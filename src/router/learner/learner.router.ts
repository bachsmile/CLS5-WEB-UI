export default [
  {
    path: '/learner',
    name: 'learner',
    redirect: { name: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard-students',
        component: () => import('@/pages/admin/dashboard/index.vue'),
      },
      {
        path: 'learning-content',
        name: 'learning-content',
      },
      {
        path: 'list-my-survey',
        name: 'list-my-survey',
      },
      {
        path: 'learning-path',
        name: 'learning-path',
      },
      {
        path: 'list-my-exam',
        name: 'list-my-exam',
      },
      {
        path: 'list-course',
        name: 'list-course',
      },
      {
        path: 'calendar',
        name: 'calendar',
      },
      {
        path: 'forum-new-feed',
        name: 'forum-new-feed',
      },
      {
        path: 'list-library',
        name: 'list-library',
      },
    ],
  },

]
