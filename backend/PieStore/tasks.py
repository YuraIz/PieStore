from .celery import app
from time import time, sleep


# @app.task(bind=True)
# def make_order(self, secs=0):
#     end_time = time() + secs
#     while time() < end_time:
#         self.update_state(state='PRGORESS', meta=(end_time - time()))
#         sleep(0.5)

#     return 0.0


@app.task(bind=True)
def make_order(self, secs=0):
    end_time = time() + secs
    while time() < end_time:
        self.update_state(state='PRGORESS', meta=(end_time - time()))
        sleep(0.5)

    return 0.0
