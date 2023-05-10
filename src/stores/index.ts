import { defineStore } from 'pinia'
import { defaultSetting } from '@/constant/data/settingDefault.json'
import SystemService from '@/api/system/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { connectionStore } from '@/stores/connections'

export const configStore = defineStore('appConfig', () => {
  /** variable */
  const config = reactive({
    isRTL: 'ltr',
  })
  const connectionControl = connectionStore()
  const { isLoginOneDevice } = storeToRefs(connectionControl)
  const settingDefaults = ref(defaultSetting)
  const isTreeBinding = () => {
    const treeBindItem = settingDefaults.value?.find((item: any) => item.typeId === 1)
    return treeBindItem && treeBindItem.value === 1
  }
  const getDefaultSetting = async () => {
    await MethodsUtil.requestApiCustom(SystemService.SettingDefaultSystem, TYPE_REQUEST.GET).then((value: any) => {
      if (value?.data?.length > 0)
        settingDefaults.value = value.data
      console.log(settingDefaults)

      const isLoginOneDeviceStatus = value.data.find((x: any) => x.typeId === 5)
      if (isLoginOneDeviceStatus && isLoginOneDeviceStatus.value === 1)
        isLoginOneDevice.value = true
      else
        isLoginOneDevice.value = false
      return value.data
    })
  }
  return { config, settingDefaults, isTreeBinding, getDefaultSetting }
})
