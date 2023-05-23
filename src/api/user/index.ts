const UserService = {

  // dowload file sample
  GenerateExcelTemplateCreateUsers: 'user/generate-excel-template-create-users',
  GetTemplateExcelUpdateEmailUser: '/User/get-template-excel-update-email-user',
  GetTemplateExcelUpdateKpiUser: '/User/get-template-excel-update-kpi',
  GetTemplateExcelUpdateProficiencyUser: '/Proficiency/generate-excel-template-proficiency',
  DownloadFileSampleUser: 'user/excel-template-change-info',
  downloadSampleFileUpdateTitle: '/User/excel-template-change-title',
  downloadSampleFileAddUser: '/user/generate-excel-template-create-users',

  // import file
  UpdateInforUserExcel: '/User/update-email-excel',
  UpdateKpiUserExcel: '/User/update-kpi-excel',
  UpdateProficiencyUserExcel: '/Title/import-excel-create-proficiency',
  UpdateFileUserInfor: '/user/import-excel-change-info',
  updateTitleFromFile: '/User/import-excel-change-title',
  AddUserFromFile: '/user/import-user-from-json',

  // export file
  exportUserToExcel: 'user/export-excel-users',

  /// user type
  RoleFeaturePermission: '/usertype/get-feature-permission-by-portal',

  /** GET */
  GetListIdStructureUser: '/user/get-list-id-from-structure-by-user',
  GetOrganizationalStructure: '/organizationalstructure/get-all',
  GetListCustomerRequest: '/Customer/get-list',
  GetRegisterConfig: '/RegistryConfiguration/get',
  GetOrgById: '/organizationalstructure/get-by-id',
  getPagingUserByList: 'user/get-info-user-by-ids',
  getPagingUserOrgByList: 'organizationalstructure/get-list-user',
  getTitleById: 'title/get-by-id',
  getProficiencyData: 'proficiency/get-all',
  GetUserExclude: '/user/get-list-user-id-by-structure',

  /** POST */
  PostApproveCustomer: 'Customer/approve',
  PostOrgCreate: 'organizationalstructure/create',
  PostOrgUpdate: 'organizationalstructure/update',
  PostPeopleRolevalue: '/user/get-paging-people-by-rolevalue',
  PostAddUserOrg: '/organizationalstructure/add-user',
  PostUpdateUserOrg: '/organizationalstructure/update-user',
  PostDeleteUserOrg: '/organizationalstructure/delete-user',

  /** Put */
  PutReturnCustomer: 'Customer/deny',

  /** delete */
  deleteCustomer: '/Customer/delete', // Xóa người dùng
  DeleteOrgStruct: '/organizationalstructure/delete-change-orstrucnew',
  DeleteTitleOrgStruct: '/title/delete-listIds',

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
  PostCreateTitle: 'title/create',
  PostUpdateTitle: 'title/update',
}

export default UserService
