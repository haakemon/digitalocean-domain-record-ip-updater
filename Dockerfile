FROM node:20.11.1-bullseye-slim@sha256:f3299f16246c71ab8b304d6745bb4059fa9283e8d025972e28436a9f9b36ed24

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
