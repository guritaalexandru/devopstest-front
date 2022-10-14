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

        stage('Upload to S3') {
            options {
                withAWS(credentials: '	AWS_CREDENTIALS', region: 'eu-central-1')
            }

            agent {
                docker { image 'amazon/aws-cli:latest' }
            }

            when {
                branch 'master'
            }

            steps {
                unstash 'next-app.zip'
                s3Delete(bucket: 'jenkins-pipeline-artifacts-gdm', path: 'website/')
                s3Upload(file: 'next-app.zip', bucket: 'jenkins-pipeline-artifacts-gdm', path: 'website/')
            }
        }
}