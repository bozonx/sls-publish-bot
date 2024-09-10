# Antifem publisher bot

## Setup

```
npx wrangler d1 create publisher
npx prisma init --datasource-provider sqlite
npx wrangler d1 migrations create publisher initial

```

make .dev.vars file

```
WORKER_HOST="antifem-bot.ivank.workers.dev"
PUBLICATION_TIME_ZONE = '+03:00'
PUBLISHING_MINUS_MINUTES = 30
SESSION_STATE_TTL_DAYS = 1

# on prod they are wrangler secret
TG_TOKEN=""
MAIN_ADMIN_TG_USER_ID=
CHAT_OF_ADMINS_ID=
# Antifem channel
DESTINATION_CHANNEL_ID=

#### DEV only
DEBUG="grammy*"
APP_DEBUG=true

# for prisma
DATABASE_URL="file:./_devDb/dev.db"
```

## Development

```
# run dev server
yarn dev

# Format scheme.prisma
npx prisma format

# run it each time you change the scheme.prisma
npx prisma generate

# create db and migration
# But remove old db and migration first in prisma folder
DATABASE_URL="file:./_devDb/dev.db" npx prisma migrate dev --name init
```

## Deploy

```
# First remove migrations/0001_initial.sql
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0001_initial3.sql
npx wrangler d1 migrations apply publisher --remote
yarn deploy
```
