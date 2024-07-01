FROM node:20.15.0-bullseye-slim@sha256:b8e5f781c6e3b2279c51907f593a9ae2095f4da0c9bf4bcdf5fa6b1423514335

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
