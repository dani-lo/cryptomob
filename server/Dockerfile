# FROM python:3.10 as build

# WORKDIR /opt/app
# RUN python -m venv /opt/app/venv
# ENV PATH="/opt/app/venv/bin:$PATH"

# COPY requirements.txt .
# RUN pip install -r libparse-requirements.txt

FROM node:14-alpine3.12

# Install python/pip
ENV PYTHONUNBUFFERED=1

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# copying packages first helps take advantage of docker layers
COPY ./api-server/package*.json ./api-server/
COPY ./api-server ./api-server
COPY ./libparse ./libparse

RUN pip3 install -r ./libparse/requirements.txt

WORKDIR /app/api-server

RUN npm install

ENV NODE_ENV=container
EXPOSE 8080

CMD [ "npm", "run", "dev" ]