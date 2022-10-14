pipeline {
    agent none
    stages {
        stage('Build') {
            agent {
                docker { image 'node:lts-alpine' }
            }

            steps {
                sh 'yarn && yarn build'
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
            }
        }

        stage('Upload to S3') {
            options {
                withAWS(credentials: 'AWS_CREDENTIALS', region: 'eu-central-1')
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

        stage('Deploy to EC2') {
            agent any

            when {
                branch 'master'
            }

            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'DevOpsTest-pem', keyFileVariable: 'KEYFILE')]) {
                    sh '""ssh -tt -i $KEYFILE ubuntu@3.70.184.245 "rm -rf website && mkdir website && cd website && aws s3 sync s3://jenkins-pipeline-artifacts-gdm/website . && unzip next-app.zip -d .  && rm -rf next-app.zip && yarn && pm2 reload ecosystem.config.js" ""'
                }
            }
        }
    }
}