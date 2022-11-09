
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
    selectManageTasks: 'Управлять заданиями',
    selectManageTelegraph: 'Управлять telegra.ph',
    publish: 'Опубликовать из контент плана',
    makeStory: 'Создать STORY в tg',
    makeMem: 'Создать МЕМ в Tg',
    makeReel: 'Создать REEL в Tg',
    makePost: 'Создать ПОСТ в Tg',
    makeAdvertTg: 'Создать РЕКЛАМУ в Tg',
    contentParams: 'Параметры публикации:',
    pageContent: 'Содержание страницы:',
    telegraphMenu: 'Меню сервиса telegra.ph',
    telegraphList: 'Список статей',
    siteMenu: 'Меню сайта slsfreedom.org',
    taskList: 'Текущие задания',
    emptyTaskList: 'Нет текущих заданий',
    deleteTask: 'Удалить задание',
    flushTask: 'Выполнить сейчас',
    taskDetails: 'Детали задания ',
    taskRemoveError: 'Не удалось удалить задание. ',
    selectTime: 'Напишите время в таком формате: 03:59, 23:08',
    selectDate: 'Выберете ближайшую дату или напишите число текущего '
      + 'или следующего месяца (5, 11, 29). Либо число и месяц DD.MM (1.12. 5.5, 03.07, 20.12)',
    postFooter: 'Футер поста: ',
    askTypeText: 'Введите текст поста. Чтобы очистить введите символ 0 (ноль)',
    selectedPostText: 'Будет использован текст поста:',
    selectedNoPostText: 'У поста нет текста.',
    announcementGist: 'Объявление:',
    publishFromCpMenu: 'Управление публикацией',
  },
  buttons: {
    postMediaSkip: 'Без картинки',
    addText: 'Добавить текст',
    addTags: 'Добавить тэги',
    changeSns: 'Изменить соц сети',
    uploadMainImage: 'Загрузить главную картинку/видео',
    changeMainImage: 'Изменить главную картинку/видео',
    uploadMediaGroup: 'Загрузить медиа',
    changeText: 'Изменить текст',
    changeInstaTags: 'Изменить тэги instagram',
  },
  commonPhrases: {
    setPubTime: 'Установить время публикации',
    changePubTime: 'Изменить время публикации',
    changedPubTime: 'Время публикации ',
    setPubDate: 'Установить дату публикации',
    changePubDate: 'Изменить дату публикации',
    pubDate: 'Дата публикации ',
    noPostFooter: 'Убрать footer поста',
    yesPostFooter: 'Добавить footer поста',
    noPreview: 'Убрать предпросмотр ссылки',
    yesPreview: 'Добавить предпросмотр ссылки',
    selectedDateAndTime: 'Пост будет опубликован: ',
    selectedOnlyTime: 'Установлено время на: ',
    selectedOnlyDate: 'Дата установлена на: ',
    selectedNoFooter: 'Footer поста: ',
    selectedNoPreview: 'Предпросмотр ссылки: ',
    publishConfirmation: 'Опубликовать?',
    sns: 'Cоц сети',
  },
  story: {
    upload: 'Загрузите картинку, видео или ссылку на картинку. Можно несколько. '
      + 'Если несколько ссылок то каждая должна быть на новой строке.',
  },
  customPost: {
    actionMenu: 'Настройка публикации поста',
  },
  advert: {
    upload: 'Форвардите сообщение от рекламодателя или отправьте сообщение с рекламой.',
  },
  contentInfo: {
    dateTime: 'Дата и время',
    content: 'Контент',
    link: 'Сылка',
    type: 'Тип',
    status: 'Статус',
    onlySn: 'Только соц сети',
    note: 'Заметка',
    noRestriction: 'Без ограничений',
  },
  pageInfo: {
    title: 'Название',
    announcement: 'анонс',
    imageDescr: 'Описание картинки',
    instaTags: 'Тэги Instagram',
    tgTags: 'Тэги Telegram',
    contentLength: 'Количество символов в тексте',
    contentLengthWithInstaTags: 'Количество символов в тексте + тэги инстаграмм',
    contentLengthWithTgFooter: 'Количество символов в тексте + футер telegram',
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
  onOff: ['Выкл', 'Вкл'],
  errors: {
    invalidContent: `Запись контент плана не валидна. Исправьте в notion: `,
    invalidPage: `Страница не валидна. Исправьте в notion: `,
    errorLoadFromNotion: `Ошибка загрузки из notion: `,
    // notSelectedPubDate: `Выберете дату публикации`,
    // notSelectedPubTime: `Выберете время публикации`,
    incorrectDate: 'Не валидная дата. Попробуйте ещё раз.',
    incorrectTime: 'Не валидное время. Попробуйте ещё раз.',
    incorrectUrl: 'Не валидный URL. Попробуйте ещё раз.',
    notRegisteredChat: 'Бот был ранее перезапущен поэтому начните с начала: /start',
    cantSendImage: '⚠️ Не получилось распознать картинку. Возможно она больше 5 мегабайт.',
    noNestedPage: 'Нет связанной страницы',
    noSns: '⚠️ Нет соц сетей для публикации',
  },
  message: {
    prePublishInfo: 'Это тот пост будет опубликован в канале ',
    taskDoneSuccessful: 'Задача была успешно выполнена.',
    taskRegistered: 'Задание успешно зарегистрировано',
    //loadedTask: 'Задача была загруженна с диска:',
  },
}

export default dict;
