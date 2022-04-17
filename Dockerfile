# STAGE 1 - Build the react app
FROM node:16 as reactBuilder
RUN mkdir -p /home/node/react/node_modules && chown -R node:node /home/node/react
WORKDIR /home/node/react
COPY --chown=node:node ./react-app/package*.json ./
RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install
COPY --chown=node:node ./react-app .
RUN npm run build

# STAGE 2 - Build the Back end
FROM node:16 as builder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node ./backend/package*.json ./
RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install
COPY --chown=node:node ./backend .
RUN npm run build

# STAGE 3 - Deployment container
FROM node:16-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node ./backend/package*.json ./
USER node
RUN npm install --production
COPY --from=builder /home/node/app/dist ./build
COPY --from=reactBuilder /home/node/react/build ./public

# COPY --chown=node:node .env.prod .
# COPY --chown=node:node .sequelizerc .
# COPY --chown=node:node  /config ./config
# COPY --chown=node:node  /public ./public

EXPOSE 3000
CMD [ "node", "build/main.js" ]