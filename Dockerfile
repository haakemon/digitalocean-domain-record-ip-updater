FROM node:20.15.0-bullseye-slim@sha256:8f6881869150049f8f1228a2f828c3dc1d0a012f136175f02ae46a83c0a1002b

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
