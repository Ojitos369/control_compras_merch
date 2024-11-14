from google.oauth2 import service_account
from googleapiclient.discovery import build

import pandas as pd

from app.settings import MEDIA_DIR, google_drive_file

credentials_file = f"{MEDIA_DIR}/json/{google_drive_file}" if google_drive_file else None
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

class Sheet:
    def __init__(self, sheet_id: str = None):
        self.sheet_id = sheet_id or "1nMNs3sv3heDsRLR1nQEiRzZix9fGWKck"
        if not credentials_file:
            raise Exception("No se ha definido el archivo de credenciales de google drive")
        self.sheet_service = self.load_sheet_service()

    def load_sheet_service(self):
        creds = None
        creds = service_account.Credentials.from_service_account_file(credentials_file, scopes=SCOPES)
        service = build('sheets', 'v4', credentials=creds)
        sheet = service.spreadsheets()
        return sheet
    
    def load_sheet(self, sheet_id: str = None):
        self.sheet_id = sheet_id or self.sheet_id
        return self.sheet_service.get(spreadsheetId=self.sheet_id).execute()
    
    def get_file_df(self):
        file = self.load_sheet()
        sheets = file.get('sheets', [])
        shs = {}
        for sheet in sheets:
            title = sheet.get('properties', {}).get('title', None)
            if title:
                result = self.sheet_service.values().get(spreadsheetId=self.sheet_id, range=title).execute()
                values = result.get('values', [])
                if values:
                    shs[title] = pd.DataFrame(values[1:], columns=values[0])
        return shs
