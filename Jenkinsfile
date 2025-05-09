pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker')  // Docker Hub credentials
        EC2_SSH_CREDENTIALS = credentials('ec2_ssh')        // EC2 SSH credentials
        DOCKER_IMAGE = "divyeshrathod/website"
        EC2_INSTANCE_IP = "3.7.68.32"             // EC2 instance public IP
    }

  stages {
      
        stage('Cleanup Workspace') {
            steps {
                deleteDir() // Clean the workspace to ensure fresh clone
            }
        }
        stage('Clone Repository') {
            steps {
                echo 'Cloning the repository...'
                // Use 'main' if your repo uses it instead of 'master'
                sh 'git clone -b main https://github.com/Divyeshrathod988/chatApp.git'
            }
        }
        stage('Check Workspace Files') {
            steps {
                sh 'ls -la'
                sh 'ls -la chatApp'// This will list all files in the workspace to check for Dockerfile
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
                    // Log in to Docker Hub
                    docker.withRegistry('https://registry.hub.docker.com', 'docker') {
                        // Push the built Docker image to Docker Hub
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy to EC2') {
        steps {
            script {
            // SSH into the EC2 instance and pull & run the Docker image
            sshagent(['ec2_ssh']) {
                 sh '''
ssh -o StrictHostKeyChecking=no ec2-user@3.7.68.32 <<EOF
docker pull divyeshrathod/website:latest
docker stop chatapp || true
docker rm chatapp || true
docker run -d -p 9000:9000 --name divyeshrathod/website:latest
EOF
'''

            }
        }
    }
}

    }

    post {
        always {
            // Clean up workspace after the pipeline
            cleanWs()
        }
    }
}
