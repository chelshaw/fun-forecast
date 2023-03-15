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

- Do Python: Create environment with .venv

### Making Changes

```
poetry add <library>
poetry lock  # locks the dependency file for Docker/future builds
poetry run pytest  # run at backend root level, runs all unit tests

# Build and run image
docker build . -t ff-backend
docker run -d -p 5001:5001 ff-backend:latest

# Use docker compose
docker compose up -d
docker compose down
```

<hr/>

## Misc

Changing pre-commit configuration (not sure if this is necessary multiple times)

```
poetry run pre-commit install -t pre-commit
poetry run pre-commit install -t pre-push
```

### Troubleshooting

If you are encountering the following error when running the docker container on an Apple M1 chip:

```
docker: Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:5000 -> 0.0.0.0:0: listen tcp 0.0.0.0:5000: bind: address already in use.
```

Read (this tutorial)[https://twissmueller.medium.com/resolving-the-problem-of-port-5000-already-being-in-use-dd2fe4bad0be] to learn more (TL;DR Turn off `Airplay Receiving` in Sharing system preferences)
