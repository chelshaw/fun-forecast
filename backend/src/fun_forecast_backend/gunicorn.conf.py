import multiprocessing
import os

bind = os.getenv("HOST") + ":" + os.getenv("PORT")
workers = multiprocessing.cpu_count() * 2 + 1
