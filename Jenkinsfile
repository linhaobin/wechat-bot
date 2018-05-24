node {
  stage('Build') {
    checkout scm

    docker.build('wechat-bot')
  }
    
  stage('Deploy') {
    sh 'docker-compose down'
    sh 'docker-compose up -d'
  }
}