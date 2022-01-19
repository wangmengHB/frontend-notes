import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './langs'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: 'cn',
    messages
})

export default i18n





