FROM node:20.3.1-bullseye-slim@sha256:c92280d8fb6e7ca07f258c45e9f18cb643ea798a5441855a05e982cfd2b90789

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
