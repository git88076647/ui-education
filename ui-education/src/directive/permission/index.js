import hasRole from './hasRole'
import hasPermi from './hasPermi'
import hasNotPermi from './hasNotPermi'

const install = function(Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('hasNotPermi', hasNotPermi)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  window['hasNotPermi'] = hasNotPermi
  Vue.use(install); // eslint-disable-line
}

export default install
