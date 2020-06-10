import Vue from 'vue'
import App from './App.vue'
import PkView from '../package/index'
// 注册组件库
Vue.use(PkView)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
