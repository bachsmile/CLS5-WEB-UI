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
  const videoData = ref({
    courseId: null as null | number,
    archiveTypeId: 0,
    description: '',
    name: '',
    url: null as null | string,
    urlFileName: null as null | string,
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
  const dataInitVideo = ref(window._.cloneDeep(videoData.value))

  /** method */
  // lấy loại nội dung
  function getTypeContent(value: number) {
    switch (value) {
      case 1:
        return 'text-content'
      case 2:
        return 'web-content'
      case 3:
        return 'online-content'
      case 4:
        return 'video-content'
      case 5:
        return 'audio-content'
      case 6:
        return 'document-content'
      case 7:
        return 'scorm-content'
      case 8:
        return 'flash-content'
      case 9:
        return 'iframe-content'
      case 10:
        return 'test-content'
      case 11:
        return 'survey-content'
      case 12:
        return 'essay-content'
      case 16:
        return 'offline-content'
      default:
        return 'text-content'
    }
  }
  function getErrorsMessage(errorsMess: Array<any>) {
    let str = ''
    errorsMess.forEach(element => {
      str += `${t(element.message, element.params)}`
      str += '. '
    })

    return str
  }
  function resetDataVideo() {
    videoData.value = dataInitVideo.value
  }
  async function handleUpdateContent(idx: any, isSaveAndUpdate: boolean) {
    let response = null
    const isUpdates = videoData.value.courseContentId && videoData.value.courseContentId !== null
    window.showAllPageLoading('COMPONENT')

    if (videoData.value.acceptDownload === null)
      videoData.value.acceptDownload = false

    if (isUpdates) {
      response = await MethodsUtil.requestApiCustom(CourseService.PostUpdateContent, TYPE_REQUEST.POST, videoData.value)
    }
    else {
      videoData.value.courseId = Number(route.params.id)
      response = await MethodsUtil.requestApiCustom(CourseService.PostCreateContent, TYPE_REQUEST.POST, videoData.value)
    }
    window.hideAllPageLoading()
    let variant = true
    let message = response?.message
    if (response.code === 200) {
      videoData.value = dataInitVideo.value
      if (isSaveAndUpdate === true) {
        contentId.value = response.data
        unLoadComponent(idx)
        await fetchContent(contentId.value, true)

        router.push({
          name: 'content-edit',
          params: {
            id: Number(route.params.id),
            tab: route.params.tab,
            type: 'video',
            contentTab: 'infor',
            contentId: contentId.value,
          },
        })
      }
      else {
        unLoadComponent(idx)
        router.push({ name: 'course-edit', params: { tab: 'content', id: Number(route.params.id) } })
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
    console.log(id)
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
        videoData.value = value?.data
      }
      console.log(videoData.value)

      if (videoData.value.archiveTypeId !== 12)
        await fetchConditionAttend(videoData.value.courseContentId)
      if (videoData.value.archiveTypeId !== 10 && videoData.value.archiveTypeId !== 11 && videoData.value.archiveTypeId !== 12)
        await fetchConditionComplete(videoData.value.courseContentId)
      isUpdate.value = true
      typeContent.value = getTypeContent(videoData.value.archiveTypeId)
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

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    /** Nội dung video */
    courseData,
    videoData,
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
    resetDataVideo,
    fetchConditionAttend,
    changeType,
    getQuestionsData,
  }
})
