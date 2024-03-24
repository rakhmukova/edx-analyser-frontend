import json
import os

import pymongo

from metrics.decompress_zst import LOGS_DIR, LOGS_FILES_DIR

if __name__ == '__main__':
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["itmo_logs"]

    folder_path = LOGS_DIR + LOGS_FILES_DIR
    file_names = os.listdir(folder_path)
    common_collection = db["all_logs"]

    for file_name in file_names:
        with open(os.path.join(folder_path, file_name), "r", encoding="utf-8") as file:
            print(file_name)
            for line in file:
                try:
                    log_entry = json.loads(line)
                    common_collection.insert_one(log_entry)
                except json.JSONDecodeError:
                    print("Ошибка разбора JSON в строке:", line)
