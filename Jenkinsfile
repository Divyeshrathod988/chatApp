pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker')
        EC2_SSH_CREDENTIALS = credentials('ec2_ssh')
        DOCKER_IMAGE = "divyeshrathod/website"
        EC2_INSTANCE_IP = "3.7.68.32"
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Clone Repository') {
            steps {
                echo 'Cloning the repository...'
                sh 'git clone -b main https://github.com/Divyeshrathod988/chatApp.git'
            }
        }

        stage('Check Workspace Files') {
            steps {
                sh 'ls -la'
                sh 'ls -la chatApp'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building the Docker image...'
                sh 'docker build -t ${DOCKER_IMAGE}:latest -f chatApp/Dockerfile chatApp'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker') {
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    sshagent(['ec2_ssh']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ec2-user@${EC2_INSTANCE_IP} <<EOF
                            docker pull ${DOCKER_IMAGE}:latest
                            docker stop chatapp || true
                            docker rm chatapp || true
                            docker run -d -p 9000:9000 --name chatapp ${DOCKER_IMAGE}:latest
                            EOF
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}
