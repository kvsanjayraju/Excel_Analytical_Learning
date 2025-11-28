pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // pulls the code from the same repo & branch
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
