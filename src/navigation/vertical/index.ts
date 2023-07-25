import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Quản lý tổ chức',
    icon: { icon: 'tabler-file' },
    children: [
      { title: 'Phân quyền người dùng', to: { name: 'user-type-list' } },
      { title: 'Người dùng', to: { name: 'user' } },
      { title: 'Nhóm người dùng', to: { name: 'user-group-list' } },
      { title: 'Cơ cấu tổ chức', to: { name: 'organizational-structure-list' } },
      { title: 'Vị trí chức danh', to: { name: 'user-title' } },

      {
        title: 'Năng lực',
        to: {
          name: 'proficiency-management',

          // params: {
          //   activeTab: 'group-capacity',
          // },
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
      { title: 'Lịch đào tạo', to: { name: 'admin-calendar' } },
    ],
  },
  {
    title: 'Tổ chức đào tạo',
    icon: { icon: 'tabler-file' },
    children: [
      { title: 'Quản lý khóa học', to: { name: 'course-list' } },
      { title: 'Quản lý kỳ thi', to: { name: 'list-exam' } },
    ],
  },
] as VerticalNavItems
