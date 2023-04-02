# Fun Forecast Backend

Python based backend for fun forecast

<hr/>

## Repo Structure

This repo uses [Poetry](https://python-poetry.org/), a python version dependency management tool.

Python linter/formatter/etc... setup follows a mixture of [this guide](https://sourcery.ai/blog/python-best-practices/)
and [this example](https://github.com/bitphage/cookiecutter-base-py-project).

## Local Development Setup

As of now, this repo only contains Python code. For smooth local development, do the following:

Install:

- [Docker](https://www.docker.com/).
- [Poetry](https://python-poetry.org/) for Python package and environment management.
- [Homebrew](https://brew.sh/)

```
# Install pyenv
brew install pyenv

# Create an env that runs Python `3.11.0`, set it to global default
pyenv install 3.11.0
pyenv global 3.11.0

# Install Poetry and project dependencies
pip install poetry
cd fun-forecast/backend
poetry install
```

### VSCode configuration

```
cd fun-forecast
code .
```
Open the file .vscode/backend.code-workspace and click on the "open workspace" button.

This will open vscode in the backend project with all of the Python settings defined in that file.


### Changes & Deployment

```
poetry add <library>
poetry lock  # locks the dependency file for Docker/future builds
poetry run pytest  # run at backend root level, runs all unit tests

# Build and run image
docker build . -t ff-backend
docker run -d -p 5001:5001 ff-backend:latest
docker logs <container_id>

# Test API via localhost (example)
http://localhost:5001/api/v0/get-forecast/walk/36.8637,-78.5324

# Use docker compose
docker compose up -d
docker compose down
```

You can now use the running docker container to test as needed.

To deploy changes to AWS, simply commit and push your changes to your development branch. Upon successful merge with main, github actions will build and deploy the backend image to AWS ECR. The details are in `.github/workflows/main.yaml`. To change the container version on ECR, change line 30 in `main.yaml` to one of the following: `minor, major, patch`. This will update the container version by incrementing the respective value `v{Major}.{Minor}.{Patch}`, as well as add the image to ECR with the tag `latest` to make the following ECS deployment easier.

<hr/>


### Troubleshooting

If you are encountering the following error when running the docker container on an Apple M1 chip:

```
docker: Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:5000 -> 0.0.0.0:0: listen tcp 0.0.0.0:5000: bind: address already in use.
```

Read (this tutorial)[https://twissmueller.medium.com/resolving-the-problem-of-port-5000-already-being-in-use-dd2fe4bad0be] to learn more (TL;DR Turn off `Airplay Receiving` in Sharing system preferences)


## AWS Architecture & Resources
CICD/ECR reference: https://www.youtube.com/watch?v=Hv5UcBYseus&feature=youtu.be
ECS tutorial: https://www.youtube.com/watch?v=esISkPlnxL0
