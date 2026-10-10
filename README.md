# playwright-agentic-qa
AI-assisted Playwright QA framework demonstrating agentic test planning, test generation, failure diagnosis, POM, and CI/CD with GitHub Actions.


## Running tests with Docker

Prerequisite: install and start Docker Desktop.

The Dockerfile uses the official Playwright v1.62.1 Noble image.
Keep this version aligned with Playwright in package-lock.json.
Dependencies are installed using npm ci.

### Build the image

Run from the project root:

```bash
docker build -t playwright-ai-agent:local .
```

Rebuild after changing project files. The image contains a snapshot
of the files copied during the build.

### Run the guest workflow tests

Create the host report folders first:

```bash
mkdir -p docker-reports docker-test-results
```

Then run:

```bash
docker run --rm --init --ipc=host \
  --env CI=true \
  --env PLAYWRIGHT_HTML_OPEN=never \
  --mount "type=bind,source=$PWD/docker-reports,target=/app/playwright-report" \
  --mount "type=bind,source=$PWD/docker-test-results,target=/app/test-results" \
  playwright-ai-agent:local \
  npx playwright test tests/automationexercise-approved-workflows.spec.ts \
  --project=chromium \
  --workers=1 \
  --retries=0 \
  --grep-invert="TC-AUTH-005"
```

This runs five guest tests against the external AutomationExercise
website. The container does not host the application.

- --rm removes the container after execution; the image remains.
- --init adds a small process manager to handle child-process cleanup.
- --ipc=host provides Chromium with the shared-memory configuration
  recommended for this runner.
- Bind mounts save reports outside the container.
- A failed test produces a nonzero exit code.

HTML reports are saved under docker-reports/.
JUnit XML and failure artifacts are saved under docker-test-results/.

### Runtime choices

The command after the image name replaces the Dockerfile's default
command. Change the test file, --project, or test filter to select
another supported run.

Runtime variables can be supplied using --env NAME or an uncommitted
--env-file. Never put credentials in the Dockerfile or build arguments.
The guest suite above does not require credentials.

### Architecture and permissions

Verified locally: Linux x86_64, Playwright 1.62.1.
Other architectures have not been verified by this project.

The image currently runs as root inside the container.
Bind-mounted report folders must be writable by the container user.
On Linux hosts, generated reports may be owned by root; a non-root
runner and its folder permissions require separate validation.

.dockerignore excludes local dependencies, Git data, environment
files, secrets, authentication state, and generated reports from
the build context.