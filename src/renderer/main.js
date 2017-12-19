import Vue from 'vue';
import axios from 'axios';
import Buefy from 'buefy';

import App from './App';
import router from './router';
import store from './store';

Vue.use(Buefy, {
  defaultIconPack: 'fa',
});

const config = {
  apiKey: 'AIzaSyCGNQxV-FRTNmfdUgwshbf8_bcn6ekwE7w',
  databaseURL: 'https://dsr-oneclick-miner.firebaseio.com',
  projectId: 'dsr-oneclick-miner',
  messagingSenderId: '479906324283',
};
window.firebase.initializeApp(config);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
