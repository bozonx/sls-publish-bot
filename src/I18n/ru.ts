
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
    makeStory: 'Создать story в tg',
    makeAdvert: 'Опубликовать рекламу',
    contentParams: 'Параметры публикации:',
    pageContent: 'Содержание страницы:',
    publishConfirmation: 'Опубликовать?',
    telegraphMenu: 'Меню сервиса telegra.ph',
    telegraphList: 'Список статей',
    siteMenu: 'Меню сайта slsfreedom.org',
    taskList: 'Текущие задания',
    emptyTaskList: 'Нет текущих заданий',
    deleteTask: 'Удалить задание',
    flushTask: 'Выполнить сейчас',
    taskDetails: 'Детали задания ',
    taskRemoveError: 'Не удалось удалить задание. ',
    noPreview: 'Не делать предпросмотр ссылки',
    yesPreview: 'Добавить предпросмотр ссылки',
    selectTime: 'Напишите время в таком формате: 03:59, 23:08',
    postFooter: 'Футер поста: ',
    selectedTimeMsg: 'Пост будет опубликован: ',
    selectedNoPreview: 'Предпросмотр ссылки: ',
    selectedNoFooter: 'Подпись поста: ',
    incorrectTime: 'Не валидное время. Попробуйте ещё раз.',
  },
  commonPhrases: {
    setPubTime: 'Установить время публикации',
    changePubTime: 'Изменить время публикации',
    changedPubTime: 'Время публикации ',
    setPubDate: 'Установить дату публикации',
    changePubDate: 'Изменить дату публикации',
    changedPubDate: 'Дата публикации ',
    noPostFooter: 'Убрать подпись поста',
    yesPostFooter: 'Добавить подпись поста',
    incorrectUrl: 'Не валидный URL. Попробуйте ещё раз.',
  },
  story: {
    upload: 'Загрузите картинку или ссылку на картинку и отправьте сообщение.',
    actionMenu: 'Настройка публикации story',
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
    contentLengthWithTags: 'Количество символов в тексте + тэги инстаграмм',
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
    errorLoadFromNotion: `Ошибка загрузки из notion: `,
  },
  message: {
    prePublishInfo: 'Это тот пост будет опубликован в канале ',
    taskDoneSuccessful: 'Задача была успешно выполнена.',
    taskRegistered: 'Задание успешно зарегистрировано',
    //loadedTask: 'Задача была загруженна с диска:',
  },
}

export default dict;
