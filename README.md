# Publisher for freedom projects

## API

- `POST /bot` - receive webhook requests of Telegram
- `/api/bot/setwh` - Set webhook for Telegram bot manually
- `/api/users` - CRUD for users
- `/api/workspaces` - CRUD for user's workspaces
- `/api/blogs` - CRUD for blogs
- `/api/inbox` - CRUD for inbox items

## Setup

```
npx wrangler kv namespace create publisher
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

## Deploy

```
npx wrangler d1 migrations apply publisher --remote
yarn deploy

# If you need to setup telegram webhook run
crul https://publisher.ivank.workers.dev/api/bot/setwh
```

## Dev initialize

```
yarn
# after that put the ID to wrangler.toml
npx wrangler d1 create publisher
npx prisma init --datasource-provider sqlite

# create initial empty migration
npx wrangler d1 migrations create publisher initial
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0001_initial.sql
npx wrangler d1 migrations apply publisher --local
```

## Development

```
# run dev server
yarn dev

# prisma studio (work bad)
npx prisma studio

# Format scheme.prisma
npx prisma format

# run it each time you change the scheme.prisma
npx prisma generate

DATABASE_URL="file:./_devDb/dev.db" npx prisma migrate dev --name init

# Migration
# create the new migration
npx wrangler d1 migrations create publisher <name>
# make sql from schema
npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/<fileName>.sql
# apply migrations
npx wrangler d1 migrations apply publisher --local
npx wrangler d1 migrations apply publisher --remote
```
