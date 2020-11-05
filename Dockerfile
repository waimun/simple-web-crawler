FROM node:14.15.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY src src/
COPY [ "README.md", "./" ]
RUN ln -s src/cli.js cli.js
ENTRYPOINT [ "node" ]
