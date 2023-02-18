FROM node:19.6.1-bullseye-slim@sha256:e684615bdfb71cb676b3d0dfcc538c416f7254697d8f9639bd87255062fd1681

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
