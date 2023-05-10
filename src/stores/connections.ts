import { defineStore } from 'pinia'
import { defaultSetting } from '@/constant/data/settingDefault.json'
import SystemService from '@/api/system/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

export const connectionStore = defineStore('connections', () => {
  /** variable */
  const isLoginOneDevice = ref()

  return { isLoginOneDevice }
})
