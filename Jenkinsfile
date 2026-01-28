pipeline {
  agent {
    docker {
      image 'node:22-alpine'
      args '--network container:jenkins'
    }
  }

  environment {
    DATABASE_URL = credentials('DATABASE_URL')
    NODE_ENV = 'test'
  }

  stages {

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Generate Prisma') {
      steps {
        sh 'npx prisma generate'
      }
    }

    stage('Migrate DB') {
      steps {
        sh 'npx prisma migrate deploy'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }

  post {
    always {
      sh 'npm cache clean --force'
    }
  }
}
