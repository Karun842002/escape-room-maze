from datetime import datetime
from blacksheep.server import Application
from blacksheep.server.responses import json as js
from google.cloud import spanner
from dotenv import load_dotenv
from google.api_core.exceptions import GoogleAPICallError
import json

load_dotenv()
spanner_client = spanner.Client()
instance = spanner_client.instance('react-instance')
database = instance.database('react-database')

app = Application()
app.use_cors(
    allow_methods="*",
    allow_origins="*",
    allow_headers="* Authorization",
    max_age=300,
)
@app.route("/")
async def hello_world():
    return "<p>Hello, World!</p>"


def insert_users(transaction, uid):
    return list(transaction.insert(
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
            uid,
            True,
            False,
            datetime.fromtimestamp(0),
            [1,0],
            False,
            False,
            0,
            [True]*115,
            [True]*729
        )]
    ))
    #print("{} record(s) inserted.".format(row_ct))


def update_user_data(transaction, data):
    transaction.execute_update(
            "UPDATE USERS"
            "SET CLICK=@CLICK, FINISHED=@FINISHED, FINISHED_TIME=@FINSIHED_TIME, HERO=@HERO, KEY1=@KEY1, KEY2=@KEY2, PENALTY=@PENALTY, SOLVED=@SOLVED,VISIBILITY=@VISIBILITY"
            "WHERE USER_ID='aSs9Ko79rQM2Ke9uaWWu48CDrOm1'",
            params={"AlbumBudget": first_album_budget},
            param_types={"AlbumBudget": spanner.param_types.INT64},
        )

    return list(transaction.update(
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
    ))
    # transaction.commit()
    #print("{} record(s) inserted.".format(row_ct))


@app.route('/create-user', methods=['POST'])
async def create_user(request):
    req = await request.text()
    data = json.loads(req) 
    uid = data['uid']
    print(data['uid'])
    database.run_in_transaction(insert_users, uid)
    return js("Done", 200)


@app.route('/update-user', methods=['POST'])
async def update_userdata(request):
    data = await request.text()
    data = json.loads(data)
    data["FINISHED_TIME"] = datetime.fromtimestamp(data["FINISHED_TIME"])
    try:
        database.run_in_transaction(update_user_data, data)
    except GoogleAPICallError as ex:
        print(ex)
    return js("Done", 200)


@app.route('/get-user', methods=['POST'])
async def get_user_docs(request):
    data = await request.text()
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
        return js("Done", 200)
    return js("Not Done", 201)


@app.route('/get-user-data', methods=['POST'])
async def get_user_data(request):
    data = await request.text()
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
    return js(json.dumps(data), 200)