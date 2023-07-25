import { defineStore } from 'pinia'
import StringUtil from '@/utils/StringUtil'
import toast from '@/plugins/toast'
import UserService from '@/api/user/index'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { configStore } from '@/stores/index'
import { tableStore } from '@/stores/table'
import { load } from '@/stores/loadComponent.js'

export const courseInforManagerStore = defineStore('courseInforManager', () => {
  /** store */
  const configControl = configStore()
  const { settingDefaults } = storeToRefs(configControl)
  const storeTable = tableStore()
  const { callBackAction } = storeToRefs(storeTable)
  const store = load()
  const { unLoadComponent } = store

  /** variable ********************************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  interface course {
    id?: any
    name?: string | null
    thumbnail?: string
    videoUrl?: string
    about?: string
    topicCourseId?: number | null
    formOfStudy?: number | null
    code?: string | null
    authorList?: any
    credit?: number | null
    ownerId?: number | null
  }
  const courseData = ref<course>(
    {
      name: null,
      thumbnail: '',
      videoUrl: '',
      about: '',
      topicCourseId: null,
      code: null,
      formOfStudy: 1,
      credit: null,
      authorList: [],
      ownerId: null,
    },
  )
  const isViewDetail = ref(false) // trạng thái xem hay chỉnh sửa
  const idCourse = ref<any>(null) // id khóa học
  // data request api danh sách giảng viên
  const data = reactive({
    deleteIds: [] as any[], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const queryParams = ref<any>({
    search: null,
    pageNumber: 1,
    pageSize: 10,
  })
  const totalRecord = ref(0)
  const isOwner = ref() // chủ khóa học
  const isSaving = ref(false)
  const tableAddTeacher = ref()

  /** variable ********************************************************************************/
  const isShowDialogNotiDelete = ref(false)
  const disabledDelete = computed(() => !data.selectedRowsIds.length)
  function selectedRows(e: any) {
    data.selectedRowsIds = e
  }

  // search ở fillter header
  async function handleSearchTeacher(value: any) {
    queryParams.value.search = value
  }

  // click  multi delete btn to show modal confirm
  function deleteItems() {
    data.deleteIds = data.selectedRowsIds
    isShowDialogNotiDelete.value = true
  }

  // Function to handle when click button Delete
  function deleteItem(id: number) {
    data.deleteIds = [id as never]
    isShowDialogNotiDelete.value = true
  }

  function confirmDialogDelete(event: any) {
    if (event)
      deleteAction()
  }

  // delete action
  async function deleteAction() {
    const params = {
      ids: data.deleteIds,
    }
    for (let i = 0; i < courseData.value?.authorList?.length; i += 1) {
      if (isOwner.value && data.deleteIds?.includes(isOwner.value))
        isOwner.value = null

      if (data.deleteIds.find(x => x === courseData.value?.authorList[i]?.userId)) {
        courseData.value?.authorList?.splice(i, 1)
        i -= 1
      }
    }
    data.selectedRowsIds = []
    data.deleteIds = []
    totalRecord.value = courseData.value.authorList?.length
    toast('SUCCESS', t('delete-author-success'))
  }

  // chuyển trang
  async function handlePageClick(page: any) {
    queryParams.value.pageNumber = page
  }

  // lấy danh sách author
  const getAuthor = computed(() => {
    if (queryParams.value.search !== null) {
      return courseData.value.authorList?.filter((item: any) =>
        StringUtil.removeAccents(StringUtil.formatFullName(item.firstName, item.lastName)?.toLowerCase())
          .includes(StringUtil.removeAccents(queryParams.value.search?.toLowerCase())))
        ?.slice((queryParams.value.pageNumber - 1) * queryParams.value.pageSize, (queryParams.value.pageNumber - 1) * queryParams.value.pageSize + queryParams.value.pageSize)
    }

    return courseData.value.authorList?.slice((queryParams.value.pageNumber - 1) * queryParams.value.pageSize, (queryParams.value.pageNumber - 1) * queryParams.value.pageSize + queryParams.value.pageSize)
  })

  // thêm người dùng
  function addUser(users: any) {
    users.forEach((element: any) => {
      element.isSelected = false
      element.isOwner = false
      element.userId = element.id
      element.actions = [
        MethodsUtil.checkActionType({ id: 2 }),
      ]
      courseData.value.authorList[courseData.value.authorList.length] = element
    })
    totalRecord.value = courseData.value.authorList?.length
  }

  // hàm trả về các loại action khi click
  function actionItem(type: any) {
    switch (type[0]?.name) {
      case 'ActionDelete':
        deleteItem(type[1].id)
        break
      default:
        break
    }
  }
  callBackAction.value = actionItem
  async function addOrginAuthor() {
    const userData = JSON.parse(window.localStorage.getItem('userData') || '')
    const params = {
      userId: userData.id,
    }
    courseData.value.authorList = []
    await MethodsUtil.requestApiCustom(UserService.fetchDetailUpdate, TYPE_REQUEST.GET, params).then((value: any) => {
      if (value.data) {
        isOwner.value = value.data.id
        courseData.value.authorList.push({
          userId: value.data.id,
          id: value.data.id,
          isOwner: true,
          userName: `${value.data.firstName} ${value.data.lastName}`,
          avatar: value.data.avatar,
          firstName: value.data.firstName,
          lastName: value.data.lastName,
          actions: [
            MethodsUtil.checkActionType({ id: 2 }),
          ],
        })
      }
    })
  }
  async function fetchAuthor() {
    courseData.value.authorList = []
    const params = {
      id: courseData.value.id,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetAuthorCourseById, TYPE_REQUEST.GET, params).then(async (value: any) => {
      if (value.data) {
        const ids = MethodsUtil.getPropertyByArray(value.data, 'userId')
        const users = await MethodsUtil.getUserInfoByIds(ids)
        value.data.forEach((element: any) => {
          const user = users.pageLists.find((item: any) => item.id === element.userId)
          if (user) {
            element.firstName = user.firstName
            element.lastName = user.lastName
            element.avatar = user.avatar
            element.code = user.code
            element.actions = [
              MethodsUtil.checkActionType({ id: 2 }),
            ]
          }
        })
        courseData.value.authorList = value.data
      }
    })
  }
  function getErrorsMessage(errorsMess: Array<any>) {
    let str = ''
    errorsMess.forEach(element => {
      str += `${t(element.message, element.params)}`
      str += '. '
    })

    return str
  }
  async function addInforCourse(idx: any, isUpdate: boolean) {
    if (courseData.value.authorList.length === 0) {
      toast('WARNING', t('author-invalid'))
      return
    }

    // cảnh báo chưa chọn chủ khóa học
    if (!isOwner.value) {
      toast('WARNING', t('owner-invalid'))
      return
    }
    courseData.value.ownerId = isOwner.value
    if (Number(courseData.value.credit) > 100)
      toast('WARNING', t('not-than-100-credit'))
    if (isSaving.value)
      return
    isSaving.value = true
    courseData.value.credit = courseData.value?.credit ? Number(courseData.value?.credit) : null
    let response = null
    if (courseData.value.id && courseData.value.id !== null) {
      response = await MethodsUtil.requestApiCustom(CourseService.PostUpdateInforCourse, TYPE_REQUEST.POST, courseData.value)
    }
    else {
      response = await MethodsUtil.requestApiCustom(CourseService.PostAddInforCourse, TYPE_REQUEST.POST, courseData.value).then((value: any) => value)
      const ratingScaleDefault = settingDefaults.value.find(item => item.typeId === 11)
      if (ratingScaleDefault?.value && response?.data) {
        const setting = {
          courseId: response.data,
          ratingScaleId: ratingScaleDefault?.value || null,
          formOfRegistration: 1,
          numberOfRemindDay: 0,
          studyMode: 1,
          studyTime: 0,
          studyTimeType: 0,
          organizationalStructureIds: [],
        }

        // cập nhật thang đánh giá mặc định
        await MethodsUtil.requestApiCustom(CourseService.PostUpdateSettingCourse, TYPE_REQUEST.POST, setting).then((value: any) => value)
      }
    }

    isSaving.value = false
    if (response.code === 200) {
      if (isUpdate === true)
        router.push({ name: 'course-edit-type', params: { id: response.data, type: 'content' } })

      else
        router.push({ name: 'course-list' })
      toast('SUCCESS', t(response.message))
      unLoadComponent(idx)
    }
    else {
      toast('ERROR', t(getErrorsMessage(response.errors)))
      unLoadComponent(idx)
    }
  }
  function handleSaveUpdate(params: any) {
    //
  }
  async function getDetailCourse() {
    const params = {
      id: idCourse.value,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetDetailCourseById, TYPE_REQUEST.GET, params).then((value: any) => {
      if (value.data) {
        if (value.data.topicCourseId === 0)
          value.data.topicCourseId = null
        isOwner.value = value.data.ownerId
        courseData.value = value.data
      }
    })
  }

  // đăng ký state
  const stateInit = ref<any>({})
  const $reset = (listState: any) => MethodsUtil.$reset(stateInit)(listState)
  onMounted(() => {
    MethodsUtil.registerState([
      { courseData },
      { isViewDetail },
      { idCourse },
      { data },
      { queryParams },
      { isViewDetail },
      { totalRecord },
      { isOwner },
      { isSaving },
      { tableAddTeacher },
      { isShowDialogNotiDelete },
    ], stateInit)
  })
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    // state
    courseData,
    getAuthor,
    disabledDelete,
    queryParams,
    totalRecord,
    isShowDialogNotiDelete,
    data,
    isOwner,
    idCourse,
    isViewDetail,

    // method
    addOrginAuthor,
    handleSearchTeacher,
    selectedRows,
    handlePageClick,
    addUser,
    confirmDialogDelete,
    deleteItems,
    addInforCourse,
    handleSaveUpdate,
    getDetailCourse,
    fetchAuthor,
    $reset,
  }
})
