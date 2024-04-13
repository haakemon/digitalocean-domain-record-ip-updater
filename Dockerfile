FROM node:20.12.2-bullseye-slim@sha256:f8c4cf58c27830c78d6e2b351e55cad65f5e388b892e76eac068a64bf6ba1caf

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
