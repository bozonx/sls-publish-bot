import {ExternalLink} from './ExternalLink.js';
import {Link} from './Link.js';


export interface Nav {
  name: string
  visible: boolean
  children: (Nav | Link | ExternalLink)[]
}
