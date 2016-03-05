require 'json'
require 'docker'
# Tag structure:
# tutum.co/vjftw/homomorphic-encryption:client-<branch> for latest production
# tutum.co/vjftw/homomorphic-encryption:client-<branch>-commit
# tutum.co/vjftw/homomorphic-encryption:client-<branch>-dev for development
#
Docker.options[:read_timeout] = 600 # Set 10 minute read timeout for long processes with no output
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
    ENV['BRANCH']
  else
    system_command('git rev-parse --abbrev-ref HEAD', true)[0].strip()
  end
end

def get_current_commit
  system_command('git describe --tags', true)[0].strip()
end

container_repo = 'vjftw/homomorphic-encryption'
container_tag = "client-#{get_current_branch}"
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

desc 'Run Tests'
task :test do

  get_dev_container dev_container_name

  # start container
  puts '# Starting Development container'
  puts '# Adding GitHub token'
  if ENV.include? 'GITHUB_AUTH_TOKEN' and ENV['GITHUB_AUTH_TOKEN']
    github_token = ENV['GITHUB_AUTH_TOKEN']
  else
    github_token = get_github_token
  end
  container = Docker::Container.create({
     'Image' => dev_container_name,
     'Volumes' => {
         '/app' => {}
     },
     'Binds' => [
         "#{Dir.getwd}:/app"
     ],
     'Env' => [
         "TSD_GITHUB_TOKEN=#{github_token}"
     ]
  })

  container.start
  puts "\n"

  user = IS_CI ? 'root': 'app'

  puts '# Installing NPM and TSD dependencies'
  npm_command = 'npm install'.split ' '
  container.exec(npm_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }
  tsd_command = 'node_modules/.bin/tsd install'.split ' '
  container.exec(tsd_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }

  puts '# Running tests'
  node_test = 'npm run test'
  test_result = container.exec(node_test.split ' ') { |stream, chunk| puts "#{stream}: #{chunk}" }

  # stop and remove container
  puts '# Stopping and Removing Development container'
  container.stop
  container.delete

  fail 'Tests failed' unless test_result

end

desc 'Publish Coverage'
task :publish_coverage do

  clone = 'rm -rf site && git clone -b gh-pages --single-branch git@github.com:VJftw/homomorphic-encryption.git site && cd site && git pull && cd ..'
  system_command(clone)
  copy = 'mkdir -p site/client/coverage && rm -rf site/client/coverage/* && cp -R coverage/* site/client/coverage'
  system_command(copy)
  Dir.chdir 'site/client/coverage'
  dirs = Dir.glob('*').select {|f| File.directory? f}
  dirs.each do |dir|
    mv_dir = dir.gsub ' ', '_'
    puts "#{dir} -> #{mv_dir}"
    FileUtils.mv dir, mv_dir
  end
  Dir.chdir '../../..'
  commit = 'cd site && git status && git add . && git commit -m "Updated Client Coverage Report"'
  system_command(commit)

  puts 'Pushing!'
  push = 'cd site && git status && git push origin gh-pages'
  system_command(push)

  puts 'Cleaning up'
  cleanup = 'rm -rf site'
  system_command(cleanup)

end

desc 'Build production container'
task :build_prod do

  get_dev_container dev_container_name

  # start container
  prod_api_url = 'api.homomorphic-encryption.vjpatel.me'
  prod_backend_url = 'backend.homomorphic-encryption.vjpatel.me'

  puts '# Starting Development container'
  # start_command = "docker run -d -v #{Dir.getwd}:/app -e NODE_ENV=production -e CLIENT_API_URL=#{prod_api_url} -e CLIENT_BACKEND_URL=#{prod_backend_url} #{dev_container_name}"
  # container_id = system_command(start_command, false, true, 1)[0].strip()
  # start container
  puts '# Starting Development container'
  puts '# Adding GitHub token'
  if ENV.include? 'GITHUB_AUTH_TOKEN' and ENV['GITHUB_AUTH_TOKEN']
    github_token = ENV['GITHUB_AUTH_TOKEN']
  else
    github_token = get_github_token
  end
  container = Docker::Container.create({
     'Image' => dev_container_name,
     'Volumes' => {
         '/app' => {}
     },
     'Binds' => [
         "#{Dir.getwd}:/app"
     ],
     'Env' => [
         "TSD_GITHUB_TOKEN=#{github_token}",
         'NODE_ENV=production',
         "CLIENT_API_URL=#{prod_api_url}",
         "CLIENT_BACKEND_URL=#{prod_backend_url}"
     ]
  })

  container.start

  user = IS_CI ? 'root': 'app'

  puts '# Installing NPM and TSD dependencies'
  npm_command = 'npm install'.split ' '
  container.exec(npm_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }
  tsd_command = 'node_modules/.bin/tsd install'.split ' '
  container.exec(tsd_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }

  # Webpack Build
  puts '# Running Webpack Build'
  webpack_build = 'npm run build'
  # build_command = "docker exec -t #{container_id} #{webpack_build}"
  container.exec(webpack_build.split ' ') { |stream, chunk| puts "#{stream}: #{chunk}" }
  # system_command(build_command, false, true, 1)

  puts '# Stopping and Removing Development container'
  container.stop
  container.delete


  puts '# Building Production container'
  # built_container = build_container("#{Dir.getwd}/Dockerfile.app", "#{Dir.getwd}", prod_container_name)
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
  container.stop
  container.delete

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
                                 'filter' => prod_container_name
                             })
  prod_commit_image = images[0]
  prod_commit_image.push do |chunk|
    puts JSON.parse(chunk)
  end

  images = Docker::Image.all({
                                 'filter' => container_name
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
