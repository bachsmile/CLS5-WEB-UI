import { defineStore } from 'pinia'
import type { Content } from '@/typescript/interface'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import toast from '@/plugins/toast'
import ArraysUtil from '@/utils/ArrayUtil'
import AuthUtil from '@/auth'
import DateUtil from '@/utils/DateUtil'

export const myCourseManagerStore = defineStore('myCourseManager', () => {
  /** store */
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()

  const getStatusCourse = (
    registrationType?: number,
    statusId?: number,
    isReviewExpired?: boolean,
    endDate?: any,
    startDate?: any,
    isExpired?: boolean) => {
    if (endDate) {
      const end: any = new Date(endDate)
      const now: any = new Date()
      if (now - end > 0 && isReviewExpired) {
        return {
          key: 6,
          btnValue: t('end'),
          badgeValue: t('QUE_Finished'),
          variant: 'light-danger',
        }
      }

      if (end - now > 0) {
        const start: any = new Date(startDate)
        if (start - now > 0 && statusId === -1) {
          return {
            key: 10,
            btnValue: t('sign-up'),
            badgeValue: t('sign-up'),
            variant: 'light-secondary',
          }
        }
      }
      else if (!isReviewExpired) {
        // isReviewExpried: true -> không cho phép xem lại khi khóa học kết thúc
        return {
          key: 11,
          btnValue: t('review'),
          badgeValue: t('review'),
          variant: 'light-secondary',
        }
      }
    }
    if (isExpired) {
      return {
        key: 11,
        btnValue: t('review'),
        badgeValue: t('review'),
        variant: 'light-secondary',
      }
    }
    switch (statusId) {
      case 0:
        // Đăng kí
        if (registrationType === 3) {
          // Không cho phép đăng kí
          return {
            key: 0,
            btnValue: t('NoAssign'),
            badgeValue: t('NoAssign'),
            variant: 'light-secondary',
          }
        }

        // Cho phép đăng kí
        return {
          key: 1,
          btnValue: t('login'),
          badgeValue: t('NoAssign'),
          variant: 'light-secondary',
        }
      case 2:
        // Bắt đầu học
        return {
          key: 2,
          btnValue: t('start-learn'),
          badgeValue: t('CourseService.NoStart'),
          variant: 'light-warning',
        }
      case 3:
        // Tiếp tục ngay
        return {
          key: 3,
          btnValue: t('continue-now'),
          badgeValue: t('CourseService.LearnerStudying'),
          variant: 'light-success',
        }
      case 4:
        // Hoàn thành
        // eslint-disable-next-line no-case-declarations
        const ends: any = new Date(endDate)
        // eslint-disable-next-line no-case-declarations
        const nows: any = new Date()
        if (isReviewExpired && (nows - ends > 0)) {
          return {
            key: 6,
            btnValue: t('accomplished'),
            badgeValue: t('accomplished'),
            variant: 'light-success',
          }
        }
        return {
          key: 3,
          btnValue: t('accomplished'),
          badgeValue: t('accomplished'),
          variant: 'light-success',
        }
      case 5:
        // Đang chờ (đã đăng kí và đợi phản hồi)
        return {
          key: 4,
          btnValue: t('Pending'),
          badgeValue: t('waiting-response'),
          variant: 'light-warning',
        }
      case 6:
        // Đăng kí bị từ chối
        return {
          key: 5,
          btnValue: t('denied-accept'),
          badgeValue: t('denied-accept'),
          variant: 'light-danger',
        }
      case 10:
        // Đã kết thúc
        return {
          key: 6,
          btnValue: t('end'),
          badgeValue: t('end'),
          variant: 'light-secondary',
        }
      case 11:
        // Sắp diễn ra
        return {
          key: 7,
          btnValue: t('ComingSoon'),
          badgeValue: t('ComingSoon'),
          variant: 'light-warning',
        }
      default:
        return {
          key: 1,
          btnValue: t('login'),
          badgeValue: t('NoAssign'),
          variant: 'light-secondary',
        }
    }
  }
  const pageOption = ref({
    pageNumber: 1,
    pageSize: 5,
  })
  const isReview = ref(false)
  const isShowContent = ref(false)
  const contentRef = ref()
  const isMoblie = ref(false)

  /** ************************************************ Store các nội dung khóa học của tôi**********************************************/

  /** => biến tổng */
  const isBeforeUnload = ref(false) // trạng thái dừng trước khi reload trang
  const contentCurrent = ref<Content>({
    content: '',
    contentArchiveTypeId: null,
    courseContentId: null,
    courseContentName: null,
    endDate: null,
    id: null,
    statusId: 0,
    isAfterTime: false,
    isAnswerTheQuestion: true,
    isComplete: false,
    isRewind: false,
    minuteOfLearn: 0,
    noticeTimeAttendance: 0,
    startDate: null,
    statusName: null,
    timeLearned: 0,
    urlFile: '',
    essayContent: null,
    urlFileEssay: null,
    completeRatio: 0,
    urlFileName: null,
    acceptDownload: false,
    time: 0,
    isSpeed: null,
    comment: null,
  })
  const currentContentTypeId = ref<any>()
  const courseData = ref()
  const contentList = ref<any[]>([]) // cập nhật dữ liệu
  const studyTime = ref()
  const isCompletedContent = ref(false)
  const isPause = ref(true)
  const isVolume = ref(true)
  const volume = ref(0)
  async function GetListContentCourseById(courseId: number) {
    const params = {
      courseId,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetListContentCourseById, TYPE_REQUEST.GET, params).then((value: any) => {
      console.log(value)
      courseData.value = value.data
      contentList.value = contentList.value = ArraysUtil.formatTreeTable(ArraysUtil.unFlatMapTree(value.data?.contents), 'id')

      // isShowContent.value = value.data.statusName !== 'CourseService.CourseService.NoStart'
    })
  }
  async function getDetailContent(courseContentId: number) {
    const params = {
      courseContentId,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetDetailContent, TYPE_REQUEST.GET, params).then((value: any) => {
      console.log(value)
      contentCurrent.value = value.data
      router.replace({ name: 'course-learning', query: { contentId: contentCurrent.value.courseContentId } })
    })
  }

  /***
 * các trạng thái hoàn thành
 */

  /**
   *
   * @param itemContent
   * @returns {
 *  type: 1(bấm nút hoàn thành) | 2 (sau khoảng thời gian) | 3 (trả lời câu hỏi) | 4 (sau khoảng thời gian trả lời câu hỏi),
 *  data: itemContent ( dữ liệu content)
 * }
 */
  const doingComplete = ref<any>(null)
  const isViewQuestion = ref<any>(false)
  const studyTimeFormat = computed(() => {
    return DateUtil.formatTimeSecondToCustom(studyTime.value)
  })

  function switchToAnswerQuestion() {
    pauseMedia()
    isViewQuestion.value = !isViewQuestion.value

    // if (this.isCompletedContent) {
    //   this.updatePopoverInfo(
    //     '',
    //     'common.question-end-course',
    //     'learner.content-course.question-complete-warning',
    //     false, false,
    //   )
    // }
    // else {
    //   if (this.timeOutAnswerQuestionTooltip)
    //     this.clearTimeoutUpdatePopover()

    //   this.updatePopoverInfo(
    //     this.isViewQuestion ? 'btn-show-question' : '',
    //     'common.question-end-course',
    //     'learner.content-course.question-complete-warning',
    //     this.isViewQuestion, false,
    //   )
    //   this.timeOutAnswerQuestionTooltip = setTimeout(() => {
    //     this.clearTimeoutUpdatePopover()
    //   }, 3000)
    // }
  }
  function checkTypeDoingComplete(itemContent: any) {
    console.log(itemContent)
    if (itemContent.isComplete) {
      doingComplete.value = {
        title: t('finish'),
        color: 'success',
        isShow: true,
        type: 1,
        action: setCompleteContent,
        data: itemContent,
      }
    }
    else if (itemContent.isAfterTime && itemContent.isAnswerTheQuestion) {
      doingComplete.value = {
        title: t('question'),
        titleSub: t('content'),
        color: 'warning',
        isShow: true,
        isBtn: false,
        type: 4,
        action: switchToAnswerQuestion,
        data: itemContent,
      }
    }
    else if (itemContent.isAfterTime) {
      doingComplete.value = {
        color: 'success',
        isShow: true,
        type: 2,
        data: itemContent,
      }
    }
    else if (itemContent.isAnswerTheQuestion) {
      doingComplete.value = {
        title: t('question'),
        titleSub: t('content'),
        color: 'warning',
        isShow: true,
        type: 3,
        action: switchToAnswerQuestion,
        data: itemContent,
      }
    }
    else {
      doingComplete.value = {
        isShow: false,
      }
    }

    return doingComplete.value
  }

  /*
        Đặt hoàn thành nội dung khóa học
        Nếu là nội dung học online thì lưu tiến trình thành 100% và thời gian học là thời gian diễn ra của nội dung
        Nếu là nội dung iframe thì lưu tiến trình thành 100%
    */
  async function setCompleteContent() {
    console.log('setCompleteContent')

    const params = {
      CourseContentId: contentCurrent.value.courseContentId,
      TimeLearned: studyTime.value - contentCurrent.value.timeLearned > 0 ? studyTime.value - contentCurrent.value.timeLearned : 0,
    }
    await MethodsUtil.requestApiCustom(CourseService.PostCompleteContent, TYPE_REQUEST.POST, params).then((response: any) => {
      // set thời gian đã học
      contentCurrent.value.timeLearned = Math.min(studyTime.value, contentCurrent.value.time || 0)
      isCompletedContent.value = true
      console.log(currentContentTypeId.value)

      if (currentContentTypeId.value === 3) {
        updateContentCourseUser(contentCurrent.value.id, 100, contentCurrent.value.time)
        changeProgressContent(contentCurrent.value.courseContentId, 100)
      }
      if (currentContentTypeId.value === 9) {
        updateContentCourseUser(contentCurrent.value.id, 100, studyTime.value)
        changeProgressContent(contentCurrent.value.courseContentId, 100)
      }
      changeStatusContent(contentCurrent.value.courseContentId, 'CourseService.LearnerCompleted')

      toast('SUCCESS', t('confirm-complete-course'))
    })
      .catch((err: any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
  }

  // Cập nhật tiến trình nội dung
  function changeProgressContent(contentId?: number | null, progress = 0) {
    if (!contentId)
      return
    if (contentCurrent.value.courseContentId === contentId && ((contentCurrent.value.contentArchiveTypeId === 7 && progress > contentCurrent.value.completeRatio) || contentCurrent.value.contentArchiveTypeId !== 7))
      contentCurrent.value.completeRatio = progress

    const changedContent = contentList.value.find(item => item.courseContentId === contentId)
    if (changedContent && ((changedContent.contentArchiveTypeId === 7 && progress > changedContent.completeRatio) || changedContent.contentArchiveTypeId !== 7))
      changedContent.completeRatio = progress
  }

  // Cập nhật  tiến trình khóa học
  function changeCourseProgress(progress: number) {
    courseData.value.progress = progress
  }
  function updateProgressCourse() {
    const listCompletedContent = contentList.value.filter(item => item.statusName === 'CourseService.LearnerCompleted')
    const newCourseProgress = Math.round((listCompletedContent.length * 100) / contentList.value.length)
    changeCourseProgress(newCourseProgress)
  }

  // Cập nhật nội dung học tập của người dùng bao gồm tiến trình và thời gian học lên server
  async function updateContentCourseUser(id: any, completeRatio: any, timeLearned: any, currentContent?: any, isBeforeUnloadPr = false) {
    if (!isBeforeUnloadPr && isBeforeUnload.value)
      return
    const payload = {
      id,
      completeRatio: Math.min(100, completeRatio),
      timeLearned,
    }
    const token = AuthUtil.getToken()
    const url = `${process.env.VUE_APP_BASE_API}/learner/update-course-content-user`
    await fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
    ).then(() => {
      currentContent.timeLearned = Math.min(currentContent.timeLearned + payload.timeLearned, currentContent.time)
      isBeforeUnload.value = false
    }).catch(() => {
      isBeforeUnload.value = false
    })
  }

  // Cập nhật trạng thái nội dung
  function getContentById(contentId: any) {
    return (contentId ? contentList.value.find(x => x.listCourseContent[0].courseContentId === contentId) : contentList.value[0])
  }
  function changeStatusContent(contentId: any, status: string) {
    console.log(contentId)
    const changedContent = getContentById(contentId)
    console.log(changedContent)

    if (changedContent)
      changedContent.listCourseContent[0].statusName = status
    if (status === 'CourseService.LearnerCompleted')
      updateProgressCourse()
  }

  /***
 * các trạng thái hoàn thành
 */

  // lấy thông tin nội dung bài khảo sát của người dùng
  const isReTest = ref(false) // cờ làm lại

  /*
      Lấy thông tin kết quả thực hiện bài kiểm tra của thí sinh.
      viewMode = 0: hiển thị kết quả theo cấu hình (lấy theo kết quả cao nhất hoặc cuối cùng tùy vào cài đặt)
      viewMode > 0: hiển thị kết quả theo lần thi truyền vào
      viewMode = null: hiển thị kết quả lần thi gần nhất, kết quả trả về biến isComplete = false
      thì bài thi đang làm chưa hoàn thành, true thì đã hoàn thành
      Lỗi 400 thì thí sinh chưa làm bài thi lần nào
    */
  async function getUserTestSurveyResult(viewMode: number | null) {
    const { courseContentId } = contentCurrent.value
    const params = { courseContentId, numberOfRetake: viewMode }
    return await MethodsUtil.requestApiCustom(CourseService.GetSurveyStart, TYPE_REQUEST.GET, params)
  }

  /// // video//////
  /*
      Hàm theo dõi thời gian nội dung video và âm thanh khi update,
      Nếu thời lượng thay đổi thì lấy thời gian xem trước đó nếu có và lưu lại
      Nếu thời gian xem thay đổi thì kiểm tra nếu lớn hơn lastpointer thì gán thời gian là last pointer
     */
  const total = ref(100)
  const lastPointer = ref(0)
  const currentProgressMedia = ref(0)
  const disableMediaProcessing = ref(false)
  const noSaveLastPointer = ref(false) // không lưu lastPointer ( đối với nội dung video cho phép tua)
  const countTimeVideoAndAudio = ref(false) // trạng thái đang tính thời gian ( đối với nội dung video & audio sau khoản thời gian)
  /*
      Lưu thông tin học của người dùng về máy chủ gồm progress và thời gian học
      Thông tin được lưu lại khi người dùng chuyển nội dung, thoát khỏi trang hoặc khi hoàn thành khóa học
    */
  async function saveUserLearningData(currentContent: any, isBeforeUnloadPr = false) {
    // Chỉ cập nhật cho các loại nội dung: nội dung thường, video, âm thanh, tài liệu, Iframe
    if (
      currentContent
              && !currentContent.isDataEmpty
              && [1, 2, 4, 5, 6, 9].includes(currentContent.contentArchiveTypeId)
    ) {
      const completeRatio = total.value > 0 ? Math.round((((100 * lastPointer.value) / total.value) * 10000)) / 10000 : 0
      const studyTimePr = studyTime.value - currentContent.timeLearned > 0 ? studyTime.value - currentContent.timeLearned : 0
      await updateContentCourseUser(currentContent.id,
        Math.max(completeRatio, currentContent.completeRatio),
        Math.min(currentContent.time, Math.round(studyTimePr * 10000) / 10000),
        currentContent, isBeforeUnloadPr)
    }
  }
  function timeUpdateChange(value: any) {
    if (value.durationTime && value.durationTime > 0) {
      total.value = Math.ceil(value.durationTime)
      lastPointer.value = Math.round(((contentCurrent.value.completeRatio / 100) * total.value) * 10000) / 10000
      setCurrentProgressLearning(lastPointer.value)
      return
    }
    if (value.currentTime) {
      const currentProgress = Math.round(Math.min(value.currentTime ? value.currentTime : 0, total.value) * 10000) / 10000
      if (contentCurrent.value.completeRatio < 100) {
        if (!contentCurrent.value.isRewind) {
          studyTime.value = studyTime.value < currentProgress ? Math.ceil(currentProgress) : studyTime.value
        }
        else if (contentCurrent.value.isRewind && Math.ceil(currentProgress) === Math.ceil(lastPointer.value)) {
          noSaveLastPointer.value = false
          studyTime.value = studyTime.value < currentProgress ? Math.ceil(currentProgress) : studyTime.value
        }
      }
      else if (contentCurrent.value.completeRatio === 100) {
        countTimeVideoAndAudio.value = true
      }
      else {
        countTimeVideoAndAudio.value = false
      }
      if (Math.ceil(currentProgress) > total.value - 1) {
        currentProgressMedia.value = total.value
        if (!noSaveLastPointer.value)
          saveLastPointer(total.value)

        return
      }
      currentProgressMedia.value = currentProgress
      if (!noSaveLastPointer.value)
        saveLastPointer(currentProgress)
    }
  }
  function setCurrentProgressLearning(value: any) {
    if (contentCurrent.value.completeRatio === 100)
      return
    if (contentCurrent.value.contentArchiveTypeId === 4 && contentRef.value?.duration && value >= contentRef.value?.duration)
      return
    changeCurrentProgressLearning(value, true)
  }
  function pauseMedia() {
    if (disableMediaProcessing.value)
      return
    isPause.value = true
    contentRef.value?.pause()
  }

  // cài đặt tiến trình hiện tại của đoạn media
  function changeCurrentProgressLearning(value: any, isUpdateLastPointer = false) {
    contentRef.value?.seekTo(value, isUpdateLastPointer)

    // setToPage(value)
    console.log(contentRef.value)

    // contentRef.value?.setCurrent(value)
  }
  function setToPage(value: any) {
    if (contentRef.value) {
      contentRef.value?.setToPage(value)
      if (isMoblie && contentRef.value.$el)
        contentRef.value.$el.scrollTop = 0
    }
  }
  function saveLastPointer(value: any) {
    lastPointer.value = value > lastPointer.value ? value : lastPointer.value
  }

  /// ////Khảo sát/////////////
  const surveyData = ref()
  const surveyQuestion = ref<any>([])
  async function checkSurveyInfo() {
    // không phải làm lại
    console.log(isReTest)
    if (!isReTest.value) {
      // kiểm tra thông tin bài khảo sát đã có đề tạo chưa
      await getUserTestSurveyResult(null).then(async (result: any) => {
        console.log(result)

        // if (result && result.data && result.data.isSuspended) {
        //   this.handleSuspendUser()
        //   this.isLoading = false
        //   return
        // }

        // đã có đề
        if (result && result.data && result.data.isComplete) {
          result = await getUserTestSurveyResult(0)
          console.log(result)

          // if (result && result.data
          // && this.dataContent.statusName !== 'CourseService.LearnerCompleted'
          // && (
          //   !this.dataContent.isAfterTime
          //   || (this.dataContent.isAfterTime && this.dataContent.minuteOfLearn <= this.dataContent.timeLearned)
          // )
          // && (result.data.isPass
          // || ((this.dataContent.contentArchiveTypeId === 11
          //   || (this.dataContent.contentArchiveTypeId === 10
          //       && ((!result.data.isCompleteEnoughPoints && !result.data.numberOfRetake)
          //         || (!result.data.isCompleteEnoughPoints && result.data.numberOfRetake > 0 && result.data.userPoint >= result.data.requiredPointRatio)
          //         || (result.data.isCompleteEnoughPoints && result.data.userPoint >= result.data.requiredPointRatio))))
          //   && result.data.isComplete))) {
          //   const params = {
          //     id: this.dataContent.id,
          //   }
          //   const { data } = await this.$store.dispatch('learn/updateStatusComplete', params)
          //   if (data) {
          //     this.changeStatusContent({ contentId: this.dataContent.courseContentId, status: 'CourseService.LearnerCompleted' })
          //     if (this.dataContent.completeRatio < 100 && [3, 10, 11, 12].includes(this.dataContent.contentArchiveTypeId))
          //       this.changeProgressContent({ contentId: this.dataContent.courseContentId, progress: 100 })
          //   }
          // }
        }
      }).catch(async () => {
        // Thí sinh chưa thi lần nào thì tạo đề
        const paramsGenerate = {
          courseContentId: contentCurrent.value.courseContentId,
        }

        // request tạo đề
        await MethodsUtil.requestApiCustom(CourseService.PostGenerateSurvey, TYPE_REQUEST.POST, paramsGenerate)
      })
    }
  }

  // lấy thông tin đề đã được tạo
  async function getSurveyInfo() {
    const params = {
      courseContentId: contentCurrent.value.courseContentId,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetQuestionSurvey, TYPE_REQUEST.GET, params).then((value: any) => {
      surveyData.value = value.data
      surveyQuestion.value = value.data?.listQuestions
      pageOption.value.pageSize = value.data.totalQuestionDisplayInPage
    })
  }

  /// ////Kỳ thi/////////////

  /** ******************************************************************************************************************************** */

  /** **general */
  function resetInit() {
    studyTime.value = 0
  }

  /** **general */
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })
  watch(contentCurrent, newValue => {
    isCompletedContent.value = newValue?.statusName === 'CourseService.LearnerCompleted'
    resetInit()

    nextTick(() => {
      studyTime.value = Math.round(contentCurrent.value.timeLearned)
    })
  })
  return {
    // ref
    contentRef,
    getStatusCourse,

    /** Khóa học của tôi */
    isViewQuestion,
    isShowContent,
    isPause,
    isVolume,
    lastPointer,
    volume,
    studyTime,
    courseData, // nội dung khóa học
    contentList, // danh sách nội dung
    contentCurrent, // nội dung học hiện tại
    currentContentTypeId,
    pageOption,
    isReview,
    doingComplete,
    isCompletedContent,
    studyTimeFormat,
    getDetailContent, // lấy thông tin của nội dung theo id
    GetListContentCourseById, // danh sách nội dung và chuyên  đề

    checkTypeDoingComplete, // check thể loại hoàn thành
    timeUpdateChange,
    changeStatusContent,
    saveUserLearningData,

    /** khảo sát */
    surveyData,
    surveyQuestion,
    checkSurveyInfo, // kiểm tra thông tin khảo sát để tạo đề
    getSurveyInfo, // tạo đề khảo sát
  }
})
