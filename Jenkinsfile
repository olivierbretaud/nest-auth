pipeline {
  agent { label 'docker' }   // 🔒 agent garanti avec Docker

  environment {
    IMAGE_NAME = "nest-prisma-node22"
  }

  stages {

    stage('Install / Test / Build') {
      agent {
        docker {
          image 'node:22-alpine'
          reuseNode true   // ⭐ très important
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
      steps {
        sh 'docker build -t $IMAGE_NAME .'
      }
    }
  }
}