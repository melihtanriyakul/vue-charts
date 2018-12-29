import Vue from 'vue'
import App from './App.vue'
import VueCharts from 'vue-charts'

Vue.config.productionTip = false

Vue.use(VueCharts)


new Vue({
  render: h => h(App),
}).$mount('#app')
