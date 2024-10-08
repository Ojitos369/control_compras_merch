import os
from app.core.bases.commands import MyBaseCommand, pj, pln, TF, get_d
from app.settings import STATIC_DIR

class Command(MyBaseCommand):
    def main(self, *args, **options):
        self.create_conexion()
        
        query = """SELECT id_compra from compras """
        r = self.conexion.consulta_asociativa(query)
        # ids = r['id_compra']

        check_path = "compras"
        folders = os.listdir(f"{STATIC_DIR}/{check_path}")
        
        for folder in folders:
            if r[r["id_compra"] == folder].empty:
                print(f"Deleting: {folder}")
                os.system(f"rm -rf {STATIC_DIR}/{check_path}/{folder}")

