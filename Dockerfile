FROM node:18.16.1-bullseye-slim@sha256:62b1ab3e451b37f1656518cccb3425a024c7f59a87156757a1d4ba89971e1386

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
