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
          {
            path: 'import-file',
            name: 'question-add-from-file',
            meta: {
              breadcrumb: [
                {
                  title: 'question-bank',
                  to: { name: 'question-list' },
                },
                {
                  title: 'AddFromFiles',
                  active: true,
                },
              ],
            },
            component: () => import('@/pages/admin/content/question/import/ImportFileQuestion.vue'),
          },
        ],
      },
      {
        path: 'question-survey',
        name: 'question-survey',
        redirect: { name: 'question-survey-list' },
        component: () => import('@/pages/admin/content/survey/Index.vue'),
        children: [
          {
            path: '',
            name: 'question-survey-list',
            component: () => import('@/pages/admin/content/survey/Survey.vue'),
          },
          {
            path: 'add',
            name: 'survey-add',
            meta: {
              breadcrumb: [
                {
                  title: 'survey-bank',
                  to: { name: 'question-survey-list' },
                },
                {
                  title: 'Add-new',
                  active: true,
                },
              ],
            },
            component: () => import('@/pages/admin/content/survey/modification/Modification.vue'),
          },
          {
            path: 'edit/:id',
            name: 'survey-edit',
            meta: {
              breadcrumb: [
                {
                  title: 'survey-bank',
                  to: { name: 'question-survey-list' },
                },
                {
                  title: 'ActionEdit',
                  active: true,
                },
              ],
            },
            component: () => import('@/pages/admin/content/survey/modification/Modification.vue'),
          },
          {
            path: 'import-file',
            name: 'survey-add-from-file',
            meta: {
              breadcrumb: [
                {
                  title: 'survey-bank',
                  to: { name: 'question-survey-list' },
                },
                {
                  title: 'AddFromFiles',
                  active: true,
                },
              ],
            },
            component: () => import('@/pages/admin/content/survey/import/ImportSurvey.vue'),
          },
        ],
      },
      {
        path: 'content-repository',
        name: 'content-repository',
        redirect: { name: 'content-repository-list' },
        component: () => import('@/pages/admin/content/question/Index.vue'),
        children: [
          {
            path: '',
            name: 'content-repository-list',
            component: () => import('@/pages/admin/content/content-repository/ContentRepository.vue'),
          },
          {
            path: ':type/add',
            name: 'content-repository-add',
            component: () => import('@/pages/admin/content/content-repository/edit-content/EditContent.vue'),
          },
          {
            path: ':type/edit/:id',
            name: 'content-repository-edit',
            component: () => import('@/pages/admin/content/content-repository/edit-content/EditContent.vue'),
          },

        ],
      },
    ],
  },
]
