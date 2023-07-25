const QuestionService = {
  /** Get */
  GetListExam: '/exam/get-paging',
  GetDetailExam: '/exam/get-update-exam-id',
  GetListQuestion: '/question/get-list-question-paging',
  GetComboboxQuestionLevel: 'questionlevel/get-combobox',
  GetComboboxQuestionType: 'question/get-combobox-question-type',
  GetListQuestionById: 'question/get-answer-from-question',

  /** Post */
  PostDeleteExam: '/exam/delete',
  PostCreateExam: '/exam/create',
  PostUpdateExam: '/exam/update',

  /** Delete */
  /** Put */
  /** Update */
}

export default QuestionService
