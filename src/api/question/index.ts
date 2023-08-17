const QuestionService = {
  /** Get */
  GetListExam: '/exam/get-paging',
  GetDetailExam: '/exam/get-update-exam-id',
  GetListQuestion: '/question/get-list-question-paging',
  GetComboboxQuestionLevel: 'questionlevel/get-combobox',
  GetComboboxQuestionType: 'question/get-combobox-question-type',
  GetListQuestionById: 'question/get-answer-from-question',
  GetListApprove: 'surveyExam/get-paging-agree-survey-exam',
  GetFeedBackRejectSurvey: 'surveyexam/get-feedback-survey-exam',
  GetDetailSurvey: '/surveyexam/get-by-id',
  GetListSurveyTopics: '/surveytest/get-paging-test-survey-exam',
  GetDetailSurveyTopic: '/surveytest/get-by-id',

  /** Post */
  PostDeleteExam: '/exam/delete',
  PostCreateExam: '/exam/create',
  PostUpdateExam: '/exam/update',
  PostCreateSurvey: '/surveyexam/create',
  PostAgreeSurvey: '/surveyexam/save-agree-exam',
  PostRejectSurvey: '/surveyexam/save-reject-survey-exam',
  PostSendApproveSurvey: '/surveyexam/send-agree-survey-exam',
  PostCreateSurveyTopic: '/surveytest/create',
  PostUpdateSurveyTopic: '/surveytest/update',
  PostGetListInfobyTest: 'ExamTest/get-info-by-test',

  /** Delete */
  DeleteSurveyTopic: '/surveytest/delete',

  /** Put */
  /** Update */

  /** apiv5 */
  GetDetailQuestion: (id: number) => `/questions/${id}`,
  GetListQuestionV5: '/questions',
  AddQuestion: '/questions',

}

export default QuestionService
