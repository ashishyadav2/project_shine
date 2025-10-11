import os
import logging
from datetime import datetime

LOG_DIR = os.path.join(os.getcwd(), "logs")
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = f"{datetime.now().strftime('%m_%d_%Y_%H_%M')}.log"
# LOG_FILE = "test.log"
LOG_FILE_PATH = os.path.join(os.getcwd(),"logs",LOG_FILE)

IS_LOGGING_ENABLED = os.getenv("LOGGING")
IS_CONSOLE_LOGGING_ENABLED = os.getenv("CONSOLE_LOGGING")

logging_level = logging.CRITICAL + 1

if IS_LOGGING_ENABLED=="True":
    logging_level = logging.DEBUG
    
logging.basicConfig(
        filename= LOG_FILE_PATH,
        format= '[ %(asctime)s ] file_name:"%(filename)s" module_name:(%(name)s) line: [%(lineno)d] - logging_level:%(levelname)s - %(funcName)s() - message:%(message)s \n',
        level = logging_level
    )

LOG_LEVELS = {
    "debug": logging.debug,
    "info": logging.info,
    "warning": logging.warning,
    "error": logging.error,
    "critical": logging.critical
}

def log(level, message):   
    LOG_LEVELS.get(level.lower(), logging.info)(message,stacklevel=3)
    
def aprint(*args,**kwargs):
    if IS_CONSOLE_LOGGING_ENABLED=="True":
        print(*args,**kwargs)