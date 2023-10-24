import type { typeCardImageEnum, typeStatusToast } from '@/typescript/enums/enums'

export interface globaleInterface {
  isRender: boolean
  _: _.LoDashStatic
  changeValue(key: any, value: any): void
}

export interface infMsgTimeLine {
  from: string
  message: string
  time: string
  color: string
}
export interface Content {
  content: string | null
  contentArchiveTypeId: number | null
  courseContentId: number | null
  courseContentName: string | null
  endDate: string | null
  id: number | null
  isAfterTime: boolean
  isAnswerTheQuestion: boolean
  isComplete: boolean
  isRewind: boolean
  minuteOfLearn: number | null
  noticeTimeAttendance: number
  startDate: string | null
  statusName: string | null
  statusId: number | null
  timeLearned: number | null
  urlFile: string | null
  essayContent: string | null
  urlFileEssay: string | null
  completeRatio: number | null
  urlFileName: string | null
  acceptDownload: boolean
  time: number | null
  isSpeed: boolean | null
  comment: string | null
}
export interface Survey {
  answers: any
  color: string | null
  content: string | null
  questionTypeName: string | null
  titleRating: string | null
  urlMedia: string | null
  courseContentQuestionId: number | null
  isGroup: boolean
  isMark: boolean
  isObligatory: boolean
  isPoint: boolean
  listAnswerMatrix: any
  surveyCategoryRatings: any
  surveyLevelRatings: any
  questionId: number | null
  surveyTestCodeQuestionId: number | null
  questionTypeId: number | null
  reactionId: number | null

}

export interface infTimeLine {
  isShow: boolean
  msgTimeLine: infMsgTimeLine[]
}

export interface infImageCard {
  type: typeCardImageEnum
  src: string
}
export interface Tab {
  key: string
  title?: string
  icon?: string
  component?: any // truyền thẳng component vào nếu dùng composition api, còn không thì truyền string tên component
  dataTab?: any // Dữ liệu riêng của từng tab
  isDisabled?: boolean
  isRendered?: boolean
}

export type typeToast = typeof typeStatusToast[number]

export interface Any {
  [e: string]: any
}
