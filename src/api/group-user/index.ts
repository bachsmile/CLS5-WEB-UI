const GroupUserService = {
  /** Get */
  ListGroup: '/usergroup/get-all-paging',
  AddGroup: '/usergroup/create',
  DetailGroup: '/usergroup/get-by-id',
  UpdateGroup: '',
  DeleteGroup: '/usergroup/delete-list',
  ImportFileGroup: '/usergroup/import-group-user-from-json',
  DownloadFileSampleGroup: '/usergroup/generate-excel-template-group-users',
  DownloadFileSampleAddUser: '/UserGroup/generate-template-excel-add-list-user',
  ImportAddUserToGroup: '/UserGroup/import-list-user-from-excel',

  // người dùng
  ListUser: '/usergroup/get-list-user',
  ListUserAdd: '/user/get-list-user',
  DeleteUser: '/usergroup/delete-user',
  GroupUserCombobox: '/usergroup/get-combobox',
  CategoryTitleCombobox: '/categorytitle/get-combobox',
  TitleCombobox: '/Title/get-list-distinct',
  AddUserGroup: '/usergroup/add-user',
  MoveUser: '/UserGroup/move-group',
  UserExclude: '/user/get-list-user-id-by-structure',

  // Khóa học
  ListCourse: '/course/get-by-group-user',
  ListCourseAdd: '/course/get-paging-services',
  AddCourse: '/course/add-course-to-group-user',
  TopicCourse: '/topic/get-combobox-topic-course',
  CourseExclude: '/course/get-list-course-by-structure',
  DeleteCourse: '/course/delete-course-without-group-user',
}

export default GroupUserService
