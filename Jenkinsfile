def sendNotificationToN8n(String status, String stageName, String image, String containerName, String message = "") {
    script {
        withCredentials([
            string(credentialsId: 'n8n-webhook', variable: 'N8N_WEBHOOK_URL')
        ]) {
            def payload = [
                project  : env.JOB_NAME,
                stage    : stageName,
                status   : status,
                build    : env.BUILD_NUMBER,
                branch   : env.GIT_BRANCH,
                image    : image ?: "N/A",
                container: containerName ?: "N/A",
                url      : "YOUR_WEB_APP_URL",
                message  : message,
                timestamp: new Date().format("yyyy-MM-dd'T'HH:mm:ssXXX")
            ]

            def body = groovy.json.JsonOutput.toJson(payload)

            try {
                httpRequest acceptType: 'APPLICATION_JSON',
                            contentType: 'APPLICATION_JSON',
                            httpMode: 'POST',
                            requestBody: body,
                            url: N8N_WEBHOOK_URL,
                            validResponseCodes: '200:299'

                echo "n8n webhook (${status}) sent successfully."
            } catch (err) {
                echo "Failed to send n8n webhook (${status}): ${err}"
            }
        }
    }
}

pipeline {

    agent any 

    environment {
        VERCEL_HOOK_URL = credentials('vercel-hooks-url')
        REGISTRY_USER = "YOUR_REGISTRY_USER"
        IMAGE_NAME = "condo-swift-app"
        DOCKER_HUB    = credentials('docker-hub-creds')
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Install Dependencies') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop' }
            }
            steps {
                sh 'npm ci'
            }
        }

        stage('Build (Optional)') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop' }
            }
            steps {
                sh 'echo ${DOCKER_HUB_PSW} | docker login -u ${DOCKER_HUB_USR} --password-stdin'
                sh 'docker build -t ${REGISTRY_USER}/${IMAGE_NAME}:latest .'
                sh 'docker push ${REGISTRY_USER}/${IMAGE_NAME}:latest'
                sh 'docker rmi ${REGISTRY_USER}/${IMAGE_NAME}:latest'
                sh 'docker logout'
            }
        }

        stage('Deploy') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop' }
            }
            steps {
                sh '''
                curl -X POST "$VERCEL_HOOK_URL"
                '''
            }
        }
    }

    post {
        success {
            echo 'Deploy Success!'
            sendNotificationToN8n(
                'SUCCESS',
                'Deploy Completed',
                "${REGISTRY_USER}/${IMAGE_NAME}:latest",
                IMAGE_NAME
            )
        }
    
        failure {
            echo 'Build Failed!'
            sendNotificationToN8n(
                'FAILED',
                env.STAGE_NAME ?: 'Unknown Stage',
                'N/A',
                'N/A',
                currentBuild.currentResult
            )
        }

        aborted {
            echo 'Build Aborted!'
            sendNotificationToN8n(
                'ABORTED',
                env.STAGE_NAME ?: 'Unknown Stage',
                'N/A',
                'N/A',
                currentBuild.currentResult
            )
        }
    
        always {
            cleanWs()
        }
    }
}