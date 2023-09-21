import { setupLayouts } from 'virtual:generated-layouts'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import { getUserData, parseJwt } from './utils'
import error from './errors/error.router'
import learner from './learner/learner.router'
import admin from '@/router/admin/admin.router'
import MethodsUtil from '@/utils/MethodsUtil'
import { load } from '@/stores/loadComponent.js'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { canNavigate } from '@/@layouts/plugins/casl'
import type { Any } from '@/typescript/interface'

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
  ...learner,
]

const token = localStorage.getItem('accessToken')

const permission: any = token ? parseJwt(token) : null

function isUserLoggedIn() {
  return !!permission
}

const checkPortal: any = async (next: any, to: any) => {
  const store = load()
  store.components = []
  store.$dispose()
  const isLoggedIn = isUserLoggedIn()

  if (to.meta.requireAuth) {
    const requireAuth: any = to.meta.requireAuth || {}
    const key: string = requireAuth.permissionKey || ''
    if (!isUserLoggedIn())
      return next({ name: 'login' })

    if ((Number(permission[key]) & requireAuth.permissionValue) !== requireAuth.permissionValue)
      return next({ name: 'error-403' })

    return next()
  }
  if (canNavigate(to)) {
    if (!isLoggedIn) {
      try {
        const { data } = await MethodsUtil.requestApiCustom(`${process.env.VUE_APP_BASE_API}/widget/get-all`, TYPE_REQUEST.GET)
        if (data?.data?.length > 0) {
          return next({
            name: 'guilde-demo',
          })
        }
        return next({
          name: 'login',
          query: { redirect: to.fullPath },
        })
      }
      catch {
        window.location.replace('https://cls.vn/')
      }
    }
    next({ name: 'error-403' })
  }

  if (to.meta.redirectIfLoggedIn && isUserLoggedIn()) {
    const userData = getUserData()

    // getHomeRouteForLoggedInUser(userData ? userData.roles : null)
    next({ name: 'admin-organization-users-manager' })
  }

  return next()
}
function setFaviconAndPageTitle(icon: any, title: any) {
  const link = document.querySelector('link[rel~=\'icon\']') as Any
  if (link)
    link.href = `${process.env.VUE_APP_BASE_SERVER_FILE}${icon}`

  document.title = title
}

async function getPortalInfo() {
  try {
    const data = await MethodsUtil.requestApiCustom(`${process.env.VUE_APP_BASE_API}/management/get-setting-portal`)
    if (data?.data) {
      localStorage.setItem('portalIcon', data.data.icon || '/badge/favicon.svg')
      localStorage.setItem('portalTitle', data.data.portalTitle || '')
      if (data.data?.logo)
        localStorage.setItem('portalLogo', data.data.logo)
    }
    else {
      localStorage.setItem('portalIcon', '/badge/favicon.svg')
      localStorage.setItem('portalTitle', '')
    }
    setFaviconAndPageTitle(localStorage.getItem('portalIcon'), localStorage.getItem('portalTitle'))
  }
  catch {
    localStorage.setItem('portalIcon', '/badge/favicon.svg')
    localStorage.setItem('portalTitle', '')
    setFaviconAndPageTitle(localStorage.getItem('portalIcon'), localStorage.getItem('portalTitle'))
  }
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

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (localStorage.getItem('portalIcon') && localStorage.getItem('portalTitle')) {
    nextTick(() => {
      setFaviconAndPageTitle(localStorage.getItem('portalIcon'), localStorage.getItem('portalTitle'))
    })
  }
  else {
    getPortalInfo()
  }

  // fix lỗi logo, một thời gian xóa đi
  if (!localStorage.getItem('portalLogo'))
    getPortalInfo()

  // return checkPortal(next, to)
  // if (!isUserLoggedIn())
  return checkPortal(next, to)

  // if (to.meta.redirectIfLoggedIn && isUserLoggedIn()) {
  //   const userData = getUserData()

  //   // getHomeRouteForLoggedInUser(userData ? userData.roles : null)
  //   next({ name: 'admin-organization-users-manager' })
  // }
  // if (to.meta.requireAuth) {
  //   const requireAuth: any = to.meta.requireAuth || {}
  //   const key: string = requireAuth.permissionKey || ''

  //   // Redirect if logged in

  //   if ((Number(permission[key]) & requireAuth.permissionValue) !== requireAuth.permissionValue)
  //     return next({ name: 'error-403' })

  //   return next()
  // }

  // return next()
})

export default router
