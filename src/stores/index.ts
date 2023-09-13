import { defineStore } from 'pinia'
import { defaultSetting } from '@/constant/data/settingDefault.json'
import { defaultTheme } from '@/constant/data/image.json'
import SystemService from '@/api/system/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { connectionStore } from '@/stores/connections'

export const configStore = defineStore('appConfig', () => {
  /** store */
  const connectionControl = connectionStore()
  const { isLoginOneDevice } = storeToRefs(connectionControl)

  /** state */
  const config = reactive({
    isRTL: 'ltr',
  })
  const defaultThemeValue = ref(defaultTheme)
  const permission = ref<any>(null)

  /** end state */
  const settingDefaults = ref(defaultSetting)
  const isTreeBinding = () => {
    const treeBindItem = settingDefaults.value?.find((item: any) => item.typeId === 1)
    return treeBindItem && treeBindItem.value === 1
  }
  const getDefaultSetting = async () => {
    await MethodsUtil.requestApiCustom(SystemService.SettingDefaultSystem, TYPE_REQUEST.GET).then((value: any) => {
      if (value?.data?.length > 0)
        settingDefaults.value = value.data

      const isLoginOneDeviceStatus = value.data.find((x: any) => x.typeId === 5)
      if (isLoginOneDeviceStatus && isLoginOneDeviceStatus.value === 1)
        isLoginOneDevice.value = true
      else
        isLoginOneDevice.value = false
      return value.data
    })
  }
  const getThemeConfig = async () => {
    await MethodsUtil.requestApiCustom(SystemService.ThemeSystem, TYPE_REQUEST.GET).then((value: any) => {
      defaultThemeValue.value = value.data
      localStorage.setItem('themeConfig', JSON.stringify(value.data))
    })
      .catch(() => {
        defaultThemeValue.value = defaultTheme
        localStorage.setItem('themeConfig', JSON.stringify(defaultTheme))
      })
  }
  return { config, settingDefaults, permission, defaultThemeValue, isTreeBinding, getDefaultSetting, getThemeConfig }
})
