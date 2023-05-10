const UserService = {

  // dowload file sample
  GenerateExcelTemplateCreateUsers: 'user/generate-excel-template-create-users',
  GetTemplateExcelUpdateEmailUser: '/User/get-template-excel-update-email-user',
  GetTemplateExcelUpdateKpiUser: '/User/get-template-excel-update-kpi',
  GetTemplateExcelUpdateProficiencyUser: '/Proficiency/generate-excel-template-proficiency',
  DownloadFileSampleUser: 'user/excel-template-change-info',
  downloadSampleFileUpdateTitle: '/User/excel-template-change-title',

  // import file
  UpdateInforUserExcel: '/User/update-email-excel',
  UpdateKpiUserExcel: '/User/update-kpi-excel',
  UpdateProficiencyUserExcel: '/Title/import-excel-create-proficiency',
  UpdateFileUserInfor: '/user/import-excel-change-info',
  updateTitleFromFile: '/User/import-excel-change-title',

  // export file
  exportUserToExcel: 'user/export-excel-users',

  /// user type
  RoleFeaturePermission: '/usertype/get-feature-permission-by-portal',

  /** GET */
  GetListIdStructureUser: '/user/get-list-id-from-structure-by-user',
  GetOrganizationalStructure: '/organizationalstructure/get-all',

  UsersList: '/User/get-all-users-paging', // danh sách người dùng
  UsersDelete: '/user/delete', // Xóa người dùng
  ResetPassword: '/user/set-password', // Cập nhật mật khẩu
  ChangeStatus: '/user/change-status', // Cập nhật trạng thái
  GetListTitle: 'title/get-all-by-search', // GetListTitle
  GetProfileOrg: 'profile/get-list-organizational-structure', // GetProfileOrg
  UpdateTitleUser: '/organizationalstructure/update-title-user', // updateTitleUser
  fetchCreateUser: '/User/create', // fetchCreateUser
  fetchUpdateUser: '/user/update', // fetchUpdateUser
  getAutoCode: '/user/get-suggest-user-code', // getAutoCode
  fetchDetailUpdate: '/user/get-detail-update', // fetchDetailUpdate
  fetchNameSchools: '/school/get-combobox', // get name schools
  fetchDegrees: '/Degree/get-combobox', // get bằng cấp trình độ '
  fetchCountry: '/Address/get-countries', // get country
  fetchProvinces: '/Address/get-provinces', // get provinces
  fetchDistricts: '/Address/get-districts', // get districts
  fetchWards: '/Address/get-wards', // get districts
  GetPagingByUser: '/usergroup/get-paging-by-user', // GetPagingByUser
  DeleteGroupWithUser: '/usergroup/delete-group-with-user', // GetPagingByUser
  GetPagingUserGroup: '/usergroup/get-paging-user-group-by-list', // GetPagingUserGroup
  /** POST */
  PostAddGroupUser: 'usergroup/add-group-with-user',
}

export default UserService
