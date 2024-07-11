# Python
import os
import json
import uuid
import datetime

# Django
from django.contrib.auth.hashers import make_password, check_password

# Ojitos369
from ojitos369.utils import generate_token

# User
from app.core.bases.apis import PostApi, GetApi, NoSession, get_d, pln
from app.core.bases.correos import GeneralTextMail
from app.settings import prod_mode

# '"', "'", '\\', '`', ';', ',', ' ', ''
exclude="?=&+<>{}()%!|*/[]~#:^$"

class Login(NoSession, PostApi):
    def main(self):
        self.show_me()
        # print(self.data)
        user = get_d(self.data, "user", default=None)
        user = user.replace(' ', '')
        passwd = get_d(self.data, "passwd", default=None)
        
        query = """SELECT *
                    FROM usuarios
                    WHERE lower(usuario) = %s
                    or lower(correo) = %s
                """
        query_data = (user.lower(), user.lower())
        r = self.conexion.consulta_asociativa(query, query_data)
        if not r:
            raise self.MYE("Error en los datos ingresados")
        usuario = r[0]
        passwd_hash = usuario["passwd"]
        if not (check_password(passwd, passwd_hash)):
            raise self.MYE("Error en los datos ingresados")
        
        if not usuario["validado"]:
            raise self.MYE("Usuario no validado. Revise su correo para validar su cuenta")
        
        token = generate_token(exclude=exclude)
        usuario["token"] = token
        usuario.pop("passwd")
        
        fecha_sesion = datetime.datetime.now()
        caduca = fecha_sesion + datetime.timedelta(days=1)
        
        query = """INSERT INTO sesiones
                    (id_sesion, sesion, usuario_id, fecha_sesion, caduca, ip_origen)
                    VALUES
                    (%s, %s, %s, %s, %s, %s)
                """
        query_data = (
            str(uuid.uuid4()),
            token,
            usuario["id_usuario"],
            fecha_sesion,
            caduca,
            self.petition_ip,
        )

        if not self.conexion.ejecutar(query, query_data):
            self.conexion.rollback()
            msg_error = "Error al insertar la sesion en db\n"
            msg_error += f"sesion: {token}\n"
            msg_error += f"usuario_id: {usuario['id_usuario']}\n"
            msg_error += f"ip_origen: {self.petition_ip}\n"
            self.send_me_error(msg_error)
            raise self.MYE("Error en los datos ingresados")
        self.conexion.commit()
        
        self.response = {
            "usuario": usuario,
        }


class Register(NoSession, PostApi):
    def main(self):
        self.show_me()
        # print(self.data)
        nombre = get_d(self.data, "nombre", default=None)
        paterno = get_d(self.data, "paterno", default=None)
        materno = get_d(self.data, "materno", default=None)
        usuario = get_d(self.data, "user", default=None)
        usuario = usuario.replace(' ', '')
        passwd = get_d(self.data, "passwd", default=None)
        correo = get_d(self.data, "correo", default=None)
        telefono = get_d(self.data, "telefono", default=None)
        fecha_nacimiento = get_d(self.data, "fecha_nacimiento", default=None)

        query = """SELECT *
                    FROM usuarios
                    where lower(usuario) = %s
                    or lower(correo) = %s
                    """
        query_data = (usuario.lower(), correo.lower())
        r = self.conexion.consulta_asociativa(query, query_data)
        if r:
            raise self.MYE("Usuario ya registrado")

        id_usuario = str(uuid.uuid4())
        fecha_nacimiento
        nombre = nombre
        validado = False
        activo = False

        user_data = {
            "nombre": nombre,
            "paterno": paterno,
            "materno": materno,
            "usuario": usuario,
            "passwd": make_password(passwd),
            "correo": correo,
            "telefono": telefono,
            "fecha_nacimiento": fecha_nacimiento,
        }
        campos = "id_usuario, fecha_creado, fecha_editado, "#validado, activo, "
        values = "%s, now(), now(), "#true, true, "
        query_data = [id_usuario]

        for campo, valor in user_data.items():
            if valor:
                campos += f"{campo}, "
                values += f"%s, "
                query_data.append(valor)

        campos = campos[:-2]
        values = values[:-2]

        query = f"""INSERT INTO usuarios
                ({campos})
                VALUES
                ({values})
                """

        if not self.conexion.ejecutar(query, query_data):
            self.conexion.rollback()
            msg_error = "Error al insertar el usuario en db\n"
            msg_error += f"query: {query}\n"
            msg_error += f"query_data: {query_data}\n"
            self.send_me_error(msg_error)
            raise self.MYE("Error en los datos ingresados")
        self.conexion.commit()

        id_codigo = str(uuid.uuid4())
        usuario_id = id_usuario
        codigo = generate_token(exclude=exclude)
        tipo_validacion = "registro"
        
        # 6 meses de vigencia
        fecha_codigo = datetime.datetime.now()
        fecha_vencimiento = fecha_codigo + datetime.timedelta(days=180)

        query = """INSERT INTO codigos_confirmacion
                    (id_codigo, usuario_id, codigo, fecha_codigo, fecha_vencimiento, tipo_validacion)
                    VALUES
                    (%s, %s, %s, %s, %s, %s)
                """
        query_data = (id_codigo, usuario_id, codigo, fecha_codigo, fecha_vencimiento, tipo_validacion)

        if not self.conexion.ejecutar(query, query_data):
            self.conexion.rollback()
            msg_error = "Error al insertar el codigo de confirmacion en db\n"
            msg_error += f"query: {query}\n"
            msg_error += f"query_data: {query_data}\n"
            self.send_me_error(msg_error)
            raise self.MYE("Usuario guardado, el error al enviar codigo de confirmacion, por favor contacte a soporte")
        self.conexion.commit()
        
        to_email = correo
        email_subject = "Validación de cuenta"
        email_text = f"Su código de validación es: {codigo}\n"
        url_validation = "http://localhost:8369" if not prod_mode else "https://ccm.ojitos369.com"
        url_validation += f"/#/users/validar_cuenta/{id_codigo}"
        email_text = f"Puede validar su cuenta en el siguiente enlace: {url_validation}\n"

        mail = GeneralTextMail(
            to_email=to_email,
            email_subject=email_subject,
            email_text=email_text,
        )
        mail.send()

        self.response = {
            "message": "Usuario registrado correctamente. Revise su correo para validar su cuenta."
        }


class ValidarCuenta(NoSession, PostApi):
    def main(self):
        self.show_me()
        
        codigo = get_d(self.data, "codigo", default="not available sorry")
        id_codigo = get_d(self.data, "id_codigo", default="not available sorry")
        
        query = """SELECT *
                from codigos_confirmacion
                where (id_codigo = %s
                or codigo = %s)
                and tipo_validacion = 'registro'
                and fecha_vencimiento > now()
                and fecha_validado is null
                """
        query_data = (id_codigo, codigo)
        r = self.conexion.consulta_asociativa(query, query_data)
        if not r:
            raise self.MYE("Código de validación incorrecto o vencido")
        codigo = r[0]

        if codigo["fecha_vencimiento"] < datetime.datetime.now():
            raise self.MYE("Código de validación incorrecto o vencido")
        
        query = """UPDATE usuarios
                set validado = true,
                activo = true
                where id_usuario = %s
                """
        query_data = (codigo["usuario_id"],)
        if not self.conexion.ejecutar(query, query_data):
            self.conexion.rollback()
            msg_error = "Error al validar y activar el usuario en la confirmacion\n"
            msg_error += f"query: {query}\n"
            msg_error += f"query_data: {query_data}\n"
            self.send_me_error(msg_error)
            raise self.MYE("Error al validar/activar el usuario, por favor contacte a soporte")
        self.conexion.commit()
        
        query = """UPDATE codigos_confirmacion
                set fecha_validado = now()
                where id_codigo = %s
                """
        query_data = (codigo["id_codigo"],)
        if not self.conexion.ejecutar(query, query_data):
            self.conexion.rollback()
            msg_error = "Error al validar la confirmacion\n"
            msg_error += f"query: {query}\n"
            msg_error += f"query_data: {query_data}\n"
            self.send_me_error(msg_error)
            raise self.MYE("Error al validar la confirmacion, por favor contacte a soporte")
        self.conexion.commit()
        
        self.response = {
            "message": "Usuario validado correctamente. Ya puede iniciar sesión."
        }


class ValidarSesion(GetApi):
    def main(self):
        user = {**self.user}
        user.pop("passwd")
        self.response = {
            "usuario": user
        }