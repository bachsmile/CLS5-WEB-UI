import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Quản lý tổ chức',
    icon: { icon: 'tabler-file' },
    children: [
      { title: 'Phân quyền người dùng', to: { name: 'admin-organization-permission' } },
      { title: 'Người dùng', to: { name: 'admin-organization-users' } },
      { title: 'Nhóm người dùng', to: { name: 'admin-organization-user-groups' } },
      { title: 'Cơ cấu tổ chức', to: { name: 'admin-organization-org-struct' } },
      { title: 'Vị trí chức danh', to: { name: 'admin-organization-position-title' } },

      {
        title: 'Năng lực',
        to: {
          name: 'admin-organization-capacity',
          params: {
            activeTab: 'group-capacity',
          },
        },
      },
    ],
  },
  {
    title: 'Quản lý nội dung',
    icon: { icon: 'tabler-file' },
    children: [
      { title: 'Ngân hàng câu hỏi', to: { name: 'admin-content' } },
    ],
  },
  {
    title: 'Quản lý đào tạo',
    icon: { icon: 'tabler-file' },
    children: [
      { title: 'Quản lý chủ đề', to: { name: 'topic-list' } },
      { title: 'Quản lý chi phí', to: { name: 'cost-list' } },
      { title: 'Quản lý học tập', to: { name: 'education' } },
    ],
  },
] as VerticalNavItems
