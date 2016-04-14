node {
stage 'API: Unit tests'
  env.CI = "true"
  checkout scm
  withCredentials([
  [
    $class: 'StringBinding',
    credentialsId: 'VjPatelGithubToken',
    variable: 'GITHUB_AUTH_TOKEN'
  ]
  ]) {
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {
      sh '''
        set +x
        cd api
        invoke test
      '''
    }
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
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {
      sh '''
        set +x
        cd backend
        invoke test
      '''
    }
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
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {
      sh '''
        set +x
        cd client
        invoke pre_clean
        invoke test
        echo "Compressing node modules"
        tar cf - node_modules | pv -s $(du -sk node_modules | cut -f 1)k | bzip2 -c > node_modules.tar.bz2
      '''
    }
  }
  stash includes: 'client/node_modules.tar.bz2', name: 'node_modules'
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
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {
      sh '''
        set +x
        cd api
        invoke build_prod
        invoke push_prod
      '''
    }
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
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {
      sh '''
        set +x
        cd backend
        invoke build_prod
        invoke push_prod
      '''
    }
  }
}

stage 'Client: Build and push production image'
node {
  env.CI = "true"
  checkout scm
  unstash 'node_modules'
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
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {
      sh '''
        set +x
        cd client
        invoke clean
        echo "Extracting node modules"
        pv node_modules.tar.bz2 | tar xjf -
        invoke build_prod
        invoke push_prod
      '''
    }
  }
}
