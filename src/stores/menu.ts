import { defineStore } from 'pinia'
import UserService from '@/api/user'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

export const useStoreMenu = defineStore('useStoreMenu', () => {
  const dataMenu = ref([])
  const role = ref(1)
  const getDateMenu = () => {
    const res = MethodsUtil.requestApiCustom(UserService.GetMenu, TYPE_REQUEST.GET, { id: role.value })
    dataMenu.value = res.data
  }
  return {
    getDateMenu,
    dataMenu,
    role,
  }
})
