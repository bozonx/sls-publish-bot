import {ScreenDefinition} from '../../../squidlet-ui-builder/src/AbstractUi/interfaces/ScreenDefinition.js';
import {fragment} from '../../../squidlet-ui-builder/src/AbstractUi/elements/Fragment.js';
import {text} from '../../../squidlet-ui-builder/src/AbstractUi/elements/Text.js';
import {link} from '../../../squidlet-ui-builder/src/AbstractUi/elements/Link.js';


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
