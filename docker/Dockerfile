FROM node:18.12

ENV NODE_ENV=production
ENV APP_DIR=/home/node/app

ENV CONFIG_PATH=/home/node/app/src/blogscfg.prod.yaml
ENV DATA_DIR=/home/node/data
ENV CONSOLE_LOG_LEVEL=warn
ENV CHANNEL_LOG_LEVEL=warn
ENV BOT_CHAT_LOG_LEVEL=warn
# don't execute tasks which is going to execute in 60 seconds and less
ENV EXPIRED_TASK_OFFSET_SEC=60

WORKDIR $APP_DIR

COPY ./package.json ./tsconfig.json ./yarn.lock $APP_DIR/
COPY ./src/ $APP_DIR/src

RUN mkdir -p $DATA_DIR
RUN yarn install

CMD ["yarn", "prod"]

#USER node
