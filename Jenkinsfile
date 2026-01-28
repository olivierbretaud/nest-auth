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
    stage('Debug env') {
      steps {
        withEnv(["DATABASE_URL=${env.DATABASE_URL}", "NODE_ENV=${env.NODE_ENV}"]) {
          sh 'echo "DATABASE_URL=$DATABASE_URL"'
          sh 'env | grep DATABASE_URL'
        }
      }
    }


      stage('Install') {
      steps {
        withEnv(["DATABASE_URL=${env.DATABASE_URL}", "NODE_ENV=${env.NODE_ENV}"]) {
          sh 'npm ci'
        }
      }
    }

    stage('Generate Prisma') {
      steps {
        withEnv(["DATABASE_URL=${env.DATABASE_URL}", "NODE_ENV=${env.NODE_ENV}"]) {
          sh 'npx prisma generate'
        }
      }
    }

    stage('Migrate DB') {
      steps {
        withEnv(["DATABASE_URL=${env.DATABASE_URL}", "NODE_ENV=${env.NODE_ENV}"]) {
          sh 'npx prisma migrate deploy'
        }
      }
    }

    stage('Test') {
      steps {
        withEnv(["DATABASE_URL=${env.DATABASE_URL}", "NODE_ENV=${env.NODE_ENV}"]) {
          sh 'npm test'
        }
      }
    }
  }

  post {
    always {
      sh 'npm cache clean --force'
    }
  }
}
