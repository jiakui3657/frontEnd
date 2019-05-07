import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import 'babel-polyfill'

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data

import * as filters from './filters' // global filters

import WebsocketHeartbeatJs from 'websocket-heartbeat-js'

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

Vue.use(BaiduMap, {
  ak: 'lTdEvl2zQHkfE19y0R84P0IRAgSnIuFB&services=&t=20180917142401'
})

Vue.prototype.initWebSocketM = function(url, websocketc, msgcallback, error) {
  const websocket = new WebsocketHeartbeatJs({
    url: url
  })
  websocket.onopen = function() {
    console.log('数据发送中...:' + url)
    websocketc(websocket)
  }
  websocket.onmessage = function(evt) {
    msgcallback(evt)
  }
  websocket.onerror = function() {
    this.initWebSocketM()
  }
}

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
