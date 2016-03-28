stage 'API: Unit tests'
node {
  env.CI = "true"
  checkout scm
  withCredentials([
  [
    $class: 'StringBinding',
    credentialsId: 'test',
    variable: 'test'
  ],
  [
    $class: 'UsernamePasswordMultiBinding',
    credentialsId: 'userpasswordtest',
    passwordVariable: 'username',
    usernameVariable: 'password'
  ]
  ]) {
      sh '''
        set +x
        cd api
        echo $test
        echo $username
        echo $password
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
    credentialsId: 'test',
    variable: 'test'
  ],
  [
    $class: 'UsernamePasswordMultiBinding',
    credentialsId: 'userpasswordtest',
    passwordVariable: 'username',
    usernameVariable: 'password'
  ]
  ]) {
      sh '''
        set +x
        cd api
        echo $test
        echo $username
        echo $password
      '''
  }  
}
