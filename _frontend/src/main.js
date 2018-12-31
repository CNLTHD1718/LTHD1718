/* eslint-disable prettier/prettier */

import Vue from 'vue';
import App from './App.vue';
import router from './router'
import numeral from 'numeral';
import * as VueGoogleMaps from "vue2-google-maps";
import store from './store';

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCTNYWtFCiHdHokVJTrC0g1_paqDHZWiMs",
    libraries: "places" // necessary for places input
  }
});

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://localhost:1234',
//   vuex: {
//       actionPrefix: 'SOCKET_',
//       mutationPrefix: 'SOCKET_'
//   }
// }))

Vue.filter('formatNumber', val => {
  return numeral(val).format('0,0');
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
