# sls-publish-bot
Publish bot for СЛС

## Dev

```bash
yarn dev
```

See channel `sls_publish_test`
and bot `sls_publish_test_bot
type /start in bot chat

## Prod

```bash
docker run --name publish_bot -ti --rm \
  -e NODE_ENV=production
  node:18.12
```

docker run node npm --loglevel=warn
node --experimental-specifier-resolution=node --experimental-modules --no-warnings --loader ts-node/esm