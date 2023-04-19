import { setupLayouts } from 'virtual:generated-layouts'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { getHomeRouteForLoggedInUser, getUserData, parseJwt } from './utils'
import error from './errors/error.router'
import admin from '@/router/admin/admin.router'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

const generalRoutes = [
  { path: '/', redirect: { name: 'login' } },
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: 'blank',
      parent: '',
      pageTitle: 'Quản lí người dùng',
      redirectIfLoggedIn: true,
    },
    component: () => import('@/pages/login.vue'),
  },
  ...admin,
  ...error,
]

const token = localStorage.getItem('accessToken')

const permission: any = token ? parseJwt(token) : {}

const isUserLoggedIn = () => {
  return !!permission
}

const checkPortal: any = async (next: any, to: any) => {
  const isLoggedIn = isUserLoggedIn()

  if (!isLoggedIn) {
    try {
      const { data } = await MethodsUtil.requestApiCustom(`${process.env.VUE_APP_BASE_API}/widget/get-all`, TYPE_REQUEST.GET)
      if (data?.data?.length > 0) {
        return next({
          name: 'home-page',
        })
      }

      return next({
        name: 'auth-login',
        query: { redirect: to.fullPath },
      })
    }
    catch {
      window.location.replace('https://cls.vn/')
    }
  }

  return next()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(generalRoutes),
  ],
  scrollBehavior(to, from, savePosition) {
    return { ...savePosition }
  },
})

// reset loading button
// router.beforeEach((to, from, next) => {
//   const store = load()

//   if (store.$state.components.length)
//     store.$dispose()

//   return next()
// })

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (!isUserLoggedIn())
    return checkPortal(next, to)
  if (to.meta.redirectIfLoggedIn && isUserLoggedIn()) {
    const userData = getUserData()

    // getHomeRouteForLoggedInUser(userData ? userData.roles : null)
    next({ name: 'admin-organization-users-manager' })
  }
  if (to.meta.requireAuth) {
    const requireAuth: any = to.meta.requireAuth || {}
    const key: string = requireAuth.permissionKey || ''

    // Redirect if logged in
    console.log(to.meta.redirectIfLoggedIn)
    console.log(isUserLoggedIn())

    console.log(Number(permission[key]))
    console.log(requireAuth.permissionValue)
    console.log((Number(permission[key]) & requireAuth.permissionValue))

    if ((Number(permission[key]) & requireAuth.permissionValue) !== requireAuth.permissionValue)
      return next({ name: 'error-403' })

    return next()
  }

  return next()
})

export default router
