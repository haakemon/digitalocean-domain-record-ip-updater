FROM node:20.14.0-bullseye-slim@sha256:8b9e42d429c49b537b8d06f75aa261a2327d62362336d570f5d3b1a669e33589

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
