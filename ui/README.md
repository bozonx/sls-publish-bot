# SLS Publicator UI

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# yarn
yarn build
```

Locally preview production build:

```bash
# yarn
yarn preview
```

## UI

Blog config

```
socialMedia:
  - use: dzen
    types: ["article"]
    templates:
      - ["Основной", "\${CONTENT}\n\n\nАвтор: [\${AUTHOR}](\${AUTHOR_URL})"]
      - ["Запасной", "aaasdff\n\${CONTENT}\n\nАвтор: [\${AUTHOR}](\${AUTHOR_URL})"]
  - use: telegram
    channelId: ""
    templates:
      - "some"
    postForArticleTemplates:
      - "some tg"
  - use: youtube
    types: ["podcast"]
  - use: blog
    postGitPath: "https://raw.githubusercontent.com/bozonx/sls-blog/main/src/ru/post"
```
