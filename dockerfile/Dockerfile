FROM node:18.12

ENV NODE_ENV=production
ENV APP_DIR=/home/node/app

WORKDIR $APP_DIR

ADD ./package.json $APP_DIR/
ADD ./tsconfig.json $APP_DIR/
ADD ./src $APP_DIR/
## Install build toolchain, install node deps and compile native add-ons
#RUN apk add --no-cache python3 make g++
RUN yarn install

CMD ["yarn", "container"]
USER node
