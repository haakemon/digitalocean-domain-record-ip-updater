FROM node:20.14.0-bullseye-slim@sha256:1ba9fad8cd6830e3c1087b059a4f1bd317d12b3eb67bad463414b41c86825cda

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
