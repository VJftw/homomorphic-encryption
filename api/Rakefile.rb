require 'json'
require 'docker'
require 'docker-rake-flow'

flow = DockerFlow::RakeBuilder.new 'Homomorphic Encryption - API', 'vjftw/homomorphic-encryption', 'api'
dev_container_name = "vjftw/homomorphic-encryption:#{flow.branch_container_tag}-dev"

def get_dev_container(tag)
  puts '## Building Development container'

  Docker::Image.build_from_dir(Dir.getwd, {
      'dockerfile' => "Dockerfile.dev",
      't' => tag
  }) do |v|
    if (log = JSON.parse(v)) && log.has_key?("stream")
      $stdout.puts log["stream"]
    end
  end

end

desc 'Run tests'
task :test do
  DockerFlow::Utils.clean_dirs [
    'symfony/var/cache/dev',
    'symfony/var/cache/prod',
    'symfony/var/logs/*.log',
    'symfony/coverage'
  ]
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

  user = flow.is_ci ? 'root': 'app'

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
      't' => flow.build_container_name
  }) do |v|
    if (log = JSON.parse(v)) && log.has_key?("stream")
      $stdout.puts log["stream"]
    end
  end

  puts "# Tagging as #{flow.branch_container_name}"
  image.tag(
      'repo' => flow.repository,
      'tag' => flow.branch_container_tag,
      'force' => true
  )

  puts '# Cleaning up'
  DockerFlow::Utils.clean_dirs ['__build__']
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

task :push_prod do

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
     'filter' => flow.build_container_name
  })
  prod_commit_image = images[0]
  prod_commit_image.push do |chunk|
    puts JSON.parse(chunk)
  end

  images = Docker::Image.all({
     'filter' => flow.branch_container_name
  })
  prod_main_image = images[0]
  prod_main_image.push do |chunk|
    puts JSON.parse(chunk)
  end
end

desc 'CI'
task :ci do
  Rake::Task["test"].execute
  # Rake::Task["publish_coverage"].execute
  Rake::Task["build_prod"].execute
  Rake::Task["push_prod"].execute
end

def get_github_token
  auth_json = File.read(Dir.home + '/.composer/auth.json')
  auth = JSON.parse(auth_json)

  auth['github-oauth']['github.com']
end
