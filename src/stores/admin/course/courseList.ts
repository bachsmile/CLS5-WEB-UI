import { defineStore } from 'pinia'
import { configStore } from '@/stores/index'
import { comboboxStore } from '@/stores/combobox'
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import constant from '@/constant/constant'

/** call api */
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import UserService from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

import toast from '@/plugins/toast'

/** end call api */
export const courseListManagerStore = defineStore('courseListManager', () => {
  /** lib */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const route = useRoute()
  const router = useRouter()

  /** store */
  const configControl = configStore()
  const { settingDefaults, permission } = storeToRefs(configControl)
  const storeCombobox = comboboxStore()
  const { compoboxSortCourse, topicCombobox } = storeToRefs(storeCombobox)
  const storeCourseApproveManager = courseApproveManagerStore()
  const { idModalSendRatioPoint, scoreSettingCourse } = storeToRefs(storeCourseApproveManager)

  /** state */
  // data request api danh sách khóa học
  const queryParams = ref<any>({
    dateFrom: null,
    dateTo: null,
    userId: null,
    search: null,
    sort: '-modifiedDate',
    pageNumber: 1,
    pageSize: 10,
    topicIds: [],
    formOfStudy: undefined,
    isDisplayHome: null,
    statusId: null,
    ownerId: null,
  })
  const vSelectOwner = ref<any>({
    listCombobox: [],
    totalRecord: 0,
    pageNumber: 1,
    pageSize: 30,
    search: '',
    excludeList: [],
    itemSelected: {} as any,
  })

  // bật tắt filter
  const isShowFilter = ref(true)

  // data table
  const items = ref([])
  const totalRecord = ref(0)
  const isApprovingDisable = ref(false)
  const users = ref<any>(0)
  const data = reactive({
    deleteIds: [], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const isShowDialogNotiDelete = ref(false)
  const disabledDelete = computed(() => !data.selectedRowsIds.length)
  const disabledApprove = computed(() => !data.selectedRowsIds.length)

  /** method */
  /* ==> thực hiện các action được chọn ở header page CP */
  function handlerActionHeader(type: any) {
    switch (type) {
      case 'handlerAddButton':
        router.push({ name: 'course-add', query: { tab: 'infor' } })
        break
      case 'handlerCustomButton':

        router.push({ name: 'course-approve' })
        break

      default:
        break
    }
  }

  //  fillter header
  async function handleFilterCombobox(dataFilter: any) {
    queryParams.value = {
      ...queryParams.value,
      ...dataFilter,
    }

    await pushQuery()
  }

  // đẩy params lên query url
  function pushQuery() {
    if (queryParams.value.dateFrom && queryParams.value.dateTo) {
      const start: any = new Date(queryParams.value.dateFrom)
      const end: any = new Date(queryParams.value.dateTo)
      if ((start - end) > 0) {
        toast('WARNING', t('notice-start-end-date'))
        return
      }
    }
    const query: any = window._.cloneDeep(queryParams.value)
    Object.keys(query).forEach(item => {
      if (query[item] === null || query[item] === '' || (window._.isArray(query[item]) && window._.isEmpty(query[item])))
        delete query[item]
    })

    router.push({ query })
  }

  // chuyển trang
  async function handlePageClick(page: any) {
    queryParams.value.pageNumber = page
    await pushQuery()
  }

  // search ở fillter header
  async function handleSearch(value: any) {
    queryParams.value.pageNumber = 1
    queryParams.value.search = value

    await pushQuery()
  }
  function selectedRows(e: any) {
    data.selectedRowsIds = e
  }

  /* ==> danh sách giáo viên */
  // get list teacher
  async function getTeacherOwnerCourse(loadMore?: any) {
    // loadMore dùng khi infinity scroll
    const params = {
      pageSize: vSelectOwner.value.pageSize,
      pageNumber: vSelectOwner.value.pageNumber,
      keyword: vSelectOwner.value.search,
      excludeIds: vSelectOwner.value.excludeList,
    }
    await MethodsUtil.requestApiCustom(UserService.PostGetTeacher, TYPE_REQUEST.POST, params).then((value: any) => {
      if (value?.data?.pageLists.length) {
        vSelectOwner.value.totalRecord = value.data.totalRecord

        if (loadMore)
          vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.concat(value.data.pageLists)

        else
          vSelectOwner.value.listCombobox = value.data.pageLists
        vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.map((itemValue: any) => ({
          ...itemValue,
          name: `${itemValue.lastName} ${itemValue.firstName}`,
        }))
        if (vSelectOwner.value.itemSelected?.id && !loadMore) {
          const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item.id === vSelectOwner.value.itemSelected.id)
          if (indexOwner === -1) {
            vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value.itemSelected)
            vSelectOwner.value.excludeList = [vSelectOwner.value.itemSelected.id]
          }
        }
      }
      else {
        vSelectOwner.value.listCombobox = []
        vSelectOwner.value.totalRecord = 0
      }
    })
  }
  async function isIntersecting() {
    vSelectOwner.value.pageNumber += 1
    await pushQuery()
    getTeacherOwnerCourse(true)
  }

  // Function to handle when click button Delete
  function deleteItem(id: number) {
    data.deleteIds = [id as never]
    isShowDialogNotiDelete.value = true
  }

  // click  multi delete btn to show modal confirm
  function deleteItems() {
    data.deleteIds = data.selectedRowsIds
    isShowDialogNotiDelete.value = true
  }

  // delete action
  async function deleteAction() {
    const params = {
      ids: data.deleteIds,
    }
    await MethodsUtil.requestApiCustom(CourseService.PostDeleteCourse, TYPE_REQUEST.POST, params)
      .then(async (value: any) => {
        toast('SUCCESS', t(value?.message))
        queryParams.value = {
          pageNumber: 1,
          pageSize: queryParams.value.pageSize,
        }
        await pushQuery()
        data.deleteIds = []
        data.selectedRowsIds = []
      })
      .catch(() => {
        toast('ERROR', t('USR_DeleteFail'))
      })
  }

  // hành động của dialog
  function confirmDialogDelete(event: any) {
    if (event)
      deleteAction()
  }
  function getErrorsMessage(errorsMess: Array<any>) {
    let str = ''
    errorsMess.forEach(element => {
      str += `${t(element.message, element.params)}`
      str += '. '
    })

    return str
  }

  // cập nhật trạng thái dialog
  function updateDialogVisible(event: any) {
    isShowDialogNotiDelete.value = event
  }

  async function approveCourses() {
    if (MethodsUtil.checkPermission(permission.value, 'CourseManaging', 128)) {
      const params = {
        listModel: data.selectedRowsIds.map((item: any) => ({ id: item })),
      }
      await MethodsUtil.requestApiCustom(CourseService.PostApproveCourse, TYPE_REQUEST.POST, params).then(async (value: any) => {
        if (value.code === 200) {
          toast('SUCCESS', t(value.message))
          data.deleteIds = []
          data.selectedRowsIds = []
          queryParams.value = {
            pageNumber: 1,
            pageSize: queryParams.value.pageSize,
          }
          await pushQuery()
        }
        else {
          if (value.errors.length > 0)
            toast('ERROR', t(getErrorsMessage(value.errors)))
        }
      })
        .catch((error: any) => {
          toast('ERROR', t(error.response.data.message))
        })
    }
    else {
      const params = {
        listModel: data.selectedRowsIds,
      }
      await MethodsUtil.requestApiCustom(CourseService.PostSendApproveCourse, TYPE_REQUEST.POST, params).then(async (value: any) => {
        if (value.code === 200) {
          queryParams.value = {
            pageNumber: 1,
            pageSize: queryParams.value.pageSize,
          }
          await pushQuery()
          toast('SUCCESS', t(value.message))
          data.deleteIds = []
          data.selectedRowsIds = []
        }
        else {
          toast('ERROR', t(value.message))
        }
      })
        .catch((error: any) => {
          toast('ERROR', t(error.response.data.message))
        })
    }
  }

  // duyệt khóa học
  async function approve(id: any) {
    isApprovingDisable.value = true
    const params = {
      listModel: [{ id }],
    }
    await MethodsUtil.requestApiCustom(CourseService.PostApproveCourse, TYPE_REQUEST.POST, params).then(async (value: any) => {
      if (value.code === 200) {
        toast('SUCCESS', t(value.message))
        queryParams.value = {
          pageNumber: 1,
          pageSize: queryParams.value.pageSize,
        }
        await pushQuery()
      }
      else {
        toast('ERROR', t(value.message))
      }
      isApprovingDisable.value = false

      if (value.message === 'CSE_SettingPointInValid') {
        scoreSettingCourse.value = {
          courseId: id,
          type: 'approve',
        }
        idModalSendRatioPoint.value = true
      }
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    items,
    totalRecord,
    isShowFilter,
    queryParams,
    vSelectOwner,
    settingDefaults,
    constant,
    users,
    compoboxSortCourse,
    topicCombobox,
    disabledDelete,
    isShowDialogNotiDelete,
    disabledApprove,
    data,
    isApprovingDisable,
    handlerActionHeader,
    handleFilterCombobox,
    handlePageClick,
    selectedRows,
    isIntersecting,
    getTeacherOwnerCourse,
    pushQuery,
    handleSearch,
    deleteItems,
    deleteItem,
    confirmDialogDelete,
    updateDialogVisible,
    approveCourses,
    approve,
  }
})
