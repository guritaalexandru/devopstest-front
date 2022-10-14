pipeline {
    agent none

    environment {
        ZIP_NAME = "next-app.zip"
        BUCKET_NAME = "jenkins-pipeline-artifacts-gdm"
        APP_FOLDER = "website"
        AWS_SERVICE_ACCOUNT_CREDENTIALS_SECRET_ID = "AWS_CREDENTIALS"
        AWS_SERVICE_ACCOUNT_REGION = "eu-central-1"
        KEY_SECRET_ID = "DevOpsTest-pem"
    }

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
                sh 'zip -r ${ZIP_NAME} .'
                stash includes: '${ZIP_NAME}', name: '${ZIP_NAME}'
            }
        }

        stage('Upload to S3') {
            options {
                withAWS(credentials: '${AWS_SERVICE_ACCOUNT_CREDENTIALS_SECRET_ID}', region: '${AWS_SERVICE_ACCOUNT_REGION}')
            }

            agent {
                docker { image 'amazon/aws-cli:latest' }
            }

            when {
                branch 'master'
            }

            steps {
                unstash '${ZIP_NAME}'
                s3Delete(bucket: '${BUCKET_NAME}', path: '${APP_FOLDER}/')
                s3Upload(file: '${ZIP_NAME}', bucket: '${BUCKET_NAME}', path: '${APP_FOLDER}/')
            }
        }

        stage('Deploy to EC2') {
            agent any

            when {
                branch 'master'
            }

            steps {
                withCredentials([sshUserPrivateKey(credentialsId: '${KEY_SECRET_ID}', keyFileVariable: 'KEYFILE')]) {
                    sh '""ssh -tt -i $KEYFILE ubuntu@3.70.184.245 "rm -rf ${APP_FOLDER} && mkdir ${APP_FOLDER} && cd ${APP_FOLDER} && aws s3 sync s3://${BUCKET_NAME}/${APP_FOLDER} . && unzip ${ZIP_NAME} -d .  && rm -rf ${ZIP_NAME} && yarn && pm2 reload ecosystem.config.js" ""'
                }
            }
        }
    }
}