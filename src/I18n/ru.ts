import {PublicationTypes} from '../types/PublicationTypes';

const dict = {
  menu: {
    whatToDo: 'Что хотите сделать?',
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
    article: 'Статью',
    post1000: 'Пост1000/мем',
    post2000: 'Пост2000/мем',
    story: 'Cторис',
  } as Record<PublicationTypes, string>,
  greet: 'Добро пожаловать в бот блогов свободы.',
}

export default dict;
