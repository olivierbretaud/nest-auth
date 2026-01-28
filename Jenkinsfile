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