import { nextTick } from 'vue'
import { defineStore } from 'pinia'
import * as signalR from '@microsoft/signalr'
import ExamService from '@/api/exam'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import { fetchData } from '@/mock/exam/'
import ExamMethodsUtil from '@/stores/user/exam/examMethod'
import AuthUtil from '@/auth'
import SystemService from '@/api/system/index'
import { myCourseManagerStore } from '@/stores/user/course/course'
import CourseService from '@/api/course/index'

export const myExamCourseManagerStore = defineStore('myExamCourseManager', () => {
  const myCourseManagerManager = myCourseManagerStore()
  const { contentCurrent, surveyData, surveyQuestion, pageOption, isReview } = storeToRefs(myCourseManagerManager)

  /** store */
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()
  const examControlRef = ref<any>()
  const examData = ref<any>({})
  const isComplete = ref(false)
  const isDoing = ref(false)
  const isSuspendedExam = ref(false)
  const isExamAntiCheating = ref(false)
  const disableSubmitBtn = ref(false)
  const storageKey = ref('exam')
  const userViolation = ref<any>()
  const connection = ref<any>(null)
  const examId = ref<any>(null)
  const quantityFileUploading = ref<number>(0)
  const numberOfRetake = ref<any>(null)
  const timer = ref<any>(null)
  const isShowModalAntiCheat = ref(false)
  const isShowModalSuspended = ref(false)
  const isShowModalUploading = ref(false)
  const textButtonOkConfirmModal = ref('')
  const contentConfirmModal = ref('')
  const isNotice = ref(true)
  const isConnected = ref(true)
  const isLoadingConnect = ref(false)
  const isUploadFile = ref(true)
  const isInTroduceView = ref(true)
  const disableAntiCheating = ref(false)
  const isSubmitting = ref(false)
  const isShowMdAccessCamera = ref(false)
  const isShowMdCaptureImage = ref(false)
  const isShowSubmitError = ref(false)

  /** question */
  const questionStore = ref<any>()
  const questions = ref<any>()
  const totalQuestion = ref(0)
  const totalPoint = ref(0)
  const amountAnswered = ref<any>()
  const reviewOption = ref<any>()
  const localData = ref<any>()

  const accessDeviceContent = ref('') // nội dung thông báo access camera
  const isHaveDevice = ref(false) // kiểm tra có thiết bị

  /** ********************************** signal và kết nối *************************/

  async function connectionSignalR() {
    try {
      const serverToken = localStorage.getItem('accessToken')
      const url = `${window.SERVER_SIGNAL}/hubs/examhub?access_token=${serverToken}`
      connection.value = await new signalR.HubConnectionBuilder()
        .withUrl(url, {
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build()
      connection.value
        .start()
        .then(() => {
          if (connection.value.state === 'Connected') {
            // this.initalAttemptForChat = true
            connection.value?.invoke(
              'ConnectToExam',
              examData.value.examineeId,
              examData.value.testId,
              examData.value.testShiftId !== null ? examData.value.testShiftId : 0,
            )
          }

          // // event  nhận tin nhắn
          // connection.value.on('ReceiveDirectMessageLearner', message => {
          //   this.recieveMessage(message.message)
          // })

          // event yêu cầu nhận diện
          connection.value.on('IdentifyUser', (message: any) => {
            if (message) {
              if (navigator.mediaDevices) {
                navigator.mediaDevices
                  .getUserMedia({ video: true, audio: false })
                  .then(stream => {
                    accessDeviceContent.value = t(
                      'access-camera',
                    )
                    isHaveDevice.value = true

                    // this.selectSupervisionId = message.requestBy
                    checkShowModalIdentified()
                  })
                  .catch(() => {
                    accessDeviceContent.value = t(
                      'no-device',
                    )
                    isHaveDevice.value = false
                    checkShowModalIdentified()
                  })
              }
              else {
                accessDeviceContent.value = t('no-device')
                isHaveDevice.value = false
                checkShowModalIdentified()
              }
            }
          })

          // xử lý vi phạm
          connection.value.on('HandleViolation', (message: any) => {
            if (message) {
              switch (message.type) {
                case 1:
                  // eslint-disable-next-line no-case-declarations
                  let messageContent = ''
                  if (message?.reason) {
                    messageContent = `${t(
                      'tests.exam.you-have-deducted',
                    )} ${message.minusPoint} ${t(
                      'tests.exam.with-reason',
                    )} ${message.reason}`
                  }
                  else {
                    messageContent = `${t(
                      'tests.exam.you-have-deducted',
                    )} ${message.minusPoint} ${t(
                      'common.point',
                    )}`
                  }
                  toast('WARNING', t(messageContent))
                  break
                case 2:
                  // xóa thông tin lưu đáp án
                  localStorage.removeItem(storageKey.value)
                  examControlRef.value.stopTimerExam()
                  if (message?.reason) {
                    contentConfirmModal.value = `${t(
                      'tests.exam.suspending-message',
                    )}<br>${t('report.reason')}: ${message.reason}`
                  }
                  else {
                    contentConfirmModal.value = `${t(
                      'tests.exam.suspending-message',
                    )}`
                  }
                  isSuspendedExam.value = true
                  connection.value.invoke(
                    'RegisterSuspended',
                    examData.value.examineeId,
                    examData.value.testId,
                    examData.value.testShiftId,
                  )
                  isShowModalSuspended.value = true
                  break
                default:
                  break
              }
            }
          })
        })
        .catch(() => {
          // this.initalAttemptForChat = false
          connection.value = null
        })
    }
    catch (e) {
      toast('ERROR', t('no-connection-to-server'))
      throw e
    }
  }
  async function disConnectSignalR() {
    // phát sing signal disconnect
    await connection.value.invoke(
      'DisConnectToExam',
      examData.value.examineeId,
      examData.value.testId,
      examData.value.testShiftId !== null ? examData.value.testShiftId : 0,
    ).catch(() => {
      toast('ERROR', t('no-connection-to-server'))
    })
    if (connection.value?.stop())
      connection.value?.stop()?.catch(() => { toast('ERROR', t('no-connection-to-server')) })
  }

  // kiểm tra kết nối internet & thêm sự kiện lắng nghe
  async function checkConnect() {
    MethodsUtil.requestApiCustom(ExamService.GetCheckConnect, TYPE_REQUEST.GET).then((result: any) => {
      handleConnected()
    }).catch(() => {
      handleDisconnected()
    })
  }

  // Xử lý khi có kết nối mạng
  function handleConnected() {
    if (isConnected.value)
      return
    isConnected.value = true
    if (isInTroduceView.value)
      return
    isLoadingConnect.value = true
    continueExam()
    disableSubmitBtn.value = false
    isShowModalSuspended.value = false

    if (userViolation.value?.isFullScreen || userViolation.value?.notPageSwitching) {
      disableAntiCheating.value = false
      enableAntiCheating()
      const timerShowModal = setTimeout(() => {
        isShowModalAntiCheat.value = true
        clearTimeout(timerShowModal)
      }, 1200)
    }

    // delay để hiện thị thông báo kết nối thành công
    const timerDelay = setTimeout(() => {
      isLoadingConnect.value = false
      handleContinueTime()

      // hết thời gian nộp bài
      // if (this.$refs['exam-direction']?.time <= 0) {
      //   submitExam(1)
      //   return
      // }
      clearTimeout(timerDelay)
    }, 800)
  }

  // Xử lý khi mất kết nối mạng
  function handleDisconnected() {
    if (!isConnected.value) {
      isShowModalSuspended.value = true
      return
    }
    isConnected.value = false
    if (isInTroduceView.value)
      return
    isUploadFile.value = false

    isShowMdCaptureImage.value = false
    isShowMdAccessCamera.value = false
    isShowModalUploading.value = false

    // this.$bvModal?.hide(this.submitModalId)

    if (userViolation.value?.isFullScreen || userViolation.value?.notPageSwitching) {
      isShowModalAntiCheat.value = false
      disableAntiCheating.value = true
    }

    // this.$bvModal.hide('progress-upload-modal-id')
    disableSubmitBtn.value = true
    handleStopTime()
    isShowModalSuspended.value = false
    textButtonOkConfirmModal.value = t('import-file.try-again')
    contentConfirmModal.value = t('no-internet')
    isShowModalSuspended.value = true
  }

  /** ********************************** signal *************************/
  /** ********************************** Thiết lập  bài làm *************************/
  // lấy thông tin kỳ thi
  async function getExamInfo() {
    if (!isReview.value) {
      const params = {
        CourseContentId: contentCurrent.value.courseContentId,
      }
      return await MethodsUtil.requestApiCustom(CourseService.GetGetDataExam, TYPE_REQUEST.GET, params).then(async (result: any) => {
        if (!result.testShiftId || result.testShiftId === null)
          result.testShiftId = 0
        if (result?.isComplete === true) {
          isComplete.value = true
          return
        }
        if (result?.isSuspended === true) {
          examData.value = result
          isSuspendedExam.value = true
          return
        }
        await getDateServer()
        if (!result.testShiftId || result.testShiftId === null)
          result.testShiftId = 0

        if (result?.listTimeShot?.length)
          result.listTimeShot = result.listTimeShot.map((item: any) => parseInt(item, 10))

        examData.value = result.data
        const { isFullScreen, notPageSwitching, examineeStartTime } = examData.value
        if (isFullScreen || notPageSwitching)
          isExamAntiCheating.value = true
        handleAntiCheating(isFullScreen, notPageSwitching, examineeStartTime)
        storageKey.value = `exam_T${examData.value.testId}_E${examData.value.examineeId}`
      }).catch(() => {
        router.push({ name: 'error-404' })
      })
    }
    else {
      const params = {
        id: Number(route.params.id),
      }
      MethodsUtil.requestApiCustom(ExamService.GetExamResultInfo, TYPE_REQUEST.GET, params).then((result: any) => {
        examData.value = result.data
      })
    }
  }

  const timeServer = ref()
  const joinExamTime = ref()
  async function getDateServer() {
    MethodsUtil.requestApiCustom(SystemService.TimeServer, TYPE_REQUEST.GET).then((result: any) => {
      timeServer.value = (result?.code === 200 && result?.data) ? result?.data : (new Date()).toISOString()
      joinExamTime.value = (new Date()).toISOString()
    })
  }

  // tính thời gian từ thời gian server trước đó
  function getTimeFormTimeServer() {
    if (!timeServer.value)
      return ''
    return new Date(new Date(timeServer.value)?.getTime() + ((new Date()?.getTime() - new Date(joinExamTime.value)?.getTime()))).toISOString()
  }

  // tiếp tục đếm thời gian làm bài
  function handleContinueTime() {
    if (examControlRef.value && examData.value?.isPreserveTime)
      examControlRef.value.startTimer()
  }

  // dừng đếm thời gian làm bài
  function handleStopTime() {
    if (examControlRef.value && examData.value?.isPreserveTime)
      examControlRef.value.stopTimerExam()
  }

  /** ********************************** Thiết lập  bài làm  *************************/
  /** ********************************** Question *************************/
  const isMobileDevice = ref(MethodsUtil.deviceType() !== 'desktop')
  const pageNumberUploadingChange = ref()
  async function getTestQuestion() {
    // lấy đề
    return await fetchData().then(async (value: any) => {
      questionStore.value = value.data.questions
      if (!window._.isEmpty(examData.value)) {
        if (examData.value.totalQuestionDisplayInPage)
          pageOption.value.pageSize = examData.value.totalQuestionDisplayInPage

        else
          pageOption.value.pageSize = isMobileDevice.value ? 10 : questionStore.value.length
      }

      // xử lý dữ liệu đề
      if (isReview.value !== true) {
        await initLocalData()
      }

      else {
        // xử lý dữ liệu xem
        ExamMethodsUtil.standardizedDataReview(questionStore.value)
      }

      totalPoint.value = value.data.totalPoint
      totalQuestion.value = questionStore.value.length
    })
  }

  // lấy đề thi từ database
  async function getExamQuestions() {
    const response = null

    // Trường hợp xem lại bài thi|khảo sát
    if (isReview.value === true) {
      // lấy nội dung xem lại bài thi
      const params = {
        id: examId.value, numberOfRetake: numberOfRetake.value,
      }
      MethodsUtil.requestApiCustom(ExamService.GetQuestionResult, TYPE_REQUEST.GET, params).then((result: any) => {
        examData.value = result.data
        examData.value.testCodeId = examId.value
        reviewOption.value = {
          isCorrectAnswer: examData.value?.reviewId === 3 ? examData.value.isCorrectAnswer : false,
          isDisplayResult: examData.value?.reviewId === 3 ? examData.value.isDisplayResult : false,
          isDisplayFalseAnswer: examData.value?.reviewId === 3 ? examData.value.isDisplayFalseAnswer : false,
          reviewId: examData.value.reviewId,
        }
      })
    }
    else {
      const params = {
        testCodeId: examData.value.testCodeId,
      }
      await MethodsUtil.requestApiCustom(ExamService.GetQuestionExamId, TYPE_REQUEST.GET, params).then(async (result: any) => {
        result?.data?.items.forEach((element: any) => {
          element.isAnswered = false
        })
        questionStore.value = result?.data?.items || []

        // lấy số câu hiển thị trên trang
        if (examData.value) {
          pageOption.value.pageSize = (examData.value.totalQuestionDisplayInPage && (examData.value.totalQuestionDisplayInPage !== 0))
            ? examData.value.totalQuestionDisplayInPage
            : questionStore.value.length
        }
        if (isReview.value !== true)
          await initLocalData()

        else
          ExamMethodsUtil.standardizedDataReview(questionStore.value)
      })
    }
  }

  // lấy danh sách câu hỏi theo phân trang
  async function fetchQuestion() {
    questions.value = questionStore.value
  }

  // cập nhật số câu trả lời
  function updateAmountAnswered() {
    amountAnswered.value = questionStore.value.filter(
      (qs: any) => qs.isAnswered === true,
    ).length
  }

  // set local storage
  async function initLocalData() {
    localData.value = JSON.parse(`${localStorage.getItem(storageKey.value)}`)
    if (!localData.value || localData.value === null) {
      // dữ liệu local storage
      localData.value = {
        startTime: null,
        examineeId: examData.value.examineeId,
        questions: [],
      }

      // lấy dữ liệu từ log
      if (examData.value?.writeLogMinute && examData.value?.examineeStartTime !== null) {
        const params = {
          testId: examData.value.testId,
          examineeId: examData.value.examineeId,
          shiftId:
            examData.value.testShiftId !== null ? examData.value.testShiftId : 0,
          pageSize: questionStore.value.length,
          pageNumber: 1,
        }
        await MethodsUtil.requestApiCustom(ExamService.GetStudentExamLog, TYPE_REQUEST.GET, params).then((result: any) => {
          ExamMethodsUtil.synchronizedFromLog(questionStore.value, result.data)
        })
      }
      questionStore.value.forEach((element: any) => {
        if (element.isGroup) {
          localData.value.questions.push(
            ExamMethodsUtil.getLocalDataFromQuestion(element, element.isMark),
          )
          element.questions.forEach((child: any) => {
            localData.value.questions.push(
              ExamMethodsUtil.getLocalDataFromQuestion(child),
            )
          })
        }
        else {
          localData.value.questions.push(
            ExamMethodsUtil.getLocalDataFromQuestion(element, element.isMark),
          )
        }
      })
      localStorage.setItem(storageKey.value, JSON.stringify(localData.value))
    }
    else {
      ExamMethodsUtil.getDataFromDataLocal(
        questionStore.value,
        localData.value.questions,
      )
    }
  }
  const questionGoTo = ref<any>(null)
  const timerScrollQuestion = ref<any>(null)
  async function handleClickQuestion(question: any, isConfirm?: boolean, pos = 0) {
    const idQuestion = question.id
    console.log((pageOption.value.pageNumber - 1) * pageOption.value.pageSize <= pos && pos < pageOption.value.pageNumber * pageOption.value.pageSize)

    if (question === null)
      return
    if (!((pageOption.value.pageNumber - 1) * pageOption.value.pageSize <= pos && pos < pageOption.value.pageNumber * pageOption.value.pageSize)) {
      if (quantityFileUploading.value && !isConfirm) {
        questionGoTo.value = question
        isShowModalUploading.value = true
        return
      }
      const index = questionStore.value.indexOf(question)
      pageOption.value.pageNumber = Math.floor(index / pageOption.value.pageSize) + 1
      console.log(pageOption.value)
      nextTick(() => {
        clearTimeout(timerScrollQuestion.value)
        timerScrollQuestion.value = null
        timerScrollQuestion.value = setTimeout(() => {
          const el: any = document.getElementById(`${idQuestion}`)
          const top = el.offsetTop
          el.offsetParent.scrollTop = top
        }, 500)
      })
    }
    else {
      const el: any = document.getElementById(`${idQuestion}`)
      const top = el.offsetTop
      el.offsetParent.scrollTop = top
    }
  }

  /** ********************************** Question *************************/
  /** ********************************** log *************************/
  const timeLog = ref()

  // đếm thời gian ghi log
  function startTimerSaveLog() {
    if (!timer.value) {
      timer.value = setInterval(() => {
        if (timeLog.value > 0) {
          timeLog.value -= 1
        }
        else {
          clearInterval(timer.value)

          // lưu log
          saveUserAnswer(true)
          timeLog.value = examData.value.writeLogMinute * 60
          timer.value = undefined
          startTimerSaveLog()
        }
      }, 1000)
    }
  }

  // lưu dữ liệu local khi trả lời đáp án
  function saveLocalData(value: any, data: any) {
    // updateAmountAnswered()
    ExamMethodsUtil.saveLocalData(
      data,
      localData.value.questions,
      value,
    )
    console.log(localData.value)

    localData.value.createdDate = getTimeFormTimeServer()
    localStorage.setItem(storageKey.value, JSON.stringify(localData.value))
  }

  /** ********************************** log *************************/
  /** ********************************** Thiết lập các cài đặt để xử lý gian lận *************************/
  const isFullScreen = ref(false)
  const errAddEventChangeFullscreen = ref(false) // lỗi khi thêm sự kiện theo dỗi toàn màn hình
  async function handleAntiCheating(isFullScreenPr: boolean, notPageSwitching: any, examineeStartTime: any) {
    if (!isFullScreenPr && !notPageSwitching)
      return

    const params = {
      examineeId: examData.value.examineeId,
    }
    MethodsUtil.requestApiCustom(ExamService.GetViolationUser, TYPE_REQUEST.GET, params).then((res: any) => {
      let result = res?.data
      if (result?.isSuspended) {
        // BE lỗi nên check ở đây
        examData.value.isSuspended = true
        handleSuspendUser()
        return
      }
      result = {
        ...result,
        type: 1,
        isFullScreen: isFullScreenPr,
        notPageSwitching,
        isWarning: false,
      }
      result.numberWarning = result.numberWarning || 0
      userViolation.value = result
      disableSubmitBtn.value = true
    })
  }
  function handleSuspendUser() {
    // if (this.connection) {
    //   connection.value.invoke(
    //     'RegisterSuspended',
    //     examData.value.examineeId,
    //     examData.value.testId,
    //     examData.value.testShiftId,
    //   )
    // }
    // if (this.storageKey)
    //   localStorage.removeItem(this.storageKey)
    // this.$refs['exam-direction']?.stopTimerExam()
    // window.removeEventListener('blur', this.handleChangeTab)
    // window.removeEventListener('focus', this.handleFocusExam)
    // document.removeEventListener('mouseleave', this.mouseLeave)
    // const violation = {
    //   isSuspended: true,
    // }
    // if (this.userViolation?.numberWarning)
    //   violation.numberWarning = this.userViolation.numberWarning

    // if (this.userViolation?.maximumViolation)
    //   violation.maximumViolation = this.userViolation.maximumViolation

    // this.userViolation = violation
    // this.isSuspendedExam = true
    // this.$nextTick(() => {
    //   this.$bvModal.show('anti-cheating')
    // })
  }
  async function acceptAntiCheating(notice?: boolean) {
    isShowModalAntiCheat.value = false
    if (isUploadFile.value) {
      handleAcceptConfirmModal()
      isShowModalSuspended.value = false
    }
    if (notice) {
      const isStart = await handleStartExam()
      if (!isStart)
        return
      isNotice.value = false
    }
    disableSubmitBtn.value = false
    if (!userViolation.value.isWarning) {
      if (userViolation.value.isFullScreen)
        await handleTrackingFullScreen(true)

      if (userViolation.value.notPageSwitching)
        handleTrackingChangeTab()
    }
    else if (userViolation.value.isFullScreen) {
      await handleTrackingFullScreen()
    }
  }
  function handleAcceptConfirmModal() {
    if (isSuspendedExam.value) {
      router.push({ name: 'list-my-exam' })
      return
    }
    if (!isConnected.value) {
      isLoadingConnect.value = true
      const timerConnect: any = setTimeout(() => {
        checkConnect()
        isLoadingConnect.value = false
        clearTimeout(timerConnect)
      }, 1500)
      return
    }
    if (isUploadFile.value) {
      disableAntiCheating.value = false
      enableAntiCheating(isUploadFile.value)
    }
  }
  async function enableAntiCheating(isUploadFilePr?: boolean) {
    if (isUploadFilePr)
      isUploadFile.value = false

    disableSubmitBtn.value = false
    if (userViolation.value?.isFullScreen) {
      // if (!document.fullscreenElement && document.fullscreenEnabled) {
      await handleTrackingFullScreen(true)
    }
    if (userViolation.value?.notPageSwitching)
      handleTrackingChangeTab()
  }
  async function handleTrackingFullScreen(isListenerEvent?: boolean) {
    const doingExamContainer: any = document.getElementById('body')

    if (doingExamContainer?.requestFullscreen) {
      await doingExamContainer.requestFullscreen()
        .then(() => {
          isFullScreen.value = true
          if ((isListenerEvent || errAddEventChangeFullscreen.value))
            document.addEventListener('fullscreenchange', onFullScreenChange)

          errAddEventChangeFullscreen.value = false
        })
        .catch(() => {
          isFullScreen.value = false
          if (isListenerEvent)
            errAddEventChangeFullscreen.value = true
        })
    }
    else if (doingExamContainer?.webkitRequestFullscreen) {
      await doingExamContainer.webkitRequestFullscreen()
        .then(() => {
          isFullScreen.value = true
          if ((isListenerEvent || errAddEventChangeFullscreen.value))
            document.addEventListener('webkitfullscreenchange', onFullScreenChange)

          errAddEventChangeFullscreen.value = false
        })
        .catch(() => {
          isFullScreen.value = false
          if (isListenerEvent)
            errAddEventChangeFullscreen.value = true
        })
    }
    else if (doingExamContainer?.mozRequestFullScreen) {
      await doingExamContainer.mozRequestFullScreen()
        .then(() => {
          isFullScreen.value = true
          if ((isListenerEvent || errAddEventChangeFullscreen.value))
            document.addEventListener('mozfullscreenchange', onFullScreenChange)

          errAddEventChangeFullscreen.value = false
        })
        .catch(() => {
          isFullScreen.value = false
          if (isListenerEvent)
            errAddEventChangeFullscreen.value = true
        })
    }
    else if (doingExamContainer?.msRequestFullscreen) {
      await doingExamContainer.msRequestFullscreen()
        .then(() => {
          isFullScreen.value = true
          if ((isListenerEvent || errAddEventChangeFullscreen.value))
            document.addEventListener('msfullscreenchange', onFullScreenChange)

          errAddEventChangeFullscreen.value = false
        })
        .catch(() => {
          isFullScreen.value = false
          if (isListenerEvent)
            errAddEventChangeFullscreen.value = true
        })
    }
  }
  function handleTrackingChangeTab() {
    window.addEventListener('blur', handleChangeTab)
    window.addEventListener('focus', handleFocusExam)
    document.addEventListener('mouseleave', mouseLeave)
  }

  // lấy danh sách giám sát thi
  const supervisor = ref()
  async function fetchSupervisions() {
    const params = {
      id: examData.value.testId,
    }

    MethodsUtil.requestApiCustom(ExamService.GetSupervisions, TYPE_REQUEST.GET, params).then((result: any) => {
      // const users = await shared.getUserInfoByIds(data)
      // supervisor.value = users.pageLists
    })
  }
  async function handleCheating(type?: any, noShowWarning?: any) {
    // type = 404. cảnh báo khi di chuột rời khỏi màn hình thi, không bắt vi phạm
    if (type === 404) {
      userViolation.value.isWarning = true
      disableSubmitBtn.value = true
      isShowModalAntiCheat.value = true
      return
    }

    // chụp ảnh màn hình
    if (type === 4 || type === 5)
      captureScreen()

    // Hàm xử lý khi học viên gian lận
    if (noShowWarning !== true) {
      userViolation.value.isWarning = true
      disableSubmitBtn.value = true
    }

    // số lần vi phạm
    if (Object.hasOwn(userViolation.value, 'numberWarning'))
      userViolation.value.numberWarning += 1

    if (userViolation.value.maximumViolation > 0 && userViolation.value.numberWarning >= userViolation.value.maximumViolation) {
      handleSuspendUser()
    }

    else if (noShowWarning !== true) {
      nextTick(() => {
        isShowModalAntiCheat.value = true
      })
    }

    const params = {
      examUserId: examData.value.examineeId,
      testId: examData.value.testId,
      learnerId: AuthUtil.getUserData()?.id,
      typeId: type,
      minusPoint: 0,
      supervisorId: 0,
      reason: '',
    }
    await MethodsUtil.requestApiCustom(ExamService.PostCreateSupervisions, TYPE_REQUEST.POST, params)
  }
  function handleDisableAntiCheating(isDisconnect?: any) {
    // khi download & upload file
    if (!isDisconnect)
      isUploadFile.value = true

    disableSubmitBtn.value = true
    if (userViolation.value?.notPageSwitching) {
      window.removeEventListener('blur', handleChangeTab)
      window.removeEventListener('focus', handleFocusExam)
      document.removeEventListener('mouseleave', mouseLeave)
    }
    if (userViolation.value?.isFullScreen) {
      isFullScreen.value = false
      if (document?.exitFullscreen) {
        if (document.fullscreenElement)
          document?.exitFullscreen()

        document.removeEventListener('fullscreenchange', onFullScreenChange)
      }
      else if ((document as any)?.webkitExitFullscreen) {
        if (document.fullscreenElement)
          (document as any)?.webkitExitFullscreen()

        document.removeEventListener('webkitfullscreenchange', onFullScreenChange)
      }
      else if ((document as any)?.mozExitFullscreen) {
        if (document.fullscreenElement)
          (document as any)?.mozExitFullscreen()

        document.removeEventListener('mozfullscreenchange', onFullScreenChange)
      }
      else if ((document as any)?.msExitFullscreen) {
        if (document.fullscreenElement)
          (document as any)?.msExitFullscreen()

        document.removeEventListener('msfullscreenchange', onFullScreenChange)
      }
    }
    if (!isDisconnect) {
      textButtonOkConfirmModal.value = t('ok-title')
      contentConfirmModal.value = t('please-agree-to-continue')
      isShowModalSuspended.value = true
    }
  }

  /** ********************************** Thiết lập các cài đặt để xử lý gian lận *************************/

  /** ********************************** doing *************************/

  const isShowModalSubmit = ref(false)

  // tiếp tục làm bài thi
  async function continueExam() {
    const params = {
      examTestId: examData.value.testId,
      examineId: examData.value.examineeId,
    }
    await MethodsUtil.requestApiCustom(ExamService.PostContinueExam, TYPE_REQUEST.POST, params)
  }
  async function handleStartExam() {
    connectionSignalR()

    let isStart = false
    examData.value.timeRemaining = 0
    let timeRemaining = 0

    // gọi lại lấy giờ server
    await getDateServer()
    const timeServerPr: any = getTimeFormTimeServer()
    if (examData.value.examineeStartTime !== null) {
      isStart = true
      continueExam()
      connectionSignalR()

      // Nếu bảo toàn thời gian
      if (examData.value?.isPreserveTime)
        timeRemaining = (examData.value.minuteOfWork * 60 - Math.round(examData.value?.totalWork || 0)) / 60
      if (examData.value.minuteOfWork !== 0 && (!examData.value?.isPreserveTime)) {
        timeRemaining = examData.value.minuteOfWork
                      - (new Date(timeServerPr).getTime() - new Date(examData.value.examineeStartTime).getTime()) / 1000 / 60
      }
    }
    else {
      localData.value.createdDate = timeServerPr
      localStorage.setItem(storageKey.value, JSON.stringify(localData.value))

      // ghi thời gian bắt đầu làm bài
      const response = await MethodsUtil.requestApiCustom(ExamService.PatchStartExam, TYPE_REQUEST.PATCH, { examineeId: examData.value.examineeId })

      if (response?.code === 200) {
        isStart = true
        timeRemaining = examData.value.minuteOfWork
        connectionSignalR()
      }
    }
    if (isStart === true) {
      isInTroduceView.value = false

      if (examData.value.writeLogMinute > 0) {
        timeLog.value = examData.value.writeLogMinute * 60

        startTimerSaveLog()
      }
      if (examData.value.minuteOfWork !== 0) {
        // Nếu không duy trì trạng thái thi khi thời gian kì thi kết thúc
        if (!examData.value?.isMaintainStatus) {
          const endTimeThematicExam = (new Date(examData.value.endTime).getTime() - new Date(timeServerPr).getTime()) / 1000 / 60
          examData.value.timeRemaining = Math.min(timeRemaining, endTimeThematicExam)
        }
        else {
          examData.value.timeRemaining = timeRemaining
        }
        if (examData.value.timeRemaining <= 0)
          submitExam(1)
      }
      nextTick(() => {
        if (examControlRef.value)
          examControlRef.value.startExame()
      })
      return true
    }
    return false
  }
  function confirmSubmit() {
    isShowModalSubmit.value = true
  }
  function setQuantityUploadingFile(quantity: any) {
    if (quantity !== 0) {
      const qty = quantityFileUploading.value + quantity
      if (qty >= 0)
        quantityFileUploading.value = qty
    }
    else {
      quantityFileUploading.value = 0
    }
  }

  // nộp bài kiểm tra
  async function submitExam(submitId: number) {
    // submitId 1: Hệ thống, 2: Người dùng
    isShowSubmitError.value = false
    disableSubmitBtn.value = true
    handleDisableAntiCheating(true)
    if (submitId === 1) {
      // Tự động nộp bài cho thí sinh khi đã hết thời gian thi
      toast('WARNING', t('time-out-exam'))
    }

    // lưu lại log exam khi nộp bài
    saveUserAnswer(true, 1)
    const result = await saveUserAnswer(false, submitId)
    if (result === false) {
      isSubmitting.value = false
      isShowSubmitError.value = true
      if (examControlRef.value)
        examControlRef.value.stopTimerExam()

      return
    }
    clearInterval(timer.value)

    setQuantityUploadingFile(0)
    localStorage.removeItem(storageKey.value)

    router.push({
      name: 'my-test-result',
      params: { id: route.params.id },
      query: {
        id: examData.value.testCodeId,
        checkCert: 'true',
      },
    })
    if (connection.value !== null && connection.value.state === 'Connected') {
      connection.value.invoke(
        'CompleteExam',
        examData.value.examineeId,
        examData.value.testId,
        examData.value.testShiftId ?? 0,
      )
    }
  }

  // Lưu câu trả lời của người dùng ghi log và submit
  async function saveUserAnswer(isSaveLog?: any, submitId?: any) {
    // !isSaveLog: Nộp bài; submitId(1: Hệ thống, 2: Người dùng)
    let data: any = null
    let model = null
    let localStorageData: any

    if (isSaveLog === true) {
      // kiểm tra thêm sự thay đổi ở local storage, khi chưa đến thời gian ghi log người dùng thoát ra và vào lại kì thi
      localStorageData = JSON.parse(localStorage.getItem(storageKey.value) ?? '{}') || {}
      data = ExamMethodsUtil.getExamUserAnswerChange(questionStore.value, localStorageData)
    }
    else {
      data = ExamMethodsUtil.getExamUserAnswer(questionStore.value)
    }

    if (isSaveLog === true) {
      if (data?.listData.length > 0 || submitId === 1) {
        model = {
          testId: examData.value.testId,
          shitfId: examData.value.testShiftId || 0,
          examineeId: examData.value.examineeId,
          questions: data?.listData || [],
          createdDate: localStorageData?.createdDate || null,
        }
        MethodsUtil.requestApiCustom(ExamService.PostStudentExamLog, TYPE_REQUEST.POST, model).then((result: any) => {
          questionStore.value.forEach((element: any) => {
            if (element.isGroup) {
              element.questions.forEach((question: any) => {
                question.isDataChange = false
              })
            }
            else {
              element.isDataChange = false
            }
          })
          if (localStorageData?.questions?.length) {
            localStorageData?.questions?.forEach((el: any) => {
              el?.questions?.forEach((q: any) => {
                q.isDataChange = false
              })
            })
            localStorage.setItem(storageKey.value, JSON.stringify(localStorageData))
          }
        })
      }
      return true
    }
    const params = {
      testCodeId: examData.value.testCodeId,
      listData: data?.listData || [],
      submitId,
      testLearnerMapId: examData.value.examineeId,
    }

    MethodsUtil.requestApiCustom(ExamService.PostSaveUserAnswer, TYPE_REQUEST.POST, params).then((result: any) => {
      return true
    }).catch(() => {
      return false
    })

    return false
  }

  /** ********************************** doing *************************/

  /** ********************************** camera *************************/
  const isSharingCamera = ref<boolean | null>(null)
  const captureCamera = ref<any>({})
  const identifiedRequestTempId = ref<any>() // id tạm thời của lần nhận diện mặc định
  const isAutoReqCaptureCamera = ref(false)
  function requestPermisionCamera(event: any) {
    if (captureCamera.value.isLoadCamera && captureCamera.value.stream)
      return
    if (event.target.state === 'denied') {
      captureCamera.value.stream = null
      isSharingCamera.value = false
    }
    else {
      grantPermissionsCamera()
    }
  }
  async function checkCamera() {
    if (navigator?.mediaDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      if (videoDevices.length) {
        navigator.permissions.query({ name: 'camera' } as any)
          .then(permissionObj => {
            permissionObj.onchange = event => {
              requestPermisionCamera(event)
            }

            if (permissionObj.state === 'denied')
              isSharingCamera.value = false

            if (permissionObj.state === 'granted')
              isSharingCamera.value = true
          })
      }
    }
  }
  async function grantPermissionsCamera() {
    if (navigator?.mediaDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      if (videoDevices.length) {
        navigator.permissions.query({ name: 'camera' } as any)
          .then(permissionObj => {
            permissionObj.onchange = event => {
              requestPermisionCamera(event)
            }

            if (permissionObj.state === 'denied') {
              isSharingCamera.value = false
              toast('WARNING', t('you-need-grant-camera-permission'))
            }
            else {
              loadCamera()
            }
          })
          .catch(() => {
            isSharingCamera.value = false
            captureCamera.value = {
              isLoadCamera: false,
              stream: null,
              video: null,
            }
          })
      }
    }
  }
  const cameraRef = ref()
  function videoOnendedCamera(event: any) {
    isSharingCamera.value = false
    captureCamera.value = {
      isLoadCamera: false,
      stream: null,
      video: null,
    }
  }
  async function loadCamera() {
    if (cameraRef.value)
      captureCamera.value.video = cameraRef.value

    else
      captureCamera.value.video = null

    if (navigator.mediaDevices) {
      captureCamera.value.isLoadCamera = true
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(stream => {
          stream.getVideoTracks()[0].onended = event => {
            videoOnendedCamera(event)
          }
          captureCamera.value.stream = stream
          if (cameraRef.value) {
            // video kiểm tra camera ở start exam
            captureCamera.value.video.srcObject = stream
            captureCamera.value.video.play()
          }
          isSharingCamera.value = true
          captureCamera.value.isLoadCamera = false
        })
        .catch(err => {
          if (err?.message === 'Permission denied')
            toast('WARNING', t('you-need-grant-camera-permission'))

          captureCamera.value.isLoadCamera = false
          isSharingCamera.value = false
        })
    }
    else {
      isSharingCamera.value = false
    }
  }

  // cho phép truy cập camera
  function acceptCamera(isAccpet = true) {
    if (isAccpet)
      isShowMdCaptureImage.value = true
    else
      hideModalCapture()
  }
  async function autoCaptureCamera() {
    handleStopTime()
    const date = new Date(Date.now())
    const fileName = `${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
    const queryParams = {
      typeId: 1,
      examineeId: examData.value.examineeId,
      fileName,
      urlFile: '',
    }

    await MethodsUtil.requestApiCustom(ExamService.PostSaveImageViolateUser, TYPE_REQUEST.POST, queryParams).then((res: any) => {
      identifiedRequestTempId.value = res?.data
      if (navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then(async stream => {
            accessDeviceContent.value = t(
              'access-camera',
            )
            isHaveDevice.value = true
            checkShowModalIdentified(true)
          })
          .catch(() => {
            accessDeviceContent.value = t(
              'no-device',
            )
            isHaveDevice.value = false
            checkShowModalIdentified()
          })
      }
      else {
        accessDeviceContent.value = t('no-device')
        isHaveDevice.value = false
        checkShowModalIdentified()
      }
    })
  }

  // kiểm tra modal nhận điện người dùng có đang hiển thị hay không
  function checkShowModalIdentified(isAuto = false) {
    if (isShowMdCaptureImage.value || isShowMdAccessCamera.value)
      return
    isAutoReqCaptureCamera.value = isAuto
    isShowMdAccessCamera.value = true
  }

  // khi ẩn modal nhận diện
  function hideModalCapture() {
    if (identifiedRequestTempId.value) {
      if (examData.value?.isPreserveTime)
        submitIdentifiedAutoReq('')

      handleContinueTime()
      identifiedRequestTempId.value = ''
    }
  }
  async function submitIdentifiedAutoReq(url: any) {
    const queryParams = {
      typeId: 1,
      id: identifiedRequestTempId.value,
      examineeId: examData.value.examineeId,
      urlFile: url,
    }

    await MethodsUtil.requestApiCustom(ExamService.PutUpdateImageIdentified, TYPE_REQUEST.PUT, queryParams)
    isAutoReqCaptureCamera.value = false
  }

  // gửi ảnh nhận diện
  async function submitIdentified(url?: string) {
    if (isAutoReqCaptureCamera.value) {
      handleContinueTime()
      if (identifiedRequestTempId.value)
        submitIdentifiedAutoReq(url)
    }
    else {
      const params = {
        url,
        examUserId: examData.value.examineeId,
      }
      await MethodsUtil.requestApiCustom(ExamService.PostVertificate, TYPE_REQUEST.POST, params).then((response: any) => {
        if (connection.value !== null) {
          connection.value.invoke(
            'SubmitIdentity',
            examData.value.examineeId,
            examData.value.testId,
            examData.value.testShiftId || 0,
            AuthUtil.getUserData()?.id,
            url,
          )
          toast('SUCCESS', t('end-image-success'))
        }
      }).catch((err: any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
  }

  /** ********************************** camera *************************/
  /** ********************************** screen *************************/
  const captureStream = ref<any>({
    stream: null,
    image: null,
    video: null,
    amount: 0,
    isReqShareScreen: false,
  })
  const isSharingFullScreen = ref<boolean | null>(null)
  async function grantSharingScreenPermission() {
    captureStream.value.amount += 1
    try {
      captureStream.value.isReqShareScreen = true
      await navigator.mediaDevices
        .getDisplayMedia({
          video: true,
          audio: false,
        })
        .then(async stream => {
          const { displaySurface } = stream.getVideoTracks()[0].getSettings()
          if (displaySurface === 'monitor') {
            captureStream.value.stream = stream
            isSharingFullScreen.value = true
            stream.getVideoTracks()[0].onended = event => {
              videoScreenOnended(event)
            }
          }
          else {
            stream.getVideoTracks()[0].stop()
            captureStream.value.stream = null
            isSharingFullScreen.value = false
            toast('WARNING', t('you-need-grant-full-screen-permission'))

            // số lần chọn lại <= 3
            if (captureStream.value.stream === null && captureStream.value.amount <= 3)
              await grantSharingScreenPermission()
          }
          captureStream.value.isReqShareScreen = false
        })
    }
    catch (err) {
      isSharingFullScreen.value = false
      captureStream.value.isReqShareScreen = false
      captureStream.value = {
        stream: null,
        image: null,
        video: null,
        amount: 0,
        isReqShareScreen: false,
      }
    }
  }
  function videoScreenOnended(event: any) {
    isSharingFullScreen.value = false
    captureStream.value = {
      stream: null,
      image: null,
      video: null,
      amount: 0,
      isReqShareScreen: false,
    }
  }
  function onFullScreenChange() {
    const doingExamContainer = document.getElementById('doing-exam-container')
    if (document?.fullscreenElement?.getAttribute('id') === doingExamContainer?.getAttribute('id')) {
      isFullScreen.value = true
      return
    }
    if (userViolation.value.isFullScreen) {
      isFullScreen.value = false
      handleCheating(5)
    }
  }
  async function captureScreen() {
    const date = new Date(Date.now())
    const fileName = `${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
    const params = {
      examineeId: examData.value.examineeId,
      fileName,
    }

    // delay thời gian chụp ảnh
    const timerCapture = setTimeout(() => {
      if (isSharingFullScreen.value === true && captureStream.value.stream !== null)
        getImageUploadServer(captureStream.value, params)

      if (captureStream.value.stream !== null)
        getImageUploadServer(captureStream.value, params)

      clearTimeout(timerCapture)
    }, 888)
  }

  /** ********************************** screen *************************/
  /** ********************************** tab *************************/
  function handleChangeTab() {
    if (document?.hasFocus())
      return
    handleCheating(4)
  }
  async function handleFocusExam() {
    // quay lại bài thi
    const params = {
      id: examData.value.examineeId,
    }
    await MethodsUtil.requestApiCustom(ExamService.PostJoinAgainExam, TYPE_REQUEST.POST, params)
  }
  function mouseLeave() {
    handleCheating(404)
  }

  /** ********************************** tab *************************/
  /** ********************************** upload file *************************/

  async function getImageUploadServer(captureObj: any, params?: any) {
    const canvas: any = document.createElement('canvas')
    if (captureObj.video === null)
      captureObj.video = document.createElement('video')

    const { video } = captureObj
    video.autoplay = true
    video.srcObject = captureObj.stream
    video.onplay = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d', { alpha: false, desynchronized: true, willReadFrequently: true }).drawImage(video, 0, 0)
      canvas.toBlob(async (blob: any) => {
        // lấy đuôi file
        const typeImage = blob.type.split('/')
        blob.name = `screenshot ${params.fileName}.${typeImage[1]}`
        const file = new File([blob], blob.name, {
          type: blob.type,
        })
        const model = {
          files: file,
          isSecure: false,
        }
        await MethodsUtil.uploadFile(model).then(data => {
          if (data?.fileOrigin) {
            const queryParams = { ...params, urlFile: data?.fileOrigin }
            MethodsUtil.requestApiCustom(ExamService.PostSaveImageViolateUser, TYPE_REQUEST.POST, queryParams)
          }
        })
      }, 'image/jpeg', 1)
    }
  }

  /** ********************************** upload file *************************/
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })
  watch(disableAntiCheating, (newValue: any) => {
    if (newValue) {
      if (!isConnected.value)
        handleDisableAntiCheating(true)

      else
        handleDisableAntiCheating()
    }
  })

  return {
    // view
    isInTroduceView, // view giới thiệu

    examControlRef, // ref của phần view làm
    isNotice, // trạng thái là thông báo khi đang ở màn hình chờ làm bài thi
    isReview, // trạng thái xem
    examData, // thông tin kỳ thi
    timeServer, // thời gian sever
    joinExamTime, // thời gian tham gia thi
    isComplete, // trạng thái kỳ thi hoàn thành
    isSuspendedExam, // trạng thái kỳ thi bị đình chỉ
    storageKey, // key local kỳ thi
    disableSubmitBtn, // trạng thái ẩn button nộp bài
    isDoing, // trạng thái tiếp tục làm bài thi
    examId, // id bài thi khi xem lại
    numberOfRetake, // lần xem lại bài kiểm tra
    isShowModalSubmit, // show modal confirm nộp bài
    // số lượng file đang tải lên ở trang hiện tại
    // dùng khi đề thi có thiết lập chống gian lận và có nhiều trang
    // nếu đang upload file ở câu hỏi chưa xong thì cảnh báo khi người dùng chuyển trang
    quantityFileUploading,
    timer,
    isSubmitting,
    isShowModalUploading,
    handleAcceptConfirmModal,

    ////
    getExamInfo, // lấy thông tin kỳ thi
    getDateServer, // lấy thời gian sever
    handleStartExam, // hành động bắt đầu làm bài
    getTestQuestion, // lấy danh sách câu hỏi
    fetchSupervisions, // danh sách các giám thị
    updateAmountAnswered, // cập nhật số câu trả lời
    getExamQuestions, // lấy đề thi từ database
    confirmSubmit, // nộp bài
    submitExam,

    /** submit */
    isShowSubmitError,

    /** upload */
    setQuantityUploadingFile,

    /** question */
    totalQuestion, // tổng số câu hỏi
    questionGoTo,
    questions, // danh sách câu hỏi
    questionStore, // danh sách câu hỏi
    totalPoint, // tổng đểm câu hỏi
    pageOption,
    pageNumberUploadingChange,
    fetchQuestion, // lấy danh sách câu hỏi phân trang
    handleClickQuestion, // đi đến vị trí câu hỏi
    saveLocalData,

    /** *Camera */
    cameraRef,
    isSharingCamera,
    captureCamera,
    isHaveDevice,
    isShowMdCaptureImage,
    isShowMdAccessCamera,
    accessDeviceContent,
    acceptCamera,
    grantPermissionsCamera, // cấp quyền camera
    checkCamera, // check quyền camera
    autoCaptureCamera,
    submitIdentified,
    hideModalCapture,

    /** *tab */
    handleFocusExam,
    handleChangeTab,
    mouseLeave,

    /** *screen */
    captureStream,
    isFullScreen, // toàn màn hình
    errAddEventChangeFullscreen, // lỗi khi thêm sự kiện theo dỗi toàn màn hình
    isSharingFullScreen, // chia sẻ toàn màn hình
    grantSharingScreenPermission, // cấp quyền màn hình
    onFullScreenChange,

    /** kết nối */
    connection,
    isConnected, // trạng thái có kết nối mạng
    connectionSignalR, // kết nối signal
    disConnectSignalR, // ngắt kết nối signal
    handleConnected,
    handleDisconnected,

    /** chống gian lận */
    disableAntiCheating, // dừng bắt lỗi vi phạm khi người dùng upload file hoặc download file trong câu hỏi
    userViolation, // vi phạm của người dùng
    isExamAntiCheating, // trạng thái kì thì được thiết lập chống gian lận
    isShowModalAntiCheat, // bật tắt modal anti cheat
    isShowModalSuspended, // modal thông báo đình chỉ thi && khi upload or download file (kì thi có thiết lập chống gian lận)
    isUploadFile, // trạng thái khi đang upload file cho kì thi có thiết lập chống gian lận
    contentConfirmModal,
    acceptAntiCheating,
    handleSuspendUser, // hanhd động đình chỉnh người dùng
  }
})
