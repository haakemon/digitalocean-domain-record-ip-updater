FROM node:18.15.0-bullseye-slim@sha256:639e94182196dccc83a45224a10d2a3cb4139c0e3d05194b64d6587ce2919e8c

RUN corepack enable
RUN apt-get update && apt-get install cron tzdata -y

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn --immutable
RUN yarn build

RUN ["chmod", "+x", "/app/entrypoint.sh"]
ENTRYPOINT [ "bash", "/app/entrypoint.sh" ]
