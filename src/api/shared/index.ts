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

  /** Delete */
  DeleteTopic: '/topic/delete',

  /** Put */
  /** Update */
}

export default SharedService
