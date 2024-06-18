# Python
import os
import json

# User
from app.core.bases.apis import PostApi, GetApi, NoSession, get_d


class Login(NoSession, PostApi):
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


class Register(NoSession, PostApi):
    def main(self):
        self.show_me()
        print(self.data)


