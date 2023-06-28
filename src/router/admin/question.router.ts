export default [
  {
    path: 'content',
    name: 'admin-content',
    redirect: { name: 'question' },

    // meta: {
    //   requireAuth: {
    //     permissionKey: 'OrganizationalStructureManaging',
    //     permissionValue: 1,
    //   },
    // },
    children: [
      {
        path: '/question',
        name: 'question',
        component: () => import('@/pages/admin/content/question/Question.vue'),
      },
      {
        path: '/question/add',
        name: 'question-add',
        component: () => import('@/pages/admin/content/question/modification/Modification.vue'),
      },
    ],
    component: () => import('@/pages/admin/content/question/Index.vue'),
  },
]
