import {PackageIndex} from '../../types/types.js';
import {PackageContext} from '../../packageManager/PackageContext.js';
import {Screen} from '../../AbstractUi/Screen.js';


const publisher: PackageIndex = (ctx: PackageContext) => {
  const screen = new Screen()


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
