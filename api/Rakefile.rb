require 'json'

container_name = 'homomorphic-encryption-api'
prod_container_name = 'tutum.co/vjftw/homomorphic-encryption:api-latest'

if ENV.include? 'CI' and ENV['CI'] == 'true'
  IS_CI = true
  puts 'Continuous Integration environment'
else
  IS_CI = false
  puts 'Development environment'
end

desc 'Build production container'
task :build_prod do

  # Get github token
  github_token = get_github_token

  built_container = build_container("#{Dir.getwd}/Dockerfile.app --build-arg github_token=#{github_token}", "#{Dir.getwd}", prod_container_name)
end

desc 'Build and run tests'
task :test do
  puts 'Looking for dev image'
  found = system_command("docker images #{container_name}:dev | grep B")

  unless found
    puts 'Building dev image'
    build_container("#{Dir.getwd}/Dockerfile.dev", "#{Dir.getwd}", "#{container_name}:dev")
  end

  # start container
  puts 'Starting dev container'
  start_command = "docker run -d -v #{Dir.getwd}/symfony:/app #{container_name}:dev"
  container_id = system_command(start_command)[0].strip()

  user = IS_CI ? 'root': 'app'

  puts 'Adding GitHub composer token'
  if ENV.include? 'GITHUB_AUTH_TOKEN' and ENV['GITHUB_AUTH_TOKEN']
    github_token = ENV['GITHUB_AUTH_TOKEN']
  else
    github_token = get_github_token
  end
  composer_config = "composer config --global github-oauth.github.com #{github_token}"
  config_command = "docker exec -t #{container_id} #{composer_config}"
  system_command(config_command)

  puts 'Installing Composer dependencies'
  composer_command = 'composer --ansi --no-interaction -v install'
  deps_command = "docker exec -t -u #{user} #{container_id} #{composer_command}"
  system_command(deps_command)

  puts 'Running tests'
  phpspec_command = 'bin/phpspec run -v -f pretty'
  test_command = "docker exec -t -u #{user} #{container_id} #{phpspec_command}"
  test_result = system_command(test_command)

  # stop and remove container
  puts 'Stopping dev container'
  system_command("docker stop #{container_id}")
  puts 'Removing dev container'
  system_command("docker rm #{container_id}")

  fail 'Tests failed' unless test_result
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
  Rake::Task["publish_coverage"].execute
  Rake::Task["build_prod"].execute
  Rake::Task["push_prod"].execute

  docker_email = ENV['DOCKER_EMAIL']
  docker_username = ENV['DOCKER_USERNAME']
  docker_password = ENV['DOCKER_PASSWORD']
  registry = "tutum.co"
  docker_login = "docker login -e #{docker_email} -u #{docker_username} -p #{docker_password} #{registry}"
  system_command(docker_login)

  docker_push = "docker push #{prod_container_name}"
  system_command(docker_push)
end

def get_github_token
  auth_json = File.read(Dir.home + '/.composer/auth.json')
  auth = JSON.parse(auth_json)

  auth['github-oauth']['github.com']
end


def build_container(docker_file, working_dir, tag='test')

    command = "docker build -f #{docker_file} -t #{tag} #{working_dir}"
    output = system_command(command, "Failed to build container for #{docker_file}")

    output_match = /(Successfully built )(.*)/.match(output.last)
    fail 'Docker failed to build the container!' unless output_match

    puts "Built Container Image: #{output_match[2]}"

    output_match[2]
end

def system_command(command, failure_message="#{command} failed.")
  output = []
  IO.popen(command) do |io|
    while line = io.gets
      puts line.chomp
      output << line.chomp
    end
    io.close

    if $?.to_i != 0
      puts "Warning: #{command} returned: #{$?.to_i}"
      return false
    end
    # fail failure_message unless $?.to_i == 0
  end

  output
end
