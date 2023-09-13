import type { Any } from '.'

// interface
export interface DowloadSample {
  urlFileDefault: string
  method: string
  paramsDowload?: Any
  nameFile?: string
}
export interface ImportFile {
  paramsImport?: object
  urlFileDefault: string
  method: string
  dataColumnExcel(rowData: Array<any>): object
}
export interface tableImport {
  header: Array<any>
}
export interface Config {
  customId?: string
  cusomKeyError?: string
  customKeyMesError?: string
  routerBack?: string
  table: tableImport
  dowloadSample?: DowloadSample
  importFile?: ImportFile
}

export interface Action {
  title: string
  icon?: string
  key?: string | number
}
