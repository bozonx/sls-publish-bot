import {redirect} from '@sveltejs/kit';
import type {PageLoad} from './$types';


// redirect to the app page
export const load: PageLoad = (event) => {
  throw redirect(307, '/app')
};
