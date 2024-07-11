# Python
import os
import json
import uuid

# User
from app.core.bases.apis import PostApi, GetApi, get_d, pln
from app.settings import url_base

class GetNewId(GetApi):
    def main(self):
        self.response = {
            'id': str(uuid.uuid4())
        }

class GetHostLink(GetApi):
    def main(self):
        self.response = {
            'host': url_base
        }
    def validate_session(self):
        pass