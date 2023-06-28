import { defineStore } from 'pinia'
import { courseInforManagerStore } from '@/stores/admin/course/infor'
import toast from '@/plugins/toast'
import { comboboxStore } from '@/stores/combobox'
import CourseService from '@/api/course/index'
import UserService from '@/api/user'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'

export const conditionManagerStore = defineStore('conditionManager', () => {
  /** store */

  /** state ****************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()

  /**
 * Store
 */
  const storeCourseInforManager = courseInforManagerStore()
  const { courseData } = storeToRefs(storeCourseInforManager)
  const combobox = comboboxStore()
  const { listTopicCourseCombobox } = storeToRefs(combobox)
  const { getlistTopicCourseCombobox } = combobox

  /** năng lực */
  const itemsCapacity = ref([])
  const totalRecordCapacity = ref(0)
  const dataCapacity = reactive({
    deleteIds: [] as any[], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const queryParamsCapacity = ref<any>({
    search: null,
    pageNumber: 1,
    pageSize: 10,
  })
  const disabledDeleteCapacity = computed(() => !dataCapacity.selectedRowsIds.length)
  const isShowDialogNotiDeleteCapacity = ref(false)

  /** state ****************************************************************/
  /** interface */

  /** method */

  /** năng lực */
  function deleteItemsCapacity() {
    dataCapacity.deleteIds = dataCapacity.selectedRowsIds
    isShowDialogNotiDeleteCapacity.value = true
  }
  function handleSearchCapacity(value: any) {
    queryParamsCapacity.value.search = value
    getCapacityRequired()
  }

  // chuyển trang
  async function handlePageClickCapacity(page: any) {
    queryParamsCapacity.value.pageNumber = page
    getCapacityRequired()
  }
  function selectedRowsCapacity(e: any) {
    dataCapacity.selectedRowsIds = e
  }
  async function getCapacityRequired() {
    queryParamsCapacity.value.courseId = courseData.value?.id
    await MethodsUtil.requestApiCustom(CourseService.GetRequiredProficiencies, TYPE_REQUEST.GET, queryParamsCapacity.value).then((value: any) => {
      const params = {
        keyword: queryParamsCapacity.value?.search,
        proficiencyLevelMapIdList: value.data?.map(({ proficiencyLevelMapId }: any) => proficiencyLevelMapId),
      }
      totalRecordCapacity.value = value.data.totalRecord
      MethodsUtil.requestApiCustom(UserService.PostProciencyUser, TYPE_REQUEST.POST, params).then((capacities: any) => {
        capacities.data.forEach((element: any) => {
          const profi = value.data.find((x: any) => x.proficiencyLevelMapId === element.proficiencyLevelMapId)
          if (profi)
            element.id = profi.courseProficiencyRequireId
          element.actions = [
            MethodsUtil.checkActionType({ id: 2 }, actionItemCapacity),
          ]
        })
        itemsCapacity.value = capacities.data

        // reset các giá trị
        dataCapacity.deleteIds = []
        dataCapacity.selectedRowsIds = []
      })
    })
  }

  // xóa năng lực
  function deleteItemCapacity(id: number) {
    dataCapacity.deleteIds = [id as never]
    isShowDialogNotiDeleteCapacity.value = true
  }

  // hàm trả về các loại action khi click
  function actionItemCapacity(type: any) {
    switch (type[0]?.name) {
      case 'ActionDelete':
        deleteItemCapacity(type[1].id)
        break
      default:
        break
    }
  }

  // xác nhận xóa năng lực
  function confirmDialogDeleteCapacity(event: any) {
    if (event)
      deleteAction()
  }

  // Hành động xóa năng lực
  async function deleteAction() {
    const params = {
      listId: dataCapacity.deleteIds,
    }
    await MethodsUtil.requestApiCustom(CourseService.PostDeleteRequiredProficiencies, TYPE_REQUEST.POST, params).then((value: any) => {
      getCapacityRequired()
      dataCapacity.selectedRowsIds = []
      dataCapacity.deleteIds = []
      toast('SUCCESS', t(value.message))
    })
  }
  async function addCapacity(capacityIds: any) {
    if (capacityIds.length === 0) {
      toast('WARNING', t('capacity-invalid'))
      return
    }
    const params = {
      courseId: courseData.value?.id,
      proficiencyLevelMapIdList: capacityIds,
    }
    await MethodsUtil.requestApiCustom(CourseService.PostAddProficiencies, TYPE_REQUEST.POST, params).then((value: any) => {
      getCapacityRequired()
      toast('SUCCESS', t(value.message))
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  /** course */
  const queryParamsCourse = ref<any>({
    search: null,
    pageNumber: 1,
    pageSize: 10,
  })
  const dataCourse = reactive({
    deleteIds: [] as any[], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const itemsCourse = ref([])
  const totalRecordCourse = ref(0)
  const isShowDialogNotiDeleteCourse = ref(false)
  const disabledDeleteCourse = computed(() => !dataCourse.selectedRowsIds.length)
  function deleteItemsCourse() {
    dataCourse.deleteIds = dataCourse.selectedRowsIds
    isShowDialogNotiDeleteCourse.value = true
  }

  // xóa năng lực
  function deleteItemCourse(id: number) {
    dataCourse.deleteIds = [id as never]
    isShowDialogNotiDeleteCourse.value = true
  }
  async function deleteActionCourse() {
    const params = {
      listId: dataCourse.deleteIds,
    }
    await MethodsUtil.requestApiCustom(CourseService.PostDeleteCourseRequired, TYPE_REQUEST.POST, params).then((value: any) => {
      getCourseRequired()
      dataCourse.selectedRowsIds = []
      dataCourse.deleteIds = []
      toast('SUCCESS', t(value.message))
    })
  }
  function confirmDialogDeleteCourse(event: any) {
    if (event)
      deleteActionCourse()
  }
  function handleSearchCourse(value: any) {
    queryParamsCourse.value.search = value
    getCourseRequired()
  }
  function selectedRowsCourse(e: any) {
    dataCourse.selectedRowsIds = e
  }
  async function handlePageClickCourse(page: any) {
    queryParamsCourse.value.pageNumber = page
    getCourseRequired()
  }

  function actionItemCourse(type: any) {
    switch (type[0]?.name) {
      case 'ActionDelete':
        deleteItemCourse(type[1].courseRequiredId)
        break
      default:
        break
    }
  }
  async function getCourseRequired() {
    queryParamsCourse.value.courseId = courseData.value?.id
    await MethodsUtil.requestApiCustom(CourseService.GetRequiredCourse, TYPE_REQUEST.GET, queryParamsCourse.value).then(async (value: any) => {
      if (!listTopicCourseCombobox.value?.length)
        await getlistTopicCourseCombobox()
      value?.data.forEach((element: any) => {
        const topic: any = listTopicCourseCombobox.value?.find((x: any) => x.key === element.topicCourseId)
        if (topic)
          element.topicCourseName = topic.value
        element.actions = [
          MethodsUtil.checkActionType({ id: 2 }, actionItemCourse),
        ]
      })
      itemsCourse.value = value.data
      dataCourse.deleteIds = []
      dataCourse.selectedRowsIds = []
      totalRecordCourse.value = value.data.totalRecord
    })
  }
  async function addCourse(courses: any) {
    if (courses.length === 0) {
      toast('WARNING', t('course-invalid'))
      return
    }
    const params = {
      courseId: courseData.value?.id,
      requiredCourseList: courses.map(({ id }: any) => id),
    }

    await MethodsUtil.requestApiCustom(CourseService.PostAddCourseRequired, TYPE_REQUEST.POST, params).then((value: any) => {
      getCourseRequired()
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
    //* *năng lực */
    disabledDeleteCapacity,
    isShowDialogNotiDeleteCapacity,
    queryParamsCapacity,
    itemsCapacity,
    totalRecordCapacity,

    handlePageClickCapacity,
    selectedRowsCapacity,
    confirmDialogDeleteCapacity,
    deleteItemsCapacity,
    handleSearchCapacity,
    getCapacityRequired,
    addCapacity,

    //* *course */
    itemsCourse,
    isShowDialogNotiDeleteCourse,
    disabledDeleteCourse,
    totalRecordCourse,
    queryParamsCourse,
    getCourseRequired,
    deleteItemsCourse,
    deleteItemCourse,
    confirmDialogDeleteCourse,
    handleSearchCourse,
    selectedRowsCourse,
    handlePageClickCourse,
    addCourse,
  }
})
