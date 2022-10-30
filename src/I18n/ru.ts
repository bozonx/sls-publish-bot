import {PublicationTypes} from '../types/types';


// TODO: refactor


const dict = {
  menu: {
    whatToDo: 'Что хотите опубликовать?',
    whichSns: 'В какие соц сети публиковать?',
    selectedSnsPre: 'Выбраны: ',
    snsToDo: 'Можете убрать лишние или нажать ОК, если всё устраивает.',
    btnNewPage: 'СОЗДАТЬ НОВУЮ',
    selectChannel: 'Выберете канал',
    selectManageSite: 'Сайт slsfreedom',
    selectPage: 'Выберете заготовку или создайте новую',
    selectedType: 'Выбран тип публикации: ',
    selectedChannel: 'Выбран канал: ',
    selectedSns: 'Выбраны соц сети: ',
    selectedRawPage: 'Выбрана заготовка: ',
    removeSn: 'Убрать ',
    //selectedSlsSite: 'Управление сайтом slsfreedom.org'
    selectDate: 'Выберете дату или ввидете число этого или следующего месяца, например "21" или число и дату в виде "21.04", "6.5".',
    selectedDate: 'Выбрана дата: ',
    // new
    publish: 'Опубликовать материал',
    makeStory: 'Создать story в tg',
    makeAdvert: 'Опубликовать рекламу',
    selectContent: 'Выберете запись к публикации',
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
  greet: 'Добро пожаловать в бот блогов свободы.',
}

export default dict;
