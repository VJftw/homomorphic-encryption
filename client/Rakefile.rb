require 'json'
require 'docker'
require 'docker-rake-flow'

Docker.options[:read_timeout] = 600 # Set 10 minute read timeout for long processes with no output

flow = DockerFlow::RakeBuilder.new 'Homomorphic Encryption - Client', 'vjftw/homomorphic-encryption', 'client'
dev_container_name = "vjftw/homomorphic-encryption:#{flow.branch_container_tag}-dev"

def clean_long_cache
  # Clean Awesome TypeScript Loader's cache.
  puts '### temp: Clearing node_modules/.awesome-typescript-loader-cache as filenames are too long'
  DockerFlow::Utils.clean_dirs ['node_modules/.awesome-typescript-loader-cache']
end

def get_dev_container(tag)
  clean_long_cache
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

desc 'Run Tests'
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
         "#{Dir.getwd}:/app"
     ],
  })

  container.start
  puts "\n"

  user = flow.is_ci ? 'root': 'app'

  puts '# Node and NPM versions'
  npm_command = 'node --version'.split ' '
  container.exec(npm_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }
  npm_command = 'npm --version'.split ' '
  container.exec(npm_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }

  puts '# Installing NPM and Typings dependencies'
  npm_command = 'npm install'.split ' '
  container.exec(npm_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }
  npm_command = 'npm run postinstall'.split ' '
  container.exec(npm_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }

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
  # start container
  container = Docker::Container.create({
     'Image' => dev_container_name,
     'Volumes' => {
         '/app' => {}
     },
     'Binds' => [
         "#{Dir.getwd}:/app"
     ],
     'Env' => [
         'NODE_ENV=production',
         "CLIENT_API_ADDRESS=#{prod_api_url}",
         "CLIENT_BACKEND_ADDRESS=#{prod_backend_url}"
     ]
  })

  container.start

  user = flow.is_ci ? 'root': 'app'

  puts '# Installing NPM and TSD dependencies'
  npm_command = 'npm install'.split ' '
  container.exec(npm_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }
  npm_command = 'npm run postinstall'.split ' '
  container.exec(npm_command, {:user => user}) { |stream, chunk| puts "#{stream}: #{chunk}" }

  # Webpack Build
  puts '# Running Webpack Build'
  webpack_build = 'npm run build:prod'
  container.exec(webpack_build.split ' ') { |stream, chunk| puts "#{stream}: #{chunk}" }

  puts '# Stopping and Removing Development container'
  container.stop
  container.delete

  clean_long_cache
  puts '# Building Production container'
  puts flow.build_container_name
  image = Docker::Image.build_from_dir(Dir.getwd, {
      'dockerfile' => 'Dockerfile.app',
      't' => flow.build_container_name
  }) do |v|
    if (log = JSON.parse(v)) && log.has_key?('stream')
      $stdout.puts log['stream']
    end
  end

  puts "# Tagging as #{flow.branch_container_name}"
  image.tag(
    'repo' => flow.repository,
    'tag' => flow.branch_container_tag,
    'force' => true
  )

  puts '# Cleaning up'
  DockerFlow::Utils.clean_dirs ['dist']
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

task :clean do
  DockerFlow::Utils.clean_dirs ['node_modules', 'doc', 'typings', 'coverage', 'dist']  
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
