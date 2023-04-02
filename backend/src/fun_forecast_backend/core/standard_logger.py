import logging
from logging.config import dictConfig

LOGGER_NAME: str = "app-logger"
LOG_LEVEL: str = "DEBUG"
app_dict_config = {
    "version": 1, # mandatory field
    # if you want to overwrite existing loggers' configs
    # "disable_existing_loggers": False,
    "formatters": {
        "basic": {
            "format": "%(asctime)s %(filename)s %(lineno)d [%(levelname)s] %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S"
        }
    },
    "handlers": {
        "console": {
            "formatter": "basic",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
            "level": LOG_LEVEL,
        }
    },
    "loggers": {
        LOGGER_NAME: {
            "handlers": ["console"],
            "level": LOG_LEVEL,
            # "propagate": False
        }
    },
}

dictConfig(app_dict_config)

def get_logger(name: str = LOGGER_NAME, level: int = logging.DEBUG) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(level)
    return logger
