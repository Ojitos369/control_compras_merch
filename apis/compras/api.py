# Python
import os
import json
import uuid
import datetime

from ojitos369.utils import print_json as pj
# User
from app.core.bases.apis import PostApi, GetApi, get_d, pln
from app.core.bases.correos import GeneralTextMail
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
        self.validar_existente()
        self.get_usuarios()
        self.guardar_compra()
        self.guardar_detalles()
        try:
            self.enviar_correo()
        except:
            pass

    def validar_existente(self):
        query = """SELECT id_compra
                    FROM compras
                    WHERE id_compra = :id_compra """
        query_data = {
            "id_compra": self.id_compra,
        }
        r =  self.conexion.consulta_asociativa(query, query_data)
        self.existe_compra = bool(r)
                    
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
        self.usuarios_anteriores = {}
        self.totales_usuario = {usuario: 0 for usuario in self.usuarios_ids.values()}
        
        if self.existe_compra:
            query = """SELECT cd.usuario_id, u.usuario
                        FROM compras_det cd, usuarios u
                        WHERE cd.compra_id = :id_compra
                        AND cd.usuario_id = u.id_usuario
                        AND cd.usuario_id not in :usuarios
                        GROUP BY cd.usuario_id, u.usuario
                        """
            query_data = {
                "id_compra": self.id_compra,
                "usuarios": tuple(self.usuarios_ids.values()),
            }
            r = self.conexion.consulta_asociativa(query, query_data)
            self.usuarios_anteriores = {i["usuario"]: i["usuario_id"] for i in r}

    def guardar_compra(self):
        if not self.existe_compra:
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
        else:
            # total, origen, link, status_compra, pagado, nombre_compra, descripcion_compra, creado_por
            query = """UPDATE compras
                    set total = :total,
                        origen = :origen,
                        link = :link,
                        status_compra = :status_compra,
                        pagado = :pagado,
                        nombre_compra = :nombre_compra,
                        descripcion_compra = :descripcion_compra,
                        creado_por = :creado_por
                    WHERE id_compra = :id_compra
                    """

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
        query = """INSERT INTO compras_det
                (id_compra_det, compra_id, usuario_id, descripcion, precio, cantidad, total)
                VALUES
                (:id_compra_det, :compra_id, :usuario_id, :descripcion, :precio, :cantidad, :total) """
            
        query_2 = """INSERT INTO cargos
                (id_cargo, usuario_id, compra_det_id, compra_id, total, fecha_limite, pagado, status_cargo, tipo)
                VALUES
                (:id_cargo, :usuario_id, :compra_det_id, :compra_id, :total, :fecha_limite, false, 'pendiente', 'compra') """
        
        query_3 = """INSERT INTO kardex
                (id_kardex, usuario_id, cantidad, tipo, tipo_id, comentario, movimiento)
                VALUES
                (:id_kardex, :usuario_id, :cantidad, 'compra', :tipo_id, 'Compra inicial', 'S') """
            
        query_4 = """INSERT INTO compras_usuarios
                (id_compra_usuario, usuario_id, compra_id, compra_det_id, total_correspondiente, porcentaje)
                VALUES
                (:id_compra_usuario, :usuario_id, :compra_id, :compra_det_id, :total_correspondiente, :porcentaje) """
        if not self.existe_compra:
            # id_compra_det, compra_id, usuario_id, descripcion, precio, cantidad, total

            for item in self.data["items"]:
                user = item["usuario"].lower()
                usuario_id = self.usuarios_ids[user] if user in self.usuarios_ids else self.user["id_usuario"]
                total_precio = float(item["precio"]) * float(item["cantidad"])
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
                self.totales_usuario[usuario_id] += float(item["precio"]) * float(item["cantidad"])

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
                porcentaje = total_precio / self.data["total"] * 100

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

        else:
            qt = """SELECT *
                        FROM compras_det
                        WHERE compra_id = :id_compra
                        """
            qd = {
                "id_compra": self.id_compra,
            }
            r = self.conexion.consulta_asociativa(qt, qd)
            compras_dets_ids = [r["id_compra_det"] for r in r]
            info_anterior = {r["id_compra_det"]: r for r in r}

            for item in self.data["items"]:
                user = item["usuario"].lower()
                usuario_id = self.usuarios_ids[user] if user in self.usuarios_ids else self.user["id_usuario"]
                total_precio = float(item["precio"]) * float(item["cantidad"])
                id_compra_det = get_d(item, "id_compra_det", default=str(uuid.uuid4()))
                
                if id_compra_det not in compras_dets_ids:
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
                    self.totales_usuario[usuario_id] += float(item["precio"]) * float(item["cantidad"])

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
                    porcentaje = total_precio / self.data["total"] * 100

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
                else:
                    compras_dets_ids.remove(id_compra_det)
                    info = info_anterior[id_compra_det]
                    
                    same_user = info["usuario_id"] == usuario_id
                    same_precio = info["precio"] == item["precio"]
                    same_cantidad = info["cantidad"] == item["cantidad"]
                    if same_user and same_precio and same_cantidad:
                        same_desc = info["descripcion"] == item["descripcion_compra"]
                        if same_desc:
                            continue
                        else:
                            qt = """UPDATE compras_det
                                        set descripcion = :descripcion
                                        WHERE id_compra_det = :id_compra_det
                                """
                            qd = {
                                "descripcion": item["descripcion_compra"],
                                "id_compra_det": id_compra_det,
                            }
                            if not(self.conexion.ejecutar(qt, qd)):
                                self.conexion.rollback()
                                raise Exception("Error al actualizar la descripcion de la compra")
                            self.conexion.commit()
                    else:
                        # compras_det, cargos, kardex, compras_usuarios
                        qt = """UPDATE compras_det
                                SET usuario_id = :usuario_id,
                                    descripcion = :descripcion,
                                    precio = :precio,
                                    cantidad = :cantidad,
                                    total = :total
                                WHERE id_compra_det = :id_compra_det
                                """
                        qd = {
                            "usuario_id": usuario_id,
                            "descripcion": item["descripcion_compra"],
                            "precio": item["precio"],
                            "cantidad": item["cantidad"],
                            "total": total_precio,
                            "id_compra_det": id_compra_det,
                        }
                        if not(self.conexion.ejecutar(qt, qd)):
                            self.conexion.rollback()
                            raise Exception("Error al actualizar la compra")
                        self.conexion.commit()
                        
                        qt = """UPDATE cargos
                                SET usuario_id = :usuario_id,
                                    total = :total
                                WHERE compra_det_id = :id_compra_det
                                """
                        qd = {
                            "usuario_id": usuario_id,
                            "total": total_precio,
                            "id_compra_det": id_compra_det,
                        }
                        if not(self.conexion.ejecutar(qt, qd)):
                            self.conexion.rollback()
                            raise Exception("Error al actualizar los cargos")
                        self.conexion.commit()
                        
                        qt = """UPDATE kardex
                                SET usuario_id = :usuario_id,
                                    cantidad = :cantidad
                                WHERE tipo_id = :id_compra_det
                                """
                        qd = {
                            "usuario_id": usuario_id,
                            "cantidad": total_precio,
                            "id_compra_det": id_compra_det,
                        }
                        if not(self.conexion.ejecutar(qt, qd)):
                            self.conexion.rollback()
                            raise Exception("Error al actualizar el kardex")
                        self.conexion.commit()
                        
                        porcentaje = total_precio / self.data["total"] * 100
                        qt = """UPDATE compras_usuarios
                                SET usuario_id = :usuario_id,
                                    total_correspondiente = :total_correspondiente,
                                    porcentaje = :porcentaje
                                WHERE compra_det_id = :id_compra_det
                                """
                        qd = {
                            "usuario_id": usuario_id,
                            "total_correspondiente": total_precio,
                            "porcentaje": porcentaje,
                            "id_compra_det": id_compra_det,
                        }
                        if not(self.conexion.ejecutar(qt, qd)):
                            self.conexion.rollback()
                            raise Exception("Error al actualizar los usuarios")
                        self.conexion.commit()
            
            qt = """UPDATE cargos
                    SET fecha_limite = :fecha_limite
                    WHERE compra_id = :id_compra
                    AND tipo = 'compra'
                    """
            qd = {
                "fecha_limite": self.data["fecha_limite"],
                "id_compra": self.id_compra,
            }
            if not (self.conexion.ejecutar(qt, qd)):
                self.conexion.rollback()
                raise Exception("Error al actualizar la fecha limite")
            self.conexion.commit()

            if compras_dets_ids:
                qt = """UPDATE compras_det
                            SET oculto = true,
                                status_articulo = 'cancelado'
                            WHERE id_compra_det in :compras_dets_ids
                            """
                qd = {
                    "compras_dets_ids": tuple(compras_dets_ids),
                }
                if not self.conexion.ejecutar(qt, qd):
                    self.conexion.rollback()
                    raise Exception("Error al cancelar los articulos")
                self.conexion.commit()

    def enviar_correo(self):
        query = """SELECT u.correo, u.usuario
                FROM usuarios u
                WHERE u.id_usuario IN :usuarios """
        query_data = {
            "usuarios": tuple(self.usuarios_ids.values()) + tuple(self.usuarios_anteriores.values()),
        }
        usuarios = self.conexion.consulta_asociativa(query, query_data)

        query = """SELECT u.correo, u.usuario
                FROM usuarios u
                WHERE u.id_usuario = :id_usuario """
        query_data = {
            "id_usuario": self.user["id_usuario"],
        }
        r = self.conexion.consulta_asociativa(query, query_data)
        creador = r[0]

        nombre_compra = self.data["nombre_compra"]
        descripcion_compra = self.data["descripcion_compra"]
        creado_por = creador["usuario"]
        fecha_limite = self.data["fecha_limite"]
        origen = self.data["origen"]
        link = self.data["link"]

        usuarios = self.conexion.consulta_asociativa(query, query_data)
        email_subject = "Nueva Compra" if not self.existe_compra else "Compra Actualizada"
        email_text = f"Se te ha agregado a una nueva compra\n" if not self.existe_compra else f"Se ha actualizado una compra\n"
        email_text += f"Nombre: {nombre_compra}\n"
        email_text += f"Descripción: {descripcion_compra}\n"
        email_text += f"Creado por: {creado_por}\n"
        email_text += f"Fecha limite de pago: {fecha_limite}\n"
        email_text += f"Origen: {origen}\n"
        email_text += f"Link: {link}\n\n"
        email_text += f"Puedes consultar los detalles aqui: {url_base}/#/compras/detalle/{self.id_compra}\n\n"

        to_email = [i["correo"] for i in usuarios if i["correo"]]
        if not to_email:
            return

        mail = GeneralTextMail(email_subject=email_subject, email_text=email_text, to_email=to_email)
        mail.send()


class GetCompra(GetApi):
    def main(self):
        self.show_me()
        self.id_compra = self.data["compra_id"]
        # compras, compras_usuarios, compras_det, cargos, pagos
        self.queries_filteres()
        self.get_compra()
        self.get_imagenes()
        self.get_compras_det()
        self.get_cargos()
        self.get_pagos()
        self.get_usuarios()
        self.get_pagos_pendientes()
        
        self.response = {
            "compra": {
                "compra": self.compra,
                "imagenes": self.imagenes,
                "articulos": self.compras_det,
                "cargos": self.cargos,
                "pagos": self.pagos,
                "usuarios": self.usuarios,
                "pagos_pendientes": self.pagos_pendientes,
            }
        }
        # pj(self.response)

    def get_compra(self):
        query = """SELECT c.*,
                (select count(*) 
                from {0} cd 
                where compra_id = c.id_compra) cantidad_articulos,
                (select sum(cantidad)
                from {0} cd 
                where compra_id = c.id_compra) cantidad_items,
                (select sum(total)
                from {0} cd
                where compra_id = c.id_compra) total_deuda,
                (select sum(cantidad)
                from {1} pg
                where compra_id = c.id_compra
                and validado = 1
                and tipo='compra') total_abonado,
                (select min(fecha_limite)
                from {2} cg
                where compra_id = c.id_compra
                and tipo='compra') fecha_limite
                FROM {3} c
                WHERE c.id_compra = :id_compra
                AND (c.creado_por = :id_usuario OR :id_usuario IN (SELECT usuario_id FROM compras_usuarios WHERE compra_id = :id_compra))
                """.format(self.det_query, self.pago_query, self.cargo_query, self.compra_query)
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
        query = """SELECt t.*, (t.total - t.total_abonado) restante, 
                        (select porcentaje 
                            from compras_usuarios
                            where compra_det_id = t.id_compra_det) porcentaje
                FROM (SELECT cd.*, 
                        u.usuario,
                        (select nvl(sum(cantidad), 0)
                        from {0} pg
                        where compra_det_id = cd.id_compra_det
                        and tipo = 'compra'
                        and validado = 1
                        and usuario_id = cd.usuario_id) total_abonado
                FROM {1} cd, usuarios u
                WHERE compra_id = :id_compra AND cd.usuario_id = u.id_usuario) t
                """.format(self.pago_query, self.det_query)
        query_data = {
            "id_compra": self.id_compra,
        }
        self.compras_det = self.conexion.consulta_asociativa(query, query_data)
        self.compras_det_ids = [i["id_compra_det"] for i in self.compras_det]

    def get_cargos(self):
        query = """SELECT c.*, (select usuario from usuarios where id_usuario = c.usuario_id) as usuario
                FROM {0} c
                WHERE compra_id = :id_compra
                """.format(self.cargo_query)
        query_data = {
            "id_compra": self.id_compra,
        }
        self.cargos = self.conexion.consulta_asociativa(query, query_data)
        self.cargos_ids = [i["id_cargo"] for i in self.cargos]

    def get_pagos(self):
        query = """SELECT a.* , (select usuario from usuarios where id_usuario = a.usuario_id) as usuario
                FROM {0} a
                WHERE compra_id = :id_compra """.format(self.pago_query)
        query_data = {
            "id_compra": self.id_compra,
        }
        self.pagos = self.conexion.consulta_asociativa(query, query_data)
        self.pagos_ids = [i["id_pago"] for i in self.pagos]
    
    def get_usuarios(self):
        query = """SELECT u.usuario, cu.porcentaje, u.id_usuario, cd.descripcion, cu.compra_det_id
                FROM compras_usuarios cu, usuarios u, {0} cd
                WHERE cu.compra_id = :id_compra
                AND cu.usuario_id = u.id_usuario
                AND cd.id_compra_det = cu.compra_det_id
                """.format(self.det_query)
        query_data = {
            "id_compra": self.id_compra,
        }
        self.usuarios = self.conexion.consulta_asociativa(query, query_data)

    def get_pagos_pendientes(self):
        query = """SELECT a.* , (select usuario from usuarios where id_usuario = a.usuario_id) as usuario,
                (select descripcion from {0} cd where id_compra_det = a.compra_det_id) as descripcion
                FROM {1} a
                WHERE compra_id = :id_compra AND validado = 0 """.format(self.det_query, self.pago_query)
        query_data = {
            "id_compra": self.id_compra,
        }
        self.pagos_pendientes = self.conexion.consulta_asociativa(query, query_data)

    def queries_filteres(self):
        self.compra_query = """(SELECT *
                                FROM compras
                                WHERE not oculto
                                AND nvl(status_compra, 'pendiente') not in ('entregado', 'cancelado')) """
        self.det_query = """(SELECT *
                            FROM compras_det
                            WHERE not oculto
                            AND nvl(status_articulo, 'pendiente') not in ('entregado', 'cancelado')) """
        self.cargo_query = """(SELECT cr.*
                            FROM cargos cr,
                                compras_det cd
                            WHERE cr.compra_det_id = cd.id_compra_det
                            AND not cd.oculto
                            AND nvl(cd.status_articulo, 'pendiente') not in ('entregado', 'cancelado')) """
        self.pago_query = """(SELECT pg.*
                            FROM pagos pg,
                                compras_det cd
                            WHERE pg.compra_det_id = cd.id_compra_det
                            AND not cd.oculto
                            AND nvl(cd.status_articulo, 'pendiente') not in ('entregado', 'cancelado')) """


class GetMyCompras(GetApi):
    def main(self):
        self.show_me()
        self.compras = []
        self.compras_ids = []
        self.id_usuario = self.user["id_usuario"]
        self.queries_filteres()
        self.get_detalles()
        self.get_images()
        self.get_compras()
        
        self.response = {
            "compras": self.compras
        }

    def queries_filteres(self):
        self.compra_query = """(SELECT *
                                FROM compras
                                WHERE not oculto
                                AND nvl(status_compra, 'pendiente') not in ('entregado', 'cancelado')) """
        self.det_query = """(SELECT *
                            FROM compras_det
                            WHERE not oculto
                            AND nvl(status_articulo, 'pendiente') not in ('entregado', 'cancelado')) """
        self.cargo_query = """(SELECT cr.*
                            FROM cargos cr,
                                compras_det cd
                            WHERE cr.compra_det_id = cd.id_compra_det
                            AND not cd.oculto
                            AND nvl(cd.status_articulo, 'pendiente') not in ('entregado', 'cancelado')) """
        self.pago_query = """(SELECT pg.*
                            FROM pagos pg,
                                compras_det cd
                            WHERE pg.compra_det_id = cd.id_compra_det
                            AND not cd.oculto
                            AND nvl(cd.status_articulo, 'pendiente') not in ('entregado', 'cancelado')) """

    def get_detalles(self):
        query = """SELECT cd.*
                FROM {0} cd
                WHERE usuario_id = :id_usuario """.format(self.det_query)
        query_data = {
            "id_usuario": self.id_usuario,
        }
        
        r = self.conexion.consulta_asociativa(query, query_data)
        compras_ids = list(set([i["compra_id"] for i in r]))
        self.compras_ids = list(set(compras_ids))
    
    def get_images(self):
        self.images = {}
        ids = self.compras_ids
        if not self.compras_ids:
            query = """SELECT c.id_compra
                    FROM {0} c
                    WHERE c.creado_por = :id_usuario """.format(self.compra_query)
            query_data = {
                "id_usuario": self.id_usuario,
            }
            r = self.conexion.consulta_asociativa(query, query_data)
            if r:
                ids = [i["id_compra"] for i in r]
            else:
                return

        query = """SELECT img.*
                FROM imagenes img
                WHERE img.compra_id in :compras
                order by img.fecha_alta asc
                """
        query_data = {
            "compras": tuple(ids),
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
                        from {0} cd 
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as articulos,
                        (select sum(cantidad)
                        from {0} cd 
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as cantidad_items,

                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as total_usuario,
                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo = 'compra'
                        and usuario_id = :id_usuario) as total_usuario_compra,
                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo != 'compra'
                        and usuario_id = :id_usuario) as total_usuario_cargos,

                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra) as total_compra,
                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo = 'compra') as total_compra_compra,
                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo != 'compra') as total_compra_cargos,

                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and usuario_id = :id_usuario) as total_abonado_usuario,
                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and tipo = 'compra'
                        and usuario_id = :id_usuario) as total_abonado_usuario_compra,
                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and tipo != 'compra'
                        and usuario_id = :id_usuario) as total_abonado_usuario_cargos,

                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1) as total_abonado,
                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and tipo = 'compra') as total_abonado_compra,
                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and tipo != 'compra') as total_abonado_cargos,

                        (select min(fecha_limite)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo='compra') as fecha_limite
                    from (SELECT c.*
                    FROM {3} c
                    WHERE id_compra IN :compras_ids
                    UNION
                    SELECT c.*
                    FROM {3} c
                    WHERE creado_por = :id_usuario) c
                    
                    ORDER BY c.fecha_compra DESC
                """.format(self.det_query, self.cargo_query, self.pago_query, self.compra_query)
            query_data = {
                "compras_ids": tuple(self.compras_ids),
                "id_usuario": self.id_usuario,
            }
        else:
            query = """select c.*, 
                        (select count(*) 
                        from {0} cd 
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as articulos,
                        (select sum(cantidad)
                        from {0} cd 
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as cantidad_items,

                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and usuario_id = :id_usuario) as total_usuario,
                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo = 'compra'
                        and usuario_id = :id_usuario) as total_usuario_compra,
                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo != 'compra'
                        and usuario_id = :id_usuario) as total_usuario_cargos,

                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra) as total_compra,
                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo = 'compra') as total_compra_compra,
                        (select sum(total)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo != 'compra') as total_compra_cargos,

                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and usuario_id = :id_usuario) as total_abonado_usuario,
                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and tipo = 'compra'
                        and usuario_id = :id_usuario) as total_abonado_usuario_compra,
                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and tipo != 'compra'
                        and usuario_id = :id_usuario) as total_abonado_usuario_cargos,

                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1) as total_abonado,
                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and tipo = 'compra') as total_abonado_compra,
                        (select sum(cantidad)
                        from {2} pg
                        where compra_id = c.id_compra
                        and validado = 1
                        and tipo != 'compra') as total_abonado_cargos,

                        (select min(fecha_limite)
                        from {1} cg
                        where compra_id = c.id_compra
                        and tipo='compra') as fecha_limite
                    from (SELECT c.*
                    FROM {3} c
                    WHERE creado_por = :id_usuario) c
                    
                    ORDER BY c.fecha_compra DESC
                    """.format(self.det_query, self.cargo_query, self.pago_query, self.compra_query)
            query_data = {
                "id_usuario": self.id_usuario,
            }
        
        self.compras = self.conexion.consulta_asociativa(query, query_data)
        
        for c in self.compras:
            c["images"] = self.images.get(c["id_compra"], [])


class GuardarCargo(PostApi):
    def main(self):
        self.show_me()
        self.usuarios = []
        self.validar_creador()
        self.add_cargo()
        try:
            self.enviar_correo()
        except:
            pass
    
    def validar_creador(self):
        self.compra_id = compra_id = self.data["compra_id"]
        query = """SELECT creado_por, nombre_compra
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

        self.nombre_compra = compra[0]["nombre_compra"]

    def add_cargo(self):
        total = self.data.get("total", 0)
        self.fecha_limite = fecha_limite = self.data.get("fecha_limite", None)
        self.tipo_cargo = tipo = self.data["tipo"]
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
            in_peruser = compra_det_id in perUser and (not perUser[compra_det_id] or float(perUser[compra_det_id]) < 0.5)
            in_total = not total and compra_det_id not in perUser
            
            if in_peruser or in_total:
                continue
            
            query_data["id_cargo"] = id_cargo
            query_data["usuario_id"] = user["id_usuario"]
            query_data["compra_det_id"] = compra_det_id
            self.usuarios.append(user["id_usuario"])

            if compra_det_id in perUser:
                query_data["total"] = float(perUser[compra_det_id])
            else:
                porcentaje = float(user["porcentaje"])
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

    def enviar_correo(self):
        query = """SELECT u.correo, u.usuario
                FROM usuarios u
                WHERE u.id_usuario IN :usuarios """
        query_data = {
            "usuarios": tuple(self.usuarios),
        }
        usuarios = self.conexion.consulta_asociativa(query, query_data)

        query = """SELECT u.correo, u.usuario
                FROM usuarios u
                WHERE u.id_usuario = :id_usuario """
        query_data = {
            "id_usuario": self.user["id_usuario"],
        }
        r = self.conexion.consulta_asociativa(query, query_data)
        creador = r[0]

        # self.compra_id, self.nombre_compra, self.fecha_limite, self.tipo_cargo

        usuarios = self.conexion.consulta_asociativa(query, query_data)
        email_subject = f"Nuevo Cargo a la compra {self.nombre_compra}"
        email_text = f"Se ha agregado un nuevo cargo para la compra {self.nombre_compra}\n"
        email_text += f"Tipo de cargo: {self.tipo_cargo}\n"
        email_text += f"Fecha Limite de pago: {self.fecha_limite}\n"
        email_text += f"Cargo agregado por: {creador['usuario']}\n\n"
        email_text += f"Puedes consultar los detalles aqui: {url_base}/#/compras/detalle/{self.compra_id}\n\n"

        to_email = [i["correo"] for i in usuarios if i["correo"]]
        if not to_email:
            return

        mail = GeneralTextMail(email_subject=email_subject, email_text=email_text, to_email=to_email)
        mail.send()


class GuardarPago(PostApi):
    def main(self):
        self.show_me()
        self.reparse_data()
        self.compra_id = self.data["compra_id"]
        self.usuarios = []
        self.guardar_comprobante()
        self.validar_creador()
        self.add_pago()
        try:
            self.enviar_correo()
        except:
            pass
    
    def validar_creador(self):
        query = """SELECT creado_por, nombre_compra
                FROM compras
                WHERE id_compra = :compra_id """
        query_data = {
            "compra_id": self.compra_id,
        }
        compra = self.conexion.consulta_asociativa(query, query_data)
        if not compra:
            raise self.MYE("No se encontró la compra")
        self.validado = (compra[0]["creado_por"] == self.user["id_usuario"])
        self.nombre_compra = compra[0]["nombre_compra"]
        self.creador_compra = compra[0]["creado_por"]

    def add_pago(self):
        total = self.data.get("total", 0)
        self.tipo_cargo = tipo = self.data["tipo"]
        perUser = get_d(self.data, "perUser", default={})
        fvalidado = "null" if not self.validado else "now()"
        query = """INSERT INTO pagos
                (id_pago, cantidad, tipo, compra_det_id, compra_id, usuario_id, validado, comprobante, fecha_validado)
                VALUES
                (:id_pago, :cantidad, :tipo, :compra_det_id, :compra_id, :usuario_id, :validado, :comprobante, {})
            """.format(fvalidado)
            
        query_data = {
            "compra_id": self.compra_id,
            "tipo": tipo,
            "validado": self.validado,
            "comprobante": self.comprobante,
        }

        for user in self.data["usuarios"]:
            id_pago = str(uuid.uuid4())
            compra_det_id = user["compra_det_id"]

            in_peruser = compra_det_id in perUser and (not perUser[compra_det_id] or float(perUser[compra_det_id]) < 0.5)
            in_total = not total and compra_det_id not in perUser
            if in_peruser or in_total:
                continue
            
            query_data["id_pago"] = id_pago
            query_data["usuario_id"] = user["id_usuario"]
            query_data["compra_det_id"] = compra_det_id

            if compra_det_id in perUser:
                query_data["cantidad"] = float(perUser[compra_det_id])
            else:
                porcentaje = float(user["porcentaje"])
                query_data["cantidad"] = round(float(total) * porcentaje / 100, 2)

            if not(self.conexion.ejecutar(query, query_data)):
                self.conexion.rollback()
                raise Exception("Error al guardar el pago")
            self.conexion.commit()

            if self.validado:
                self.add_kardex(user["id_usuario"], query_data["cantidad"], id_pago, tipo)
                self.usuarios.append(user["id_usuario"])

    def add_kardex(self, usuario_id, cantidad, tipo_id, tipo_pago):
        id_kardex = str(uuid.uuid4())
        tipo = "pago"
        comentario = f"Pago por {tipo_pago}"

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

    def reparse_data(self):
        data_str_json = self.request.data["data"]
        self.data = json.loads(data_str_json)

    def guardar_comprobante(self):
        file_id = str(uuid.uuid4())
        try:
            file = self.request.FILES['comprobante']
        except:
            file = None
        if not file:
            self.comprobante = None
            return

        file_name = file.name
        file_extension = file_name.split('.')[-1]
        file_name = f"{file_id}.{file_extension}"
        path_save = f'{STATIC_DIR}/compras/{self.compra_id}/comprobantes'
        if not os.path.exists(path_save):
            os.makedirs(path_save)

        with open(f'{path_save}/{file_name}', 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        self.comprobante = file_name

    def enviar_correo(self):
        if self.validado:
            query = """SELECT u.correo, u.usuario
                    FROM usuarios u
                    WHERE u.id_usuario IN :usuarios """
            query_data = {
                "usuarios": tuple(self.usuarios),
            }
            usuarios = self.conexion.consulta_asociativa(query, query_data)

            query = """SELECT u.correo, u.usuario
                    FROM usuarios u
                    WHERE u.id_usuario = :id_usuario """
            query_data = {
                "id_usuario": self.user["id_usuario"],
            }
            r = self.conexion.consulta_asociativa(query, query_data)
            creador = r[0]

            usuarios = self.conexion.consulta_asociativa(query, query_data)
            email_subject = f"Nuevo Pago a la compra {self.nombre_compra}"
            email_text = f"Se ha agregado un nuevo cargo para la compra {self.nombre_compra}\n"
            email_text += f"Tipo de pago: {self.tipo_cargo}\n"
            email_text += f"Pago agregado por: {creador['usuario']}\n\n"
            email_text += f"Puedes consultar los detalles aqui: {url_base}/#/compras/detalle/{self.compra_id}\n\n"

            to_email = [i["correo"] for i in usuarios if i["correo"]]
            if not to_email:
                return

            mail = GeneralTextMail(email_subject=email_subject, email_text=email_text, to_email=to_email)
            mail.send()
        else:
            query = """SELECT u.correo, u.usuario
                    FROM usuarios u
                    WHERE u.id_usuario = :usuario """
            query_data = {
                "usuario": self.creador_compra,
            }
            creador = self.conexion.consulta_asociativa(query, query_data)[0]

            query = """SELECT u.correo, u.usuario
                    FROM usuarios u
                    WHERE u.id_usuario = :id_usuario """
            query_data = {
                "id_usuario": self.user["id_usuario"],
            }
            solicitante = self.conexion.consulta_asociativa(query, query_data)[0]
            
            email_subject = f"Nuevo Pago para validar en {self.nombre_compra}"
            email_text = f"Se ha mandado un pago en {self.nombre_compra} para que lo valides\n"
            email_text += f"Tipo de pago: {self.tipo_cargo}\n"
            email_text += f"Pago enviado por: {solicitante['usuario']}\n\n"
            email_text += f"Puedes validar el pago aqui: {url_base}/#/compras/detalle/{self.compra_id}\n\n"
            to_email = [creador["correo"]]

            mail = GeneralTextMail(email_subject=email_subject, email_text=email_text, to_email=to_email)
            mail.send()
            
            email_subject = f"Pago enviado para validar en {self.nombre_compra}"
            email_text = f"Se ha mandado tu pago para {self.nombre_compra} queda en espera de validacion\n"
            email_text += f"Tipo de pago: {self.tipo_cargo}\n"
            email_text += f"Puedes seguir el status del pago aqui: {url_base}/#/compras/detalle/{self.compra_id}\n\n"
            to_email = [solicitante["correo"]]

            mail = GeneralTextMail(email_subject=email_subject, email_text=email_text, to_email=to_email)
            mail.send()


class ValidarPago(PostApi):
    def main(self):
        self.show_me()
        self.compra_id = self.data["compra_id"]
        self.validar_creador()
        self.validar_pago()
        try:
            self.enviar_correo()
        except:
            pass
    
    def validar_creador(self):
        query = """SELECT creado_por, nombre_compra
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
        self.nombre_compra = compra[0]["nombre_compra"]

    def validar_pago(self):
        id_pago = self.data["id_pago"]
        query = """UPDATE pagos
                SET validado = 1,
                    fecha_validado = :fecha_validado
                WHERE id_pago = :id_pago """
        query_data = {
            "id_pago": id_pago,
            "fecha_validado": datetime.datetime.now(),
        }
        if not(self.conexion.ejecutar(query, query_data)):
            self.conexion.rollback()
            raise Exception("Error al validar el pago")
        self.conexion.commit()
        
        self.add_kardex(self.data["usuario_id"], self.data["cantidad"], self.data["id_pago"], self.data["tipo"])

    def add_kardex(self, usuario_id, cantidad, tipo_id, tipo_pago):
        id_kardex = str(uuid.uuid4())
        tipo = "pago"
        comentario = f"Pago por {tipo_pago}"

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

    def enviar_correo(self):
        query = """SELECT u.correo, u.usuario
                FROM usuarios u
                WHERE u.id_usuario = :usuario """
        query_data = {
            "usuario": self.data["usuario_id"],
        }
        usuarios = self.conexion.consulta_asociativa(query, query_data)

        query = """SELECT u.correo, u.usuario
                FROM usuarios u
                WHERE u.id_usuario = :id_usuario """
        query_data = {
            "id_usuario": self.user["id_usuario"],
        }
        r = self.conexion.consulta_asociativa(query, query_data)
        creador = r[0]

        usuarios = self.conexion.consulta_asociativa(query, query_data)
        email_subject = f"Pago Validado para {self.nombre_compra}"
        email_text = f"Se ha validado tu pago para la compra {self.nombre_compra}\n"
        email_text += f"Tipo de pago: {self.data["tipo"]}\n"
        email_text += f"Pago Validado por: {creador['usuario']}\n\n"
        email_text += f"Puedes consultar los detalles aqui: {url_base}/#/compras/detalle/{self.compra_id}\n\n"

        to_email = [i["correo"] for i in usuarios if i["correo"]]
        if not to_email:
            return

        mail = GeneralTextMail(email_subject=email_subject, email_text=email_text, to_email=to_email)
        mail.send()


class EliminarImagen(PostApi):
    def main(self):
        id_image = self.data["id_image"]
        query = """SELECT compra_id, filename
                    from imagenes
                    where id_imagen = :id_imagen """
        query_data = {
            "id_imagen": id_image,
        }
        r = self.conexion.consulta_asociativa(query, query_data)
        image = r[0]
        compra_id = image["compra_id"]
        filename = image["filename"]
        
        file_path = f"{STATIC_DIR}/compras/{compra_id}/preview/{filename}"
        
        os.remove(file_path)
        
        query = """DELETE FROM imagenes
                    WHERE id_imagen = :id_imagen """
        
        if not self.conexion.ejecutar(query, query_data):
            self.conexion.rollback()
            raise Exception("Error al eliminar la imagen")
        self.conexion.commit()
        
        self.response = {
            "message": "Archivo eliminado correctamente"
        }


class EliminarCompra(PostApi):
    def main(self):
        self.compra_id = self.data["compra_id"]
        self.validar_creador()
        self.get_usuarios()
        self.marcar_oculto()
        self.enviar_correo()
    
    def validar_creador(self):
        query = """SELECT creado_por, nombre_compra
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
        self.nombre_compra = compra[0]["nombre_compra"]

    def get_usuarios(self):
        query = """SELECT usuario_id
                    FROM compras_det
                    WHERE compra_id = :compra_id """
        query_data = {
            "compra_id": self.compra_id,
        }
        r = self.conexion.consulta_asociativa(query, query_data)
        self.usuarios = [i["usuario_id"] for i in r]
        
    def marcar_oculto(self):
        query = """UPDATE compras
                SET oculto = 1,
                    status_compra = 'cancelado'
                WHERE id_compra = :compra_id """
        query_data = {
            "compra_id": self.compra_id,
        }
        if not self.conexion.ejecutar(query, query_data):
            self.conexion.rollback()
            raise Exception("Error al eliminar la compra")
        self.conexion.commit()
        
        query = """UPDATE compras_det
                    set oculto = 1,
                        status_articulo = 'cancelado'
                    WHERE compra_id = :compra_id """
        if not self.conexion.ejecutar(query, query_data):
            self.conexion.rollback()
            raise Exception("Error al eliminar la compra")
        self.conexion.commit()

    def enviar_correo(self):
        query = """SELECT u.correo, u.usuario
                FROM usuarios u
                WHERE u.id_usuario IN :usuarios """
                
        query_data = {
            "usuarios": tuple(self.usuarios),
        }
        usuarios = self.conexion.consulta_asociativa(query, query_data)
        
        query = """SELECT u.correo, u.usuario
                FROM usuarios u
                WHERE u.id_usuario = :id_usuario """
        query_data = {
            "id_usuario": self.user["id_usuario"],
        }
        r = self.conexion.consulta_asociativa(query, query_data)
        creador = r[0]
        
        email_subject = f"Compra Cancelada"
        email_text = f"Se ha cancelado la compra {self.nombre_compra}\n"
        email_text += f"Compra cancelada por: {creador['usuario']}\n\n"
        
        to_email = [i["correo"] for i in usuarios if i["correo"]]
        if not to_email:
            return
        
        mail = GeneralTextMail(email_subject=email_subject, email_text=email_text, to_email=to_email)
        mail.send()

""" 
Yemen
967 773 755 514
vs
SV
need funa
"""


