FROM node:18.14.2-bullseye-slim@sha256:36f3403a001b82d525afd2bdb7fcec0980543277dd86e9657964cce3438ae4b7

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
