import user from '@/router/admin/user.router'
import training from '@/router/admin/training.router'
import question from '@/router/admin/question.router'
import course from '@/router/admin/course.router'
import exam from '@/router/admin/exam.router'

export default [
  // quản lý admin
  {
    path: '/admin',
    name: 'admin',
    redirect: { name: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/admin/dashboard/index.vue'),
      },

      // user
      ...user,
      ...training,
      ...question,
      ...course,
      ...exam,
    ],
  },

  // quản lý admin khác layout
]
