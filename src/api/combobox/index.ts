const ComboboxService = {
  /** Get */
  GroupProficiency: '/groupproficiency/get-combobox',
  ProficiencyLevel: '/proficiencylevel/get-paging',
  StatusUser: '/User/get-statuses', // trạng thái người dùng
  AllOrgStruct: '/organizationalstructure/get-all', // Cơ cấu tổ chức
  AllOrgTitle: '/OrganizationalStructure/get-all-org-title', // Cơ cấu tổ chức
  TypeUsers: '/usertype/get-all', // Cơ cấu tổ chức
  GroupUser: '/usergroup/get-combobox', // Nhóm người dùng
  Country: '/Address/get-countries', // Quốc gia
  Provinces: '/Address/get-provinces', // Tỉnh thành phố
  Districts: '/Address/get-districts', // Quận huyện
  Wards: '/Address/get-wards', // Quận huyện
  topicCourse: '/topic/get-combobox-topic-course',
  levels: '/Level/get-combobox',
}

export default ComboboxService
