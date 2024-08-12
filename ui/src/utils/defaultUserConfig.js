export default `
blogs:
  - id: sls-ru
    label: "Система Личной Свободы (RU)"
    socialMedia:
      - use: dzen
        types: ["article"]
        templates:
          - "some"
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
