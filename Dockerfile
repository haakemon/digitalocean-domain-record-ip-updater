FROM node:20.10.0-bullseye-slim@sha256:1d0ce9e6debe189a62c553dc989cb07d28e9bccfb315609f3b26ea7f37a220c4

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
