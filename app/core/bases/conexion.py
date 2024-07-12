import re
from ojitos369_mysql_db.mysql_db import ConexionMySQL

class MyConexioneMySQL(ConexionMySQL):
    def consulta(self, query, *args, **kwargs):
        query = self.replace_query(query)
        return super().consulta(query, *args, **kwargs)

    def ejecutar_funcion(self, query, *args, **kwargs):
        query = self.replace_query(query)
        return super().ejecutar_funcion(query, *args, **kwargs)

    def consulta_asociativa(self, query, *args, **kwargs):
        query = self.replace_query(query)
        return super().consulta_asociativa(query, *args, **kwargs)

    def ejecutar(self, query, *args, **kwargs):
        query = self.replace_query(query)
        return super().ejecutar(query, *args, **kwargs)

    def paginador(self, query, *args, **kwargs):
        query = self.replace_query(query)
        return super().paginador(query, *args, **kwargs)

    def replace_query(self, query):
        re_pattern = """:[a-zA-Z0-9_]+"""
        params = re.findall(re_pattern, query)
        for param in params:
            query = query.replace(param, '%('+param[1:]+')s')
        return query
