pipeline {
  agent {
    docker {
      image 'node:22-alpine'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    IMAGE_NAME = "nest-prisma-node22"
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm install -g pnpm'
        sh 'pnpm install --frozen-lockfile'
      }
    }

    stage('Prisma Generate') {
      steps {
        sh 'pnpm prisma generate'
      }
    }

    stage('Test') {
      steps {
        sh 'pnpm test'
      }
    }

    stage('Build') {
      steps {
        sh 'pnpm build'
        sh 'ls dist/'  // pour debug
      }
    }

    stage('Docker Build') {
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