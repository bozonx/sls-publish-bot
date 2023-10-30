import type {PageLoad} from '../../../../.svelte-kit/types/src/routes';


const testData = {
  blog: {
    name: 'plibereco',
    title: 'Система Личной Свободы RU',
    lang: 'ru',
  },
}


export const load: PageLoad = async (event) => {
  return testData
}
