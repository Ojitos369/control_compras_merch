# Python
import os
import json
import uuid

# User
from app.core.bases.apis import PostApi, GetApi, get_d, pln
from app.settings import url_base, STATIC_DIR

class GetNewId(GetApi):
    def main(self):
        self.response = {
            'id': str(uuid.uuid4())
        }

class GetHostLink(GetApi):
    def main(self):
        self.response = {
            'host': url_base
        }
    def validate_session(self):
        pass


class GetUsuarios(GetApi):
    def main(self):
        # id_usuario, usuario, activo
        query = """SELECT id_usuario, usuario
                    FROM usuarios
                    WHERE activo = 1
                    """
        rs = self.conexion.consulta_asociativa(query)
        
        self.response = {
            "usuarios": self.d2d(rs)
        }
