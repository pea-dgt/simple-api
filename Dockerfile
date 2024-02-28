FROM node:20.11-alpine

RUN apk update && apk upgrade
RUN npm install -g npm@10.4.0

WORKDIR /home/node
COPY . .
RUN npm install

ENTRYPOINT [ "npm", "run", "dev" ]