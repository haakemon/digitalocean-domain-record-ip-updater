FROM node:18.16.0-bullseye-slim@sha256:b8a9ad50d8833a2aede22170a517e64c79776e9145811d7f6649bb123fb4e258

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
