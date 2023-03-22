FROM node:18.15.0-bullseye-slim@sha256:7d67f2765f8d1b13f3833001bebbc6513581ef3f300aa4b1019a0b6dff2c0b25

RUN corepack enable
RUN apt-get update && apt-get install cron tzdata -y

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn --immutable
RUN yarn build

RUN ["chmod", "+x", "/app/entrypoint.sh"]
ENTRYPOINT [ "bash", "/app/entrypoint.sh" ]
