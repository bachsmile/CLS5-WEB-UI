import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { useUserGroupStore } from './cpUser'
import { useCourseGroupStore } from './cpCourse'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiGroupUser from '@/api/user'
import type { Params } from '@/typescript/interface/params'
import toast from '@/plugins/toast'

export const useStoreAddUser = defineStore('useStoreAddUser', () => {
  const route = useRoute()
  const { t } = window.i18n()
  interface QueryParamsModal extends Params {
    keyword: string
    roleId: number | null
    titles: string[] | null
    userRole: number | null
    excludeIds: number[] | null
    categoryTitleId: number[] | null
    groupId: number[] | null
    organizationalStructureId: number[] | null
  }
  const storeUserTab = useUserGroupStore()

  const queryParams = ref<QueryParamsModal>({
    keyword: '',
    roleId: null,
    titles: null,
    userRole: null,
    excludeIds: storeUserTab.excludeIds,
    categoryTitleId: null,
    groupId: null,
    organizationalStructureId: null,
    pageNumber: 1,
    pageSize: 10,
    search: '',
  })

  const listId = ref([])
  const getUsersByStruce = async () => {
    const payload = {
      id: route.params.id,
      typeId: 1,
    }
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.UserExclude, TYPE_REQUEST.GET, payload)
    listId.value = data
  }
  getUsersByStruce()

  const listUser = ref([])
  const totalRecord = ref(0)
  const fetchDataModal = async () => {
    queryParams.value.excludeIds = listId.value
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.ListUserAdd, TYPE_REQUEST.POST, queryParams.value)
    listUser.value = data.pageLists
    totalRecord.value = data.totalRecord
  }

  // getData header modal add user
  const dataHeader = reactive({
    listGroupUser: [] as any[],
    listCategoryTitle: [] as any[],
    listTitle: [] as any[],
  })

  const getGroupUser = async () => {
    const payload = {
      groupId: Number(route.params.id),
    }
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.GroupUserCombobox, TYPE_REQUEST.GET, payload)
    dataHeader.listGroupUser = data
  }
  if (!dataHeader.listGroupUser.length)
    getGroupUser()

  const getCategoryTitle = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.CategoryTitleCombobox, TYPE_REQUEST.GET)
    dataHeader.listCategoryTitle = data
  }
  if (!dataHeader.listCategoryTitle.length)
    getCategoryTitle()

  const getTitle = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.TitleCombobox, TYPE_REQUEST.GET)
    const list: any[] = []
    data.forEach((element: string) => {
      list.push({
        key: element,
        value: element,
      })
    })
    dataHeader.listTitle = list
  }
  if (!dataHeader.listTitle.length)
    getTitle()

  // Xử lý thêm người dùng vào nhóm người dùng
  interface DataUser {
    isCourse: boolean
    isTraining: boolean
    groupId: number
    listUser: any[]
  }
  const dataUser = ref<DataUser>({
    isCourse: false,
    isTraining: false,
    groupId: Number(route.params.id),
    listUser: [],
  })

  const handleAddUser = (list: number[]) => {
    dataUser.value.listUser = list
    let status = false
    MethodsUtil.requestApiCustom(ApiGroupUser.AddUserGroup, TYPE_REQUEST.POST, dataUser.value).then((res: any) => {
      toast('SUCCESS', t('calendar.add-user-success'))
      storeUserTab.getListUser()
      status = false
    }).catch((e: any) => {
      toast('ERROR', t('calendar.add-user-failed'))
      status = true
    })
    return status
  }
  const $reset = () => {
    dataUser.value = {
      isCourse: false,
      isTraining: false,
      groupId: Number(route.params.id),
      listUser: [],
    }
    queryParams.value = {
      keyword: '',
      roleId: null,
      titles: null,
      userRole: null,
      excludeIds: storeUserTab.excludeIds,
      categoryTitleId: null,
      groupId: null,
      organizationalStructureId: null,
      pageNumber: 1,
      pageSize: 10,
      search: '',
    }
  }
  return { dataHeader, fetchDataModal, queryParams, listUser, totalRecord, dataUser, handleAddUser, $reset }
})

// Course
export const useStoreAddCourse = defineStore('useStoreAddCourse', () => {
  const route = useRoute()
  const { t } = window.i18n()
  const storeCourse = useCourseGroupStore()
  interface QueryParamsModal extends Params {
    keyword: string
    excludeListId: number[] | null
    topicCourseId?: number | null
  }
  const queryParams = reactive<QueryParamsModal>({
    keyword: '',
    excludeListId: [],
    pageNumber: 1,
    pageSize: 10,
    topicCourseId: null,
  })
  const getUsersByStruce = async () => {
    const payload = {
      id: route.params.id,
      typeId: 2,
    }
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.CourseExclude, TYPE_REQUEST.GET, payload)
    queryParams.excludeListId = data
  }
  getUsersByStruce()

  const listCourse = ref([])
  const totalRecord = ref(0)
  const fetchData = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.ListCourseAdd, TYPE_REQUEST.GET, queryParams)
    listCourse.value = data.pageLists
    totalRecord.value = data.totalRecord
  }

  // Xử lý thêm người dùng vào nhóm người dùng
  interface DataCourse {
    groupId: number
    courseModel: any[]
  }
  const dataCourse = reactive<DataCourse>({
    groupId: Number(route.params.id),
    courseModel: [],
  })

  const handleAddCourse = () => {
    let status = false
    MethodsUtil.requestApiCustom(ApiGroupUser.AddCourse, TYPE_REQUEST.POST, dataCourse).then((res: any) => {
      storeCourse.getListCourse()
      toast('SUCCESS', t('calendar.add-course-success'))
    }).catch((e: any) => {
      toast('ERROR', t('calendar.add-course-failed'))
      status = true
    })
    return status
  }

  return { fetchData, queryParams, listCourse, totalRecord, dataCourse, handleAddCourse, getUsersByStruce }
})
