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
