import Vue from 'vue'
import Router from 'vue-router'

import AppView from '@/components/app-view'
import Home from '@/pages/home'

Vue.use(Router)

const page = name => () => import('@/pages/' + name)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      component: AppView,
      children: [
        {path: '/', name: 'home', component: Home},
        {path: '/404', name: '404', component: page('404')},
        {path: '/500', name: '500', component: page('500')},
        {path: '/users', name: 'users', component: page('users')},
        {path: '/roles', name: 'roles', component: page('roles')},
        {path: '/menus', name: 'menus', component: page('menus')},
        {path: '/tplmg', name: 'tplmg', component: page('tplmg')},
        {path: '/tplcheck', name: 'tplcheck', component: page('tplcheck')},
        {path: '/tplsum', name: 'tplsum', component: page('tplsum')},
        {path: '/port', name: 'port', component: page('port')}
      ]
    },
    {path: '/login', name: 'login', component: page('login')},
    // pages
    {path: '/home-login', name: 'p-login', component: page('home-login')},
    {path: '/register', name: 'p-register', component: page('register')},
    {path: '*', redirect: {name: '404'}}
  ]
})
