const ExamService = {
  /** Get */
  GetThematicList: '/examtest/get-paging',
  GetThematicById: '/examtest/get-by-id',
  GetShiftById: '/examtest/get-by-id-shift',
  GetPeopleInShiftById: '/examTest/get-paging-people-in-shift',
  GetNumberPeopleInShiftAuto: '/examtest/get-number-user-shift-auto',
  GetListTestCodeShift: '/examtest/get-paging-list-test-code-shift',

  /** Post */
  PostCreateThematic: '/examtest/create',
  PostUpdateThematic: '/examtest/update',
  PostDeletePeople: '/examtest/delete-people',
  PostCreatePeople: '/examtest/create-people',
  PostPaggingShift: '/examtest/get-pagging-shift',
  PostCreateShift: '/examtest/create-shift',
  PostDeleteUserShift: '/examtest/delete-user-shift',
  PostDeleteSupervisorShift: '/examtest/delete-supervios-shift',
  PostSaveUserShiftAuto: '/examtest/save-user-shift-auto',
  PostSaveUserShift: '/examtest/save-user-shift',
  PostSaveSupervisorShift: '/examtest/save-supervisor-shift',
  PostPagingTestCodeShift: '/examtest/get-paging-test-code-shift',
  PostDelTestCodeShift: '/examtest/delete-test-code-shift',
  PostSaveTestCodeShift: '/examtest/save-test-code-shift',

  /** Delete */

  /** Put */

  /** Update */
  /** patch */

}

export default ExamService
