import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import Login from '@/components/Login.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sys',
      component: Layout,
      redirect: 'user',
      children: [
        {
          path: '/sys/user',
          name: 'user',
          component: () => import('../views/user/Index.vue')
        },
        {
          path: '/sys/ar-point',
          name: 'ar-point',
          component: () => import('../views/ar-point/Index.vue')
        },
        {
          path: '/sys/sticker',
          name: 'sticker',
          component: () => import('../views/sticker/Index.vue')
        },
      ]
    },
    { path: "/", redirect: "/sys/user" },
    { path: "/login", component: Login },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  //获取token
  const token = window.localStorage.getItem('FOSHAN-TOKEN')
  if (!token) return next('/login')
  next()
})

export default router
