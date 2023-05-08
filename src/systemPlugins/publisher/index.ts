import {PackageIndex} from '../../types/types.js';
import {PackageContext} from '../../packageManager/PackageContext.js';
import {Screen} from '../../AbstractUi/Screen.js';
import {fragment} from '../../AbstractUi/elements/Fragment.js';
import {button} from '../../AbstractUi/elements/Button.js';


const publisher: PackageIndex = (ctx: PackageContext) => {
  const screen = new Screen({
    template: fragment({
      name: 'screenRoot',
      children: [
        button({
          name: 'publisher',
          text: 'Publisher btn',
          onClick() {

          },
          //disabled: false,
        }),
      ]
    })
  })


  ctx.registerRoute({
    path: '/publisher',
    screen,
  })

  // ctx.menu.registerMenuHandler((menu: DynamicMenuInstance) => {
  //   const curPath = menu.breadCrumbs.getCurrentPath()
  //
  //   if (curPath === BREADCRUMBS_ROOT) {
  //     menu.addItem({
  //       name: 'publisherRoot',
  //       // TODO: get from translate
  //       label: 'Publisher root',
  //       // TODO: make it optional
  //       disabled: false,
  //       visible: true,
  //     })
  //   }
  // })
}

export default publisher
