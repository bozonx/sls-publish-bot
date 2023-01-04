# sls-publish-bot
Publish bot for СЛС

## Dev

```bash
yarn dev
```

See channel `sls_publish_test`
and bot `sls_publish_test_bot
type /start in bot chat

create file ./env

```
# This is development config. Prod config in a dockerfile

BOT_TOKEN=
NOTION_TOKEN=
TELEGRA_PH_TOKEN=
LOG_CHANNEL_ID=
UTC_OFFSET=3

CONSOLE_LOG_LEVEL=debug
CHANNEL_LOG_LEVEL=debug
BOT_CHAT_LOG_LEVEL=debug
CONFIG_PATH=
DATA_DIR=./_testState
# TODO: ??? WTF ????
# 300 for prod
EXPIRED_TASK_OFFSET_SEC=1
```

## Prod

### Docker run

```bash
docker run --name publish_bot -ti --rm \
  -u "node" \
  -w "/usr/src/app" \
  -v "/mnt/disk2/workspace/sls-publish-bot/docker-test:/usr/src/app" \
  -e NODE_ENV=production \
  node:18.12 \
  yarn "container"
```

### Docker compose

```
version: "3"
services:
  node:
    image: "node:18.12"
    user: "node"
    working_dir: /usr/src/app
    environment:
      - NODE_ENV=production
    volumes:
      - /mnt/disk2/workspace/sls-publish-bot/docker-test:/usr/src/app
    #expose:
    #  - "8081"
    command: "yarn container"
```

start chat in telegram with `freedom_publish_bot`

## Docker hook

docker login
docker push bozonx/publish_bot:latest