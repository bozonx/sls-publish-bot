
// TODO: refactor


import {PublicationTypes} from '../types/ContentItem';

const dict = {
  greet: 'Добро пожаловать в бот блогов свободы.',
  menu: {
    mainMenu: 'Главное меню',
    selectedBlog: 'Выбран блог: ',
    blogMenu: 'Выберете что сделать: ',
    selectContent: 'Выберете запись для публикации',
    selectManageSite: 'Сайт slsfreedom',
    publish: 'Опубликовать из контент плана',
    makeStory: 'Создать story в tg',
    makeAdvert: 'Опубликовать рекламу',
    contentParams: 'Параметры публикации:',
    pageContent: 'Содержание страницы:',
    publishConfirmation: 'Опубликовать?',
    siteMenu: 'Меню сайта slsfreedom.org',
  },
  contentInfo: {
    dateTime: 'Дата и время',
    content: 'Контент',
    link: 'Сылка',
    type: 'Тип',
    status: 'Статус',
    sns: 'Соц сети',
    note: 'Заметка'
  },
  pageInfo: {
    title: 'Название',
    announcement: 'анонс',
    imageDescr: 'Описание картинки',
    instaTags: 'Тэги Instagram',
    tgTags: 'Тэги Telegram',
    contentLength: 'Количество символов в тексте',
  },
  publicationType: {
    article: 'Статья',
    post1000: 'Пост1000/мем',
    post2000: 'Пост2000',
    story: 'Cторис',
  } as Record<PublicationTypes, string>,
  dates: {
    today: 'Сегодня',
    tomorrow: 'Завтра',
    afterTomorrow: 'Послезавтра',
  },
  errors: {
    invalidContent: `Запить контент плана не валидна. Исправьте в notion: `,
  },
  message: {
    prePublishInfo: 'Это тот пост будет опубликован в канале ',
  }
}

export default dict;
