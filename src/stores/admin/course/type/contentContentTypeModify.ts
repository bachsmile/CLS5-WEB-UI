import { defineStore } from 'pinia'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CourseService from '@/api/course/index'
import { load } from '@/stores/loadComponent.js'
import toast from '@/plugins/toast'

export const contentTypeManagerStore = defineStore('contentTypeManager', () => {
  /** lib ****************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()

  /**
 * Store
 */
  const store = load()
  const { unLoadComponent } = store

  /** ********************************Nội dung video******************************************** */
  /** state */
  const isNumberPerPage = ref(false)
  const isShowRandom = ref(false)
  const isTimeOfWork = ref(false)
  const isAutoLog = ref(false)
  const isAllowRetake = ref(false)
  const minuteWork = ref(0)
  const secondWork = ref(0)
  const contentData = ref({
    courseId: null as null | number,
    archiveTypeId: 0,
    description: '',
    name: '',
    url: null as null | string,
    urlFileName: null as any,
    urlCdn: '',
    ownerId: null,
    courseContentId: null,
    dateTimeStart: null,
    dateTimeEnd: null,
    isRewind: false,
    isSpeed: false,
    isCustomTime: false,
    isPdf: false,
    themeticId: null,
    timeTypeId: 1,
    isApprove: false,
    isAutoTestCode: false,
    time: 0,
    isArchive: false,
    acceptDownload: null as null | boolean,
    timeVideoOrSound: 0,
    testConfig: {
      courseContentId: null,
      isShuffleQuestion: false,
      requiredPointRatio: 80,
      totalQuestionDisplayInPage: 0,
      randomQuestion: 0,
      minuteOfWork: 0,
      writeLogMinute: 0,
      numberOfRetake: 0,
      retakeResultType: 0,
      isDisplayResult: false,
      isCorrectAnswer: false,
      timeFinish: 0,
      isPreserveTime: false,
      isReviewTheTest: false,
      isMaintainStatus: false,
      isCompleteEnoughPoints: false,
    },
  })
  const testConfig = ref<any>({
    pointRatio: 0,
    courseContentId: null,
    isShuffleQuestion: false,
    requiredPointRatio: 80,
    totalQuestionDisplayInPage: 0,
    randomQuestion: 0,
    minuteOfWork: 0,
    writeLogMinute: 0,
    numberOfRetake: 0,
    retakeResultType: 0,
    reviewId: undefined as any,
    isRequiredRetest: false,
    isDisplayPoint: false,
    isDisplayResult: false,
    isCorrectAnswer: false,
    timeFinish: 0,
    isPreserveTime: false,
    isReviewTheTest: false,
    isMaintainStatus: false,
    isCompleteEnoughPoints: false,
    isDisplayFalseAnswer: false,
  })
  const courseData = ref()
  const myFormSettingConditions = ref()
  const contentId = ref()
  const typeContent = ref()
  const conditionAttend = ref<any>(
    {
      archiveId: null,
      courseContentId: null,
      courseId: null,
      dateTimeStart: '',
      dateTimeEnd: '',
      lesionRequire: [],
    },
  )
  const conditionComplete = ref<any>({
    archiveId: null,
    courseContentId: null,
    courseId: null,
    isAfterTime: false,
    isAnswerTheQuestion: false,
    isComplete: false,
    noticeTimeAttendance: 0,
    numberOfAttendance: 0,
    pointRatio: 0,
    time: 0,
    timeFinish: 0,
    timeTypeId: 0,
  })
  const isViewDetail = ref(false)
  const isUpdate = ref(false)
  const timeComplete = ref(0)
  const dataInitContent = ref(window._.cloneDeep(contentData.value))

  /** method */
  function getErrorsMessage(errorsMess: Array<any>) {
    let str = ''
    errorsMess.forEach(element => {
      str += `${t(element.message, element.params)}`
      str += '. '
    })

    return str
  }
  function resetData() {
    contentData.value = dataInitContent.value
  }
  async function handleUpdateContent(idx: any, isSaveAndUpdate: boolean) {
    let response = null
    const isUpdates = contentData.value.courseContentId && contentData.value.courseContentId !== null
    window.showAllPageLoading('COMPONENT')

    if (contentData.value.acceptDownload === null)
      contentData.value.acceptDownload = false

    if (isUpdates) {
      response = await MethodsUtil.requestApiCustom(CourseService.PostUpdateContent, TYPE_REQUEST.POST, contentData.value)
    }
    else {
      contentData.value.courseId = Number(route.params.id)
      response = await MethodsUtil.requestApiCustom(CourseService.PostCreateContent, TYPE_REQUEST.POST, contentData.value)
    }
    window.hideAllPageLoading()

    let variant = true
    let message = response?.message
    if (response.code === 200) {
      contentData.value = dataInitContent.value
      if (isSaveAndUpdate === true) {
        contentId.value = response.data
        unLoadComponent(idx)
        await fetchContent(contentId.value, true)

        router.push({
          name: 'content-edit',
          params: {
            id: Number(route.params.id),
            type: route.params.type,
            contentId: contentId.value,
          },
          query: {
            contentTab: 'infor',
            tab: route.params.tab,
          },
        })
      }
      else {
        unLoadComponent(idx)
        router.push({ name: 'course-edit', params: { id: Number(route.params.id) }, query: { tab: 'content' } })
      }
    }
    else {
      variant = false
      if (response.errors.length > 0)
        message = getErrorsMessage(response.errors)
    }
    unLoadComponent(idx)
    toast(variant ? 'SUCCESS' : 'ERROR', t(message))
  }

  // lấy nội dung điều kiện tham gia khóa học
  async function fetchConditionAttend(id?: number | null) {
    const params = {
      id,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetRequireParticipate, TYPE_REQUEST.GET, params).then((value: any) => {
      conditionAttend.value = value.data
      if (value.data.dateTimeStart && value.data.dateTimeStart !== null) {
        const starts = value.data.dateTimeStart.split('T')
        if (starts.length > 1) {
          conditionAttend.value.startTime = starts[1].trim()
          conditionAttend.value.startDay = starts[0].replace('Z', '').trim()
        }
      }
      if (value.data.dateTimeEnd && value.data.dateTimeEnd !== null) {
        const ends = value.data.dateTimeEnd.split('T')
        if (ends.length > 1) {
          conditionAttend.value.endTime = ends[1].trim()
          conditionAttend.value.endDay = ends[0].replace('Z', '').trim()
        }
      }
    })
  }

  // lấy nội dung điều kiện hoàn thành khóa học
  async function fetchConditionComplete(id: any) {
    const params = {
      id,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetRequireFinish, TYPE_REQUEST.GET, params).then((value: any) => {
      if (value.data)
        conditionComplete.value = value.data
    })
  }

  async function fetchContent(id: any, isView = false) {
    const params = {
      id, isView: isView === true ? true : isViewDetail.value,
    }
    return await MethodsUtil.requestApiCustom(CourseService.GetInforContentById, TYPE_REQUEST.GET, params).then(async (value: any) => {
      if (value?.data) {
        value.data.themeticId = value.data.themeticId ? value.data.themeticId : null
        contentData.value = value?.data
      }

      if (contentData.value.archiveTypeId !== 12)
        await fetchConditionAttend(contentData.value.courseContentId)
      if (contentData.value.archiveTypeId !== 10 && contentData.value.archiveTypeId !== 11 && contentData.value.archiveTypeId !== 12)
        await fetchConditionComplete(contentData.value.courseContentId)
      isUpdate.value = true
      typeContent.value = MethodsUtil.getTypeContent(contentData.value.archiveTypeId)
    })
  }
  function changeType(val: any, type: string) {
    conditionComplete.value[type] = val
    if (val && type === 'isComplete') {
      conditionComplete.value.isAfterTime = false
      conditionComplete.value.isAnswerTheQuestion = false
    }
    if (val && ['isAfterTime', 'isAnswerTheQuestion'].includes(type))
      conditionComplete.value.isComplete = false
  }
  function getQuestionsData() {
    return []
  }

  // youtobe
  // local
  // cdn
  // đăng ký state
  const stateInit = ref<any>({})
  const $reset = (listState: any) => MethodsUtil.$reset(stateInit)(listState)
  onMounted(() => {
    MethodsUtil.registerState([
      { courseData },
      { contentData },
      { timeComplete },
      { isUpdate },
      { contentId },
      { isViewDetail },
      { conditionAttend },
      { conditionComplete },
      { testConfig },
      { myFormSettingConditions },
      { isNumberPerPage },
      { isShowRandom },
      { isTimeOfWork },
      { isAutoLog },
      { isAllowRetake },
      { minuteWork },
      { secondWork },
    ], stateInit)
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    /** Nội dung video */
    courseData,
    contentData,
    timeComplete,
    isUpdate,
    contentId,
    isViewDetail,
    conditionAttend,
    conditionComplete,
    testConfig,
    myFormSettingConditions,
    isNumberPerPage,
    isShowRandom,
    isTimeOfWork,
    isAutoLog,
    isAllowRetake,
    minuteWork,
    secondWork,
    handleUpdateContent,
    fetchContent,
    resetData,
    fetchConditionAttend,
    changeType,
    getQuestionsData,
    $reset,
  }
})
