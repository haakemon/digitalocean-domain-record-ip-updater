FROM node:20.10.0-bullseye-slim@sha256:664dbe4900f10ecef7ae888e621dc597ca57d07a64a632894fff8f49f32b1925

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
