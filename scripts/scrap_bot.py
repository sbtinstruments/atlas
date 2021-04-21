import gspread
from pathlib import Path

def get_records():
    gc = gspread.service_account(filename=Path('json_token.json').absolute())
    sh = gc.open("Atlas-list")

    return sh.sheet1.get_all_records()