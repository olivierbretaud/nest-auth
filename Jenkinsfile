pipeline {
  agent { label 'docker' }   // 🔒 agent garanti avec Docker

  environment {
    IMAGE_NAME = "nest-prisma-node22"
    DATABASE_URL = credentials('DATABASE_URL')
  }

  stages {
    stage('Agent check') {
      steps {
        sh '''
          echo "Node: $(hostname)"
          which docker || echo "❌ docker absent"
          docker version || true
        '''
      }
    }

    stage('Install / Test / Build') {
      agent {
        docker {
          image 'node:22-alpine'
          args '--user root'  // <-- Exécuter en root
          reuseNode true
        }
      }
      steps {
      sh '''
        set -e

        echo "Enable Corepack"
        corepack enable
        corepack prepare pnpm@latest --activate

        echo "Check pnpm version"
        pnpm -v

        echo "Install dependencies"
        pnpm install --frozen-lockfile

        echo "Generate Prisma client"
        pnpm prisma generate

        echo "Run tests"
        pnpm test

        echo "Build project"
        pnpm build

        echo "Check dist/"
        ls dist/
      '''
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t $IMAGE_NAME .'
      }
    }
  }
}