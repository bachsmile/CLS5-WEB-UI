export default [

  {
    path: 'exam-question-stock-list',
    name: 'exam-question-stock-list',
  },
  {
    path: 'content-repository',
    name: 'content-repository',
  },
  {
    path: 'library-management',
    name: 'library-management',
  },
  {
    path: 'exam',
    name: 'list-exam',
    redirect: { name: 'exam-list' },
    component: () => import('@/pages/admin/exam/Index.vue'),
    children: [
      {
        path: '',
        name: 'exam-list',
        component: () => import('@/pages/admin/exam/Exam.vue'),
      },
      {
        path: 'add/:tab',
        name: 'exam-add',
        meta: {
          breadcrumb: [
            {
              title: 'exam-list',
              to: { name: 'list-exam' },
            },
            {
              title: 'Add-new',
              active: true,
            },
          ],
        },
        component: () => import('@/pages/admin/exam/edit/EditExam.vue'),
      },
      {
        path: 'edit/:id',
        name: 'exam-edit',
        meta: {
          breadcrumb: [
            {
              title: 'exam-list',
              to: { name: 'list-exam' },
            },
            {
              title: 'QuestionService.ActionEdit',
              active: true,
            },
          ],
        },
        component: () => import('@/pages/admin/exam/edit/EditExam.vue'),
      },
    ],
  },
]
