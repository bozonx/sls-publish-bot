export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en: {
      inbox: "Manage inbox",
      settings: "Settings",
      home: "Home",
      socialMedia: {
        dzen: "Yandex Dzen",
        telegram: "Telegram",
        blog: "Blog site",
      },
    },
    ru: {
      inbox: "Управлять входящими",
      settings: "Настройки",
      home: "Главаня",
      socialMedia: {
        dzen: "Яндекс Дзен",
        telegram: "Telegram",
        blog: "Сайт блога",
      },
    },
  },
}));
