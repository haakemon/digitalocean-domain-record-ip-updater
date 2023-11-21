FROM node:20.9.0-bullseye-slim@sha256:330fa0342b6ad2cbdab30ac44195660af5a1f298cc499d8cbdf7496b02ea17d8

RUN corepack enable
RUN apt-get update && apt-get install cron tzdata -y

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY . .
RUN pnpm i
RUN pnpm build

RUN ["chmod", "+x", "/app/entrypoint.sh"]
ENTRYPOINT [ "bash", "/app/entrypoint.sh" ]
