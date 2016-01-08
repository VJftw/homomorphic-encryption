require 'json'

desc 'Build production container'
task :build_prod do

  # Get github token
  github_token = get_github_token

  built_container = build_container("#{Dir.getwd}/Dockerfile.app --build-arg github_token=#{github_token}", "#{Dir.getwd}", 'tutum.co/vjftw/homomorphic-encryption:api-latest')
end

desc 'Build and run tests'
task :test do
  github_token = get_github_token
  test_container = build_container("#{Dir.getwd}/Dockerfile.test --build-arg github_token=#{github_token}", "#{Dir.getwd}", 'homomorphic-encryption:api-test')


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

        fail failure_message unless $?.to_i == 0
    end

    output
end
