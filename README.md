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
CHANNEL_IDS='{...JSON object}'
UTC_OFFSET=3

CONSOLE_LOG_LEVEL=debug
CHANNEL_LOG_LEVEL=debug
BOT_CHAT_LOG_LEVEL=debug
CONFIG_PATH=./src/blogscfg.dev.yaml
DATA_DIR=./_testData
EXPIRED_TASK_OFFSET_SEC=1
```

To get log channel id - in TgMain uncomment console.log('--- forwarded' ...

## Prod

### Docker run for test

```bash
yarn prod-test-run
```

### Docker compose for prod

```
version: '3'

services:
  app:
    image: bozonx/publish_bot:latest
    restart: always
    environment:
      - BOT_TOKEN=
      - TELEGRA_PH_TOKEN=
      - GOOGLE_API_TOKENS=
      - LOG_CHANNEL_ID=
      - NOTION_TOKEN=
      - UTC_OFFSET=3
    volumes:
      - /home/services/data/publish-bot/data:/home/node/data
```

start chat in telegram with `freedom_publish_bot`

## Docker hook

docker login
docker push bozonx/publish_bot:latest

## Push to prod

```bash
yarn build
yarn push
```