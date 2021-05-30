import "core-js/stable"
import "regenerator-runtime/runtime"
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
require('./assets/css/slate.bootswatch.bootstrap.min.css');

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
