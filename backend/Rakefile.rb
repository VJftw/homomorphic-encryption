container_name = 'homomorphic-encryption-backend'

desc 'Run Tests'
task :test do
  
  puts 'Looking for dev image'
  found = system_command("docker images #{container_name}:dev | grep B")

  if !found
    puts 'Building dev image'
    build_container("#{Dir.getwd}/Dockerfile.dev", "#{Dir.getwd}", "#{container_name}:dev")
  end

  # start container
  puts 'Starting dev container'
  start_command = "docker run -d -v #{Dir.getwd}:/app -p 9000:9000 #{container_name}:dev"
  container_id = system_command(start_command)[0].strip()

  # exec tests
  puts 'Running tests'
  nosetests = 'nosetests --rednose --force-color --with-coverage --all-modules --cover-package=HomomorphicEncryptionBackend tests/ -v'
  test_command = "docker exec -t #{container_id} #{nosetests}"

  system_command(test_command)
  
  # stop and remove container
  puts 'Stopping dev container'
  system_command("docker stop #{container_id}")
  puts 'Removing dev container'
  system_command("docker rm #{container_id}")
end

desc 'Build production container'
task :build_prod do
  built_container = build_container("#{Dir.getwd}/Dockerfile.prod", "#{Dir.getwd}", 'tutum.co/vjftw/homomorphic-encryption:backend-latest')

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
      puts "Error! #{command} returned: #{$?.to_i}"
      return false
    end
    # fail failure_message unless $?.to_i == 0
  end

  output
end
