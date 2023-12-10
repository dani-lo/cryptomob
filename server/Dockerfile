FROM node:14-alpine3.12

ENV PYTHONUNBUFFERED=1

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /app

COPY ./api-server/package*.json ./api-server/
COPY ./api-server ./api-server
COPY ./libparse ./libparse

RUN pip3 install -r ./libparse/requirements.txt

WORKDIR /app/api-server

RUN npm install

ENV NODE_ENV=production

EXPOSE 8080

CMD [ "npm", "start" ]