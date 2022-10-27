import {PublicationTypes} from '../types/types';

const dict = {
  menu: {
    whatToDo: 'Что хотите опубликовать?',
    whichSns: 'В какие соц сети публиковать',
    btnNewPage: 'СОЗДАТЬ НОВУЮ',
    selectChannel: 'Выберете канал',
    selectManageSite: 'Сайт slsfreedom',
    selectPage: 'Выберете заготовку или создайте новую',
    selectedType: 'Выбран тип: ',
    selectedChannel: 'Выбран канал: ',
    selectedRawPage: 'Выбрана заготовка: ',
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
