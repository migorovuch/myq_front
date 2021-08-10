pipeline {
  agent any

  stages {
    stage('Build&Run front container') {
      steps {
        withCredentials([file(credentialsId: 'myq_front', variable: 'SECRETS')]) {
            writeFile file: './.env', text: readFile(SECRETS)
        }
        sh 'docker build -t myq_node -f ./docker/node/prod/Dockerfile .'
        sh 'docker run --rm -t -d --name myq_node --env-file .env myq_node'
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
    stage('Copy & Stop') {
      steps {
        sh 'docker cp myq_node:/app/dist/. ./myq_back/public/front/'
        sh 'docker cp ./myq_back/public/front/. myq_nginx:/var/www/project/public/front/'
        sh 'docker stop myq_node'
      }
    }
  }
}
