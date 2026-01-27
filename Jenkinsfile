pipeline {
  agent none

  environment {
    IMAGE_NAME = "nest-prisma-node22"
  }

  stages {

    stage('Install / Test / Build') {
      agent {
        docker {
          image 'node:22-alpine'
        }
      }
      steps {
        sh 'npm install -g pnpm'
        sh 'pnpm install --frozen-lockfile'
        sh 'pnpm prisma generate'
        sh 'pnpm test'
        sh 'pnpm build'
        sh 'ls dist/'
      }
    }

    stage('Docker Build') {
      agent any   // ← agent Jenkins avec Docker installé
      steps {
        sh 'docker build -t $IMAGE_NAME .'
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