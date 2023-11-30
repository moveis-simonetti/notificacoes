FROM node:20.10-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY bin bin
COPY src src
COPY .babelrc .babelrc

RUN npm run build

EXPOSE 3000

CMD node bin/server.js
