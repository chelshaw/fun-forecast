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

# Create a Virtualenv that runs Python `3.9.0`
pyenv install 3.9.0
pyenv global 3.9.0 # might need to do more to set your global pyenv version

# Install Poetry dependencies
brew install poetry

# cd into the top level directory
cd fun-forecast/backend

# Install the dependencies
poetry install
```

### VSCode configuration

- Do Python: Create environment with .venv

### Making Changes

```
poetry add <library>
poetry lock  # locks the dependency file for Docker/future builds
poetry run pytest  # run at backend root level, runs all unit tests

docker build . -t ff-backend
docker run ff-backend:latest
OR (for networking, before docker-compose is set up):
docker run -d -p 5000:5000 ff-backend:latest
```

<hr/>

## Misc

Changing pre-commit configuration (not sure if this is necessary multiple times)

```
poetry run pre-commit install -t pre-commit
poetry run pre-commit install -t pre-push
```
