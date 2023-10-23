import { defineStore } from 'pinia'
import type { Content } from '@/typescript/interface'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { myExamCourseManagerStore } from '@/stores/user/course/courseExam'

export const myCourseManagerStore = defineStore('myCourseManager', () => {
  /** store */
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()
  const myExamCourseManagerManager = myExamCourseManagerStore()
  const { } = storeToRefs(myExamCourseManagerManager)
  const { getExamInfo, getTestQuestion } = myExamCourseManagerManager
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
  const isRenderedContent = ref(false)

  /** ************************************************ Store các nội dung khóa học của tôi**********************************************/

  /** => biến tổng */
  const contentCurrent = ref<Content>({
    content: '',
    contentArchiveTypeId: null,
    courseContentId: null,
    courseContentName: null,
    endDate: null,
    id: null,
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
  const courseData = ref()
  async function GetListContentCourseById(courseId: number) {
    const params = {
      courseId,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetListContentCourseById, TYPE_REQUEST.GET, params).then((value: any) => {
      console.log(value)
      courseData.value = value.data
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
  async function changeContent(courseContentId: any) {
    await getDetailContent(courseContentId)
    await changeCurrentContent()
  }
  async function changeCurrentContent() {
    isRenderedContent.value = false
    if (contentCurrent.value.contentArchiveTypeId === 11) {
      await checkSurveyInfo()
      await getSurveyInfo()
    }
    else if (contentCurrent.value.contentArchiveTypeId === 10) {
      await getExamInfo().then(() => {
        getTestQuestion().then(value => {
          isRenderedContent.value = true
        })
      })
    }
    else {
      isRenderedContent.value = true
    }
  }

  /**
   *
   * @param itemContent
   * @returns {
   *  type: 1(bấm nút hoàn thành) | 2 (sau khoảng thời gian) | 3 (trả lời câu hỏi) | 4 (sau khoảng thời gian trả lời câu hỏi),
   *  data: itemContent ( dữ liệu content)
   * }
   */
  const doingComplete = ref<any>(null)
  function checkTypeDoingComplete(itemContent: any) {
    if (itemContent.isComplete) {
      doingComplete.value = {
        type: 1,
        data: itemContent,
      }
    }
  }

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
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    getStatusCourse,

    /** Khóa học của tôi */
    courseData, // nội dung khóa học
    contentCurrent, // nội dung học hiện tại
    pageOption,
    isReview,
    isRenderedContent,
    doingComplete,
    getDetailContent, // lấy thông tin của nội dung theo id
    GetListContentCourseById, // danh sách nội dung và chuyên  đề
    changeContent, // xử lý khi change content
    changeCurrentContent,
    checkTypeDoingComplete, // check thể loại hoàn thành
    /** khảo sát */
    surveyData,
    surveyQuestion,
    checkSurveyInfo, // kiểm tra thông tin khảo sát để tạo đề
    getSurveyInfo, // tạo đề khảo sát
  }
})
