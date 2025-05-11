pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker')     // Docker Hub credentials
        EC2_SSH_CREDENTIALS = credentials('ssh_ec2')       // EC2 SSH credentials
        DOCKER_IMAGE = "divyeshrathod/website"
        EC2_INSTANCE_IP = "3.111.39.87"                   // EC2 instance public IP
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs() // Clean the workspace to ensure fresh clone
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
                sh 'docker build -t divyeshrathod/website -f chatApp/Dockerfile chatApp'
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
                    sshagent(['ssh_ec2']) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@3.111.39.87 <<EOF
                        docker pull divyeshrathod/website:latest
                        docker stop chatapp || true
                        docker rm chatapp || true
                        docker run -d -p 9000:9000 --name chatapp divyeshrathod/website:latest
                        EOF
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning workspace after pipeline run...'
            cleanWs() // ✅ Now valid without wrapping in node
        }
    }
}
