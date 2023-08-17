export default [
  {
    path: 'content',
    name: 'content',
    redirect: { name: 'question-list' },

    children: [
      {
        path: 'question',
        name: 'question-list',
        redirect: { name: 'question' },
        component: () => import('@/pages/admin/content/question/Index.vue'),
        children: [
          {
            path: '',
            name: 'question',
            component: () => import('@/pages/admin/content/question/Question.vue'),
          },
          {
            path: 'add',
            name: 'question-add',
            meta: {
              breadcrumb: [
                {
                  title: 'question-bank',
                  to: { name: 'question-list' },
                },
                {
                  title: 'Add-new',
                  active: true,
                },
              ],
            },
            component: () => import('@/pages/admin/content/question/modification/Modification.vue'),
          },
          {
            path: 'edit/:id',
            name: 'question-edit',
            meta: {
              breadcrumb: [
                {
                  title: 'question-bank',
                  to: { name: 'question-list' },
                },
                {
                  title: 'ActionEdit',
                  active: true,
                },
              ],
            },
            component: () => import('@/pages/admin/content/question/modification/Modification.vue'),
          },

        ],
      },

    ],
  },
]
