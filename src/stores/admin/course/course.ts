import { defineStore } from 'pinia'
import toast from '@/plugins/toast'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { courseInforManagerStore } from '@/stores/admin/course/infor'
import ShareService from '@/api/shared/index'
import { comboboxStore } from '@/stores/combobox'
import CourseService from '@/api/course'

export const courseManagerStore = defineStore('courseManager', () => {
  /** store */
  const storeCourseInforManager = courseInforManagerStore()
  const { courseData } = storeToRefs(storeCourseInforManager)

  const combobox = comboboxStore()
  const { compoboxCostTypes } = storeToRefs(combobox)

  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()
  const idCourse = ref<any>(null)

  /** ********Cost********* */

  /** course */
  const queryParamsCost = ref<any>({
    search: null,
    pageNumber: 1,
    pageSize: 10,
  })
  const dataCost = reactive({
    deleteIds: [] as any[], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const costData = ref<any>({
    courseId: null as any,
    name: null,
    costTypeId: null,
    unitPrice: null as any,
    description: null,
  })
  const itemsCost = ref([])
  const totalRecordCost = ref(0)
  const isShowDialogNotiDeleteCost = ref(false)
  const isShowModalAddCost = ref(false)
  const disabledDeleteCost = computed(() => !dataCost.selectedRowsIds.length)
  function deleteItemsCost() {
    dataCost.deleteIds = dataCost.selectedRowsIds
    isShowDialogNotiDeleteCost.value = true
  }

  // xóa năng lực
  function deleteItemCost(id: number) {
    dataCost.deleteIds = [id as never]
    isShowDialogNotiDeleteCost.value = true
  }
  function resetStateCostData() {
    costData.value = {
      courseId: null as any,
      name: null,
      costTypeId: null,
      unitPrice: null as any,
      description: null,
    }
  }
  async function deleteActionCost() {
    const params = {
      listId: dataCost.deleteIds,
    }
    console.log(params)
    await MethodsUtil.requestApiCustom(ShareService.PostDeleteCost, TYPE_REQUEST.POST, params).then((value: any) => {
      getCostRequired()
      dataCost.selectedRowsIds = []
      dataCost.deleteIds = []
      toast('SUCCESS', t(value.message))
    })
  }
  function confirmDialogDeleteCost(event: any) {
    if (event)
      deleteActionCost()
  }
  function handleSearchCost(value: any) {
    queryParamsCost.value.search = value
    getCostRequired()
  }
  function selectedRowsCost(e: any) {
    dataCost.selectedRowsIds = e
  }
  async function handlePageClickCost(page: any) {
    queryParamsCost.value.pageNumber = page
    getCostRequired()
  }
  function actionItemCost(type: any) {
    console.log(type)

    switch (type[0]?.name) {
      case 'ActionEdit':
        getCostCourseById(type[1].id)
        break
      case 'ActionDelete':
        deleteItemCost(type[1].id)
        break
      default:
        break
    }
  }
  async function getCostRequired() {
    queryParamsCost.value.courseId = route.params.id
    await MethodsUtil.requestApiCustom(ShareService.GetListCost, TYPE_REQUEST.GET, queryParamsCost.value).then(async (value: any) => {
      console.log(value)
      value.data.pageLists.forEach((element: any) => {
        const type: any = compoboxCostTypes.value?.find((item: any) => item.key === element.costTypeId)
        if (type)
          element.costTypeName = type.value
        element.actions = [
          MethodsUtil.checkActionType({ id: 1 }, actionItemCost),
          MethodsUtil.checkActionType({ id: 2 }, actionItemCost),
        ]
      })
      itemsCost.value = value.data.pageLists
      dataCost.deleteIds = []
      dataCost.selectedRowsIds = []
      totalRecordCost.value = value.data.totalRecord
    })
  }
  async function getCostCourseById(id: any) {
    const params = {
      id,
    }
    await MethodsUtil.requestApiCustom(ShareService.GetDetailCost, TYPE_REQUEST.GET, params).then(async (value: any) => {
      console.log(value)
      costData.value = value.data
      isShowModalAddCost.value = true
    })
  }

  // đánh giá sau đào tạo
  /** state */
  const isViewReport = ref(route.name === 'report-course-detail-type')
  const isShowDialogNotiDeleteEval = ref(false)
  const isShowModalAddEval = ref(false)
  const totalRecordEval = ref(0)
  const itemsEval = ref([])
  const queryParamsEval = ref<any>({
    search: null,
    pageNumber: 1,
    pageSize: 10,
    sort: null,
    courseId: route.params.id,
    isteacher: false,
    authorId: null,
    isActive: isViewReport.value,
  })
  const dataEval = reactive({
    deleteIds: [] as any[], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const disabledDeleteEval = computed(() => !dataEval.selectedRowsIds.length)
  const excludeIdsEval = ref([])

  /** method */
  function deleteItemEval(id: number) {
    dataEval.deleteIds = [id as never]
    isShowDialogNotiDeleteEval.value = true
  }
  function deleteItemsEval() {
    dataEval.deleteIds = dataEval.selectedRowsIds
    isShowDialogNotiDeleteEval.value = true
  }
  function selectedRowsEval(e: any) {
    dataEval.selectedRowsIds = e
  }
  function actionItemEval(type: any) {
    console.log(type)

    switch (type[0]?.name) {
      case 'ActionDelete':
        deleteItemEval(type[1].id)
        break
      default:
        break
    }
  }

  //  fillter header
  async function handleFilterEvaluationCombobox(dataFilter: any) {
    queryParamsEval.value = {
      ...queryParamsEval.value,
      ...dataFilter,
    }
    getEvaluetionRequired()
  }
  function confirmDialogDeleteEval(event: any) {
    if (event)
      deleteActionEval()
  }
  function handleSearchEvaluation(value: any) {
    queryParamsEval.value.search = value
    getEvaluetionRequired()
  }
  async function handlePageClickEval(page: any) {
    queryParamsEval.value.pageNumber = page
    getEvaluetionRequired()
  }
  async function getEvaluetionRequired() {
    queryParamsEval.value.courseId = route.params.id
    await MethodsUtil.requestApiCustom(CourseService.GetSurveyEvaluation, TYPE_REQUEST.GET, queryParamsEval.value).then(async (value: any) => {
      console.log(value)

      const userIds = MethodsUtil.getPropertyByArray(value?.data?.pageLists, 'createdBy')
      const users = await MethodsUtil.getUserInfoByIds(userIds)
      value.data.pageLists.forEach((element: any) => {
        const user = users.pageLists.find((x: any) => x.id === element.createdBy)

        if (user) {
          element.firstName = user.firstName
          element.lastName = user.lastName
        }
        element.actions = [
          MethodsUtil.checkActionType({ id: 2 }, actionItemEval),
        ]
      })
      itemsEval.value = value.data.pageLists
      dataEval.deleteIds = []
      dataEval.selectedRowsIds = []
      totalRecordEval.value = value.data.totalRecord
    })
  }
  async function addSurveyCourse(ids: any) {
    const params = {
      courseId: courseData.value?.id,
      isActive: true,
      isTeacher: false,
      surveyIds: ids,
    }
    console.log(params)

    await MethodsUtil.requestApiCustom(CourseService.PostCourseSurveyEvaluation, TYPE_REQUEST.POST, params).then((value: any) => {
      getEvaluetionRequired()
      toast('SUCCESS', t(value.message))
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }
  async function getEvaluetionAllRequired() {
    const params = {
      search: null,
      pageNumber: null,
      pageSize: null,
      sort: null,
      courseId: route.params.id,
      isteacher: false,
      authorId: null,
      isActive: isViewReport.value,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetSurveyEvaluation, TYPE_REQUEST.GET, params).then(async (value: any) => {
      excludeIdsEval.value = value.data.pageLists.map((item: any) => item.surveyId)
      console.log(excludeIdsEval.value)
    })
  }
  async function deleteActionEval() {
    const params = {
      listId: dataEval.deleteIds,
    }
    console.log(params)
    await MethodsUtil.requestApiCustom(CourseService.PostDeleteSurveyEval, TYPE_REQUEST.POST, params).then((value: any) => {
      getEvaluetionRequired()
      dataEval.selectedRowsIds = []
      dataEval.deleteIds = []
      toast('SUCCESS', t(value.message))
    })
  }
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    // cost
    disabledDeleteCost,
    queryParamsCost,
    courseData,
    itemsCost,
    isShowDialogNotiDeleteCost,
    totalRecordCost,
    isShowModalAddCost,
    costData,
    getCostRequired,
    deleteItemsCost,
    deleteItemCost,
    confirmDialogDeleteCost,
    handleSearchCost,
    selectedRowsCost,
    handlePageClickCost,
    getCostCourseById,
    resetStateCostData,

    // đánh giá sau đào tạo
    itemsEval,
    excludeIdsEval,
    queryParamsEval,
    isShowDialogNotiDeleteEval,
    disabledDeleteEval,
    totalRecordEval,
    isShowModalAddEval,
    selectedRowsEval,
    deleteItemsEval,
    handleFilterEvaluationCombobox,
    getEvaluetionRequired,
    handleSearchEvaluation,
    confirmDialogDeleteEval,
    handlePageClickEval,
    getEvaluetionAllRequired,
    addSurveyCourse,
  }
})
