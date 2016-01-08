desc 'Run Tests'
task :test do
  # Build base container
  built_container = build_container("#{Dir.getwd}/Dockerfile.test", "#{Dir.getwd}", 'tutum.co/vjftw/homomorphic-encryption:client-base')

  command = "docker run #{built_container} npm run test"

  system_command(command)
end

desc 'Build production container'
task :build_prod do

  # build in Node container
  prod_api_url = 'api.homomorphic-encryption.vjpatel.me'
  prod_backend_url = 'backend.homomorphic-encryption.vjpatel.me'
  create_build_dir = 'mkdir -p /build && cp -r /app/* /build/ && cd /build && rm -rf /build/__build__ && pwd'
  fetch_dependencies = 'npm install && node_modules/tsd/build/cli.js install && node_modules/bower/bin/bower --allow-root install'
  webpack_build = "export NODE_ENV=production && export CLIENT_API_URL=#{prod_api_url} && export CLIENT_BACKEND_URL=#{prod_backend_url} && npm run build && node ./build.dist.js"
  copy_build = 'cp -r /build/__build__ /app'
  build_command = "#{create_build_dir} && #{fetch_dependencies} && #{webpack_build} && #{copy_build}"

  command = "docker run -v #{Dir.getwd}:/app -w=/app node:slim /bin/bash -c '#{build_command}'"
  system_command(command)

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

    fail failure_message unless $?.to_i == 0
  end

  output
end
