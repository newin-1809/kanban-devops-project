pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = 'docker-hub-credentials'
        DOCKERHUB_USERNAME = 'your_actual_dockerhub_username_here' // Replace before running!
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/kanban-board"
        TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Validate Syntax') {
            steps {
                sh 'echo "Validating Dockerfile and Manifests..."'
                sh 'docker run --rm -i hadolint/hadolint < Dockerfile'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${TAG} -t ${IMAGE_NAME}:latest ."
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh "docker push ${IMAGE_NAME}:${TAG}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }
        
        stage('Deploy to Minikube') {
            steps {
                // Dynamically replace DOCKERHUB_USERNAME in the deployment file
                sh "sed -i 's|DOCKERHUB_USERNAME|${DOCKERHUB_USERNAME}|g' k8s/deployment.yaml"
                
                sh "kubectl apply -f k8s/deployment.yaml -n kanban-prod"
                sh "kubectl apply -f k8s/service.yaml -n kanban-prod"
                
                // Rollout validation
                sh "kubectl rollout status deployment/kanban-deployment -n kanban-prod"
            }
        }
    }
}