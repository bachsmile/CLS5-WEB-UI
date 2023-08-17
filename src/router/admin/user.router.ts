export default [
  {
    path: 'dashboard',
    name: 'dashboard-admin',
    component: () => import('@/pages/guilde/tree-select.vue'),
  },
  {
    path: 'hello',
    name: 'hello',
    component: () => import('@/pages/guilde/test.vue'),
  },
  {
    path: 'dashboard-lecturers',
    name: 'dashboard-lecturers',
    component: () => import('@/pages/guilde/tree-select.vue'),
  },
  {
    path: 'guilde/tree-select',
    name: 'guilde-tree-select',
    component: () => import('@/pages/guilde/tree-select.vue'),
  },
  {
    path: '/guilde/import-file',
    name: 'guilde-import-file',
    component: () => import('@/pages/guilde/import-file.vue'),
  },
  {
    path: '/guilde/tree',
    name: 'guilde-tree',
    component: () => import('@/pages/guilde/tree.vue'),
  },
  {
    path: '/guilde/table',
    name: 'guilde-table',
    component: () => import('@/pages/guilde/table.vue'),
  },
  {
    path: 'guilde/table-group',
    name: 'guilde-table-group',
    component: () => import('@/pages/guilde/table-group.vue'),
  },
  {
    path: '/guilde/demo',
    meta: {
      layout: 'blank',
    },
    name: 'guilde-demo',
    component: () => import('@/pages/guilde/demo.vue'),
  },

  {
    path: '/guilde/calender',
    meta: {
      layout: 'blank',
    },
    name: 'guilde-calender',
    component: () => import('@/pages/guilde/calender.vue'),
  },
  {
    path: '/guilde/demo/:tabActive',
    name: 'guilde-demo-tab',
    component: () => import('@/pages/guilde/demo.vue'),
  },
  {
    path: '/guilde/demo/:tabActive/:tab',
    name: 'guilde-demo-tab-tab',
    component: () => import('@/pages/guilde/demo.vue'),
  },

  // quản lý người dùng
  {
    path: 'organization',
    name: 'admin-organization',
    redirect: { name: 'user-type-list' },
    children: [
      {
        path: 'permission',
        name: 'user-type-list',
        requireAuth: {
          permissionKey: 'UserTypeManaging',
          permissionValue: 1,
        },
        component: () => import('@/pages/admin/organization/permission/Index.vue'),
        redirect: { name: 'admin-organization-permission-list' },
        children: [
          {
            path: '',
            name: 'admin-organization-permission-list',
            component: () => import('@/pages/admin/organization/permission/Permission.vue'),
          },
          {
            path: 'add',
            name: 'admin-organization-permission-add',
            requireAuth: {
              permissionKey: 'UserTypeManaging',
              permissionValue: 2,
            },
            breadcrumb: [
              {
                title: 'usertype-management',
                to: { name: 'admin-organization-permission' },
              },
              {
                title: 'add',

                active: true,
              },
            ],
            component: () => import('@/pages/admin/organization/permission/Edit/EditPermission.vue'),
          },
          {
            path: 'edit/:id',
            name: 'admin-organization-permission-edit',
            requireAuth: {
              permissionKey: 'UserTypeManaging',
              permissionValue: 4,
            },
            component: () => import('@/pages/admin/organization/permission/Edit/EditPermission.vue'),
          },
        ],
      },
      {
        path: 'users',
        meta: {
          requireAuth: {
            permissionKey: 'UserManaging',
            permissionValue: 1,
          },
        },
        name: 'user',
        component: () => import('@/pages/admin/organization/users/Index.vue'),
        redirect: { name: 'admin-organization-users-manager' },
        children: [
          {
            path: '',
            name: 'admin-organization-users-manager',
            component: () => import('@/pages/admin/organization/users/Users.vue'),
          },
          {
            path: 'profile',
            name: 'admin-organization-users-profile-add',
            meta: {
              parent: 'users',
              pageTitle: 'users.add-user.title',
              breadcrumb: [
                {
                  title: 'user-list',
                  to: { name: 'user' },
                },
                {
                  title: 'common.add',

                  active: true,
                },
              ],
              requireAuth: {
                permissionKey: 'UserManaging',
                permissionValue: 2,
              },
            },
            component: () => import('@/pages/admin/organization/users/profile/Profile.vue'),
          },
          {
            path: 'profile/:tab/:id',
            name: 'admin-organization-users-profile-edit',
            meta: {
              parent: 'users',
              pageTitle: 'users.add-user.title',
              breadcrumb: [
                {
                  title: 'user-list',
                  to: { name: 'user' },
                },
                {
                  title: 'add',

                  active: true,
                },
              ],
              requireAuth: {
                permissionKey: 'UserManaging',
                permissionValue: 4,
              },
            },
            component: () => import('@/pages/admin/organization/users/profile/Profile.vue'),
          },
          {
            path: 'import-file',
            meta: {
              requireAuth: {
                permissionKey: 'UserManaging',
                permissionValue: 1,
              },
              breadcrumb: [
                {
                  title: 'user-list',
                  to: { name: 'admin-organization-users-manager' },
                },
                {
                  title: 'title-import-file',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-import-file-update-user-infor',
            component: () => import('@/pages/admin/organization/users/import-file/UpdateUserInfor.vue'),
          },
          {
            path: 'import-file-title',
            meta: {
              requireAuth: {
                permissionKey: 'UserManaging',
                permissionValue: 1,
              },
              breadcrumb: [
                {
                  title: 'user-list',
                  to: { name: 'admin-organization-users-manager' },
                },
                {
                  title: 'title-import-file',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-import-file-update-user-title',
            component: () => import('@/pages/admin/organization/users/import-file/UpdateUserTitle.vue'),
          },
          {
            path: 'import-file-add-user',
            meta: {
              requireAuth: {
                permissionKey: 'UserManaging',
                permissionValue: 1,
              },
              breadcrumb: [
                {
                  title: 'user-list',
                  to: { name: 'admin-organization-users-manager' },
                },
                {
                  title: 'add-user-from-file',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-import-file-add-user',
            component: () => import('@/pages/admin/organization/users/import-file/AddUser.vue'),
          },
          {
            path: 'users-approve',
            meta: {
              requireAuth: {
                permissionKey: 'UserManaging',
                permissionValue: 1,
              },
              breadcrumb: [
                {
                  title: 'user-list',
                  to: { name: 'admin-organization-users-manager' },
                },
                {
                  title: 'browse-user',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-approve',
            component: () => import('@/pages/admin/organization/users/approve/Approve.vue'),
          },
        ],
      },
      {
        path: 'user-groups',
        name: 'user-group-list',
        redirect: { name: 'admin-organization-user-groups-list' },
        meta: {
          requireAuth: {
            permissionKey: 'UserGroupManaging',
            permissionValue: 1,
          },
        },
        children: [
          {
            path: '',
            name: 'admin-organization-user-groups-list',
            component: () => import('@/pages/admin/organization/user-groups/UserGroups.vue'),
          },
          {
            path: 'add',
            meta: {
              requireAuth: {
                permissionKey: 'UserGroupManaging',
                permissionValue: 2,
              },
              breadcrumb: [
                {
                  title: 'list-group-user',
                  to: { name: 'user-group-list' },
                },
                {
                  title: 'common.add',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-groups-add',
            component: () => import('@/pages/admin/organization/user-groups/edit/EditUserGroup.vue'),
          },
          {
            path: 'edit/:id',
            meta: {
              requireAuth: {
                permissionKey: 'UserGroupManaging',
                permissionValue: 4,
              },
              breadcrumb: [
                {
                  title: 'list-group-user',
                  to: { name: 'user-group-list' },
                },
                {
                  title: 'QuestionService.ActionEdit',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-groups-edit',
            component: () => import('@/pages/admin/organization/user-groups/edit/EditUserGroup.vue'),
          },
          {
            path: 'import-file',
            meta: {
              requireAuth: {
                permissionKey: 'UserGroupManaging',
                permissionValue: 2,
              },
              breadcrumb: [
                {
                  title: 'list-group-user',
                  to: { name: 'user-group-list' },
                },
                {
                  title: 'title-import-file',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-groups-import',
            component: () => import('@/pages/admin/organization/user-groups/import-file/ImportFileAddGroup.vue'),
          },
          {
            path: 'add-user/import-file',
            meta: {
              requireAuth: {
                permissionKey: 'UserGroupManaging',
                permissionValue: 4,
              },
              breadcrumb: [
                {
                  title: 'list-group-user',
                  to: { name: 'user-group-list' },
                },
                {
                  title: 'title-import-file',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-groups-import-user',
            component: () => import('@/pages/admin/organization/user-groups/import-file/ImportFileAddUserToGroup.vue'),
          },
        ],
        component: () => import('@/pages/admin/organization/user-groups/Index.vue'),
      },
      {
        path: 'org-struct',
        name: 'organizational-structure-list',
        redirect: { name: 'admin-organization-org-struct-list' },
        meta: {
          requireAuth: {
            permissionKey: 'OrganizationalStructureManaging',
            permissionValue: 1,
          },
        },
        children: [
          {
            path: '',
            name: 'admin-organization-org-struct-list',
            component: () => import('@/pages/admin/organization/org-struct/OrgStruct.vue'),
          },
          {
            path: 'org-struct/:tab/add',
            name: 'admin-organization-org-struct-add',
            component: () => import('@/pages/admin/organization/org-struct/edit/EditOrgStruct.vue'),
          },
          {
            path: 'org-struct/:tab/add/:parentId',
            name: 'admin-organization-org-struct-add-parent',
            component: () => import('@/pages/admin/organization/org-struct/edit/EditOrgStruct.vue'),
          },
          {
            path: 'org-struct/:tab/edit/:id',
            name: 'admin-organization-org-struct-edit',
            component: () => import('@/pages/admin/organization/org-struct/edit/EditOrgStruct.vue'),
          },

          /** import */
          {
            path: 'import-file',
            meta: {
              requireAuth: {
                permissionKey: 'OrganizationalStructureManaging',
                permissionValue: 1,
              },
              breadcrumb: [
                {
                  title: 'org-struct',
                  to: { name: 'admin-organization-org-struct' },
                },
                {
                  title: 'import-file-org',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-org-struct-import-file',
            component: () => import('@/pages/admin/organization/org-struct/import/ImportOrgStructFromFile.vue'),
          },
        ],
        component: () => import('@/pages/admin/organization/org-struct/Index.vue'),
      },
      {
        path: 'position-title',
        name: 'user-title',
        component: () => import('@/pages/admin/organization/position-title/PositionTitle.vue'),
      },
      {
        path: 'branch-list',
        name: 'branch-list',
      },
      {
        path: 'capacity',
        name: 'proficiency-management',
        component: () => import('@/pages/admin/organization/capacity/Capacity.vue'),
        redirect: { name: 'admin-organization-capacity-tab', params: { tab: 'group-capacity' } },
        children: [
          {
            path: ':tab',
            name: 'admin-organization-capacity-tab',
            component: () => import('@/pages/admin/organization/capacity/Capacity.vue'),
          },
        ],
      },

    ],
  },

]
