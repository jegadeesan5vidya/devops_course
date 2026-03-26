pipeline {
    agent any

    environment {
        FRONTEND_IMAGE= "mern-frontend:jenkins"
        BACKEND_IMAGE= "mern-backend:jenkins"
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
                docker compose up -d
                echo 'Show running containers (-)'
                docker ps
                echo 'backend logs'
                docker logs backend || true
                docker logs frontend || true
                '''
            }
        }
    }

}