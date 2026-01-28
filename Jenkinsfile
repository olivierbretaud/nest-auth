pipeline {
  agent {
    docker {
      image 'node:22-alpine-git'
      args "-e DATABASE_URL=${env.DATABASE_URL} -e NODE_ENV=${env.NODE_ENV} --network container:jenkins"
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
        // On récupère le code puisque skipDefaultCheckout = true
        checkout scm
      }
    }

    stage('Afficher le dernier commit') {
      steps {
        // Récupérer le dernier commit et l'afficher
        sh '''
          echo "Dernier commit :"
          git log -1 --pretty=format:"%h - %an : %s"
        '''
      }
    }

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

    stage('Lint & Test') {
      steps {
          withEnv(["DATABASE_URL=${env.DATABASE_URL}", "NODE_ENV=${env.NODE_ENV}"]) {
              echo "Running linter..."
              sh 'npm run lint'

              echo "Running tests..."
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