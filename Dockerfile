FROM node:20.13.1-bullseye-slim@sha256:af5fb4447e73fdbbf4cec9fcdbc545061a5a13db1b5d21f479302a9c4e56de0b

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
