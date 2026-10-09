pipeline {
    // Local learning setup: the available execution node is your Mac.
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
    }

    environment {
        PATH = "/Users/Work/.docker/bin:${env.PATH}"
        IMAGE_NAME = 'playwright-agentic-qa-jenkins'
    }

    stages {
        stage('Checkout') {
            steps {
                // Clean only this job's allocated workspace, avoiding stale reports.
                deleteDir()
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                // BUILD_NUMBER distinguishes images produced by this job's builds.
                sh 'docker build -t "$IMAGE_NAME:$BUILD_NUMBER" .'
            }
        }

        stage('Run Guest Tests') {
            steps {
                sh '''
                    set -eu
                    mkdir -p playwright-report test-results

                    docker run --rm --init --ipc=host \
                      --env CI=true \
                      --env PLAYWRIGHT_HTML_OPEN=never \
                      --mount "type=bind,source=$PWD/playwright-report,target=/app/playwright-report" \
                      --mount "type=bind,source=$PWD/test-results,target=/app/test-results" \
                      "$IMAGE_NAME:$BUILD_NUMBER" \
                      npx playwright test tests/automationexercise-approved-workflows.spec.ts \
                      --project=chromium \
                      --workers=1 \
                      --retries=0 \
                      --grep-invert="TC-AUTH-005"
                '''
            }
        }
    }

    post {
        always {
            // Archive first so a missing or invalid JUnit report cannot prevent
            // collection of HTML reports and other available failure artifacts.
            archiveArtifacts(
                artifacts: 'playwright-report/**,test-results/**',
                allowEmptyArchive: true
            )

            script {
                if (fileExists('test-results/junit.xml')) {
                    junit testResults: 'test-results/junit.xml', allowEmptyResults: false
                } else if (currentBuild.currentResult == 'SUCCESS') {
                    error('Test execution completed without the required JUnit report.')
                } else {
                    echo 'No JUnit report was produced; retaining the existing unsuccessful build result.'
                }
            }
        }
    }
}
