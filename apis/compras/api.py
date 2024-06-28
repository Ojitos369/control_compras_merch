# Python
import os
import json
import uuid

# User
from app.core.bases.apis import PostApi, GetApi, get_d, pln

from app.settings import STATIC_DIR, url_base

class GuardarImagen(PostApi):
    def main(self):
        self.show_me()
        
        file = self.request.FILES['file']
        file_name = file.name
        file_id, file_extension = file_name.split('.')
        
        usuario_id = self.user["id_usuario"]
        
        pln(f'file_name: {file_name}')
        pln(f'file_extension: {file_extension}')
        pln(f'file: {file}')

        id_compra = file_name.split('_')[0]
        ruta = f"/compras/{id_compra}/preview"

        path_save = f'{STATIC_DIR}{ruta}'
        pln("path_save", path_save)
        if not os.path.exists(path_save):
            os.makedirs(path_save)
        
        path_save = f'{path_save}/{file_name}'
        with open(path_save, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        
        image = {
            "url": f"{url_base}/static{ruta}/{file_name}",
            "name": file_name
        }
        
        query = """INSERT INTO imagenes
                (id_imagen, usuario_id, compra_id, ruta, estatus)
                values
                (%s, %s, %s, %s, 'pendiente') """
        
        query_data = (file_id, usuario_id, id_compra, path_save)
        
        if not (self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            self.send_me_error(f"Error al guardar la imagen {file_name} en la base de datos")
        self.conexion.commit()

        self.response = {
            "image": image
        }


class ValidarImagenesNoGuardadas(GetApi):
    def main(self):
        self.show_me()
        usuario_id = self.user["id_usuario"]
        
        query = """SELECT id_imagen, ruta FROM imagenes
                WHERE usuario_id = %s AND estatus = 'pendiente' """
        query_data = (usuario_id,)
        images = self.conexion.consulta_asociativa(query, query_data)
        
        # ids = [i["id_imagen"] for i in images]
        for image in images:
            ruta = image["ruta"]
            if os.path.exists(ruta):
                os.remove(ruta)
            
            final = ruta.split('/static/compras/')[1]
            compra = final.split('/')[0]
            files = os.listdir(f'{STATIC_DIR}/compras/{compra}/preview')
            if not files:
                os.rmdir(f'{STATIC_DIR}/compras/{compra}/preview')
            files = os.listdir(f'{STATIC_DIR}/compras/{compra}')
            if not files:
                os.rmdir(f'{STATIC_DIR}/compras/{compra}')
            
        query = """DELETE FROM imagenes
                WHERE usuario_id = %s AND estatus = 'pendiente' """
        query_data = (usuario_id,)
        
        if not (self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            self.send_me_error("Error al eliminar las imágenes pendientes")
        self.conexion.commit()
        
        self.response = {
            "message": "Imágenes eliminadas correctamente",
        }
