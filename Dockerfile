FROM node:20.11.1-bullseye-slim@sha256:fd4acbaa8ea5f027f3307ed50355d5827d4fa17a6331963f89e4ac21d9fb37cf

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
