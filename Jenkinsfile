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

  // Définir les variables pour tout le pipeline
  options {
    skipDefaultCheckout true
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Env') {
      steps {
        // withEnv au niveau pipeline pour que tous les sh voient les variables
        script {
          env.DATABASE_URL = env.DATABASE_URL
          env.NODE_ENV = env.NODE_ENV
        }
      }
    }

    stage('Debug Env') {
      steps {
        sh 'echo "DATABASE_URL=$DATABASE_URL"'
        sh 'env | grep DATABASE_URL'
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Prisma Generate') {
      steps {
        sh 'npx prisma generate'
      }
    }

    stage('Prisma Migrate') {
      steps {
        sh 'npx prisma migrate deploy'
      }
    }

    stage('Run Tests') {
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