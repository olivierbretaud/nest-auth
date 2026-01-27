pipeline {
  agent { label 'docker' }

  environment {
    IMAGE_NAME = "nest-prisma-node22"
  }

  stages {
    stage('Docker Build') {
      steps {
        sh 'docker build -t $IMAGE_NAME .'
      }
    }

    stage('Test image') {
      steps {
        sh 'docker run --rm $IMAGE_NAME node dist/main.js'
      }
    }
  }

  post {
    success {
      echo '✅ CI réussie !'
    }
    failure {
      echo '❌ CI échouée !'
    }
  }
}