from app.core.bases.conexion import MyConexioneMySQL as ConexionMySQL
from app.settings import MYE, prod_mode, ce, DB_DATA

class Utils:
    def __init__(self, db_data):
        self.ce = ce
        self.MYE = MYE
        self.create_conexion(db_data)

    def __del__(self):
        self.close_conexion

    def create_conexion(self, db_data=None):
        self.close_conexion()
        self.conexion = ConexionMySQL(db_data or DB_DATA, ce=self.ce, send_error=True)
        self.conexion.raise_error = True

    def close_conexion(self):
        try:
            self.conexion.close()
        except:
            pass
