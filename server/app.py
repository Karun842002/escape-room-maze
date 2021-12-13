from flask import Flask
from google.cloud import spanner
from flask import request
import json
from datetime import datetime
from flask_cors import CORS
from werkzeug.wrappers import response

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

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
def create_user():
    uid = request.json['uid']
    database.run_in_transaction(insert_users, uid)
    return ("Done", 200)


@app.route('/update-user', methods=['POST'])
def update_userdata():
    data = json.loads(request.data)
    print(data)
    data1 = {
        "USER_ID": data["USER_ID"],
        "CLICK": data["CLICK"],
        "FINISHED": data["FINISHED"],
        "FINISHED_TIME": datetime.fromtimestamp(0),
        "HERO": data["HERO"],
        "KEY1": data["KEY1"],
        "KEY2": data["KEY2"],
        "PENALTY": data["PENALTY"],
        "SOLVED": data["SOLVED"],
        "VISIBILITY": data["VISIBILITY"]
    }
    # date1 = data.get('FINISHED_TIME')
    # print(type(date1))
    # data["FINISHED_TIME"] = datetime.fromtimestamp(0)
    database.run_in_transaction(update_user_data, data1)
    return ("Done", 200)


@app.route('/get-user', methods=['POST'])
def get_user_docs():
    uid = json.loads(request.data)['uid']
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
def get_user_data():
    uid = json.loads(request.data)['uid']
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
