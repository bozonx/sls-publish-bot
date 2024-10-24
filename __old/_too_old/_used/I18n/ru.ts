
// TODO: refactor


import {PublicationType} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/publicationType';

const dict = {
  menu: {
    mainMenu: 'Главное меню',
    selectedBlog: 'Выбран блог: ',
    blogMenu: 'Выберете что сделать: ',
    customPostTgMenu: 'Выберете тип поста для публикации в Telegram',
    selectContent: 'Выберете запись для публикации',
    selectManageTasks: 'Управлять заданиями',
    selectManageTelegraph: 'Управлять telegra.ph',
    publish: 'Опубликовать из контент плана',
    customTgPostMenu: 'Создать пост в Telegram',
    makePost1000: 'Создать post1000',
    makePost2000: 'Создать post2000',
    makeMem: 'Создать мем',
    makePhotos: 'Несколько фоток',
    makeStory: 'Создать story',
    makeReel: 'Создать reel',
    buyAdvertTg: 'Закупить рекламу в Tg',
    sellAdvertTg: 'Продать рекламное место в Tg',
    makePollTg: 'Создать опрос',
    contentParams: 'Параметры публикации:',
    //pageContent: 'Содержание страницы:',
    telegraphMenu: 'Меню сервиса telegra.ph',
    telegraphPageList: 'Всего страниц: ',
    telegraphList: 'Список страниц',
    taskList: 'Текущие задания:',
    emptyTaskList: 'Нет текущих заданий',
    taskMenuDefinition: 'Чтобы добавить отложенное задание выберете соответствующее действие.',
    deleteTask: 'Удалить задание',
    flushTask: 'Выполнить сейчас',
    changeTaskExecDate: 'Изменить время исполнения',
    changeTaskAutoDeleteDate: 'Изменить время авто удаления',
    taskDetails: 'Детали задания:',
    taskRemoveError: 'Не удалось удалить задание. ',
    taskEditError: 'Не удалось имзенить задание. ',
    selectTime: 'Напишите время в таком формате: 03:59, 23:08, 1.20. Так же можно указать только час: 7, 10, 18',
    selectDate: 'Выберете ближайшую дату или напишите число текущего '
      + 'или следующего месяца (5, 11, 29). Либо число и месяц DD.MM (1.12. 5.5, 03.07, 20.12)',
    selectTags: 'Введите тэги разделяя пробелом, знак # ставить не обязательно. '
      + 'Введённые тэги полностью заменят то что было раньше',
    selectSns: 'Уберите лишние соц сети',
    makePoll: 'Создайте или расшарьте сюда опрос',
    postFooter: 'Футер поста: ',
    askTypeText: 'Введите или расшарьте текст. Поддерживается стандартное форматирование Telegram кроме spoiler',
    askTgChannel: 'Выберете канал. Введите часть названия канала для фильтрации',
    askAdBuyer: 'Введите имя покупателя, можно вставлять ссылки и форматирование',
    selectedPostText: 'Будет использован текст поста:',
    selectedAnnounce: 'Будет использован анонс статьи:',
    selectedNoPostText: 'У поста нет текста.',
    selectedInitialPostText: 'Будет использован изначальный текст из Notion.',
    notSelectedAnnounce: 'Анонс очищен, будет использован шаблон поста из конфига.',
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
    taskClonePost: 'Расшарьте сюда пост который должен быть склонирован. '
      + 'В чате или канале где находится пост бот должен иметь соответствующие права.\n'
      + 'Url кнопка не будет склонирована. Сообщения с несколькими картинками не поддерживаются.',
    taskPinPost: 'Расшарьте сюда пост который должен быть прикреплён. '
      + 'В чате или канале где находится пост бот должен иметь соответствующие права.',
    taskUnpinPost: 'Расшарьте сюда пост который должен быть прикреплён. '
      + 'В чате или канале где находится пост бот должен иметь соответствующие права.',
    taskFinishPoll: 'Расшарьте сюда опрос который должен быть завершён. '
      + 'В чате или канале где находится пост бот должен иметь соответствующие права.',
    selectPollClose: 'Чтобы установить отложенное закрытие опроса напишите количество '
      + 'часов от публикации до закрытия опроса (например 24, 72, макс 596), либо выберете из меню.',
    askAnnounce: 'Вставьте анонс в виде markdown. Можно вставлять ${ TITLE } и ${ ARTICLE_URL }',
    anotherChannel: 'Другой канал',
    anotherChannelName: 'Название канала',
    anotherChannelUrl: 'Url канала',
    adContact: 'Введите контакт для связи',
  },
  buttons: {
    postMediaSkip: 'Без картинки',
    addText: 'Добавить текст',
    replaceText: 'Заменить текст',
    addArticleAnnounce: 'Добавить анонс статьи',
    replaceArticleAnnounce: 'Заменить анонс статьи',
    addTgUrlButton: 'Добавить URL кнопку в Telegram',
    changeTgUrlButton: 'Изменить URL кнопку в Telegram',
    setTgAutoRemove: 'Установить таймер авто удаления в Telegram',
    changeTgAutoRemove: 'Изменить таймер авто удаления в Telegram',
    replaceTags: 'Заменить тэги',
    addTags: 'Добавить тэги',
    changeSns: 'Изменить соц сети',
    uploadImage: 'Загрузить картинку/видео',
    changeImage: 'Изменить картинку/видео',
    uploadImages: 'Загрузить картинки/видео',
    changeImages: 'Изменить картинки/видео',
    changeInstaTags: 'Изменить тэги Instagram',
    clear: 'Очистить',
    //noNote: 'Без заметки',
    deletePost: 'Удалить пост',
    clonePost: 'Клонировать пост',
    pinPost: 'Закрепить пост',
    unpinPost: 'Открепить пост',
    finishPoll: 'Завершить опрос',
    setDate: 'Установить дату',
    withoutText: 'Без текста',
    getInitialNotionText: 'Вернуть первоначальный текст из Notion',
    getInitialNotionImage: 'Вернуть первоначальную картинку из Notion',
    clearAnnouce: 'Очистить анонс',
    back: 'Назад',
    cancel: 'Отмена',
    ok: 'Ок',
    toMainMenu: 'В главное меню',
    onlyTelegraphArticle: 'Только сформировать telegra.ph статью',
    makeForZen: 'Сформировать для Zen',
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
    autoDeletePostDate: 'Дата авто-удаления поста',
    autoClosePollDate: 'Дата авто-закрытия опроса',
    noTgPostFooter: 'Убрать footer поста в Telegram',
    yesTgPostFooter: 'Добавить footer поста в Telegram',
    noTgPreview: 'Убрать предпросмотр ссылки в Telegram',
    yesTgPreview: 'Добавить предпросмотр ссылки в Telegram',
    selectedDateAndTime: 'Выбрана дата и время: ',
    //pollCloseDateAndTime: 'Дата и время закрытия опроса: ',
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
    addedDeleteTimerPeriod: 'Пост авто удалится после публикации через(часов): ',
    closePollTime: 'Таймер авто закрытия опроса был установлен на: ',
    //closePollPeriod: 'Пост авто закрытия опроса после публикации через(часов): ',
    typeBtnText: 'Введите текст кнопки',
    typeBtnUrl: 'Введите url кнопки',
    withoutUrlBtn: 'Без URL кнопки',
    pollParams: 'Параметры опроса:',
    footer: 'футер',
    dateLabel: {
      postponePost: 'Дата публикации поста',
      deletePost: 'Дата удаления поста',
      clonePost: 'Дата клонирования поста',
      pinPost: 'Дата прикрепления поста',
      unpinPost: 'Дата открепления поста',
      finishPoll: 'Дата завершения опроса',
    },
    next: 'Следующие',
    prev: 'Предыдущие',
    seconds: 'секунд',
  },
  customPost: {
    actionMenu: 'Настройка публикации поста',
  },
  advert: {
    upload: 'Форвардите сообщение от рекламодателя или отправьте сообщение с рекламой.',
  },
  contentInfo: {
    dateTime: 'Дата и время',
    name: 'Название',
    gist: 'Суть',
    link: 'Сылка',
    type: 'Тип',
    status: 'Статус',
    note: 'Заметка',
    noRestriction: 'Без ограничений',
    instaTags: 'Тэги Instagram',
    sections: 'Разделы',
  },
  pageInfo: {
    title: 'Название',
    announcement: 'анонс',
    contentLength: 'Количество символов в тексте',
    contentLengthWithInstaTags: 'Количество символов в тексте + тэги инстаграмм',
    //contentLengthWithTgFooter: 'Количество символов в тексте + футер',
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
    cantSendImage: '⚠️ Не получилось распознать картинку. Возможно она больше 5 мегабайт. Можете её поменять в notion или в следующем меню публикации.',
    noSns: 'Нет соц сетей для публикации',
    needAlmostOneSn: 'Нужна хотябы одна соц сеть',
    toManyInstaTags: 'Тэгов для Instagram больше чем 30',
    pollIsClosed: '⚠️ Опрос уже закрыт',
    noImage: 'Нет картинки/видео',
    noImages: 'Нет картинок/видео',
    moreThanOneImage: 'Загружено более одной картинки',
    noText: 'Нет текста',
    noImageNoText: 'Нет ни картинки ни текста',
    unsupportedPubType: 'Соц сеть "${SN}" не поддерживает тип публикации ${PUB_TYPE}',
    bigCaption: 'Подпись картинки в ${SN} превышает ${COUNT} символа',
    bigPost: 'Пост в ${SN} превышает ${COUNT} символа',
    noTitle: 'Нет заголовка',
    invalidNumber: 'Не валидное число',
    cantCreatePage: 'Не удалось создать страницу: ',
    cantPostToLogChannel: 'Не удалось записать в канал лога: ',
    noChannel: 'Не найден канал для публикации',
    dateLessThenAutoDelete: 'Выбрана дата меньше чем дата авто удаления поста',
    dateGreaterThenAutoDelete: 'Выбрана дата больше чем дата авто удаления поста',
    onlyImageAllowed: 'Разрешено прикреплять только картинки',
    onlyVideoAllowed: 'Разрешено прикреплять только видео',
    videoNotSuppoerted: 'Видео не поддерживается в этом формате',
    articleNeedText: 'Для статьи необходим текст, но его нет',
    dateHasToBeGreaterThanCurrent: 'Дата должны быть больше чем текущая',
    dateTimeHasToBeGreaterThanCurrent: 'Дата и время должны быть больше чем текущее + ',
    errorUploadingImageTelegraph: 'Не удалось загрузить картинку в telegra.ph, попробуйте снова.',
  },
  message: {
    greet: 'Добро пожаловать в бот блогов свободы.\nВремя сервера: ',
    localTime: 'Часовой пояс по Москве, +3:00',
    prePublishInfo: 'Это тот пост будет опубликован в канале ',
    taskDoneSuccessful: 'Задача была успешно выполнена.',
    taskRegistered: 'Задание успешно зарегистрировано',
    taskRemoved: 'Задание было удалено',
    taskEdited: 'Задание было изменено',
    taskFlushed: 'Задание было выполнено',
    mediaPlaced: 'Новое медиа было установлено',
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
    //waitImagesAndPressOk: 'Дождитесь окончания загрузки картинок/видео и нажмите ОК.',
    taskTimeWasChanged: 'Время выполнения задачи было успешно изменено',
    taskAutoDeleteTimeWasChanged: 'Время авто удаления поста было успешно изменено',
    selectedChat: 'Выбран чат',
    pleaseSelectChatForClone: `Чтобы передать id чата в который будет склонировано сообщение`
      + ` просто расшарьте что-нибудь из него сюда и из сообщения извлекётся id чата`,
    bloggerComPostEditUrl: 'Ссылка на редактирование статьи на blogger',
    selectedAutoDeletePeriod: 'Выбран период авто удаления поста (часов): ',
    zenData: 'Данные для Zen смотрите тут: ',
  },
}

export default dict;
