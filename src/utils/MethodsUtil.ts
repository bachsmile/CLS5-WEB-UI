import jwt_decode from 'jwt-decode'
import JSZip from 'jszip'
import type { Any } from '@/typescript/interface'
import { ActionType } from '@/constant/data/actionType.json'
import { typeFile } from '@/constant/data/typeFile.json'
import { StatusTypeUser } from '@/constant/data/status.json'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import UserService from '@/api/user/index'
import ServerFileService from '@/api/server-file/index'
import axios from '@axios'
import toast from '@/plugins/toast'
import {
  MediaType,
  audioExtention, audioTypes, excelFileExtention, imageFileExtention, imageTypes, otherFileExtention, videoExtention, videoTypes,
} from '@/constant/Globals'
import { configStore } from '@/stores/index'

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
  static getErrorsMessage(errorsMess: Array<any>, t: any) {
    let str = ''
    errorsMess.forEach(element => {
      str += `${t(element.message, element.params)}`
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
  static requestApiCustom = (url = '', method = 'GET', payload?: any, headers?: any) => {
    if (url === undefined)
      return
    const data = (method === 'GET') ? null : (payload || null)
    const params = (method === 'GET') ? payload : null
    return window.axios({
      url,
      method,
      data,
      params,
      headers,
    })
  }

  /**
   * @name: Request API
   * @param {string} url => Đường dẫn api
   * @param {string} method => Phương thức 'POST', 'GET'
   * @param {any} payload =>  Dữ liệu đính kèm api
   * @return {object}
   */
  static requestApiCustomV5 = (url = '', method = 'GET', payload?: any) => {
    if (url === undefined)
      return
    const data = (method === 'GET') ? null : (payload || null)
    const params = (method === 'GET') ? payload : null
    return window.axiosV5({
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

  static getRandomImage = (type = 0) => {
    const configControl = configStore()
    const { defaultThemeValue } = storeToRefs(configControl)
    const listExamImages: any = defaultThemeValue.value[type === 0 ? 'examImages' : 'items']

    return listExamImages[Math.floor(Math.random() * listExamImages.length)].value
  }

  static getThemeItem(type = 1) {
    const configControl = configStore()
    const { defaultThemeValue } = storeToRefs(configControl)
    return (key: any) => {
      const themeItemValue = defaultThemeValue.value?.items?.find(el => el.key === key)
      if (themeItemValue)
        return themeItemValue.value

      return ''
    }
  }

  static urlImageFile = (src: string) => {
    if (src)
      return src.startsWith('http') ? src : SERVERFILE + src

    return null
  }

  static getImage(id: number): string {
    const result = MethodsUtil.getThemeItem(1)(id)
    return typeof result === 'string' ? result : ''
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

  static async getDocLocalInfoFileDown(folder: any, getFileSize?: any) {
    return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET).then((data: any) => data)
  }

  static formatCurrency(value: number, toFixed = 3) {
    const currency = Math.floor(value * 10 ** toFixed) / 10 ** toFixed

    const formatter = new Intl.NumberFormat('en-US', {
      useGrouping: true,
    })

    return formatter.format(currency)
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

  static checkTypeFileUpload(type: string) {
    if (excelFileExtention.includes(type))
      return typeFile.excel
    return typeFile.default
  }

  static showErrorsYub(errors: any) {
    if (errors?.length)
      return errors[0] === 'this cannot be null' ? 'not-empty' : errors[0]
    return ''
  }

  static getFolder(str: string, type: number) {
    let strs
    if (type === 7) {
      strs = str.split('=')
      return strs[strs.length - 1]
    }
    strs = str.split('/')
    if (strs.length > 2)
      return strs[strs.length - 2]

    return str
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

  static registerState(listState: any, stateInit: any) {
    listState.forEach((item: any) => {
      const key = Object.keys(item)?.[0]

      stateInit.value[key] = window._.cloneDeep(item[key].value)
    })
  }

  static $reset(stateInit: any) {
    return (listState: any) => {
      if (!window._.isEmpty(listState)) {
        window._.forEach(listState, (value, key) => {
          listState[key] = window._.cloneDeep(stateInit.value[key])
        })
      }
    }
  }

  /*
      hàm ghi lại  file bằng blob
      fileURL blob sau khi được khởi tạo
      fileName tên file
      dirHandle hàm mở system file
      const dirHandle = await window.showDirectoryPicker()
      chỉ hỗ trợ IDE và chrome
    */
  static async writeFileDownload(fileURL: any, fileName: any, dirHandle: any) {
    try {
      const fileHandle = await dirHandle.getFileHandle(fileName, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.seek(fileURL)
      await writable.write(fileURL)
      await writable.close()
      return 200
    }
    catch (error) {
      return error
    }
  }

  // Nén nhiều file vào file zip bằng blob trả về
  static async exportBlobZipMulFile(model: any, document: any, window: any) {
    let status
    try {
      const zip = new JSZip()
      const folder = zip
      model.blobs?.forEach((item: any, index: any) => {
        folder.file(`${index + 1} ${model.fileNames[index]}`, item)
      })

      // document.getElementById('main-loading').style.display = 'block'

      zip.generateAsync({ type: 'blob' }).then(blob => {
        const fileURL = window.URL.createObjectURL(new Blob([blob]))

        // document.getElementById('main-loading').style.display = 'none'
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', model.zipName)
        document.body.appendChild(fileLink)
        fileLink.click()
        document.body.removeChild(fileLink)
        window.URL.revokeObjectURL(fileURL)
        status = 200
      }).catch(error => {
        // document.getElementById('main-loading').style.display = 'none'
        status = error
      })
      return status
    }
    catch (error) {
      return error
    }
  }

  // chuyển html thành text
  static converContentHtmlToText(html: string) {
    const content = document.createElement('div')
    content.innerHTML = html
    return content.textContent || content.innerText
  }

  // lấy ký tự
  static getIndex(index: number) {
    return `${String.fromCharCode(65 + index)}.`
  }

  // loại media
  static getMediaType = (fileExtention: any) => {
    if (videoTypes.includes(fileExtention))
      return MediaType.VIDEO
    if (audioTypes.includes(fileExtention))
      return MediaType.AUDIO
    if (imageTypes.includes(fileExtention))
      return MediaType.IMAGE
    if (otherFileExtention.includes(fileExtention))
      return MediaType.OTHER_FILE
    return MediaType.NONE
  }

  // loại media
  static getMediaTypeExtention = (typeMedia: any) => {
    switch (typeMedia) {
      case 1:
        return imageFileExtention
      case 2:
        return audioExtention
      case 3:
        return videoExtention
      default:
        return otherFileExtention
    }
  }

  // lấy id youtube
  static getYoutubeId(url: string) {
    let videoId = url.split('v=')[1]
    const ampersandPosition = videoId.indexOf('&')
    if (ampersandPosition !== -1)
      videoId = videoId.substring(0, ampersandPosition)

    return videoId
  }

  // thông báo theo status response api
  static notificationApiStatus(status: any, t: any, error?: any) {
    switch (status) {
      case 201:
        toast('SUCCESS', t('USR_AddSuccess'))
        break
      case 204:

        toast('SUCCESS', t('USR_UpdateSuccess'))
        break

      default:
        break
    }
  }
}
