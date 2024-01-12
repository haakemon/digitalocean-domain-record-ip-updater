FROM node:20.11.0-bullseye-slim@sha256:2aa7cabd5ba5d16960b02298ff1a9af16880663e93a70da127f01309cb6c5a20

RUN corepack enable
RUN apt-get update && apt-get install cron tzdata -y

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY . .
RUN pnpm i
RUN pnpm run build

RUN ["chmod", "+x", "/app/entrypoint.sh"]
ENTRYPOINT [ "bash", "/app/entrypoint.sh" ]
