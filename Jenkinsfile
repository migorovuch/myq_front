pipeline {
  agent any

  stages {
    stage('Build&Run front container') {
      steps {
        withCredentials([file(credentialsId: 'myq_front', variable: 'SECRETS')]) {
            writeFile file: './.env', text: readFile(SECRETS)
        }
        sh 'docker build --target prod -t myq_node -f ./docker/node/Dockerfile .'
        sh 'docker stop myq_node || true'
        sh 'docker rm myq_node || true'
        sh 'docker run -t -d --name myq_node --env-file .env myq_node'
      }
    }
    stage('Install dependencies') {
      steps {
        sh 'docker exec myq_node npm i'
      }
    }
    stage('Build application') {
      steps {
        sh 'docker exec myq_node npm run webpack:build'
      }
    }
    stage('Copy to nginx container') {
      steps {
        sh 'docker cp myq_node:/app/dist/. ./app/dist/'
        sh 'docker cp ./app/dist/. myq_nginx:/var/www/html/public/front/'
      }
    }
  }
}
