import {PackageIndex} from '../../types/types.js';
import {PackageContext} from '../../packageManager/PackageContext.js';
import {Screen} from '../../../../squidlet-ui-builder/src/AbstractUi/Screen.js';
import {fragment} from '../../../../squidlet-ui-builder/src/AbstractUi/elements/Fragment.js';
import {button} from '../../../../squidlet-ui-builder/src/AbstractUi/elements/Button.js';


const publisher: PackageIndex = (ctx: PackageContext) => {
  const screenDefinition = () => {
    return {
      template: fragment({
        name: 'screenRoot',
        children: [
          button({
            name: 'publisher',
            text: 'Publisher btn',
            onClick() {

            },
          }),
        ]
      })
    }
  }
  const screen = new Screen(screenDefinition)

  ctx.registerRoute({
    path: '/publisher',
    screen,
  })
}

export default publisher
