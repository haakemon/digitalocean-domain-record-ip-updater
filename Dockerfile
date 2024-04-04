FROM node:20.12.1-bullseye-slim@sha256:8b4ff77871661263d8b99ed83174b52bf62001787ad2ddeeb8de870e81fb7757

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
