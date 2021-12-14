from google.cloud import spanner
from quart import Quart, g, request
import json
from datetime import datetime
from quart_cors import cors
from werkzeug.wrappers import response
import logging
from flask_executor import Executor
import os
from dotenv import load_dotenv
load_dotenv()

app = Quart(__name__)
cors(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# executor = Executor(app)
# app.config['EXECUTOR_TYPE'] = 'thread'

spanner_client = spanner.Client()
instance = spanner_client.instance('react-instance')
database = instance.database('react-database')


@app.before_first_request
def before_first_request():
    log_level = logging.INFO

    for handler in app.logger.handlers:
        app.logger.removeHandler(handler)

    root = os.path.dirname(os.path.abspath(__file__))
    logdir = os.path.join(root, 'logs')
    if not os.path.exists(logdir):
        os.mkdir(logdir)
    log_file = os.path.join(logdir, 'app.log')
    handler = logging.FileHandler(log_file)
    handler.setLevel(log_level)
    app.logger.addHandler(handler)

    app.logger.setLevel(log_level)


@app.route("/")
async def hello_world():
    return "<p>Hello, World!</p>"


def insert_users(transaction, uid):
    sql = f'''INSERT INTO
    USERS (USER_ID,
      CLICK,
      FINISHED,
      FINISHED_TIME,
      HERO,
      KEY1,
      KEY2,
      PENALTY,
      SOLVED,
      VISIBILITY)
  VALUES
    ("{uid}", -- type: STRING(1024)
      TRUE, -- type: BOOL
      FALSE, -- type: BOOL
      TIMESTAMP("2020-12-25 15:30:00+00"), -- type: TIMESTAMP
      [1,0], -- type: ARRAY<INT64> e.g., ['abc','def','ghi'] or [123, 456, 789]
      FALSE, -- type: BOOL
      FALSE, -- type: BOOL
      0, -- type: INT64
      );'''
    row_ct = transaction.execute_update(sql)
    print("{} record(s) inserted.".format(row_ct))


def update_user_data(transaction, data):
    row_ct = transaction.update(
        table="USERS",
        columns=(
            "USER_ID",
            "CLICK",
            "FINISHED",
            "FINISHED_TIME",
            "HERO",
            "KEY1",
            'KEY2',
            'PENALTY',
            'SOLVED',
            'VISIBILITY'),
        values=[(
            data['USER_ID'],
            data['CLICK'],
            data['FINISHED'],
            data['FINISHED_TIME'],
            data['HERO'],
            data['KEY1'],
            data['KEY2'],
            data['PENALTY'],
            data['SOLVED'],
            data['VISIBILITY']
        )]
    )
    # transaction.commit()
    print("{} record(s) inserted.".format(row_ct))


@app.route('/create-user', methods=['POST'])
async def create_user():
    req = await request.json
    print(req)
    uid = req['uid']
    database.run_in_transaction(insert_users, uid)
    return ("Done", 200)


@app.route('/update-user', methods=['POST'])
async def update_userdata():
    data = await request.data
    data = json.loads(data)
    print(data["HERO"])
    data["FINISHED_TIME"] = datetime.fromtimestamp(data["FINISHED_TIME"])
    database.run_in_transaction(update_user_data, data)
    return ("Done", 200)


@app.route('/get-user', methods=['POST'])
async def get_user_docs():
    data = await request.data
    uid = json.loads(data)['uid']
    #uid = "1"
    found = False

    def get_userdocs(transaction, uid):
        nonlocal found
        sql = f'SELECT USER_ID FROM USERS WHERE USER_ID = "{uid}"'
        res = transaction.execute_sql(sql)
        if len(list(res)) > 0:
            found = True

    database.run_in_transaction(get_userdocs, uid)
    if found:
        return ("Done", 200)
    return ("Not Done", 201)


@app.route('/get-user-data', methods=['POST'])
async def get_user_data():
    data = await request.data
    uid = json.loads(data)['uid']
    data = None

    def get_userdocs(transaction, uid):
        nonlocal data
        sql = f'SELECT * FROM USERS WHERE USER_ID = "{uid}"'
        res = list(transaction.execute_sql(sql))
        if len(res) > 0:
            data = res[0]
    database.run_in_transaction(get_userdocs, uid)
    data = {
        "USER_ID": data[0],
        "CLICK": data[1],
        "FINISHED": data[2],
        "FINISHED_TIME": datetime.timestamp(data[3]),
        "HERO": data[4],
        "KEY1": data[5],
        "KEY2": data[6],
        "PENALTY": data[7],
        "SOLVED": data[8],
        "VISIBILITY": data[9],
    }
    return (json.dumps(data), 200)


if __name__ == "__main__":
    app.run(threaded=True, debug=True)
