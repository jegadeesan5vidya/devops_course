pipeline {
    agent any

    environment {
        BUILD_TAG = "${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "mern-frontend:${BUILD_TAG}"
        BACKEND_IMAGE  = "mern-backend:${BUILD_TAG}"
        PORT= "5000"
        MONGO_URI= "mongodb://mongo:27017/taskdb"
    }

    stages {
        stage('Checking out code') {
            steps {
                git url: 'https://github.com/jegadeesan5vidya/devops_course.git', branch: 'dev' 
            }
        }

        stage('Prepare .env') {
            steps {
                sh '''
                mkdir -p server
                cat > server/.env << EOF
                PORT=$PORT
                MONGO_URI=$MONGO_URI
                EOF
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                echo "Cleaning up old containers..."
                /usr/bin/docker compose down || true
                '''
            }
        }

        stage('Build docker images for server and client') {
            steps {
                sh '''
                echo 'Building backend docker image (-)'
                docker build -t $BACKEND_IMAGE ./server
                echo 'Building frontend docker image (-)'
                docker build -t $FRONTEND_IMAGE ./client --build-arg VITE_APP_URL=http://localhost:5000/api
                '''
            }
        }
        
        stage('Run images with docker compose') {
            steps {
                sh '''
                echo "Starting MERN app with docker compose (-)"
                /usr/bin/docker compose up -d
                echo 'Show running containers (-)'
                /usr/bin/docker ps
                echo 'backend logs'
                /usr/bin/docker logs demo-backend || true
                /usr/bin/docker logs demo-frontend || true
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "Checking backend health..."
                sleep 10
                curl -f http://localhost:5000/health || (echo "Backend health check failed" && exit 1)
                '''
            }
        }
    }

    post {
        success {
            echo "✅ MERN resilience pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed — check container logs for details."
            sh 'docker ps -a'
        }
    }
}