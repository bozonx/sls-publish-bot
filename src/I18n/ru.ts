import {PublicationTypes} from '../types/types';

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
    //removeSn: 'Убрать ',
    //selectedSlsSite: 'Управление сайтом slsfreedom.org'
  },
  publicationType: {
    article: 'Статья',
    post1000: 'Пост1000/мем',
    post2000: 'Пост2000',
    story: 'Cторис',
  } as Record<PublicationTypes, string>,
  greet: 'Добро пожаловать в бот блогов свободы.',
}

export default dict;
