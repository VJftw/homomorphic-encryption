require 'json'
require 'docker'
# Tag structure:
# tutum.co/vjftw/homomorphic-encryption:api-<branch> for latest production
# tutum.co/vjftw/homomorphic-encryption:api-<branch>-commit
# tutum.co/vjftw/homomorphic-encryption:api-<branch>-dev for development
#
if ENV.include? 'CI' and ENV['CI'] == 'true'
  IS_CI = true
  puts "# Continuous Integration environment\n\n"
else
  IS_CI = false
  puts "# Development environment\n\n"
end

def system_command(command, silent=false, show_warnings=true, indent_amount=0)
  output = []
  indent = ''
  indent_amount.times do
    indent += "\t"
  end
  IO.popen(command) do |io|
    while line = io.gets
      unless silent
        puts "#{indent}#{line.chomp}"
      end
      output << line.chomp
    end
    io.close

    if $?.to_i != 0
      if show_warnings
        puts "Warning: #{command} returned: #{$?.to_i}"
      end
      return false
    end
  end

  output
end

def get_current_branch
  if IS_CI
    # ENV['TRAVIS_BRANCH']
    ENV['branch']
  else
    system_command('git rev-parse --abbrev-ref HEAD', true)[0].strip()
  end
end

def get_current_commit
  system_command('git describe --tags', true)[0].strip()
end

container_repo = 'vjftw/homomorphic-encryption'
container_tag = "api-#{get_current_branch}"
container_name = "#{container_repo}:#{container_tag}"
dev_container_name = "#{container_name}-dev"
prod_container_name = "#{container_name}-#{get_current_commit}"

puts "# Container Tags\n\tProduction:\t#{container_name}\n\tDevelopment:\t#{dev_container_name} \n\tBuild:\t\t#{prod_container_name}\n\n"


def get_dev_container(tag)
  puts '# Looking for Development container'

  images = Docker::Image.all({
                                 'filter' => tag
                             })

  if images.empty?
    puts '## Building Development container'

    image = Docker::Image.build_from_dir(Dir.getwd, {
        'dockerfile' => "Dockerfile.dev",
        't' => tag
    }) do |v|
      if (log = JSON.parse(v)) && log.has_key?("stream")
        $stdout.puts log["stream"]
      end
    end

    return image
  end

  images[0]
end

desc 'Run tests'
task :test do

  get_dev_container dev_container_name

  # start container
  puts '# Starting Development container'
  container = Docker::Container.create({
     'Image' => dev_container_name,
     'Volumes' => {
         '/app' => {}
     },
     'Binds' => [
         "#{Dir.getwd}/symfony:/app"
     ]
  })

  container.start
  puts "\n"

  user = IS_CI ? 'root': 'app'

  puts '# Adding GitHub composer token'
  if ENV.include? 'GITHUB_AUTH_TOKEN' and ENV['GITHUB_AUTH_TOKEN']
    github_token = ENV['GITHUB_AUTH_TOKEN']
  else
    github_token = get_github_token
  end
  composer_config = "composer config --global github-oauth.github.com #{github_token}"
  container.exec(composer_config.split ' ') { |stream, chunk| puts "#{stream}: #{chunk}" }

  puts '# Installing Composer dependencies'
  composer_command = 'composer --ansi --no-interaction -v install'.split ' '
  container.exec(composer_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }

  puts '# Running tests'
  phpspec_command = 'php -dzend_extension=xdebug.so bin/phpspec run --ansi -v -f pretty'
  test_result = container.exec(phpspec_command.split ' ') { |stream, chunk| puts "#{stream}: #{chunk}" }

  # stop and remove container
  puts '# Stopping and Removing Development container'
  container.stop
  container.delete

  fail 'Tests failed' unless test_result
end

desc 'Build production container'
task :build_prod do
  # 1). create build dir
  # 2). copy source into __build__ dir
  # 3). remove bin, vendor, coverage, spec dirs
  # 4). start dev container
  # 5). exec composer install
  # 6). build prod container
  FileUtils.rm_rf('__build__/.', secure: true)

  get_dev_container dev_container_name
  FileUtils.rm_rf('symfony/var/cache/dev', secure: true)
  FileUtils.rm_rf('symfony/var/cache/test', secure: true)
  FileUtils.rm_rf('symfony/var/cache/prod', secure: true)
  FileUtils.rm_rf('symfony/var/logs/dev.log', secure: true)
  FileUtils.rm_rf('symfony/var/logs/prod.log', secure: true)

  FileUtils.mkdir_p '__build__'
  FileUtils.cp_r 'symfony/.', '__build__'

  FileUtils.rm_rf('__build__/var/cache/.', secure: true)
  FileUtils.rm_rf('__build__/var/logs/.', secure: true)
  FileUtils.rm_rf('__build__/coverage/.', secure: true)
  FileUtils.rm_rf('__build__/spec/.', secure: true)
  FileUtils.rm_rf('__build__/vendor/.', secure: true)
  FileUtils.rm_rf [
              '__build__/var/bootstrap.php.cache',
              '__build__/app/config/parameters.yml',
              '__build__/bin/phpspec',
              '__build__/bin/symfony_requirements',
              '__build__/bin/security-checker',
              '__build__/bin/doctrine.php',
              '__build__/bin/doctrine-migrations',
              '__build__/bin/doctrine-dbal',
              '__build__/bin/doctrine']

  # start container
  puts '# Starting Development container'
  container = Docker::Container.create({
     'Image' => dev_container_name,
     'Volumes' => {
         '/app' => {}
     },
     'Binds' => [
         "#{Dir.getwd}/__build__:/app"
     ]
  })
  container.start

  puts '# Adding GitHub composer token'
  if ENV.include? 'GITHUB_AUTH_TOKEN' and ENV['GITHUB_AUTH_TOKEN']
    github_token = ENV['GITHUB_AUTH_TOKEN']
  else
    github_token = get_github_token
  end
  composer_config = "composer config --global github-oauth.github.com #{github_token}"
  container.exec(composer_config.split ' ') { |stream, chunk| puts "#{stream}: #{chunk}" }

  puts '# Installing Composer dependencies'
  composer_command = 'composer --no-dev --ansi --no-interaction --prefer-dist -v --optimize-autoloader install'
  container.exec(composer_command.split ' ') { |stream, chunk| puts "#{stream}: #{chunk}" }

  puts '# Stopping and Removing Development container'
  container.stop
  container.delete

  puts '# Building Production container'

  image = Docker::Image.build_from_dir(Dir.getwd, {
      'dockerfile' => "Dockerfile.app",
      't' => prod_container_name
  }) do |v|
    if (log = JSON.parse(v)) && log.has_key?("stream")
      $stdout.puts log["stream"]
    end
  end

  puts "# Tagging as #{container_name}"
  image.tag(
      'repo' => container_repo,
      'tag' => container_tag,
      'force' => true
  )

  puts '# Cleaning up'
  container = Docker::Container.create({
     'Image' => 'alpine',
     'Volumes' => {
         '/app' => {}
     },
     'Binds' => [
         "#{Dir.getwd}:/app"
     ],
     'WorkingDir' => '/app',
     'Cmd': [
         '/bin/sh', '-c', 'rm -rf __build__'
     ]
  })
  container.tap(&:start).attach { |stream, chunk| puts "#{stream}: #{chunk}" }
  # system_command("docker run -v #{Dir.getwd}:/app -w=/app alpine /bin/sh -c 'rm -rf __build__'")
end



desc 'Publish Coverage'
task :publish_coverage do

  clone = 'rm -rf site && git clone -b gh-pages --single-branch git@github.com:VJftw/homomorphic-encryption.git site && cd site && git pull && cd ..'
  system_command(clone)
  copy = 'mkdir -p site/api/coverage && cp -R symfony/coverage/* site/api/coverage'
  system_command(copy)
  commit = 'cd site && git status && git add . && git commit -m "Updated API Coverage Report"'
  system_command(commit)

  puts 'Pushing!'
  push = 'cd site && git status && git push origin gh-pages'
  system_command(push)

  puts 'Cleaning up'
  cleanup = 'rm -rf site'
  system_command(cleanup)

end

desc 'CI'
task :ci do
  Rake::Task["test"].execute
  # Rake::Task["publish_coverage"].execute
  Rake::Task["build_prod"].execute

  docker_email = ENV['DOCKER_EMAIL']
  docker_username = ENV['DOCKER_USERNAME']
  docker_password = ENV['DOCKER_PASSWORD']
  registry = ''
  Docker.authenticate!({
     'username' => docker_username,
     'password' => docker_password,
     'email' => docker_email
  })

  puts "\n# Pushing to Registry"

  images = Docker::Image.all({
     'filter' => prod_container_name
  })
  images[0].push do |chunk|
    puts JSON.parse(chunk)
  end

  images = Docker::Image.all({
     'filter' => container_name
  })
  images[0].push do |chunk|
    puts JSON.parse(chunk)
  end
end

def get_github_token
  auth_json = File.read(Dir.home + '/.composer/auth.json')
  auth = JSON.parse(auth_json)

  auth['github-oauth']['github.com']
end
