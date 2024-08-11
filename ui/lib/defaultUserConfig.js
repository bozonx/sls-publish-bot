export default `
blogs:
  - id: sls-ru
    label: "Система Личной Свободы (RU)"
    types:
      - article
      - post
      - podcast
    socialMedia:
      - use: dzen
        templates:
          - "some"
      - use: telegram
        channelId: ""
        templates:
          - "some"
      - use: blog
        postGitPath: "https://raw.githubusercontent.com/bozonx/sls-blog/main/src/ru/post"
`;
