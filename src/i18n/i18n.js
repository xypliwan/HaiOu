import Vue from 'vue'

import locale from 'element-ui/lib/locale'
import VueI18n from 'vue-i18n'
import messages from './langs'
import { getLocalStorage,setLocalStorage,removeLocalStorage } from "_u/localStorage"

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: getLocalStorage('lang') || 'zh',
  messages,
  silentTranslationWarn: true
})
 
locale.i18n((key, value) => i18n.t(key, value))
export default i18n
