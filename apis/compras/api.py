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
                (id_imagen, usuario_id, compra_id, ruta, filename, estatus)
                values
                (%s, %s, %s, %s, %s, 'pendiente') """
        
        query_data = (file_id, usuario_id, id_compra, path_save, file_name)
        
        if not (self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            self.send_me_error(f"Error al guardar la imagen {file_name} en la base de datos")
        self.conexion.commit()
        image["id_image"] = file_id

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


class GuardarCompra(PostApi):
    def main(self):
        self.show_me()
        from ojitos369.utils import print_json as pj
        # pj(self.data)
        self.id_compra = self.data["id"]
        self.get_usuarios()
        self.guardar_compra()
        self.guardar_detalles()
        self.guardar_usuarios()

    def get_usuarios(self):
        usuarios = [i["usuario"].lower() for i in self.data["items"]]
        usuarios = list(set(usuarios))
        query = """SELECT id_usuario, usuario FROM usuarios
                WHERE lower(usuario) IN %s """
        query_data = (tuple(usuarios),)
        usuarios = self.conexion.consulta_asociativa(query, query_data)
        self.usuarios_ids = {i["usuario"].lower(): i["id_usuario"] for i in usuarios}
        self.totales_usuario = {usuario: 0 for usuario in self.usuarios_ids.values()}

    def guardar_compra(self):
        query = """INSERT INTO compras
                (id_compra, total, origen, link, status_compra, pagado, nombre_compra, descripcion_compra, creado_por)
                VALUES
                (%s, %s, %s, %s, %s, %s, %s, %s, %s) """

        query_data = (
            self.id_compra,
            self.data["total"],
            self.data["origen"],
            self.data["link"],
            "pendiente",
            False,
            self.data["nombre_compra"],
            self.data["descripcion_compra"],
            self.user["id_usuario"],
        )
        if not(self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            raise Exception("Error al guardar la compra")
        self.conexion.commit()
        
        query = """UPDATE imagenes
                SET estatus = 'guardada'
                WHERE compra_id = %s """
        query_data = (self.id_compra,)
        if not(self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            raise Exception("Error al actualizar las imágenes")
        self.conexion.commit()

    def guardar_detalles(self):
        # id_compra_det, compra_id, usuario_id, descripcion, precio, cantidad, total
        query = """INSERT INTO compras_det
                (id_compra_det, compra_id, usuario_id, descripcion, precio, cantidad, total)
                VALUES
                (%s, %s, %s, %s, %s, %s, %s) """
            
        query_2 = """INSERT INTO cargos
                (id_cargo, usuario_id, compra_det_id, compra_id, total, fecha_limite, pagado, status_cargo, tipo)
                VALUES
                (%s, %s, %s, %s, %s, %s, false, 'pendiente', 'compra')
        """
        
        query_3 = """INSERT INTO kardex
                (id_kardex, usuario_id, cantidad, tipo, tipo_id, comentario, movimiento)
                VALUES
                (%s, %s, %s, 'compra', %s, 'compra inicial', 'S') """

        for item in self.data["items"]:
            user = item["usuario"].lower()
            usuario_id = self.usuarios_ids[user] if user in self.usuarios_ids else self.user["id_usuario"]
            total_precio = round(float(item["precio"]) * float(item["cantidad"]), 2)
            id_compra_det = str(uuid.uuid4())

            query_data = (
                id_compra_det,
                self.id_compra,
                usuario_id,
                item["descripcion_compra"],
                item["precio"],
                item["cantidad"],
                total_precio
            )
            if usuario_id not in self.totales_usuario:
                self.totales_usuario[usuario_id] = 0
            self.totales_usuario[usuario_id] += round(float(item["precio"]) * float(item["cantidad"]), 2)

            if not(self.conexion.ejecutar(query, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar los detalles de la compra")
            self.totales_usuario[usuario_id] += int(item["precio"]) * int(item["cantidad"])
            
            id_cargo = str(uuid.uuid4())
            # id_cargo, usuario_id, compra_det_id, total, fecha_limite
            query_data = (
                id_cargo,
                usuario_id,
                id_compra_det,
                self.id_compra,
                total_precio,
                self.data["fecha_limite"],
            )
            
            if not(self.conexion.ejecutar(query_2, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar los cargos de la compra")
            self.conexion.commit()
            
            # id_kardex, usuario_id, cantidad, tipo_id
            id_kardex = str(uuid.uuid4())
            query_data = (
                id_kardex,
                usuario_id,
                total_precio,
                id_cargo,
            )
            
            if not(self.conexion.ejecutar(query_3, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar el kardex de la compra")
            self.conexion.commit()

    def guardar_usuarios(self):
        query = """INSERT INTO compras_usuarios
                (id_compra_usuario, usuario_id, compra_id, total_correspondiente, porcentaje)
                VALUES
                (%s, %s, %s, %s, %s) """

        for usuario_id, total in self.totales_usuario.items():
            id_compra_usuario = str(uuid.uuid4())
            porcentaje = round(total / self.data["total"] * 100, 2)

            query_data = (
                id_compra_usuario,
                usuario_id,
                self.id_compra,
                total,
                porcentaje
            )
            if not(self.conexion.ejecutar(query, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar los usuarios de la compra")
            self.conexion.commit()

    def test_data(self):
        data = {
            "id": "221c610c-ec81-4098-9f55-e2091b13f7d8",
            "images": [
                {
                    "url": "http://localhost:8369/static/compras/221c610c-ec81-4098-9f55-e2091b13f7d8/preview/221c610c-ec81-4098-9f55-e2091b13f7d8_a8dc23f0-3940-40a0-b333-83846fd696ea.png",
                    "name": "221c610c-ec81-4098-9f55-e2091b13f7d8_a8dc23f0-3940-40a0-b333-83846fd696ea.png",
                    "id_image": "221c610c-ec81-4098-9f55-e2091b13f7d8_a8dc23f0-3940-40a0-b333-83846fd696ea",
                    "index": 0
                }
            ],
            "total": 123,
            "nombre_compra": "Dive",
            "descripcion_compra": "Dive desc",
            "link": "http://localhost:5173/#/compras/nueva",
            "origen": "Interno",
            "items": [
                {
                    "usuario": "ojitos369",
                    "descripcion_compra": "Version A",
                    "cantidad": "1",
                    "precio": "123"
                }
            ]
        }


class GetCompra(GetApi):
    def main(self):
        self.show_me()
        self.id_compra = self.data["compra_id"]
        # compras, compras_usuarios, compras_det, cargos, abonos
        self.get_compra()
        self.get_imagenes()
        self.get_compras_det()
        self.get_cargos()
        self.get_abonos()
        
        self.response = {
            "compra": {
                "compra": self.compra,
                "imagenes": self.imagenes,
                "articulos": self.compras_det,
                "cargos": self.cargos,
                "abonos": self.abonos,
            }
        }

    def get_compra(self):
        query = """SELECT c.*,
                (select count(*) 
                from compras_det 
                where compra_id=c.id_compra) cantidad_articulos,
                (select sum(cantidad)
                from compras_det 
                where compra_id=c.id_compra) cantidad_items,
                (select sum(total)
                from compras_det
                where compra_id=c.id_compra) total_deuda,
                (select sum(cantidad)
                from abonos
                where compra_id=c.id_compra
                and tipo='compra') total_abonado,
                (select min(fecha_limite)
                from cargos
                where compra_id=c.id_compra
                and tipo='compra') fecha_limite
                FROM compras c
                WHERE c.id_compra = %(id_compra)s
                AND (c.creado_por = %(id_usuario)s OR %(id_usuario)s IN (SELECT usuario_id FROM compras_usuarios WHERE compra_id = %(id_compra)s))
                """
        query_data = {
            "id_compra": self.id_compra,
            "id_usuario": self.user["id_usuario"],
        }
        compra = self.conexion.consulta_asociativa(query, query_data)
        if not compra:
            self.send_me_error("No se encontró la compra")
            raise self.MYE("No se encontro informacion de la compra")
        self.compra = compra[0]
    
    def get_imagenes(self):
        query = """SELECT * FROM imagenes
                WHERE compra_id = %s """
        query_data = (self.id_compra,)
        self.imagenes = self.conexion.consulta_asociativa(query, query_data)

    def get_compras_det(self):
        query = """SELECT cd.*, 
                        u.usuario,
                        (select sum(cantidad)
                        from abonos
                        where compra_det_id=cd.id_compra_det
                        and tipo = 'compra'
                        and usuario_id = cd.usuario_id) total_abonado
                FROM compras_det cd, usuarios u
                WHERE compra_id = %(id_compra)s AND cd.usuario_id = u.id_usuario """
        query_data = {
            "id_compra": self.id_compra,
        }
        self.compras_det = self.conexion.consulta_asociativa(query, query_data)
        self.compras_det_ids = [i["id_compra_det"] for i in self.compras_det]

    def get_cargos(self):
        query = """SELECT c.*, (select usuario from usuarios where id_usuario = c.usuario_id) as usuario
                FROM cargos c
                WHERE compra_id = %(id_compra)s
                """
        query_data = {
            "id_compra": self.id_compra,
        }
        self.cargos = self.conexion.consulta_asociativa(query, query_data)
        self.cargos_ids = [i["id_cargo"] for i in self.cargos]
    
    def get_abonos(self):
        query = """SELECT * FROM abonos
                WHERE compra_id = %(id_compra)s """
        query_data = {
            "id_compra": self.id_compra,
        }
        self.abonos = self.conexion.consulta_asociativa(query, query_data)
        self.abonos_ids = [i["id_abono"] for i in self.abonos]


class GetMyCompras(GetApi):
    def main(self):
        self.show_me()
        self.compras = []
        self.compras_ids = []
        self.id_usuario = self.user["id_usuario"]
        self.get_detalles()
        self.get_images()
        self.get_compras()
        
        self.response = {
            "compras": self.compras
        }
    
    def get_detalles(self):
        query = """SELECT *
                FROM compras_det
                WHERE usuario_id = %(id_usuario)s """
        query_data = {
            "id_usuario": self.id_usuario,
        }
        
        r = self.conexion.consulta_asociativa(query, query_data)
        compras_ids = list(set([i["compra_id"] for i in r]))
        self.compras_ids = list(set(compras_ids))
    
    
    def get_images(self):
        self.images = {}
        if not self.compras_ids:
            return
        query = """SELECT img.*
                FROM imagenes img
                WHERE img.compra_id in %(compras)s """
        query_data = {
            "compras": tuple(self.compras_ids),
        }
        
        images = self.conexion.consulta_asociativa(query, query_data)
        for image in images:
            if image["compra_id"] not in self.images:
                self.images[image["compra_id"]] = []
            self.images[image["compra_id"]].append(image)

    def get_compras(self):
        if self.compras_ids:
            query = """select c.*, 
                        (select count(*) 
                        from compras_det 
                        where compra_id=c.id_compra
                        and usuario_id=%(id_usuario)s) as articulos,
                        (select sum(cantidad)
                        from compras_det 
                        where compra_id=c.id_compra
                        and usuario_id=%(id_usuario)s) as cantidad_items,
                        (select sum(total)
                        from compras_det
                        where compra_id=c.id_compra
                        and usuario_id=%(id_usuario)s) as total_deuda,
                        (select sum(cantidad)
                        from abonos
                        where compra_id=c.id_compra
                        and usuario_id=%(id_usuario)s) as total_abonado,
                        (select min(fecha_limite)
                        from cargos
                        where compra_id=c.id_compra
                        and usuario_id=%(id_usuario)s) as fecha_limite
                    from (SELECT *
                    FROM compras
                    WHERE id_compra IN %(compras_ids)s
                    UNION
                    SELECT *
                    FROM compras
                    WHERE creado_por = %(id_usuario)s) c
                    
                    ORDER BY c.fecha_compra DESC
                """
            query_data = {
                "compras_ids": tuple(self.compras_ids),
                "id_usuario": self.id_usuario,
            }
        else:
            query = """SELECT *
                    FROM compras
                    WHERE creado_por = %s """
            query_data = (self.id_usuario,)
        
        self.compras = self.conexion.consulta_asociativa(query, query_data)
        
        for c in self.compras:
            c["images"] = self.images.get(c["id_compra"], [])


""" 

"""

