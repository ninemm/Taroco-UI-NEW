// polyfill
import 'babel-polyfill'
// Vue
import Vue from 'vue'
import App from './App'
// store
import store from '@/store/index'
// 多国语
import i18n from './i18n'
// 核心插件
import d2Admin from '@/plugin/d2admin'

// 菜单和路由设置
import router from './router'
// 菜单
import { mapState } from 'vuex'
import { frameInRoutes } from '@/router/routes'
// 全局filter
import * as filters from './filters'
// import { watch } from 'fs';

// 核心插件
Vue.use(d2Admin)

// 全局filter
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // 刷新页面时,从持久化数据加载数据到vuex
    this.$store.commit('d2admin/account/load')
    // 设置侧边栏菜单
    // this.$store.commit('d2admin/menu/asideSet')
    // 设置顶栏菜单
    this.$store.commit('d2admin/menu/headerSet')
    // 多页面控制: 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
  },
  mounted () {
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.commit('d2admin/fullscreen/listen')
  },
  computed: {
    ...mapState('d2admin/user', [
      'aside'
    ])
  },
  watch: {
    // 监听路由 控制侧边栏显示
    '$route.matched' (val) {
      let path = val[0].path
      if (path === '') {
        path = val[1].path
      }
      const _side = this.aside.filter(menu => menu.path === path)
      this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].children : [])
    }
  }
}).$mount('#app')
