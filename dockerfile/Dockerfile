FROM node:18.12

ENV NODE_ENV=production
ENV APP_DIR=/home/node/app

WORKDIR $APP_DIR

COPY ./package.json ./tsconfig.json ./yarn.lock ./.env $APP_DIR/
COPY ./src/ $APP_DIR/src

RUN yarn install

CMD ["yarn", "prod"]
USER node
