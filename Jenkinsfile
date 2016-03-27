stage 'Build development image'
node {
  env.CI = "true"
  sh "echo WOOHOO"
}

stage 'Unit tests'
node {
  env.CI = "true"
  checkout scm
  sh "echo WOOHOO"
}

stage 'Build production image'
node {
  env.CI = "true"
  checkout scm
  sh "echo WOOHOO"
}

stage 'Push production image'
node {
  env.CI = "true"
  checkout scm
  sh "echo WOOHOO"
}
