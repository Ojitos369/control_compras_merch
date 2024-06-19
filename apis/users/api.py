# Python
import os
import json

# Django
from django.contrib.auth.hashers import make_password, check_password

# Ojitos369
from ojitos369.utils import generate_token

# User
from app.core.bases.apis import PostApi, GetApi, NoSession, get_d


class Login(NoSession, PostApi):
    def main(self):
        self.show_me()
        print(self.data)
        user = get_d(self.data, "user", default=None)
        passwd = get_d(self.data, "passwd", default=None)
        
        query = """SELECT *
                    FROM usuarios
                    WHERE lower(user) = %s
                """
        query_data = (user.lower(),)
        r = self.conexion.consulta_asociativa(query, query_data)
        if not r:
            raise self.MYE("Error en los datos ingresados")
        usuario = r[0]
        passwd_hash = usuario["passwd"]
        if not (check_password(passwd, passwd_hash)):
            raise self.MYE("Error en los datos ingresados")
        
        token = generate_token()
        usuario["token"] = token
        usuario.pop("passwd")
        
        query = """INSERT INTO sesiones
                    (sesion, usuario_id, fecha_sesion, caduca, ip_origen)
                    VALUES
                    (%s, %s, now(), now() + interval '1 day', %s)
                """
        query_data = {
            "sesion": token,
            "usuario_id": usuario["id_usuario"],
            "ip_origen": self.petition_ip,
        }

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
        print(self.data)
        nombre = get_d(self.data, "nombre", default=None)
        paterno = get_d(self.data, "paterno", default=None)
        materno = get_d(self.data, "materno", default=None)
        user = get_d(self.data, "user", default=None)
        passwd = get_d(self.data, "passwd", default=None)
        correo = get_d(self.data, "correo", default=None)
        telefono = get_d(self.data, "telefono", default=None)
        fecha_nacimiento = get_d(self.data, "fecha_nacimiento", default=None)


