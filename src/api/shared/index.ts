const SharedService = {
  /** Get */
  GetInformationTopic: '/Topic/get-information-topic',
  GetDetailTopic: '/topic/get-by-id',
  GetListCostType: '/costtype/get-paging',
  GetDetailCostType: '/costtype/get-detail',
  GetListCost: '/cost/get-paging',
  GetDetailCost: '/cost/get-detail',
  GetListCostExam: '/cost/get-paging-cost',
  GetDetailCostExam: '/cost/get-detail-cost',
  GetRatingScale: '/ratingscale/get-by-rating-scale',
  GetListCertificationId: '/certificationtemplate/get-paging',
  GetListCertificationById: '/certificationtemplate/get-by-list-id',
  GetListNotification: '/NotificationConfig',

  /** Post */
  PostCreateTopic: '/topic/create',
  PostUpdateTopic: '/topic/update',
  PostExportExcelTopic: '/topic/export-excel-course-cost',
  PostCreateTypeCost: '/costtype/create',
  PostUpdateTypeCost: '/costtype/update',
  PostDeleteTypeCost: '/costtype/delete',
  PostUpdateCost: '/cost/update',
  PostDeleteCost: '/cost/delete',
  PostCreateCost: '/cost/create',
  PostCreateCostExam: '/cost/create-cost',
  PostUpdateCostExam: '/cost/update-cost',
  PostDeleteCostExam: '/cost/delete-cost',
  PostCreateRatingScale: '/ratingscale/create',
  PostUpdateRatingScale: '/ratingscale/update',
  PostCreateLevel: '/ratingscale/create-level',
  PostUpdateLevel: '/ratingscale/update-level',
  PostDeleteCertification: '/certificationtemplate/delete',

  /** Delete */
  DeleteTopic: '/topic/delete',
  DeleteRatingScale: '/ratingscale/delete',
  DeleteLevel: '/ratingscale/delete-level',

  /** Put */
  /** Update */

  PatchSetDefaultCertification: '/CertificationTemplate/set-default',
}

export default SharedService
