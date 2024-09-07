# Antifem publisher bot

## Setup

```
npx wrangler d1 create publisher
npx prisma init --datasource-provider sqlite
npx wrangler d1 migrations create publisher initial
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0001_initial.sql
npx wrangler d1 migrations apply publisher --local

```

## Development

```
# run dev server
yarn dev


# Format scheme.prisma
npx prisma format

# run it each time you change the scheme.prisma
npx prisma generate

# Migration
# create the new migration
npx wrangler d1 migrations create publisher <name>
# make sql from schema
npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/<fileName>.sql
# apply migrations
npx wrangler d1 migrations apply publisher --local
npx wrangler d1 migrations apply publisher --remote
```

