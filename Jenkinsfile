stage 'API: Unit tests'
node {
  env.CI = "true"
  checkout scm
  withCredentials([
  [
    $class: 'StringBinding',
    credentialsId: 'VjPatelGithubToken',
    variable: 'GITHUB_AUTH_TOKEN'
  ]
  ]) {
      sh '''
        set +x
        cd api
        rake test
      '''
  }
}

stage 'Backend: Unit tests'
node {
  env.CI = "true"
  checkout scm
  withCredentials([
  [
    $class: 'StringBinding',
    credentialsId: 'VjPatelGithubToken',
    variable: 'GITHUB_AUTH_TOKEN'
  ]
  ]) {
      sh '''
        set +x
        cd backend
        rake test
      '''
  }
}

stage 'Client: Unit tests'
node {
  env.CI = "true"
  checkout scm
  withCredentials([
  [
    $class: 'StringBinding',
    credentialsId: 'VjPatelGithubToken',
    variable: 'GITHUB_AUTH_TOKEN'
  ]
  ]) {
      sh '''
        set +x
        cd client
        rake clean
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

stage 'Backend: Build and push production image'
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
        cd backend
        rake build_prod
        rake push_prod
      '''
  }
}

stage 'Client: Build and push production image'
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
        cd client
        rake clean
        rake build_prod
        rake push_prod
      '''
  }
}
