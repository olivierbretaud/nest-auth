pipeline {
  agent {
    docker {
      image 'node:22-alpine'
      args "-e DATABASE_URL=${env.DATABASE_URL} -e NODE_ENV=${env.NODE_ENV} --network container:jenkins"
    }
  }

  environment {
    DATABASE_URL = credentials('DATABASE_URL')
    NODE_ENV = 'test'
  }


  stages {

    stage('Setup tools') {
      steps {
        sh '''
          apk add --no-cache git bash
          npm install -g pnpm

          git --version
          pnpm --version
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

    stage('Afficher le dernier commit') {
      steps {
        sh '''
          echo "Dernier commit :"
          git log -1 --pretty=format:"%h - %an : %s"
        '''
      }
    }

    stage('Install & Prisma') {
      steps {
          withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL')]) {
            withEnv(["NODE_ENV=test"]) {
              // NE PAS echo la valeur réelle du secret !
              sh 'echo "DATABASE_URL length: ${#DATABASE_URL}"'  // seulement pour debug

              // Installer les dépendances
              sh 'pnpm install --frozen-lockfile'

              // Approuver tous les scripts de build ignorés (pour Prisma, bcrypt, etc.)
              sh 'pnpm approve-builds --all'

              // Générer Prisma
              sh 'npx prisma generate'

              // Appliquer les migrations
              sh 'npx prisma migrate deploy'
            }
        }
      }
    }

    stage('Lint & Test') {
      steps {
        withCredentials([string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL')]) {
          withEnv(["NODE_ENV=${env.NODE_ENV}"]) {

            echo "Running Formatter..."
            sh 'npx biome format . --write'

            echo "Running linter..."
            sh 'npx biome lint .'

            echo "Running tests..."
            sh 'npm test'
          }
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