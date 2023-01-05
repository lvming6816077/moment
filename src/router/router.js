
import {createRouter,createWebHistory} from 'vue-router'

import home from '../pages/home/index.vue'
import publish from '../pages/publish'
import login from '@/components/login'
import mypage from '../pages/mypage'
import personpage from '../pages/personpage'


const router = createRouter({
  history: createWebHistory(),
  routes: [

    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/publish',
      name: 'publish',
      component: publish

    },
    {
      path: '/mypage',
      name: 'mypage',
      component: mypage
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/personpage',
      name: 'personpage',
      component: personpage
    },
    {
      path: '/changenickname/:name',
      name: 'changenickname',
      component: () => import('../pages/changenickname')
    },
    {
      path: '/changedesc/:desc',
      name: 'changedesc',
      component: () => import( '../pages/changedesc')
    }
  ],
  scrollBehavior : (to, from, savedPosition) => {
    if (savedPosition) {
      // 跳转时保持可视范围
      try {
        document.getElementsByClassName('slideOutRight')[0].style.top = savedPosition.top + 'px'
      } catch (e) {}

      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  }
})


export default router

