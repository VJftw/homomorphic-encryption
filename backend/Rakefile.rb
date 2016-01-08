desc 'Run Tests'
task :test do
  built_container = build_container("#{Dir.getwd}/Dockerfile.test", "#{Dir.getwd}")

  nosetests = 'nosetests --rednose --force-color --with-coverage --all-modules --cover-package=HomomorphicEncryptionBackend tests/ -v'
  system_command("docker run -t #{built_container} #{nosetests}")
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

    fail failure_message unless $?.to_i == 0
  end

  output
end
