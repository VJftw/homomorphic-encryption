require 'docker'

desc 'Start Jenkins slave'
task :jenkins_slave do

  puts 'Enter Jenkins URL: '
  e_master_url = STDIN.gets.chomp
  puts 'Enter Jenkins User: '
  e_jenkins_user = STDIN.gets.chomp
  puts 'Enter Jenkins Password: '
  e_jenkins_password = STDIN.gets.chomp
  puts 'Enter Jenkins Executors amount: '
  e_executors = STDIN.gets.chomp
  puts 'Enter Jenkins Slave name: '
  e_name = STDIN.gets.chomp

  puts '# Starting Jenkins slave'

  container = Docker::Container.create(
      'Image' => 'vjftw/jenkins-slave',
      'Volumes' => {
          '/var/run/docker.sock' => {},
          '/opt/jenkins' => {}
      },
      'Binds' => [
          '/var/run/docker.sock:/var/run/docker.sock',
          '/opt/jenkins:/opt/jenkins'
      ],
      'Env' => [
          "SWARM_MASTER_URL=#{e_master_url}",
          "SWARM_JENKINS_USER=#{e_jenkins_user}",
          "SWARM_JENKINS_PASSWORD=#{e_jenkins_password}",
          "SWARM_CLIENT_EXECUTORS=#{e_executors}",
          "SWARM_CLIENT_PARAMETERS=-name '#{e_name}'"
      ]
  )
  container.rename 'jenkins-slave'

  begin
    container.tap(&:start).attach { |stream, chunk| puts "#{stream}: #{chunk}" }
  rescue Interrupt
    puts "\n# Stopping Jenkins slave"
    container.stop
    container.delete
  rescue Docker::Error::TimeoutError
    puts "\n Running in background. Run rake jenkins_slave_stop to stop"
  end
end

desc 'Stop Jenkins slave'
task :jenkins_slave_stop do

end