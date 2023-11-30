FROM node:20.10-alpine

ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=false
ENV NEW_RELIC_APP_NAME=""
ENV NEW_RELIC_LICENSE_KEY=""
ENV NEW_RELIC_LOG=stdout

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY cli/* /usr/local/bin/
COPY .babelrc .babelrc
COPY bin bin
COPY src src

RUN chmod a+x /usr/local/bin/docker-npm-*

RUN npm run build

EXPOSE 3000

CMD ["docker-npm-start-server"]
