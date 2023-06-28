import { defineStore } from 'pinia'

import toast from '@/plugins/toast'

// import UserService from '@/api/user'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { courseInforManagerStore } from '@/stores/admin/course/infor'

export const asignUserManagerStore = defineStore('asignUserManager', () => {
  /** lib ****************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()

  /**
 * Store
 */
  const storeCourseInforManager = courseInforManagerStore()
  const { courseData } = storeToRefs(storeCourseInforManager)

  /** state */
  const queryParams = ref({
    id: null as any,
    orStructure: [],
    groupUser: [],
    categoryTitleId: [],
    titles: [],
    courseId: 0,
    pageNumber: 1,
    pageSize: 10,
    searchKey: '',
    listId: [],
  })

  /** Người dùng */
  /** học viên đăng ký */
  const itemsUserReg = ref<any[]>([])
  const queryParamsUserReg = ref<any>({
    courseId: null,
    pageSize: 10,
    pageNumber: 1,
    search: '',
    status: null,
    fromDate: '',
    toDate: '',
  })
  const dataUserReg = reactive({
    deleteIds: [] as any[], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const totalRecordUserReg = ref(0)
  const disabledUserRegBack = computed(() => !dataUserReg.selectedRowsIds.length)
  const disabledUserRegApprove = computed(() => !dataUserReg.selectedRowsIds.length)
  const disabledUserRegDelete = computed(() => !dataUserReg.selectedRowsIds.length)
  const isShowDialogNotiDeleteUserReg = ref(false)
  function selectedRowsUserReg(e: any) {
    dataUserReg.selectedRowsIds = e
  }
  async function getUserRegCourse() {
    await MethodsUtil.requestApiCustom(CourseService.GetListUserRegCourse, TYPE_REQUEST.GET, queryParamsUserReg.value)
      .then((value: any) => {
        itemsUserReg.value = value.data.pageLists
        value.data.pageLists.forEach((element: any) => {
          element.actions = [
            MethodsUtil.checkActionType({ id: 2 }, actionItemUserReg),
          ]
        })
        totalRecordUserReg.value = value.data.totalRecord
      })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }
  async function handlePageClickUserReg(page: any) {
    queryParamsUserReg.value.pageNumber = page
    getUserRegCourse()
  }

  // xóa năng lực
  function deleteItemUserReg(id: number) {
    dataUserReg.deleteIds = [id as never]
    isShowDialogNotiDeleteUserReg.value = true
  }

  // click  multi delete btn to show modal confirm
  function deleteItemsUserReg() {
    dataUserReg.deleteIds = dataUserReg.selectedRowsIds
    isShowDialogNotiDeleteUserReg.value = true
  }
  function handleSearchUserReg(value: any) {
    queryParamsUserReg.value.search = value
    getUserRegCourse()
  }
  async function handleApproveUserRegReject(key: string) {
    const params = {
      courseId: queryParamsUserReg.value.courseId,
      listUser: [] as any,
    }
    dataUserReg.selectedRowsIds.forEach((item: any) => {
      params.listUser.push(item)
    })

    await MethodsUtil.requestApiCustom(
      key === 'approve'
        ? CourseService.PostApproveUser
        : CourseService.PostRejectUser,
      TYPE_REQUEST.POST, params)
      .then((value: any) => {
        toast('SUCCESS', t(value?.message))

        getUserRegCourse()
      })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  // hàm trả về các loại action khi click
  function actionItemUserReg(type: any) {
    switch (type[0]?.name) {
      case 'ActionDelete':
        deleteItemUserReg(type[1].id)
        break
      default:
        break
    }
  }

  // xác nhận xóa học viên
  function confirmDialogDeleteUserReg(event: any) {
    if (event)
      deleteActionUserReg()
  }

  // Hành động xóa học viên
  async function deleteActionUserReg() {
    const params = {
      courseId: queryParamsUserReg.value.courseId,
      listUser: dataUserReg.deleteIds,
    }
    await MethodsUtil.requestApiCustom(CourseService.DeleteUserReg, TYPE_REQUEST.DELETE, params).then((value: any) => {
      getUserRegCourse()
      dataUserReg.selectedRowsIds = []
      dataUserReg.deleteIds = []
      toast('SUCCESS', t(value.message))
    })
  }

  //  fillter header
  async function handleFilterCombobox(dataFilter: any) {
    queryParamsUserReg.value = {
      ...queryParamsUserReg.value,
      ...dataFilter,
    }
    getUserRegCourse()
  }
  async function exportExcelUserReg(dataFilter: any) {
    window.showAllPageLoading()
    const params = {
      language:
          localStorage.getItem('lang') === null
            ? 'vi'
            : localStorage.getItem('lang'),
      ...queryParamsUserReg.value,
      courseName: courseData.value.name,
    }
    await MethodsUtil.dowloadSampleFile(
      CourseService.GetExportExcelUserRegCourse,
      'GET',
      'Học viên đăng kí.xlsx',
      params,
    )
    window.hideAllPageLoading()
  }
  async function postRegisterContactUser(id: number) {
    const params = {
      courseId: queryParamsUserReg.value.courseId,
      userRegisterId: id,
    }
    await MethodsUtil.requestApiCustom(CourseService.PostContactUser, TYPE_REQUEST.POST, params).then((value: any) => {
      toast('SUCCESS', t(value.message))
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
    //* *Người dùng */
    queryParams,

    /** học viên đăng ký */
    disabledUserRegBack,
    disabledUserRegApprove,
    disabledUserRegDelete,
    itemsUserReg,
    queryParamsUserReg,
    isShowDialogNotiDeleteUserReg,
    totalRecordUserReg,
    getUserRegCourse,
    handleFilterCombobox,
    postRegisterContactUser,
    exportExcelUserReg,
    confirmDialogDeleteUserReg,
    deleteItemsUserReg,
    handlePageClickUserReg,
    handleApproveUserRegReject,
    selectedRowsUserReg,
    handleSearchUserReg,
  }
})
