FROM node:20.11.0-bullseye-slim@sha256:21fe81f52728a8fdcb1220be67a0dd2eca0c2603d84f7afbe73b6ad22c10e14b

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
