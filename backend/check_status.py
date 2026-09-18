import sqlite3
import os

db_path = "biointel.db"
if not os.path.exists(db_path):
    print("Database file does not exist!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [r[0] for r in cursor.fetchall()]
print(f"Tables in DB ({len(tables)}): {tables}")

for tbl in tables:
    try:
        cursor.execute(f"SELECT COUNT(*) FROM {tbl}")
        cnt = cursor.fetchone()[0]
        print(f"  {tbl}: {cnt} rows")
    except Exception as e:
        print(f"  {tbl}: Error {e}")

conn.close()
