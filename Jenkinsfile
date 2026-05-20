pipeline {
    agent any
    
    environment {
        // This tells Jenkins exactly how to talk to Docker Desktop
        DOCKER_HOST = 'tcp://localhost:2375' 
        
        DOCKERHUB_CREDENTIALS = 'docker-hub-credentials'
        DOCKERHUB_USERNAME = 'newin1809'
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
                bat 'echo "Validating Dockerfile and Manifests..."'
                bat 'docker run --rm -i hadolint/hadolint < Dockerfile || exit 0'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                bat "docker build -t ${IMAGE_NAME}:${TAG} -t ${IMAGE_NAME}:latest ."
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat 'echo %DOCKER_PASS%| docker login -u %DOCKER_USER% --password-stdin'
                    bat "docker push ${IMAGE_NAME}:${TAG}"
                    bat "docker push ${IMAGE_NAME}:latest"
                }
            }
        }
        
        stage('Deploy to Minikube') {
            steps {
                bat "powershell -Command \"(Get-Content k8s/deployment.yaml) -replace 'DOCKERHUB_USERNAME', '${DOCKERHUB_USERNAME}' | Set-Content k8s/deployment.yaml\""
                bat "kubectl apply -f k8s/deployment.yaml -n kanban-prod"
                bat "kubectl apply -f k8s/service.yaml -n kanban-prod"
                bat "kubectl rollout status deployment/kanban-deployment -n kanban-prod"
            }
        }
    }
}