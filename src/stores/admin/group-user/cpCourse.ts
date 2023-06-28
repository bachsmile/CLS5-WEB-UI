import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { useStoreAddCourse } from './modalEditGroupUser'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiGroupUser from '@/api/user'
import type { Params } from '@/typescript/interface/params'
import toast from '@/plugins/toast'

export const useCourseGroupStore = defineStore('useCourseGroupStore', () => {
  const route = useRoute()
  const { t } = window.i18n()
  const addStoreCourse = useStoreAddCourse()
  interface QueryParams extends Params {
    id: number
  }
  const queryParams = reactive<QueryParams>({
    search: '',
    pageNumber: 1,
    pageSize: 10,
    id: Number(route.params.id),
  })

  const listUserInGroup = ref([])
  const totalRecord = ref(0)
  const getListCourse = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.ListCourse, TYPE_REQUEST.GET, queryParams)
    listUserInGroup.value = data.pageLists
    totalRecord.value = data.totalRecord
  }
  if (!listUserInGroup.value.length)
    getListCourse()

  interface DataCourse {
    groupId: number
    courseModel: any[]
  }
  const dataCourse = reactive<DataCourse>({
    groupId: Number(route.params.id),
    courseModel: [],
  })
  const deleteItem = () => {
    let status = false
    MethodsUtil.requestApiCustom(ApiGroupUser.DeleteCourse, TYPE_REQUEST.POST, dataCourse).then((res: any) => {
      toast('SUCCESS', t('calendar.delete-user-success'))
      addStoreCourse.getUsersByStruce()
      getListCourse()
    }).catch(() => {
      status = true
      toast('ERROR', t('calendar.add-user-failed'))
    })
    return status
  }

  return { queryParams, listUserInGroup, totalRecord, getListCourse, deleteItem, dataCourse }
})
