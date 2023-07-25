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
  Titles: '/title/get-combobox',
  Owner: '/user/get-list-user',
  CategoryTitleCombobox: '/categorytitle/get-combobox', // danh mục chức danh
  proficiencylevelCombobox: '/proficiencylevel/get-combobox', // danh mục chức danh
  GetComboboxCourse: '/course/get-combobox-course', // Danh sách khóa học
  GetComboboxCostType: '/costtype/get-combobox', // Danh sách loại chi phí
  GetComboboxExam: '/exam/get-combobox-exam', // Danh sách kỳ thi
  GetComboboxTopic: '/Topic/get-information-topic', // danh sách chủ đề
  GetComboboxFormStudy: '/course/get-combobox-form-of-study', // danh sách hình thức học
  GetComboboxStatusCourse: '/course/get-combobox-course-status', // danh sách trại thái khóa học
  GetComboboxCourseApprove: '/User/get-combobox-course-approver', // danh sách trại thái khóa học
  GetSchoolType: '/school/get-combobox-school-types',
  GetAuthCourse: '/course/combobox-author-active-course', // danh sách người tạo
  GetCosttype: '/costtype/get-combobox', // danh sách loại chi phí
  GetComboboxEventType: '/event/get-event-type-combobox', //
  GetComboboxStatusExam: '/exam/combobox-status',
  GetComboboxAuthor: '/exam/combobox-author',
  GetComboboxContentType: '/contentarchivetype/get-combobox',
  GetComboboxAuthorContent: '/contentArchive/get-author',
  GetComboboxCertificate: '/CertificationTemplate/get-combobox',
  GetComboboxRatingScale: '/ratingscale/combobox-rating-scale',
  GetComboboxContentOffline: '/Course/get-combobox-content-offline',
}

export default ComboboxService
