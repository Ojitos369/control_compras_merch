# Python
import os
import json
import uuid

from ojitos369.utils import print_json as pj
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
                (:file_id, :usuario_id, :id_compra, :path_save, :file_name, 'pendiente') """
        
        query_data = {
            "file_id": file_id,
            "usuario_id": usuario_id,
            "id_compra": id_compra,
            "path_save": path_save,
            "file_name": file_name,
        }
        
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
                WHERE usuario_id = :usuario_id AND estatus = 'pendiente' """

        query_data = {
            "usuario_id": usuario_id,
        }
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
                WHERE usuario_id = :usuario_id AND estatus = 'pendiente' """
        query_data = {
            "usuario_id": usuario_id,
        }
        
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
        self.id_compra = self.data["id"]
        self.get_usuarios()
        self.guardar_compra()
        self.guardar_detalles()

    def get_usuarios(self):
        usuarios = [i["usuario"].lower() for i in self.data["items"]]
        usuarios = list(set(usuarios))
        query = """SELECT id_usuario, usuario FROM usuarios
                WHERE lower(usuario) IN :usuarios """
        query_data = {
            "usuarios": tuple(usuarios),
        }
        usuarios = self.conexion.consulta_asociativa(query, query_data)
        self.usuarios_ids = {i["usuario"].lower(): i["id_usuario"] for i in usuarios}
        self.totales_usuario = {usuario: 0 for usuario in self.usuarios_ids.values()}

    def guardar_compra(self):
        query = """INSERT INTO compras
                (id_compra, total, origen, link, status_compra, pagado, nombre_compra, descripcion_compra, creado_por)
                VALUES
                (:id_compra, :total, :origen, :link, :status_compra, :pagado, :nombre_compra, :descripcion_compra, :creado_por) """

        query_data = {
            "id_compra": self.id_compra,
            "total": self.data["total"],
            "origen": self.data["origen"],
            "link": self.data["link"],
            "status_compra": "pendiente",
            "pagado": False,
            "nombre_compra": self.data["nombre_compra"],
            "descripcion_compra": self.data["descripcion_compra"],
            "creado_por": self.user["id_usuario"],
        }
        if not(self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            raise Exception("Error al guardar la compra")
        self.conexion.commit()
        
        query = """UPDATE imagenes
                SET estatus = 'guardada'
                WHERE compra_id = :id_compra """
        query_data = {
            "id_compra": self.id_compra,
        }
        if not(self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            raise Exception("Error al actualizar las imágenes")
        self.conexion.commit()

    def guardar_detalles(self):
        # id_compra_det, compra_id, usuario_id, descripcion, precio, cantidad, total
        query = """INSERT INTO compras_det
                (id_compra_det, compra_id, usuario_id, descripcion, precio, cantidad, total)
                VALUES
                (:id_compra_det, :compra_id, :usuario_id, :descripcion, :precio, :cantidad, :total) """
            
        query_2 = """INSERT INTO cargos
                (id_cargo, usuario_id, compra_det_id, compra_id, total, fecha_limite, pagado, status_cargo, tipo)
                VALUES
                (:id_cargo, :usuario_id, :compra_det_id, :compra_id, :total, :fecha_limite, false, 'pendiente', 'compra')
        """
        
        query_3 = """INSERT INTO kardex
                (id_kardex, usuario_id, cantidad, tipo, tipo_id, comentario, movimiento)
                VALUES
                (:id_kardex, :usuario_id, :cantidad, 'compra', :tipo_id, 'Compra inicial', 'S') """
            
        query_4 = """INSERT INTO compras_usuarios
                (id_compra_usuario, usuario_id, compra_id, compra_det_id, total_correspondiente, porcentaje)
                VALUES
                (:id_compra_usuario, :usuario_id, :compra_id, :compra_det_id, :total_correspondiente, :porcentaje) """

        for item in self.data["items"]:
            user = item["usuario"].lower()
            usuario_id = self.usuarios_ids[user] if user in self.usuarios_ids else self.user["id_usuario"]
            total_precio = round(float(item["precio"]) * float(item["cantidad"]), 2)
            id_compra_det = str(uuid.uuid4())

            query_data = {
                "id_compra_det": id_compra_det,
                "compra_id": self.id_compra,
                "usuario_id": usuario_id,
                "descripcion": item["descripcion_compra"],
                "precio": item["precio"],
                "cantidad": item["cantidad"],
                "total": total_precio,
            }
            if usuario_id not in self.totales_usuario:
                self.totales_usuario[usuario_id] = 0
            self.totales_usuario[usuario_id] += round(float(item["precio"]) * float(item["cantidad"]), 2)

            if not(self.conexion.ejecutar(query, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar los detalles de la compra")

            id_cargo = str(uuid.uuid4())
            # id_cargo, usuario_id, compra_det_id, total, fecha_limite
            query_data = {
                "id_cargo": id_cargo,
                "usuario_id": usuario_id,
                "compra_det_id": id_compra_det,
                "compra_id": self.id_compra,
                "total": total_precio,
                "fecha_limite": self.data["fecha_limite"],
            }
            
            if not(self.conexion.ejecutar(query_2, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar los cargos de la compra")
            self.conexion.commit()
            
            # id_kardex, usuario_id, cantidad, tipo_id
            id_kardex = str(uuid.uuid4())
            query_data = {
                "id_kardex": id_kardex,
                "usuario_id": usuario_id,
                "cantidad": total_precio,
                "tipo_id": id_cargo,
            }
            
            if not(self.conexion.ejecutar(query_3, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar el kardex de la compra")
            self.conexion.commit()
            
            id_compra_usuario = str(uuid.uuid4())
            porcentaje = round(total_precio / self.data["total"] * 100, 2)

            query_data = {
                "id_compra_usuario": id_compra_usuario,
                "usuario_id": usuario_id,
                "compra_id": self.id_compra,
                "compra_det_id": id_compra_det,
                "total_correspondiente": total_precio,
                "porcentaje": porcentaje
            }
            if not(self.conexion.ejecutar(query_4, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar los usuarios de la compra")
            self.conexion.commit()
            

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
        self.get_usuarios()
        
        self.response = {
            "compra": {
                "compra": self.compra,
                "imagenes": self.imagenes,
                "articulos": self.compras_det,
                "cargos": self.cargos,
                "abonos": self.abonos,
                "usuarios": self.usuarios,
            }
        }
        # pj(self.response)

    def get_compra(self):
        query = """SELECT c.*,
                (select count(*) 
                from compras_det 
                where compra_id = c.id_compra) cantidad_articulos,
                (select sum(cantidad)
                from compras_det 
                where compra_id = c.id_compra) cantidad_items,
                (select sum(total)
                from compras_det
                where compra_id = c.id_compra) total_deuda,
                (select sum(cantidad)
                from abonos
                where compra_id = c.id_compra
                and tipo='compra') total_abonado,
                (select min(fecha_limite)
                from cargos
                where compra_id = c.id_compra
                and tipo='compra') fecha_limite
                FROM compras c
                WHERE c.id_compra = :id_compra
                AND (c.creado_por = :id_usuario OR :id_usuario IN (SELECT usuario_id FROM compras_usuarios WHERE compra_id = :id_compra))
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
                WHERE compra_id = :id_compra
                order by fecha_alta asc
                """
        query_data = {
            "id_compra": self.id_compra,
        }
        self.imagenes = self.conexion.consulta_asociativa(query, query_data)

    def get_compras_det(self):
        query = """SELECt t.*, (t.total - t.total_abonado) restante
                FROM (SELECT cd.*, 
                        u.usuario,
                        (select nvl(sum(cantidad), 0)
                        from abonos
                        where compra_det_id = cd.id_compra_det
                        and tipo = 'compra'
                        and usuario_id = cd.usuario_id) total_abonado
                FROM compras_det cd, usuarios u
                WHERE compra_id = :id_compra AND cd.usuario_id = u.id_usuario) t
                """
        query_data = {
            "id_compra": self.id_compra,
        }
        self.compras_det = self.conexion.consulta_asociativa(query, query_data)
        self.compras_det_ids = [i["id_compra_det"] for i in self.compras_det]

    def get_cargos(self):
        query = """SELECT c.*, (select usuario from usuarios where id_usuario = c.usuario_id) as usuario
                FROM cargos c
                WHERE compra_id = :id_compra
                """
        query_data = {
            "id_compra": self.id_compra,
        }
        self.cargos = self.conexion.consulta_asociativa(query, query_data)
        self.cargos_ids = [i["id_cargo"] for i in self.cargos]

    def get_abonos(self):
        query = """SELECT a.* , (select usuario from usuarios where id_usuario = a.usuario_id) as usuario
                FROM abonos a
                WHERE compra_id = :id_compra """
        query_data = {
            "id_compra": self.id_compra,
        }
        self.abonos = self.conexion.consulta_asociativa(query, query_data)
        self.abonos_ids = [i["id_abono"] for i in self.abonos]
    
    def get_usuarios(self):
        query = """SELECT u.usuario, cu.porcentaje, u.id_usuario, cd.descripcion, cu.compra_det_id
                FROM compras_usuarios cu, usuarios u, compras_det cd
                WHERE cu.compra_id = :id_compra
                AND cu.usuario_id = u.id_usuario
                AND cd.id_compra_det = cu.compra_det_id
                """
        query_data = {
            "id_compra": self.id_compra,
        }
        self.usuarios = self.conexion.consulta_asociativa(query, query_data)


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
                WHERE usuario_id = :id_usuario """
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
                WHERE img.compra_id in :compras
                order by img.fecha_alta asc
                """
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
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as articulos,
                        (select sum(cantidad)
                        from compras_det 
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as cantidad_items,
                        (select sum(total)
                        from compras_det
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as total_deuda,
                        (select sum(cantidad)
                        from abonos
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as total_abonado,
                        (select min(fecha_limite)
                        from cargos
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as fecha_limite
                    from (SELECT *
                    FROM compras
                    WHERE id_compra IN :compras_ids
                    UNION
                    SELECT *
                    FROM compras
                    WHERE creado_por = :id_usuario) c
                    
                    ORDER BY c.fecha_compra DESC
                """
            query_data = {
                "compras_ids": tuple(self.compras_ids),
                "id_usuario": self.id_usuario,
            }
        else:
            query = """SELECT *
                    FROM compras
                    WHERE creado_por = :id_usuario """
            query_data = {
                "id_usuario": self.id_usuario,
            }
        
        self.compras = self.conexion.consulta_asociativa(query, query_data)
        
        for c in self.compras:
            c["images"] = self.images.get(c["id_compra"], [])


class GuardarCargo(PostApi):
    def main(self):
        self.show_me()
        self.validarCreador()
        self.add_cargo()
    
    def validarCreador(self):
        compra_id = self.data["compra_id"]
        query = """SELECT creado_por
                FROM compras
                WHERE id_compra = :compra_id """
        query_data = {
            "compra_id": compra_id,
        }
        compra = self.conexion.consulta_asociativa(query, query_data)
        if not compra:
            raise self.MYE("No se encontró la compra")
        if (compra[0]["creado_por"] != self.user["id_usuario"]):
            raise self.MYE("No tienes permiso para realizar esta acción")

    def add_cargo(self):
        total = self.data.get("total", 0)
        fecha_limite = self.data.get("fecha_limite", None)
        tipo = self.data["tipo"]
        compra_id = self.data["compra_id"]
        perUser = get_d(self.data, "perUser", default={})
        query = """INSERT INTO cargos
                (id_cargo, usuario_id, compra_det_id, compra_id, total, fecha_limite, tipo)
                VALUES
                (:id_cargo, :usuario_id, :compra_det_id, :compra_id, :total, :fecha_limite, :tipo) """
            
        query_data = {
            "compra_id": compra_id,
            "fecha_limite": fecha_limite,
            "tipo": tipo,
        }

        for user in self.data["usuarios"]:
            id_cargo = str(uuid.uuid4())
            compra_det_id = user["compra_det_id"]
            if (compra_det_id in perUser and not perUser[compra_det_id]) or (compra_det_id not in perUser and not total):
                continue
            query_data["id_cargo"] = id_cargo
            query_data["usuario_id"] = user["id_usuario"]
            query_data["compra_det_id"] = compra_det_id
            
            if compra_det_id in perUser:
                query_data["total"] = float(perUser[compra_det_id])
            else:
                porcentaje = user["porcentaje"]
                query_data["total"] = round(float(total) * porcentaje / 100, 2)

            if not(self.conexion.ejecutar(query, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar el cargo")
            self.conexion.commit()
            
            self.add_kardex(user["id_usuario"], query_data["total"], id_cargo, tipo)
        
    def add_kardex(self, usuario_id, cantidad, tipo_id, tipo_cargo):
        id_kardex = str(uuid.uuid4())
        tipo = "cargo"
        comentario = f"Cargo por {tipo_cargo}"

        ''' 
        query = """ INSERT INTO kardex
                (id_kardex, usuario_id, cantidad, tipo, tipo_id, comentario, movimiento)
                VALUES
                (:id_kardex, :usuario_id, :cantidad, :tipo, :tipo_id, :comentario, 'S')
            """
        query_data = {
            "id_kardex": str(id_kardex),
            "usuario_id": str(usuario_id),
            "cantidad": float(cantidad),
            "tipo": str(tipo),
            "tipo_id": str(tipo_id),
            "comentario": str(comentario),
        } 
        '''
        query = """ INSERT INTO kardex
                (id_kardex, usuario_id, cantidad, tipo, tipo_id, comentario, movimiento)
                VALUES
                (%s, %s, %s, %s, %s, %s, 'S')
            """
        query_data = (
            str(id_kardex),
            str(usuario_id),
            float(cantidad),
            str(tipo),
            str(tipo_id),
            str(comentario),
        )
        if not(self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            raise Exception("Error al guardar el kardex")
        self.conexion.commit()

    def example_data(self):
        data = {
            "compra_id": "1b745759-3db4-4c3b-9a8c-bbd9812b8e01",
            "usuarios": [
                {
                    "usuario": "test",
                    "porcentaje": 4.86,
                    "id_usuario": "cf25556b-dda2-4117-8126-f160ac7ac1ad",
                    "descripcion": "art1"
                },
                {
                    "usuario": "test2",
                    "porcentaje": 8.77,
                    "id_usuario": "72aeeed5-e301-4843-b579-4db9ea3a44b7",
                    "descripcion": "art2"
                },
                {
                    "usuario": "ojitos369",
                    "porcentaje": 86.37,
                    "id_usuario": "e66a184d-8d5e-4a70-917c-45767bbaacfb",
                    "descripcion": "art3"
                }
            ],
            "total": "149.83",
            "perUser": {
                "e66a184d-8d5e-4a70-917c-45767bbaacfb": "101.7"
            },
            "tipo": "ems",
            "fecha_limite": "2024-07-31"
        }


class GuardarAbono(PostApi):
    def main(self):
        self.show_me()
        self.compra_id = self.data["compra_id"]
        self.validarCreador()
        self.add_abono()
    
    def validarCreador(self):
        query = """SELECT creado_por
                FROM compras
                WHERE id_compra = :compra_id """
        query_data = {
            "compra_id": self.compra_id,
        }
        compra = self.conexion.consulta_asociativa(query, query_data)
        if not compra:
            raise self.MYE("No se encontró la compra")
        if (compra[0]["creado_por"] != self.user["id_usuario"]):
            raise self.MYE("No tienes permiso para realizar esta acción")

    def add_abono(self):
        total = self.data.get("total", 0)
        tipo = self.data["tipo"]
        perUser = get_d(self.data, "perUser", default={})
        query = """INSERT INTO abonos
                (id_abono, cantidad, tipo, compra_det_id, compra_id, usuario_id)
                VALUES
                (:id_abono, :cantidad, :tipo, :compra_det_id, :compra_id, :usuario_id)
            """
            
        query_data = {
            "compra_id": self.compra_id,
            "tipo": tipo,
        }

        for user in self.data["usuarios"]:
            id_abono = str(uuid.uuid4())
            compra_det_id = user["compra_det_id"]
            if (compra_det_id in perUser and not perUser[compra_det_id]) or (compra_det_id not in perUser and not total):
                continue
            query_data["id_abono"] = id_abono
            query_data["usuario_id"] = user["id_usuario"]
            query_data["compra_det_id"] = compra_det_id
            
            if compra_det_id in perUser:
                query_data["cantidad"] = float(perUser[compra_det_id])
            else:
                porcentaje = user["porcentaje"]
                query_data["cantidad"] = round(float(total) * porcentaje / 100, 2)

            if not(self.conexion.ejecutar(query, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar el abono")
            self.conexion.commit()
            
            self.add_kardex(user["id_usuario"], query_data["cantidad"], id_abono, tipo)
        
    def add_kardex(self, usuario_id, cantidad, tipo_id, tipo_abono):
        id_kardex = str(uuid.uuid4())
        tipo = "abono"
        comentario = f"Abono por {tipo_abono}"

        ''' 
        query = """ INSERT INTO kardex
                (id_kardex, usuario_id, cantidad, tipo, tipo_id, comentario, movimiento)
                VALUES
                (:id_kardex, :usuario_id, :cantidad, :tipo, :tipo_id, :comentario, 'S')
            """
        query_data = {
            "id_kardex": str(id_kardex),
            "usuario_id": str(usuario_id),
            "cantidad": float(cantidad),
            "tipo": str(tipo),
            "tipo_id": str(tipo_id),
            "comentario": str(comentario),
        } 
        '''
        query = """ INSERT INTO kardex
                (id_kardex, usuario_id, cantidad, tipo, tipo_id, comentario, movimiento)
                VALUES
                (%s, %s, %s, %s, %s, %s, 'S')
            """
        query_data = (
            str(id_kardex),
            str(usuario_id),
            float(cantidad),
            str(tipo),
            str(tipo_id),
            str(comentario),
        )
        if not(self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            raise Exception("Error al guardar el kardex")
        self.conexion.commit()

    def example_data(self):
        data = {
            "compra_id": "1b745759-3db4-4c3b-9a8c-bbd9812b8e01",
            "usuarios": [
                {
                    "usuario": "test",
                    "porcentaje": 4.86,
                    "id_usuario": "cf25556b-dda2-4117-8126-f160ac7ac1ad",
                    "descripcion": "art1"
                },
                {
                    "usuario": "test2",
                    "porcentaje": 8.77,
                    "id_usuario": "72aeeed5-e301-4843-b579-4db9ea3a44b7",
                    "descripcion": "art2"
                },
                {
                    "usuario": "ojitos369",
                    "porcentaje": 86.37,
                    "id_usuario": "e66a184d-8d5e-4a70-917c-45767bbaacfb",
                    "descripcion": "art3"
                }
            ],
            "total": "149.83",
            "perUser": {
                "e66a184d-8d5e-4a70-917c-45767bbaacfb": "101.7"
            },
            "tipo": "ems",
            "fecha_limite": "2024-07-31"
        }



""" 
Yemen
967 773 755 514
vs
SV
need funa
"""

