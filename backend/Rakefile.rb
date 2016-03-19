require 'json'
require 'docker'
require 'docker-rake-flow'

flow = DockerFlow::RakeBuilder.new 'Homomorphic Encryption - Backend', 'vjftw/homomorphic-encryption', 'backend'
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
      ]
  })

  container.start
  puts "\n"

  user = flow.is_ci ? 'root': 'app'

  puts '# Running tests'
  nosetests = 'nosetests --rednose --force-color --with-coverage --cover-html --cover-html-dir=coverage --all-modules --cover-package=HomomorphicEncryptionBackend tests/ -v'

  test_result = container.exec(nosetests.split ' ') { |stream, chunk| puts "#{stream}: #{chunk}" }

  puts '# Stopping and Removing Development container'
  container.stop
  container.delete

  fail 'Tests failed' unless test_result
end

desc 'Publish Coverage'
task :publish_coverage do

  clone = 'rm -rf site && git clone -b gh-pages --single-branch git@github.com:VJftw/homomorphic-encryption.git site && cd site && git pull && cd ..'
  system_command(clone)
  copy = 'mkdir -p site/backend/coverage && cp -R coverage/* site/backend/coverage'
  system_command(copy)
  commit = 'cd site && git status && git add . && git commit -m "Updated Backend Coverage Report"'
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
  puts '# Building Production container'
  image = Docker::Image.build_from_dir(Dir.getwd, {
      'dockerfile' => 'Dockerfile.prod',
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

  image
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
