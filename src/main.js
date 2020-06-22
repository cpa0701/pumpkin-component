import Vue from 'vue'
import App from './App.vue'
import PkComponents from '../package/index'
// 注册组件库
Vue.use(PkComponents)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
