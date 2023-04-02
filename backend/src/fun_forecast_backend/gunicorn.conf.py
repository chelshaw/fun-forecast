import multiprocessing
import os

bind = os.getenv("HOST") + ":" + os.getenv("PORT")
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
reload = True
reload_engine = "auto"