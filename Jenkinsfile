stage 'API: Unit tests'
node {
  env.CI = "true"
  checkout scm
  withCredentials([
  [
    $class: 'StringBinding',
    credentialsId: 'VjPatelGithubToken',
    variable: 'GITHUB_AUTH_TOKEN'
  ],
  [
    $class: 'StringBinding',
    credentialsId: 'VjPatelDockerEmail',
    variable: 'DOCKER_EMAIL'
  ],
  [
    $class: 'UsernamePasswordMultiBinding',
    credentialsId: 'VjPatelDockerCredentials',
    passwordVariable: 'DOCKER_USERNAME',
    usernameVariable: 'DOCKER_PASSWORD'
  ]
  ]) {
      sh '''
        set +x
        cd api
        rake test
      '''
  }
}

stage 'API: Build and push production image'
node {
  env.CI = "true"
  checkout scm
  withCredentials([
  [
    $class: 'StringBinding',
    credentialsId: 'VjPatelGithubToken',
    variable: 'GITHUB_AUTH_TOKEN'
  ],
  [
    $class: 'StringBinding',
    credentialsId: 'VjPatelDockerEmail',
    variable: 'DOCKER_EMAIL'
  ],
  [
    $class: 'UsernamePasswordMultiBinding',
    credentialsId: 'VjPatelDockerCredentials',
    passwordVariable: 'DOCKER_PASSWORD',
    usernameVariable: 'DOCKER_USERNAME'
  ]
  ]) {
      sh '''
        set +x
        cd api
        rake build_prod
        rake push_prod
      '''
  }
}
