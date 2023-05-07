import {PackageIndex} from '../../types/types.js';
import {PackageContext} from '../../packageManager/PackageContext.js';
import {DynamicMenuInstance} from '../../DynamicMenu/DynamicMenuInstance.js';
import {BREADCRUMBS_ROOT} from '../../DynamicMenu/DynamicBreadCrumbs.js';


const publisher: PackageIndex = (ctx: PackageContext) => {
  ctx.menu.registerMenuHandler((menu: DynamicMenuInstance) => {
    const curPath = menu.breadCrumbs.getCurrentPath()

    if (curPath === BREADCRUMBS_ROOT) {
      menu.addItem({
        name: 'publisherRoot',
        // TODO: get from translate
        label: 'Publisher root',
        // TODO: make it optional
        disabled: false,
        visible: true,
      })
    }
  })
}

export default publisher
