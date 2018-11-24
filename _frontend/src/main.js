/* eslint-disable prettier/prettier */
import 'bootstrap337/dist/css/bootstrap.min.css';

import Vue from 'vue';
import App from './App.vue';
import router from './router'
import numeral from 'numeral';
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCTNYWtFCiHdHokVJTrC0g1_paqDHZWiMs",
    libraries: "places" // necessary for places input
  }
});

Vue.filter('formatNumber', val => {
  return numeral(val).format('0,0');
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
