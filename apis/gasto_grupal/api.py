# Python
import os
import json
import uuid
import datetime

from ojitos369.utils import print_json as pj
import pandas as pd
# User
from app.core.bases.apis import PostApi, GetApi, get_d, pln
from app.core.bases.correos import GeneralTextMail
from app.settings import STATIC_DIR, url_base

class Test(GetApi):
    def main(self):
        self.show_me()
        self.response = {
            "message": "test"
        }


class GetCompras(GetApi):
    def main(self):
        query = """
                select
                    c.id_compra compra_id, c.total total_compra, c.nombre_compra,
                    c.descripcion_compra, c.origen, c.fecha_compra, 
                    cd.id_compra_det compra_det_id, cd.descripcion articulo, cd.cantidad, cd.total, cd.precio,
                    cu.id_compra_usuario compra_usuario_id, cu.total_correspondiente, cu.porcentaje, cu.cantidad_porcentaje
                from compras c
                inner join compras_det cd on cd.compra_id = c.id_compra
                inner join compras_usuarios cu on cu.compra_id = c.id_compra and cu.compra_det_id = cd.id_compra_det
                and c.activo
                and not c.oculto
                and cd.activo
                and not cd.oculto"""

        images_query = """
                select id_imagen imagen_id, compra_id, ruta, filename
                from imagenes"""

        imgs = self.conexion.consulta_asociativa(images_query)
        df = self.conexion.consulta_asociativa(query)
        cm = df.groupby(['compra_id', 'total_compra', 'nombre_compra', 'descripcion_compra', 'origen']).size().reset_index(name='count')
        cm = cm.to_dict(orient='records')
        for c in cm:
            dets = df[(df['compra_id'] == c['compra_id'])]
            c['detalles'] = dets.to_dict(orient='records')
            images = imgs[(imgs['compra_id'] == c['compra_id'])]
            c['images'] = images.to_dict(orient='records')
        self.response = {
            "compras": cm
        }

