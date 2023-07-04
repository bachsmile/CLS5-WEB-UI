import jwt_decode from 'jwt-decode'
import { ActionType } from '@/constant/data/actionType.json'
import { typeFile } from '@/constant/data/typeFile.json'
import { StatusTypeUser } from '@/constant/data/status.json'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import UserService from '@/api/user/index'
import ServerFileService from '@/api/server-file/index'
import axios from '@axios'

import type { Any } from '@/typescript/interface'

const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
type CallbackFunction = (key: string) => any

export default class MethodsUtil {
  static getListInforUser = (listId: number, params?: Any) => {
    const payload = {
      userIds: [],
      pageSize: 1,
      pageNumber: 1,
      ...params,
    }
    const { data } = MethodsUtil.requestApiCustom(UserService.GetListInforUser, TYPE_REQUEST.GET, payload)
    return data
  }

  /**
   * @name: chuyển đổi rem qua pixel
   * @param rem
   * @return {Number}
   */
  static convertRemToPixels = (rem: number) => (
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
  )

  /**
   * @name: get message error
   * @param str
   * @return {string}
   */
  static getErrorsMessage = (errors: Array<any>) => {
    let str = ''
    errors.forEach(element => {
      // str += `${i18n.t(element.message, element.params)}`
      str += '. '
    })

    return str
  }

  /**
   * @name: Download file
   * @param {string} url => Đường dẫn api
   * @param {string} method => Phương thức 'POST', 'GET'
   * @param {string} nameFile =>  Tên file muốn lưu
   * @param {any} payload =>  Dữ liệu đính kèm api
   * @return {string}
   */
  static dowloadSampleFile = async (url: string, method: string, nameFile: string, payload?: any) => {
    const model = {
      language: localStorage.getItem('lang') === null ? 'vi' : localStorage.getItem('lang'),
    }

    const data = method === 'GET' ? model : !window._.isEmpty(payload) ? payload : model
    const params = method === 'GET' ? payload : null

    return axios({
      url,
      method,
      responseType: 'blob',
      data,
      params,
    })
      .then((response: any) => {
        const fileURL = window.URL.createObjectURL(new Blob([response]))
        const fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute('download', nameFile)
        document.body.appendChild(fileLink)
        fileLink.click()

        // Remove the link element from the document body and revoke the blob URL
        document.body.removeChild(fileLink)
        window.URL.revokeObjectURL(fileURL)
      })
  }

  /**
   * @name: Request API
   * @param {string} url => Đường dẫn api
   * @param {string} method => Phương thức 'POST', 'GET'
   * @param {any} payload =>  Dữ liệu đính kèm api
   * @return {object}
   */
  static requestApiCustom = (url = '', method = 'GET', payload?: any) => {
    if (url === undefined)
      return
    const data = (method === 'GET') ? null : (payload || null)
    const params = (method === 'GET') ? payload : null

    return window.axios({
      url,
      method,
      data,
      params,
    })
  }

  static checlActionKey = (itemRow: any, data?: any) => {
    const action = ActionType?.find((item: any) => item?.id === itemRow?.id)

    return data ? [action || itemRow, data] : [action || itemRow]
  }

  static checkActionType = (data: any, callback?: CallbackFunction) => {
    const dataFormat = {
      ...data,
      action: callback,
    }

    const action = ActionType.find(item => item.id === data?.id)

    dataFormat.icon = action?.icon
    dataFormat.color = action?.color
    dataFormat.name = action?.name

    return dataFormat
  }

  static checkColorCustim = (key: string) => {
    switch (key) {
      case 'error':
        return 'rgb(var(--v-error-600))'
      case 'primary':
        return 'rgb(var(--v-primary-600))'
      case 'infor':
        return 'rgb(var(--v-gray-600))'
      case 'success':
        return 'rgb(var(--v-success-600))'
      case 'warrning':
        return 'rgb(var(--v-warrning-600))'

      default:
        return 'rgb(var(--v-gray-300))'
    }
  }

  static checkStatusTypeUser = (key: number | string) => {
    if (typeof key === 'number')
      return StatusTypeUser.find((item: any) => item.id === key)

    return StatusTypeUser.find((item: any) => item.name === key)
  }

  static checkStatus = (key: number | string, data: any) => {
    if (typeof key === 'number')
      return data.find((item: any) => item.id === key)

    return data.find((item: any) => item.name === key)
  }

  static checkType = (key: number | string, data: any, customkey = 'id') => {
    return data.find((item: any) => item[customkey] === key)
  }

  static formatFullName = (firstName: string, lastName: string) => {
    const lang = localStorage.getItem('lang') === null ? 'vi' : localStorage.getItem('lang')
    switch (lang) {
      case 'vi':
        return `${lastName || '-'} ${firstName || '-'}`
      case 'en':
        return `${firstName || '-'} ${lastName || '-'}`
      default:
        return `${lastName || '-'} ${firstName || '-'}`
    }
  }

  // Tìm kiếm thông tin người dùng trong phạm vi danh sách id
  static searchUserInfoByIds = async (userIds: any, searchKey = null,
    prosForSearch = null, pageSize = null, pageNumber: any = null,
    orStructure = [], groupUser = [], categoryTitleId = [], titles = []) => {
    if (userIds?.length > 0) {
      const distinctUserIds = [...new Set(userIds)] // Lấy giá trị distict value
      const params = {
        userIds: distinctUserIds,
        searchKey,
        prosForSearch,
        orStructure,
        groupUser,
        categoryTitleId,
        titles,
        pageSize,
        pageNumber,
      }
      params.pageSize = pageSize === null ? userIds.length : pageSize
      params.pageNumber = pageNumber === null ? 1 : pageNumber
      const res = await MethodsUtil.requestApiCustom(ApiUser.GetListInforUser, TYPE_REQUEST.GET, params).then((value: any) => value)
      return res.data
    }
    return { pageLists: [], totalRecord: 0 }
  }

  static getAllChildrenOfTreeNodeIds = (node: any, nodes: any) => {
    let listIds: any = []
    node.children.forEach((item: any) => {
      listIds.push(Number(item.split('-')?.[1]))
      if (nodes[item]?.children?.length) {
        const children = MethodsUtil.getAllChildrenOfTreeNodeIds(nodes[item], nodes)
        listIds = listIds.concat(children)
      }
    })

    return listIds
  }

  static createRandomId = (length: any) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i += 1)
      result += characters.charAt(Math.floor(Math.random() * charactersLength))

    return `randomId-${result}`
  }

  // // kiểm tra quyền trên view
  static checkPermission = (permission: any, key: any, value: any) => {
    if (permission === null) {
      const token = window.localStorage.getItem('accessToken')
      if (!token)
        return false
      permission = jwt_decode(token)
    }
    const propertyValue = permission[key]
    if (!propertyValue)
      return false
    const valueNumber = parseInt(propertyValue, 10)

    return valueNumber && (valueNumber & value) === value
  }

  // lấy thuộc tính theo danh sách
  static getPropertyByArray = (data: any, property: any) => {
    const properties: any = []
    data?.forEach((element: any) => {
      if (element[property] && !properties.includes(element[property]))
        properties.push(element[property])
    })
    return properties
  }

  // Lấy danh sách thông tin người dùng từ danh sách id
  // Tham số đầu vào là danh sách các id
  static getUserInfoByIds = async (userIds: any) => {
    return await this.searchUserInfoByIds(userIds)
  }

  static async uploadFile(model: any) {
    const formData = new FormData()
    formData.append('IsSecure', model.isSecure)
    formData.append('files', model.files)
    if (model.IsBackground)
      formData.append('IsBackground ', model.IsBackground)
    if (model.fileType)
      formData.append('FileType', model.fileType)
    const userData = JSON.parse(localStorage.getItem('userData') || '')
    if (userData)
      formData.append('UserId', userData.id)
    try {
      return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.UploadFile}`, TYPE_REQUEST.POST, formData)
    }
    catch (err: any) {
      return err?.response?.data
    }
  }

  static formatCapacity(val: any) {
    if (val < 1024)
      return `${val} Byte`

    if (val < 1024 ** 2)
      return `${Math.round((val / 1024) * 100) / 100} KB`

    if (val < 1024 ** 3)
      return `${Math.round((val / 1024 ** 2) * 100) / 100} MB`

    return `${Math.round((val / 1024 ** 3) * 100) / 100} GB`
  }

  static checkTypeFile(type: string) {
    return (typeFile as any)[type ?? 'default']
  }

  static getTypeContent(value: number) {
    switch (value) {
      case 1:
        return 'text-content'
      case 2:
        return 'web-content'
      case 3:
        return 'online-content'
      case 4:
        return 'video-content'
      case 5:
        return 'audio-content'
      case 6:
        return 'document-content'
      case 7:
        return 'scorm-content'
      case 8:
        return 'flash-content'
      case 9:
        return 'iframe-content'
      case 10:
        return 'test-content'
      case 11:
        return 'survey-content'
      case 12:
        return 'essay-content'
      case 16:
        return 'offline-content'
      default:
        return 'text-content'
    }
  }
}
