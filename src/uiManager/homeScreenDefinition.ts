import {ScreenDefinition} from '../AbstractUi/interfaces/ScreenDefinition.js';
import {fragment} from '../AbstractUi/elements/Fragment.js';
import {text} from '../AbstractUi/elements/Text.js';
import {link} from '../AbstractUi/elements/Link.js';


export function homeScreenDefinition(): ScreenDefinition {
  return {
    template: fragment({
      name: 'homeScreen',
      children: [
        text({
          name: 'greet',
          text: 'Hello my friend!',
        }),
        link({
          name: 'toPublisher',
          text: 'To publisher',
          path: '/publisher',
        }),
      ]
    })
  }
}
