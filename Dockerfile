FROM --platform=linux/amd64 node:18

RUN apt update && apt upgrade -y
RUN npm install -g npm@10.4.0

WORKDIR /home/node
COPY . .
RUN npm install

RUN useradd nobody
USER nobody

RUN chmod +x /home/node/run.sh

EXPOSE 3000

ENTRYPOINT [ "sh", "/home/node/run.sh" ]
