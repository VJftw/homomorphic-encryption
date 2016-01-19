container_name = 'homomorphic-encryption-client'

if ENV.include? 'CI' and ENV['CI'] == 'true'
  IS_CI = true
  puts 'Continuous Integration environment'
else
  IS_CI = false
  puts 'Development environment'
end

desc 'Run Tests'
task :test do

  puts 'Looking for dev image'
  found = system_command("docker images #{container_name}:dev | grep B")

  unless found
    puts 'Building dev image'
    build_container("#{Dir.getwd}/Dockerfile.dev", "#{Dir.getwd}", "#{container_name}:dev")
  end

  # start container
  puts 'Starting dev container'
  start_command = "docker run -d -v #{Dir.getwd}:/app #{container_name}:dev"
  container_id = system_command(start_command)[0].strip()

  user = IS_CI ? 'root': 'app'

  puts 'Installing NPM, Bower and TSD dependencies'
  npm_command = 'npm install && node_modules/.bin/bower install && node_modules/.bin/tsd install'
  deps_command = "docker exec -t -u #{user} #{container_id} #{npm_command}"
  system_command(deps_command)

  puts 'Running tests'
  node_test = 'npm run test'
  test_command = "docker exec -t -u #{user} #{container_id} #{node_test}"
  system_command(test_command)

  # stop and remove container
  puts 'Stopping dev container'
  system_command("docker stop #{container_id}")
  puts 'Removing dev container'
  system_command("docker rm #{container_id}")

end

desc 'Publish Coverage'
task :publish_coverage do

  clone = 'rm -rf site && git clone -b gh-pages --single-branch git@github.com:VJftw/homomorphic-encryption.git site && cd site && git pull && cd ..'
  system_command(clone)
  copy = 'mkdir -p site/client/coverage && cp -R coverage/* site/client/coverage'
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

  puts 'Looking for dev image'
  found = system_command("docker images #{container_name}:dev | grep B")

  unless found
    puts 'Building dev image'
    build_container("#{Dir.getwd}/Dockerfile.dev", "#{Dir.getwd}", "#{container_name}:dev")
  end

  # start container
  prod_api_url = 'api.homomorphic-encryption.vjpatel.me'
  prod_backend_url = 'backend.homomorphic-encryption.vjpatel.me'

  puts 'Starting dev container'
  start_command = "docker run -d -v #{Dir.getwd}:/app -e NODE_ENV=production -e CLIENT_API_URL=#{prod_api_url} -e CLIENT_BACKEND_URL=#{prod_backend_url} #{container_name}:dev"
  container_id = system_command(start_command)[0].strip()

  user = IS_CI ? 'root': 'app'

  puts 'Installing NPM, Bower and TSD dependencies'
  npm_command = 'npm install && node_modules/.bin/bower install && node_modules/.bin/tsd install'
  deps_command = "docker exec -t -u #{user} #{container_id} #{npm_command}"
  system_command(deps_command)

  # Webpack Build
  webpack_build = 'npm run build'
  build_command = "docker exec -t -u #{user} #{container_id} #{webpack_build}"
  system_command(build_command)

  # stop and remove container
  puts 'Stopping dev container'
  system_command("docker stop #{container_id}")
  puts 'Removing dev container'
  system_command("docker rm #{container_id}")


  puts 'Building production container'
  built_container = build_container("#{Dir.getwd}/Dockerfile.app", "#{Dir.getwd}", 'tutum.co/vjftw/homomorphic-encryption:client-latest')

  # Remove build folder with docker
  system_command("docker run -v #{Dir.getwd}:/app -w=/app alpine /bin/sh -c 'rm -rf __build__'")

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
