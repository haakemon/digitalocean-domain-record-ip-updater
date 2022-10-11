FROM node:lts-bullseye-slim@sha256:4fc367c89d498b455c6497cdd6211cc6a180bede77d8df80dea9acbcd5ffa19c

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
