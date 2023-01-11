FROM node:lts-bullseye-slim@sha256:bc946484118735406562f17c57ddf5fded436e175b6a51f827aa6540ba1e13de

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
