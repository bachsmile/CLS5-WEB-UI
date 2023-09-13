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
        component: () => import('@/pages/users/course/MyCourse.vue'),
      },
      {
        path: 'course-detail/:id',
        name: 'course-detail',
        component: () => import('@/pages/users/course/course-detail/MyCourseDetail.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'my-course',
              to: { name: 'list-course' },
            },
            {
              title: 'course-detail',
              active: true,
            },
          ],
        },
      },
      {
        path: 'course-learning/:id',
        name: 'course-learning',
        component: () => import('@/pages/users/course/course-learning/CourseLearning.vue'),
      },
      {
        path: 'course-review/:id',
        name: 'course-review',
        component: () => import('@/pages/users/course/course-learning/CourseLearning.vue'),
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
