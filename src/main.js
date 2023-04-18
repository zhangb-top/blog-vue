import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入element-ui包
import ElementUI from 'element-ui'
// 导入css样式
import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 使用element插件
Vue.use(ElementUI)
// 使用
Vue.use(mavonEditor)

Vue.directive('title', {
  inserted: (el) => {
    document.title = el.dataset.title
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
