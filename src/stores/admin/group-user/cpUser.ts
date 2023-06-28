import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiGroupUser from '@/api/user'
import type { Params } from '@/typescript/interface/params'
import toast from '@/plugins/toast'

export const useUserGroupStore = defineStore('useUserGroupStore', () => {
  const route = useRoute()
  const { t } = window.i18n()
  interface QueryParams extends Params {
    groupId: number
  }
  const queryParams = reactive<QueryParams>({
    search: '',
    pageNumber: 1,
    pageSize: 10,
    groupId: Number(route.params.id),
  })

  const listUserInGroup = ref([])
  const totalRecord = ref(0)
  const getListUser = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.ListUser, TYPE_REQUEST.GET, queryParams)
    listUserInGroup.value = data.pageLists
    totalRecord.value = data.totalRecord
  }

  getListUser()
  const excludeIds = computed(() => {
    return listUserInGroup.value.map((e: any) => e.userId)
  })

  // Chuyển người dùng sang nhóm khác
  interface DataMove {
    currentGroup: number | null
    isTotal: boolean | null
    newGroup: number | null
    userIds: number[]
  }
  const moveUser = (data: DataMove) => {
    let status = false
    MethodsUtil.requestApiCustom(ApiGroupUser.MoveUser, TYPE_REQUEST.PUT, data).then((res: any) => {
      toast('SUCCESS', t('Chuyển nhóm người dùng thành công'))
      getListUser()
    }).catch((e: any) => {
      toast('ERROR', t('Chuyển nhóm người dùng thất bại'))
      status = true
    })
    return status
  }

  const deleteItem = (val: any) => {
    const payload = {
      groupId: route.params.id,
      listUser: [...val],
    }
    let status = false
    MethodsUtil.requestApiCustom(ApiGroupUser.DeleteUser, TYPE_REQUEST.POST, payload).then((res: any) => {
      toast('SUCCESS', t('Xóa nhóm người dùng thành công'))
      getListUser()
    }).catch((e: any) => {
      toast('ERROR', t('Xóa nhóm người dùng thất bại'))
      status = true
    })
    return status
  }

  const $reset = () => {
    listUserInGroup.value = []
    queryParams.groupId = 0
    queryParams.search = ''
    queryParams.pageNumber = 1
    queryParams.pageSize = 10
  }

  return { queryParams, listUserInGroup, totalRecord, getListUser, moveUser, deleteItem, excludeIds }
})
