FROM node:lts-bullseye-slim@sha256:1704a01e2111bcab8d3d2f3aa8bd04bab971e68861e19b5302ec6f366c87975e

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
