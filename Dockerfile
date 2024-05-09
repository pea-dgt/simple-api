FROM --platform=linux/amd64 node:18 AS builder

# RUN apt update && apt upgrade -y
# RUN npm install -g npm@10.4.0

FROM --platform=linux/amd64 gcr.io/distroless/nodejs18-debian12:nonroot AS runner

WORKDIR /home/node
COPY . .
RUN npm install

# USER nobody

# RUN chown -R nobody /home/node
# RUN chmod +x /home/node/run.sh

EXPOSE 3000

ENTRYPOINT [ "/home/node/index.js" ]
# ENTRYPOINT [ "bash", "/home/node/run.sh" ]
