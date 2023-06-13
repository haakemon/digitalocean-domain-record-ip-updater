FROM node:18.16.0-bullseye-slim@sha256:2b05866efb50b6bbc642e6d1cef908372351ad981453b8a747b1d0c9b5777cd8

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
