from flask import Flask
from google.cloud import spanner
from flask import request
import json
from datetime import datetime

from werkzeug.wrappers import response

app = Flask(__name__)

spanner_client = spanner.Client()
instance = spanner_client.instance('react-instance')
database = instance.database('react-database')


@app.route("/")
def hello_world():
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
            data["USER_ID"],
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
def create_user():
    uid = request.json['uid']
    database.run_in_transaction(insert_users, uid)
    return ("Done", 200)


@app.route('/update-user', methods=['POST'])
def update_userdata():
    data = request.json['data']
    # data = {
    #     "USER_ID": uid,
    #     "CLICK": True,
    #     "FINISHED": False,
    #     "FINISHED_TIME": datetime.fromtimestamp(0),
    #     "HERO": [11, 10],
    #     "KEY1": False,
    #     "KEY2": False,
    #     "PENALTY": 0,
    #     "SOLVED": [True]*115,
    #     "VISIBILITY": [True] * 729
    # }
    database.run_in_transaction(update_user_data, data)
    return ("Done", 200)


@app.route('/get-user', methods=['GET'])
def get_user_docs():
    uid = request.json['uid']
    found = False

    def get_userdocs(transaction, uid):
        nonlocal found
        sql = f'SELECT USER_ID FROM USERS WHERE USER_ID = "{uid}"'
        res = transaction.execute_sql(sql)
        if len(list(res)) > 0:
            found = True

    database.run_in_transaction(get_userdocs, uid)
    if found :
        return ("Done", 200)
    return ("Not Done", 200)
