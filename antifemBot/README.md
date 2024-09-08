# Antifem publisher bot

## Setup

```
npx wrangler d1 create publisher
npx prisma init --datasource-provider sqlite
npx wrangler d1 migrations create publisher initial

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
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0001_initial.sql
npx wrangler d1 migrations apply publisher --remote
yarn deploy
```
