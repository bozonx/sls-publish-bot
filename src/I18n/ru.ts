import {PublicationTypes} from '../types/types';


// TODO: refactor


const dict = {
  menu: {
    selectedChannel: 'Выбран канал: ',
    selectChannel: 'Выберете канал',
    selectContent: 'Выберете запись для публикации',
    selectManageSite: 'Сайт slsfreedom',
    publish: 'Опубликовать материал',
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
  greet: 'Добро пожаловать в бот блогов свободы.',
}

export default dict;


//whatToDo: 'Что хотите опубликовать?',
//whichSns: 'В какие соц сети публиковать?',
//selectedSnsPre: 'Выбраны: ',
//snsToDo: 'Можете убрать лишние или нажать ОК, если всё устраивает.',
//btnNewPage: 'СОЗДАТЬ НОВУЮ',
//selectPage: 'Выберете заготовку или создайте новую',
//selectedType: 'Выбран тип публикации: ',
//selectedSns: 'Выбраны соц сети: ',
//selectedRawPage: 'Выбрана заготовка: ',
//removeSn: 'Убрать ',
//selectedSlsSite: 'Управление сайтом slsfreedom.org'
//selectDate: 'Выберете дату или ввидете число этого или следующего месяца, например "21" или число и дату в виде "21.04", "6.5".',
//selectedDate: 'Выбрана дата: ',