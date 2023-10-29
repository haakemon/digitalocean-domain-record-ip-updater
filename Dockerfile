FROM node:20.9.0-bullseye-slim@sha256:9bd92446fa6af24593919e2e617b08b2462e4d9eb504775a7aa118fe4b24986a

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
