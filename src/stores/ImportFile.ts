import { defineStore } from 'pinia'
import readXlsxFile from 'read-excel-file'
import type { Config } from '@/typescript/interface/import'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'
import ObjectUtil from '@/utils/ObjectUtil'

export const useImportFileStore = defineStore('importFile', () => {
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const type = ref<number | string | undefined>(2)
  const config = reactive<Config>({ table: { header: [] } })

  const paramsImport = reactive({
    validData: <any>[],
    invalidData: <any>[],
  })
  const $reset = () => {
    paramsImport.validData = []
    paramsImport.invalidData = []
    type.value = undefined
  }
  const customKeyError = ref<string>('errors')
  const refTableValid = ref()

  /** method */
  const checkDataError = (data: any) => {
    if (data && data.length > 0) {
      data.forEach((item: any) => {
        if (item.isSuccess === false) {
          console.log(item[customKeyError.value])

          if (item[customKeyError.value]) {
            item.messageErr = ''
            item[customKeyError.value].forEach((err: any) => {
              item.messageErr += `${t(err.location)} ${t(`${err.message}`)} <br> `
            })
          }
        }
        else {
          item.isSelected = true
        }
      })
    }
  }

  const getValidData = async (listData: Array<object>, paramExtend?: object) => {
    const model = {
      listLocal: [],
      listExcel: listData,
      isSave: false,
      isValidate: true,
      type: type.value,
      ...paramExtend,
    }
    paramsImport.validData = []
    paramsImport.invalidData = []
    await MethodsUtil.requestApiCustom(config.importFile?.urlFileDefault, config.importFile?.method, model).then((value: any) => {
      checkDataError(value.data)
      const validData = value.data.filter((item: any) => item.isSuccess === true)
      if (validData) {
        validData.forEach((element: never, id: number) => {
          (element as any).key = id
        })
        paramsImport.validData = validData
      }
      const inValidData = value.data.filter((item: any) => item.isSuccess === false)
      if (inValidData) {
        inValidData.forEach((element: never, id: number) => {
          (element as any).key = id
        })
        paramsImport.invalidData = inValidData
      }
      nextTick(() => {
        if (refTableValid.value?.items.length)
          refTableValid.value.checkedAll()
      })
    })

    // showaddComponent = validData.length > 0
  }

  const checkInvalidData = async () => {
    const model = {
      listLocal: paramsImport.validData,
      listExcel: paramsImport.invalidData,
      isSave: false,
      isValidate: true,
      type: type.value,
      ...config?.importFile?.paramsImport,
    }
    paramsImport.validData = []
    paramsImport.invalidData = []
    await MethodsUtil.requestApiCustom(config.importFile?.urlFileDefault, config.importFile?.method, model).then((value: any) => {
      checkDataError(value.data)
      const validData = value.data.filter((item: any) => item.isSuccess === true)
      if (validData.length) {
        validData.forEach((element: never, id: number) => {
          paramsImport.validData.push(element)
        })
        paramsImport.validData.forEach((element: any, id: number) => {
          (element as any).key = id
        })
      }
      const inValidData = value.data.filter((item: any) => item.isSuccess === false)
      if (inValidData) {
        inValidData.forEach((element: never, id: number) => {
          (element as any).key = id
        })
        paramsImport.invalidData = inValidData
      }
      nextTick(() => {
        if (refTableValid.value?.items.length)
          refTableValid.value.checkedAll()
      })
    })
  }

  const fileChange = (event: any) => {
    const input = event.target.files[0]
    const listData: any = []
    readXlsxFile(input).then(rows => {
      if (rows.length <= 2) {
        // console.log('error')
      }
      else {
        for (let i = 2; i < rows.length; i += 1) {
          const rowData = rows[i]
          let data = null
          data = config?.importFile?.dataColumnExcel(rowData)
          listData.push(data)
        }
        event.target.value = null
        getValidData(listData, config?.importFile?.paramsImport)
      }
    })
  }

  const updateFromFile = async () => {
    const list = reactive({
      listIndex: <number[]>[],
      listData: <any[]>[],
    })

    paramsImport.validData.forEach((item: any, index: number) => {
      if (item.isSelected) {
        list.listIndex.push(index)
        list.listData.push(item)
      }
    })
    let model = {
      listExcel: list.listData,
      isSave: true,
      isValidate: false,
      typeUpdate: 2,
      type: type.value,
    }
    if (!ObjectUtil.isEmpty(type.value)) {
      model = {
        ...model,
        ...{
          type: type.value,
        },
      }
    }

    const res = await MethodsUtil.requestApiCustom(config.importFile?.urlFileDefault, config.importFile?.method, model).then((value: any) => value)

    if (res?.data && res?.code === 200) {
      toast('SUCCESS', t(res?.message))

      list.listIndex.reverse().forEach(item => {
        paramsImport.validData.splice(item, 1)
      })
      if (paramsImport.validData.length === 0 && paramsImport.invalidData.length === 0)
        return 'back'
    }
    else {
      toast('ERROR', t(res?.message))
    }
  }

  return { refTableValid, getValidData, checkInvalidData, checkDataError, paramsImport, fileChange, config, type, updateFromFile, customKeyError, $reset }
})
