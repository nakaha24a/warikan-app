# 🚨🚨🚨 注意: 以下のデータベース接続情報は、テスト目的のものです。
from flask import Flask, render_template, jsonify, request
import pyodbc

app = Flask(__name__)

# データベース接続関数
def get_db_connection():
    connection = pyodbc.connect('DRIVER={ODBC Driver 18 for SQL Server};'
                                'SERVER={\\SQLEXPRESS};'
                                'DATABASE={testDB};'
                                'UID={testdb};PWD={testdbpwd};'
                                'Trusted_Connection=No;TrustServerCertificate=Yes;')
    return connection

@app.route("/")
def home():
    return render_template("human.html")

@app.route("/next")
def next_page():
    connection = get_db_connection()
    cursor = connection.cursor()
    
    SQL_QUERY = "SELECT name FROM nameTest ORDER BY id;"
    cursor.execute(SQL_QUERY)
    records = cursor.fetchall()
    
    names = [row[0] for row in records] 
    
    connection.close()
    return render_template("human2.html", names=names)


@app.route("/insert_names", methods=["POST"])
def insert_names():
    data = request.json
    name_list = data.get("names")  
    
    if not name_list:
        return jsonify({"message": "名前が入力されていません"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    
    SQL_INSERT = "INSERT INTO nameTest (name) OUTPUT INSERTED.id VALUES (?)"
    
    for name in name_list:
        cursor.execute(SQL_INSERT, (name,))
    
    connection.commit()
    connection.close()

    return jsonify({"message": "名前がデータベースに追加されました！"})

if __name__ == "__main__":
    app.run(debug=True)
