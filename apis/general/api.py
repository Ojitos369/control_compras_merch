# Python
import os
import json
import uuid

# User
from app.core.bases.apis import PostApi, GetApi, get_d, pln

class GetNewId(GetApi):
    def main(self):
        self.response = {
            'id': str(uuid.uuid4())
        }
