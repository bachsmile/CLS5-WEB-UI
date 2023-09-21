export default [
  {
    path: 'system',
    name: 'system',
    component: () => import('@/pages/admin/system/Index.vue'),
    redirect: { name: 'setting' },
    children: [
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/pages/admin/system/setting/Setting.vue'),
      },
    ],
  },
  {
    path: 'overview-user',
    name: 'overview-user',
  },
  {
    path: 'system-history',
    name: 'system-history',
  },
  {
    path: 'badge-management',
    name: 'badge-management',
  },
  {
    path: 'gift-management',
    name: 'gift-management',
  },
  {
    path: 'course-share',
    name: 'course-share',
  },
  {
    path: 'library-courses-share',
    name: 'library-courses-share',
  },
  {
    path: 'config-manager',
    name: 'config-manager',
  },
  {
    path: 'forum-management',
    name: 'forum-management',
  },
]
