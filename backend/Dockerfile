FROM python:3.11-slim-buster

RUN apt-get update
RUN apt-get install -y build-essential

# STANDARD PYTHON SETUP
ENV PYTHONWRITEBYTECODE=1
ENV PYTHONFAULTHANDLER=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONHASHSEED=random
ENV PIP_NO_CACHE_DIR=off
ENV PIP_DISABLE_PIP_VERSION_CHECK=on
ENV PIP_DEFAULT_TIMEOUT=100
ENV POETRY_VERSION=1.4.0
ENV PYTHONPATH="/app/service/src/fun_forecast_backend:/app/service/src"
ENV STAGE=$STAGE

EXPOSE $PORT

RUN pip install "poetry==$POETRY_VERSION"
RUN poetry config virtualenvs.create false

WORKDIR /app/service
COPY ./poetry.lock .
COPY ./pyproject.toml .

RUN poetry install

COPY . .

WORKDIR /app/service/src/fun_forecast_backend
CMD ["gunicorn", "--config", "gunicorn.conf.py", "main:app", "-k", "uvicorn.workers.UvicornWorker"]