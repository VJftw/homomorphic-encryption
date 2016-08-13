node {
stage 'Unit Tests'
    env.CI = "true"
    checkout scm
    parallel ([
        backend: {
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
        },
        client: {
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
                '''
                }
            }
            publishHTML(target: [allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'client/coverage/PhantomJS 2.1.1 (Linux 0.0.0)', reportFiles: 'index.html', reportName: 'Client Test Coverage Report'])
        }
    ])
}
