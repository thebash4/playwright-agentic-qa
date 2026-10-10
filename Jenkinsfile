// Defines the complete Jenkins pipeline.
pipeline {

    // Run on any available Jenkins execution node.
    // In our learning setup, that node is your Mac.
    agent any

    // Defines what automatically starts this job.
    triggers {

        // Check GitHub roughly every two minutes.
        // Check GitHub for new commits every two minutes.
        // Start a build only when new changes are detected.
        // H distributes the checking times between different jobs.
        pollSCM('H/2 * * * *')
    }

    // Controls how the pipeline executes.
    options {

        // Keep the latest 20 builds and their archived reports.
        buildDiscarder(logRotator(numToKeepStr: '20'))

        // Disable Jenkins's automatic checkout because we perform
        // checkout explicitly in the Checkout stage below.
        skipDefaultCheckout(true)

        // Prevent two builds of this job from running simultaneously.
        // Another requested build waits for the current one to finish.
        disableConcurrentBuilds()

        // Stop execution if it exceeds 20 minutes after allocating the node.
        timeout(time: 20, unit: 'MINUTES')
    }

    // Settings available to commands throughout the pipeline.
    environment {

        // Add Docker's installation folder to the command search path.
        // Keep the existing PATH so other commands remain available.
        PATH = "/Users/Work/.docker/bin:${env.PATH}"

        // Base name for the Docker images this job builds.
        IMAGE_NAME = 'playwright-agentic-qa-jenkins'
    }

    // The main stages execute in the order listed.
    stages {

        stage('Checkout') {
    steps {
        // Clean this job's workspace, then download its GitHub code.
        deleteDir()
        checkout scm

        script {
            // Create an image tag using the job name and build number.
            // Replace characters that Docker tags cannot contain.
            env.IMAGE_TAG = env.BUILD_TAG.replaceAll('[^a-zA-Z0-9_.-]', '-')
        }
    }
}

        stage('Build Docker Image') {
            steps {

                // Execute a terminal command to build the Dockerfile
                // in the current workspace.
                // Example image tag: playwright-agentic-qa-jenkins:6
                // BUILD_NUMBER is supplied automatically by Jenkins.
                sh 'docker build -t "$IMAGE_NAME:$IMAGE_TAG" .'
            }
        }

        stage('Run Guest Tests') {
            steps {

                // sh executes the enclosed text as a shell script.
                // Shell comments inside this block use # rather than //.
                sh '''
                    # -e: stop if a command fails.
                    # -u: fail if an unset shell variable is used.
                    set -eu

                    # Create the report folders before mounting them.
                    mkdir -p playwright-report test-results

                    # Start the image built by this Jenkins build.
                    # --rm removes the container after it exits.
                    # --init helps manage and clean up container processes.
                    # --ipc=host provides shared memory access for Chromium.
                    #
                    # CI=true enables Playwright's CI-specific configuration.
                    # PLAYWRIGHT_HTML_OPEN=never prevents a report viewer
                    # from starting and keeping the container running.
                    #
                    # Mount both report folders into Jenkins's workspace.
                    # $PWD means the shell's current working directory.
                    # Reports survive the container's removal.
                    #
                    # The command after the image replaces its default CMD.
                    # Run Chromium, one worker, zero retries, and exclude
                    # TC-AUTH-005 because it requires valid login credentials.
                    docker run --rm --init --ipc=host \
                      --env CI=true \
                      --env PLAYWRIGHT_HTML_OPEN=never \
                      --mount "type=bind,source=$PWD/playwright-report,target=/app/playwright-report" \
                      --mount "type=bind,source=$PWD/test-results,target=/app/test-results" \
                      "$IMAGE_NAME:$IMAGE_TAG" \
                      npx playwright test tests/automationexercise-approved-workflows.spec.ts \
                      --project=chromium \
                      --workers=1 \
                      --retries=0 \
                      --grep-invert="TC-AUTH-005"
                '''
            }
        }
    }

    // Actions performed after the main stages finish.
    post {

        // Attempt these actions whether the build passed or failed.
        always {

            // Save available reports and artifacts with this build.
            // ** includes files in nested folders.
            // Archive before processing JUnit so a JUnit error cannot
            // prevent these files from being saved.
            archiveArtifacts(
                artifacts: 'playwright-report/**,test-results/**',

                // Missing artifacts alone do not fail this step:
                // an earlier checkout/build failure may produce none.
                allowEmptyArchive: true
            )

            // Allows conditional Groovy logic inside this pipeline.
            script {

                

                // If the JUnit XML exists, publish its test results.
                if (fileExists('test-results/junit.xml')) {

                    // Jenkins reads the XML and displays tests and failures.
                    // An empty report is not accepted.
                    // This does not turn an existing FAILURE into SUCCESS.
                    junit testResults: 'test-results/junit.xml',
                          allowEmptyResults: false

                // A successful run must produce the required JUnit report.
                } else if (currentBuild.currentResult == 'SUCCESS') {

                    // Fail rather than claim success without test evidence.
                    error('Test execution completed without the required JUnit report.')

                } else {

                    // An earlier step already failed or was aborted.
                    // Explain the missing report without replacing that result.
                    echo 'No JUnit report was produced; retaining the existing unsuccessful build result.'
                }
            }
        }
    }
}