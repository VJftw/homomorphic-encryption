require 'docker'
# Tag structure:
# tutum.co/vjftw/homomorphic-encryption:backend-<branch> for latest production
# tutum.co/vjftw/homomorphic-encryption:backend-<branch>-commit
# tutum.co/vjftw/homomorphic-encryption:backend-<branch>-dev for development
#
if ENV.include? 'CI' and ENV['CI'] == 'true'
  IS_CI = true
  puts "# Continuous Integration environment\n"
else
  IS_CI = false
  puts "# Development environment\n"
end
puts "#{Dir.getwd}\n\n"

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
container_tag = "backend-#{get_current_branch}"
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
  
  image = get_dev_container dev_container_name

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

  user = IS_CI ? 'root': 'app'

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
      'dockerfile' => "Dockerfile.prod",
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

  image
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
  prod_commit_image = images[0]
  prod_commit_image.push do |chunk|
    puts JSON.parse(chunk)
  end

  images = Docker::Image.all({
     'filter' => container_name
  })
  prod_main_image = images[0]
  prod_main_image.push do |chunk|
    j_chunk = JSON.parse(chunk)
    puts j_chunk
    if j_chunk.include? 'aux'
      puts "Pushed: #{j_chunk['aux']['Tag']}"
      prod_main_image.remove
      prod_commit_image.remove
    end
  end

end
