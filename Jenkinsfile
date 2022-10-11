pipeline {
    agent none
    stages {
        stage('Build') {
            agent {
                docker { image 'node:lts-alpine' }
            }

            steps {
                sh 'yarn && yarn build'
                sh 'echo "Build completed"'
            }
        }

        stage('Archive build') {
            agent any

            when {
                branch 'master'
            }

            steps {
                sh 'rm -rf .git && rm -rf node_modules'
                sh 'zip -r next-app.zip .'
                stash includes: 'next-app.zip', name: 'next-app.zip'
                sh 'echo "Build archived"'
            }
        }
    }
}