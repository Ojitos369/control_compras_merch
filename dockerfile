FROM python:3.12
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y default-libmysqlclient-dev

ENV APPHOME=/usr/src/app/
WORKDIR $APPHOME
ENV PYTHONUNBUFFERED 1
COPY . $APPHOME

RUN pip install -r requirements.txt

# docker network create ccm
# docker network connect ccm ccm-py
# docker network connect ccm ccm
# docker start ccm-py
# docker exec -d ccm-py bash -c "python manage.py runserver 0.0.0.0:8000"
# docker rm -f ccm-py && docker image rm ccm-web && docker compose up -d
