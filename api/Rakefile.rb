require 'json'
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

container_name = "vjftw/homomorphic-encryption:api-#{get_current_branch}"
dev_container_name = "#{container_name}-dev"
prod_container_name = "#{container_name}-#{get_current_commit}"

puts "# Container Tags\n\tProduction:\t#{container_name}\n\tDevelopment:\t#{dev_container_name} \n\tBuild:\t\t#{prod_container_name}\n\n"


def get_dev_container(tag)
  puts '# Looking for Development container'
  found = system_command("docker images #{tag} | grep B", false, false, 1)

  unless found
    puts '## Building Development container'
    build_container("#{Dir.getwd}/Dockerfile.dev", "#{Dir.getwd}", "#{tag}")
  end

end

desc 'Run tests'
task :test do

  get_dev_container dev_container_name

  # start container
  puts '# Starting Development container'
  start_command = "docker run -d -v #{Dir.getwd}/symfony:/app #{dev_container_name}"
  container_id = system_command(start_command, false, true, 1)[0].strip()

  user = IS_CI ? 'root': 'app'

  puts '# Adding GitHub composer token'
  if ENV.include? 'GITHUB_AUTH_TOKEN' and ENV['GITHUB_AUTH_TOKEN']
    github_token = ENV['GITHUB_AUTH_TOKEN']
  else
    github_token = get_github_token
  end
  composer_config = "composer config --global github-oauth.github.com #{github_token}"
  config_command = "docker exec -t #{container_id} #{composer_config}"
  system_command(config_command, false, true, 1)

  puts '# Installing Composer dependencies'
  composer_command = 'composer --ansi --no-interaction -v install'
  deps_command = "docker exec -t -u #{user} #{container_id} #{composer_command}"
  system_command(deps_command, false, true, 1)

  puts '# Running tests'
  phpspec_command = 'php -dzend_extension=xdebug.so bin/phpspec run -v -f pretty'
  test_command = "docker exec -t -u #{user} #{container_id} #{phpspec_command}"
  test_result = system_command(test_command, false, true, 1)

  # stop and remove container
  puts '# Stopping and Removing Development container'
  system_command("docker stop #{container_id}", false, true, 1)
  system_command("docker rm #{container_id}", false, true, 1)

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

  get_dev_container dev_container_name
  
  copy = 'mkdir -p __build__ && cp -r symfony/* __build__/'
  clean = 'cd __build__ && rm -rf var/cache/* var/logs/* var/bootstrap.php.cache app/config/parameters.yml coverage spec vendor'

  system_command("#{copy} && #{clean}", false, true, 1)

  # start container
  puts '# Starting Development container'
  start_command = "docker run -d -v #{Dir.getwd}/__build__:/app #{dev_container_name}"
  container_id = system_command(start_command, false, true, 1)[0].strip()

  puts '# Adding GitHub composer token'
  if ENV.include? 'GITHUB_AUTH_TOKEN' and ENV['GITHUB_AUTH_TOKEN']
    github_token = ENV['GITHUB_AUTH_TOKEN']
  else
    github_token = get_github_token
  end
  composer_config = "composer config --global github-oauth.github.com #{github_token}"
  config_command = "docker exec -t #{container_id} #{composer_config}"
  system_command(config_command, false, true, 1)

  puts '# Installing Composer dependencies'
  composer_command = 'composer --no-dev --ansi --no-interaction --prefer-dist -v --optimize-autoloader install'
  deps_command = "docker exec -t #{container_id} #{composer_command}"
  system_command(deps_command, false, true, 1)

  puts '# Stopping and Removing Development container'
  system_command("docker stop #{container_id}", false, true, 1)
  system_command("docker rm #{container_id}", false, true, 1)

  puts '# Building Production container'
  built_container = build_container("#{Dir.getwd}/Dockerfile.app", "#{Dir.getwd}", prod_container_name)

  puts "# Tagging as #{container_name}"
  tag_command = "docker tag -f #{built_container} #{container_name}"
  system_command(tag_command)

  puts '# Cleaning up'
  system_command("docker run -v #{Dir.getwd}:/app -w=/app alpine /bin/sh -c 'rm -rf __build__'")
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
  docker_login = "docker login -e #{docker_email} -u #{docker_username} -p #{docker_password} #{registry}"
  system_command(docker_login)

  docker_push = "docker push #{prod_container_name}"
  system_command(docker_push)

  docker_push = "docker push #{container_name}"
  system_command(docker_push)
end

def get_github_token
  auth_json = File.read(Dir.home + '/.composer/auth.json')
  auth = JSON.parse(auth_json)

  auth['github-oauth']['github.com']
end


def build_container(docker_file, working_dir, tag='test')

  command = "docker build -f #{docker_file} -t #{tag} #{working_dir}"
  output = system_command(command)

  output_match = /(Successfully built )(.*)/.match(output.last)
  fail 'Docker failed to build the container!' unless output_match

  puts "Built Container Image: #{output_match[2]}"

  output_match[2]
end
