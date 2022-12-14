
// TODO: refactor


import {TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST} from '../types/constants.js';
import {PublicationType} from '../types/publicationType.js';

const dict = {
  greet: 'Добро пожаловать в бот блогов свободы.',
  menu: {
    mainMenu: 'Главное меню',
    selectedBlog: 'Выбран блог: ',
    blogMenu: 'Выберете что сделать: ',
    customPostTgMenu: 'Выберете тип поста для публикации в Telegram',
    selectContent: 'Выберете запись для публикации',
    selectManageSite: 'Сайт slsfreedom',
    selectManageTasks: 'Управлять заданиями',
    selectManageTelegraph: 'Управлять telegra.ph',
    publish: 'Опубликовать из контент плана',
    customTgPostMenu: 'Создать пост в Telegram',
    makePost1000: 'Создать post1000',
    makePost2000: 'Создать post2000',
    makeMem: 'Создать мем',
    makePhotos: 'Создать пост с фотками',
    makeStory: 'Создать story',
    makeReel: 'Создать reel',
    buyAdvertTg: 'Закупить рекламу в Tg',
    sellAdvertTg: 'Продать рекламное место в Tg',
    makePollTg: 'Создать опрос',
    contentParams: 'Параметры публикации:',
    pageContent: 'Содержание страницы:',
    telegraphMenu: 'Меню сервиса telegra.ph',
    telegraphList: 'Список статей',
    siteMenu: 'Меню сайта slsfreedom.org',
    taskList: 'Текущие задания:',
    emptyTaskList: 'Нет текущих заданий',
    taskMenuDefinition: 'Чтобы добавить отложенное задание выберете соответствующее действие.',
    deleteTask: 'Удалить задание',
    flushTask: 'Выполнить сейчас',
    taskDetails: 'Детали задания:',
    taskRemoveError: 'Не удалось удалить задание. ',
    selectTime: 'Напишите время в таком формате: 03:59, 23:08. Так же можно указать только час: 7, 10, 18',
    selectDate: 'Выберете ближайшую дату или напишите число текущего '
      + 'или следующего месяца (5, 11, 29). Либо число и месяц DD.MM (1.12. 5.5, 03.07, 20.12)',
    selectTags: 'Введите тэги разделяя пробелом, знак # ставить не обязательно. '
      + 'Введённые тэги полностью заменят то что было раньше',
    selectSns: 'Уберите лишние соц сети',
    makePoll: 'Создайте или расшарьте сюда опрос',
    postFooter: 'Футер поста: ',
    askTypeText: 'Введите или расшарьте текст. Поддерживается стандартное форматирование Telegram кроме spoiler',
    selectedPostText: 'Будет использован текст поста:',
    selectedNoPostText: 'У поста нет текста.',
    //announcementGist: 'Объявление:',
    publishFromCpMenu: 'Управление публикацией',
    textForInstagram: 'Текст поста для instagram 👇',
    uploadOne: 'Загрузите/расшарьте картинку, видео или ссылку на картинку.',
    uploadSeveral: 'Загрузите/расшарьте картинку, видео или ссылку на картинку. Можно несколько. '
      + 'Если несколько ссылок то каждая должна быть на новой строке.',
    prevTags: 'Предыдущие тэги: ',
    prevSns: 'Предыдущие соц сети: ',
    selectCreatives: 'Выберете креатив',
    inputCost: 'Введите стоимость, только цифры. Валюта - рубли.',
    selectFormat: 'Выберете формат рекламы [часы в топе]/[часы до удаления]',
    typeNote: 'Введите заметку если нужно',
    taskDeletePost: 'Расшарьте сюда пост который должен быть удалён. '
      + 'В чате или канале где находится пост бот должен иметь соответствующие права.',
    taskPinPost: 'Расшарьте сюда пост который должен быть прикреплён. '
      + 'В чате или канале где находится пост бот должен иметь соответствующие права.',
    taskUnpinPost: 'Расшарьте сюда пост который должен быть прикреплён. '
      + 'В чате или канале где находится пост бот должен иметь соответствующие права.',
    taskFinishPoll: 'Расшарьте сюда опрос который должен быть завершён. '
      + 'В чате или канале где находится пост бот должен иметь соответствующие права.',
    selectPollClose: 'Чтобы установить отложенное закрытие опроса напишите количество '
      + 'часов от публикации до закрытия опроса (например 24, 72, макс 596), либо выберете из меню.',
  },
  buttons: {
    postMediaSkip: 'Без картинки',
    addText: 'Добавить текст',
    replaceText: 'Заменить текст',
    addUrlButton: 'Добавить URL кнопку',
    changeUrlButton: 'Изменить URL кнопку',
    setAutoRemove: 'Установить таймер авто удаления',
    changeAutoRemove: 'Изменить таймер авто удаления',
    replaceTags: 'Заменить тэги',
    addTags: 'Добавить тэги',
    changeSns: 'Изменить соц сети',
    uploadMainImage: 'Загрузить главную картинку/видео',
    changeMainImage: 'Изменить главную картинку/видео',
    uploadMediaGroup: 'Загрузить медиа',
    changeText: 'Изменить текст',
    changeInstaTags: 'Изменить тэги instagram',
    clear: 'Очистить',
    //noNote: 'Без заметки',
    deletePost: 'Удалить пост',
    pinPost: 'Закрепить пост',
    unpinPost: 'Открепить пост',
    finishPoll: 'Завершить опрос',
    setDate: 'Установить дату',
    withoutText: 'Без текста',
  },
  commonPhrases: {
    setPubTime: 'Установить время публикации',
    changePubTime: 'Изменить время публикации',
    changedPubTime: 'Время публикации ',
    setPubDate: 'Установить дату публикации',
    setDate: 'Установить дату',
    changePubDate: 'Изменить дату публикации',
    //pubDate: 'Дата публикации ',
    date: 'Дата',
    noPostFooter: 'Убрать footer поста',
    yesPostFooter: 'Добавить footer поста',
    noPreview: 'Убрать предпросмотр ссылки',
    yesPreview: 'Добавить предпросмотр ссылки',
    selectedDateAndTime: 'Выбрана дата и время: ',
    pollCloseDateAndTime: 'Дата и время закрытия опроса: ',
    pubDateAndTime: 'Пост будет опубликован: ',
    selectedOnlyTime: 'Установлено время на: ',
    selectedOnlyDate: 'Выбрана дата: ',
    selectedNoFooter: 'Footer поста: ',
    linkWebPreview: 'Предпросмотр ссылки: ',
    selectedTags: 'Выбранные тэги (${COUNT} шт): ',
    clearedTags: 'Тэги были ощичены',
    publishConfirmation: 'Опубликовать?',
    confirmation: 'Подтверждаете?',
    sns: 'Cоц сети',
    sn: 'Cоц сеть',
    snsForPub: 'Cоц сети для публикации: ',
    isAnonymous: 'Анонимный: ',
    isMultipleAnswer: 'Возможно несколько ответов: ',
    quizAnswer: 'Номер ответа quiz (отсчёт от нуля): ',
    type: 'Тип: ',
    selectedFormat: 'Выбран формат: ',
    skip: 'Пропустить',
    selectAdType: 'Выберете тип рекламы',
    removedUrlButton: 'URL кнопка была убрана',
    addedUrlButton: 'URL кнопка была установлена',
    removedDeleteTimer: 'Таймер авто удаления был убран',
    addedDeleteTimer: 'Таймер авто удаления был установлен на: ',
    typeBtnText: 'Введите текст кнопки',
    typeBtnUrl: 'Введите url кнопки',
    removeUrlBtl: 'Убрать URL кнопку',
    pollParams: 'Параметры опроса:',
    footer: 'футер'
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
    contentLengthWithTgFooter: 'Количество символов в тексте + футер',
    instaTagsCount: 'Количество тэгов в Instagram',
    tagsCount: 'Количество тэгов',
  },
  publicationType: {
    article: 'Статья',
    post1000: 'Пост1000/мем',
    post2000: 'Пост2000',
    story: 'Cторис',
  } as Record<PublicationType, string>,
  dates: {
    today: 'Сегодня',
    tomorrow: 'Завтра',
    afterTomorrow: 'Послезавтра',
  },
  onOff: ['Выкл', 'Вкл'],
  yesNo: ['Нет', 'Да'],
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
    noSns: 'Нет соц сетей для публикации',
    pollIsClosed: '⚠️ Опрос уже закрыт',
    noImage: 'Нет картинки/видео',
    noText: 'Нет текста',
    noImageNoText: 'Нет ни картинки ни текста',
    unsupportedPubType: 'Соц сеть "${SN}" не поддерживает тип публикации ${PUB_TYPE}',
    bigCaption: `Подпись картинки превышает ${TELEGRAM_MAX_CAPTION} символа`,
    bigPost: `Пост превышает ${TELEGRAM_MAX_POST} символа`,
    noTitle: 'Нет заголовка',
    invalidNumber: 'Не валидное число',
    cantCreatePage: 'Не удалось создать страницу: ',
    cantPostToLogChannel: 'Не удалось записать в канал лога: ',
    noChannel: 'Не найден канал для публикации',
  },
  message: {
    prePublishInfo: 'Это тот пост будет опубликован в канале ',
    taskDoneSuccessful: 'Задача была успешно выполнена.',
    taskRegistered: 'Задание успешно зарегистрировано',
    taskRemoved: 'Задание было удалено',
    taskFlushed: 'Задание было выполнено',
    removedImg: 'Картинка была удалена',
    post2000oneImg: 'Формат post2000 поддерживает только 1 картинку не более',
    post2000video: 'Формат post2000 поддерживает только 1 картинку но не видео',
    costResult: 'Стоимость ',
    buyAdDone: 'Запись была опубликована в базу данных "Закупки в Tg СЛС"',
    sellAdDone: 'Запись была опубликована в базу данных "Продажа размещений в Tg СЛС"',
    noteOrDone: 'После введения заметки запись будет записана в бд',
    maxTaskTime: 'Максимально поддерживаемый срок задачи - 24 дня от даты её регистрации.',
    //loadedTask: 'Задача была загруженна с диска:',
    noTask: 'Задание не найдено',
    noMediaCaption: 'Не задано описание для медиа',
  },
}

export default dict;
