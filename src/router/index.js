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
        {path: '/modules', name: 'modules', component: page('modules')},
        {path: '/depts', name: 'depts', component: page('depts')},
        {path: '/rules', name: 'rules', component: page('rules')},
        {path: '/tplmg', name: 'tplmg', component: page('tplmg')},
        {path: '/tplcheck', name: 'tplcheck', component: page('tplcheck')},
        {path: '/tplsum', name: 'tplsum', component: page('tplsum')},
      ]
    },
    {path: '/login', name: 'login', component: page('login')},
    {path: '/home-login', name: 'p-login', component: page('home-login')},
    {path: '/register', name: 'p-register', component: page('register')},
    {path: '*', redirect: {name: '404'}}
  ]
})
