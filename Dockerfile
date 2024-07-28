FROM node:20.16.0-bullseye-slim@sha256:b55f99f53cc2f1f3c676ac4345a9c4962097887bd2082ee60ceaef5715b9c847

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
