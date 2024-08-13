export default `
blogs:
  - id: sls-ru
    label: "Система Личной Свободы (RU)"
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
`;
