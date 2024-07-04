# Python
import os
import json
import datetime
from pathlib import Path
from inspect import currentframe

# Django
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response

# Ojitos369
from ojitos369.utils import get_d, print_line_center, printwln as pln
from ojitos369_mysql_db.mysql_db import ConexionMySQL

# User
from app.settings import MYE, prod_mode, ce, DB_DATA

class BaseApi(APIView):
    def __init__(self):
        self.status = 200
        self.response = {}
        self.data = {}
        self.ce = ce
        self.MYE = MYE
        self.response_mode = 'json'
        self.extra_error = ""
        self.create_conexion()

    def create_conexion(self):
        self.close_conexion()
        self.conexion = ConexionMySQL(DB_DATA, ce=self.ce, send_error=True)
    
    def close_conexion(self):
        try:
            self.conexion.close()
        except:
            pass

    def errors(self, e):
        try:
            self.extra_error = f'\n{self.extra_error}'
            self.extra_error += f'\nIp de la petition: {self.petition_ip}'
            raise e
        except MYE as e:
            error = self.ce.show_error(e, extra=self.extra_error)
            print_line_center(error)
            self.status = 400 if self.status not in range(400, 600) else self.status
            self.response = {
                'message': str(e),
                'error': str(e)
            }
        except Exception as e:
            error = self.ce.show_error(e, send_email=prod_mode, extra=self.extra_error)
            print_line_center(error)
            self.status = 500 if self.status not in range(400, 600) else self.status
            self.response = {
                'message': str(e),
                'error': str(e)
            }

    def get_post_data(self):
        data = {}
        try:
            data = json.loads(self.request.body.decode('utf-8'))
        except:
            try:
                data = self.request.data
            except:
                data = {}
        self.data = {**self.data, **data}

    def get_get_data(self):
        data = self.request.query_params
        for key, value in data.items():
            self.data[key] = value

    def validate_session(self):
        request = self.request
        cookies = request.COOKIES
        mi_cookie = get_d(cookies, 'tccm', default='')
        now = timezone.now()
        query = """SELECT *
                    FROM sesiones
                    WHERE sesion = %s
                    and caduca > %s
                """
        query_data = (mi_cookie, now)
        r = self.conexion.consulta_asociativa(query, query_data)
        if not r:
            self.status = 401
            raise self.MYE("Sesión no válida")
        
        if str(self.petition_ip) != str(r[0]['ip_origen']):
            self.status = 401
            raise self.MYE("Sesión no válida")
        query = """SELECT *
                    FROM usuarios
                    WHERE id_usuario = %s
                """
        query_data = (r[0]['usuario_id'],)
        r = self.conexion.consulta_asociativa(query, query_data)
        if not r:
            self.status = 401
            raise self.MYE("Sesión no válida")
        self.user = r[0]
        self.user["token"] = mi_cookie

    def validar_permiso(self, usuarios_validos):
        pass

    def show_me(self):
        class_name = self.__class__.__name__
        cf = currentframe()
        line = cf.f_back.f_lineno
        file_name = cf.f_back.f_code.co_filename
        
        print(f"{class_name} - {file_name}:{line} ")
    
    def get_client_ip(self):
        ip = ''
        try:
            x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = self.request.META.get('REMOTE_ADDR')
        except:
            ip = 'unknown'
        self.petition_ip = ip
    
    def exec(self, request, **kwargs):
        self.request = request
        self.kwargs = kwargs
        self.get_client_ip()
        if self.request.method in ('POST', 'PUT', 'PATCH'):
            self.get_post_data()
        elif self.request.method == 'GET':
            self.get_get_data()

        try:
            self.validate_session()
            self.main()
        except Exception as e:
            self.errors(e)

        self.close_conexion()
        if self.response_mode == 'blob': 
            return self.response
        elif self.response_mode == 'json':
            return Response(self.response, status=self.status)

    def send_me_error(self, msg):
        error = Exception(msg)
        self.ce.show_error(error, send_email=True)


class PostApi(BaseApi):
    def post(self, request, **kwargs):
        return self.exec(request, **kwargs)


class GetApi(BaseApi):
    def get(self, request, **kwargs):
        return self.exec(request, **kwargs)


class PutApi(BaseApi):
    def put(self, request, **kwargs):
        return self.exec(request, **kwargs)


class DeleteApi(BaseApi):
    def delete(self, request, **kwargs):
        return self.exec(request, **kwargs)


class PatchApi(BaseApi):
    def patch(self, request, **kwargs):
        return self.exec(request, **kwargs)


class FullApi(BaseApi):
    def gen(self, request, **kwargs):
        return self.exec(request, **kwargs)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.post = self.get = self.put = self.patch = self.delete = self.gen


class NoSession:
    def validate_session(self):
        pass


""" 

"""