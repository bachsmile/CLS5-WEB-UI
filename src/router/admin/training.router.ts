export default [
  {
    path: 'survey',
    name: 'survey-list',
  },
  {
    path: 'training',
    name: 'admin-training',
    redirect: { name: 'topic-list' },
    children: [
      {
        path: 'topic',
        name: 'topic-list',

        // requireAuth: {
        //   permissionKey: 'UserTypeManaging',
        //   permissionValue: 1,
        // },
        component: () => import('@/pages/admin/training/topic/Index.vue'),
        redirect: { name: 'manager-topic', params: { tab: 'title' } },
        children: [
          {
            path: ':tab',
            name: 'manager-topic',
            component: () => import('@/pages/admin/training/topic/Topic.vue'),
          },

        ],
      },
      {
        path: 'calendar',
        name: 'admin-calendar',

        // requireAuth: {
        //   permissionKey: 'UserTypeManaging',
        //   permissionValue: 1,
        // },
        component: () => import('@/pages/admin/training/topic/Index.vue'),
        redirect: { name: 'manager-calendar' },
        children: [
          {
            path: '',
            name: 'manager-calendar',
            component: () => import('@/pages/admin/training/calendar/Calendar.vue'),
          },
          {
            path: ':tab/add',
            name: 'manager-calendar-add',
            component: () => import('@/pages/admin/training/calendar/edit/EditCalendar.vue'),
          },
          {
            path: ':tab/edit/:id',
            name: 'manager-calendar-edit',
            component: () => import('@/pages/admin/training/calendar/edit/EditCalendar.vue'),
          },
        ],
      },
      {
        path: 'cost',
        name: 'cost-list',

        // requireAuth: {
        //   permissionKey: 'UserTypeManaging',
        //   permissionValue: 1,
        // },
        component: () => import('@/pages/admin/training/cost/Index.vue'),
        redirect: { name: 'manager-cost', params: { tab: 'cost-type' } },
        children: [
          {
            path: ':tab',
            name: 'manager-cost',
            component: () => import('@/pages/admin/training/cost/Cost.vue'),
          },

        ],
      },
      {
        path: 'education',
        name: 'education',

        // requireAuth: {
        //   permissionKey: 'UserTypeManaging',
        //   permissionValue: 1,
        // },
        component: () => import('@/pages/admin/training/cost/Index.vue'),
        redirect: { name: 'manager-education', params: { tab: 'cost-type' } },
        children: [
          {
            path: ':tab',
            name: 'manager-education',
            component: () => import('@/pages/admin/training/education/Education.vue'),
            children: [
              {
                path: 'add',
                name: 'manager-education-add',
                component: () => import('@/pages/admin/training/education/Education.vue'),
              },
              {
                path: 'edit/:id',
                name: 'manager-education-edit',
                component: () => import('@/pages/admin/training/education/Education.vue'),
              },
            ],
          },

        ],
      },
    ],
  },
]
