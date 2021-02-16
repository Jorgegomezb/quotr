import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueColumnsResizableVuetify from 'vue-columns-resizable-vuetify';
 

Vue.config.productionTip = false
Vue.use(VueColumnsResizableVuetify);
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
