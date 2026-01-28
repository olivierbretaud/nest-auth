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
    stage('Debug Credentials') {
      steps {
        script {
          // Test 1 : Vérifier si le credential existe
          withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DB_URL')]) {
            sh '''
              echo "Length of DB_URL: ${#DB_URL}"
              if [ -z "$DB_URL" ]; then
                echo "ERROR: DB_URL is empty!"
              else
                echo "SUCCESS: DB_URL is set (length: ${#DB_URL} characters)"
              fi
            '''
          }
        }
      }
    }

   stage('Install & Prisma') {
    steps {
        withEnv(["DATABASE_URL=${env.DATABASE_URL}", "NODE_ENV=test"]) {
            // Debug pour vérifier que la variable est bien passée
            sh 'echo "DATABASE_URL=$DATABASE_URL"'

            // Installer les dépendances
            sh 'npm ci'

            // Générer Prisma
            sh 'npx prisma generate'

            // Appliquer les migrations
            sh 'npx prisma migrate deploy'
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