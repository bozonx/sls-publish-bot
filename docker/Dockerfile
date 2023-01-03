FROM node:18.12

ENV NODE_ENV=production
ENV APP_DIR=/home/node/app

ENV CONFIG_PATH=/home/node/app/src/blogscfg.prod.yaml
ENV DATA_DIR=/home/node/data
ENV CONSOLE_LOG_LEVEL=warn
ENV CHANNEL_LOG_LEVEL=warn
ENV BOT_CHAT_LOG_LEVEL=warn
ENV SKIP_TASKS_EARLIER_SEC=300

WORKDIR $APP_DIR

COPY ./package.json ./tsconfig.json ./yarn.lock $APP_DIR/
COPY ./src/ $APP_DIR/src

RUN mkdir -p $DATA_DIR
RUN yarn install

CMD ["yarn", "prod"]
USER node
