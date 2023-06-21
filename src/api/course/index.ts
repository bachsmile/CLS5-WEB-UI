const CourseService = {
  /** Get */
  GetCourseOrgStruct: '/course/get-by-organizational-structures',
  GetListCourseAdd: '/course/get-paging-services',
  GetCourseExclude: '/course/get-list-course-by-structure',
  GetCourseList: '/Course/get-list',
  GetCheckApprove: '/Course/check-valid-to-approve',
  GetCourseSetting: '/coursecontent/get-require-point',
  GetPagingAgreeCourse: '/course/get-paging-agree-course',
  GetFeedBackCourse: '/course/get-feedback-course', // lấy phản hồi khóa học
  GetDetailCourseById: '/course/get-detail-information', // lấy phản hồi khóa học
  GetAuthorCourseById: '/course/get-authors', // lấy phản hồi khóa học
  GetRequiredProficiencies: '/course/get-required-proficiencies', // lấy danh sách năng lực theo yêu cầu
  GetRequiredCourse: '/course/get-required-courses', // lấy danh sách khóa học theo yêu cầu
  GetRequiredFinishCourse: '/course/get-required-finish', // lấy điều kiện hoàn thành
  GetSurveyEvaluation: '/CourseSurveyEvaluation/get-all', // lấy danh sách đánh giá
  GetSemester: '/Semester/get-list', // lấy danh sách kỳ học
  GetOrganizationalStructure: '/organizationalstructure/get-all', // lấy danh sách cctc
  GetListOrganizationalStructure: '/courseuser/get-list-organizational-structure', // lấy danh sách cctc
  GetListUserRegCourse: '/courseuser/get-info-user-register-from-list-user-register', // lấy danh sách học viên đăng ký
  GetExportExcelUserRegCourse: '/CourseUser/export-excel-register', // Xuất excel người đăng ký khóa học
  GetListContentCourse: '/contentarchive/get-by-course', // Xuất excel người đăng ký khóa học
  GetFeadback: '/coursecontent/get-feedback-course-content', // Xuất excel người đăng ký khóa học
  GetListReferContent: '/coursecontent/get-list-reference-content', // Lấy danh sách nội dung tham khảo
  GetListThematicContent: '/course/get-list-themetic-by-course', // Lấy danh sách nội dung tham khảo
  GetInforContentById: '/coursecontent/get-by-id', // Lấy danh sách nội dung tham khảo

  /** Post */
  PostAddCourseOrg: '/course/add-course-to-organizational-structures',
  PostDeleteCourseOrg: '/course/delete-course-without-organizational-structures',
  PostUpdatePointCourse: '/coursecontent/save-require-point',
  PostDeleteCourse: '/course/delete',
  PostApproveCourse: '/course/save-agree-course', // duyệt khóa học
  PostSendApproveCourse: '/course/send-agree-course', // Gửi duyệt khóa học
  PostApproveContentCourse: '/coursecontent/agree-course-content', // duyệt nội dung khóa học
  PostSendRejectCourse: '/course/reject-course', // Từ chối khóa học
  PostSendRejectContentCourse: '/coursecontent/reject-course-content', // trả lại nội dung khóa học
  PostAddInforCourse: '/course/add-course-information', // Thêm khóa học
  PostUpdateInforCourse: '/course/update-course-information', // Cập nhật khóa học
  PostUpdateSettingCourse: '/course/update-setting', // Thêm khóa học
  PostDeleteRequiredProficiencies: '/course/delete-required-proficiency', // Xóa năng lực theo yêu cầu
  PostAddProficiencies: '/course/add-required-proficiency', // Xóa năng lực theo yêu cầu
  PostDeleteCourseRequired: '/course/delete-required-course', // Xóa năng lực theo yêu cầu
  PostAddCourseRequired: '/course/add-required-course', // Thêm khóa học theo yêu cầu
  PostUpdateFinishRequired: '/course/update-required-finish', // Thêm điều kiện hoàn thành
  PostDeleteSemester: '/Semester/delete', // xóa kỳ học
  PostCreateSemester: '/Semester/create', // tạo kỳ học
  PostDeleteSurveyEval: '/CourseSurveyEvaluation/delete', // Xóa kỳ khảo sát trong khóa học đánh giá sau đào tạo
  PostCourseSurveyEvaluation: '/CourseSurveyEvaluation/create', // thêm khảo sát vào đánh giá kỳ thi
  PostListInfoByCourse: '/CourseUser/get-info-by-course', // Danh sách người dùng thêm vào trong khóa học
  PostAddUserCourse: '/courseuser/add-user', // Thêm người dùng thêm vào trong khóa học
  PostListUserCourse: '/CourseUser/get-info-user-add-course', // Danh sách người dùng thêm vào trong khóa học
  PostOrgCourse: '/courseuser/add-organizational-structure', // Danh sách người dùng từ cctc thêm vào trong khóa học
  PostContactUser: '/courseuser/contact-register-user', // đăng ký liên hệ người dùng khóa học
  PostRejectUser: '/courseuser/reject-register-user', // Từ chối người dùng đăng ký khóa học
  PostApproveUser: '/courseuser/agree-register-user', // Duyệt người dùng đăng ký khóa học
  PostAcceptRecall: '/coursecontent/accept-recall-request-course-content', // Cho phép thu hồi
  PostRequestRecall: '/coursecontent/recall-request-course-content', // yêu cầu thu hồi
  PostDeleteContent: '/coursecontent/delete', // xóa nội dung
  PostPositionContent: '/coursecontent/save-position-course-content', // cập nhật vị trí nội dung
  PostDeleteUserGroup: '/course/delete-user-from-groupser', // cập nhật vị trí nội dung
  PostListApproveContent: '/coursecontent/get-paging-agree-course-content', // Danh sách nội dung gửi duỵet
  PostSendApproveContent: '/coursecontent/send-agree-course-content', // Danh sách nội dung gửi duỵet
  PostCoppyCourse: '/course/copy-course', // Sao chép khóa học
  PostUpdateRefer: '/contentarchive/update', // Lưu nội dung tham khảo
  PostAddRefer: '/contentarchive/create', // Lưu nội dung tham khảo
  PostDeleteRefer: '/coursecontent/delete-reference-content', // Xóa nội dung tham khảo
  PostListReferStock: '/coursecontent/get-reference-content', // Danh sách nội dung tham khảo trong kho nội dung
  PostSaveRefContent: '/coursecontent/save-reference-content', // Danh sách nội dung tham khảo trong kho nội dung
  PostMoveThemetic: '/coursecontent/move-themetic', // Cập nhật chuyên đề cho nội dung
  PostListStockContent: '/contentarchive/get-paging', // Lấy dánh sách kho nội dung
  PostAddLContentStock: '/coursecontent/save-archive-to-course-content', // Thêm dánh sách kho nội dung

  /** Delete */
  DeleteUserReg: 'courseuser/delete-register',

  /** Put */
  PutAddToContentBank: '/CourseContent/covert-to-content-archive',

  /** Update */
  /** patch */
  PatchAddAprover: '/Course/add-approver',
}

export default CourseService
