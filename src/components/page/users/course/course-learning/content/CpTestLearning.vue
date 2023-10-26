<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import CmChip from '@/components/common/CmChip.vue'
import CpContentView from '@/components/page/gereral/page/user/CpContentView.vue'
import CpControlQuestionNumber from '@/components/page/gereral/page/user/CpControlQuestionNumber.vue'
import { myExamCourseManagerStore } from '@/stores/user/course/courseExam'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import toast from '@/plugins/toast'
import CmPagination from '@/components/common/CmPagination.vue'
import CmSheet from '@/components/common/CmSheet.vue'
import { myCourseManagerStore } from '@/stores/user/course/course'

const props = withDefaults(defineProps<Props>(), {
  isShow: false,
})
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'loaded'): void
}
interface Props {
  isShow: boolean
}
const { t } = window.i18n()
const route = useRoute()
const router = useRouter()
const layoutMobile = ref(false)
const myExamCourseManagerManager = myExamCourseManagerStore()
const { isConnected, examData, questionStore, pageOption, isReview, totalPoint, quantityFileUploading, connection, pageNumberUploadingChange, timer, isShowSubmitError, isShowModalUploading } = storeToRefs(myExamCourseManagerManager)
const { onFullScreenChange, handleChangeTab, mouseLeave, handleFocusExam, submitExam, handleConnected, handleDisconnected } = myExamCourseManagerManager
const myCourseManagerManager = myCourseManagerStore()
const { isPause } = storeToRefs(myCourseManagerManager)
const config = ref({
  wheelPropagation: false,
  suppressScrollX: true,
})

const timerScrollQuestion = ref<any>(null)

function handleResize() {
  // Kiểm tra kích thước màn hình và cập nhật giá trị visibleItems
  if (window.innerWidth >= 769)
    layoutMobile.value = false // Giá trị cho màn hình md trở lên
  else
    layoutMobile.value = true // Giá trị cho màn hình mobile
}
window.addEventListener('resize', handleResize)

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// nội dung bài thi

function disableKeyboard(event: any) {
  // if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73))
  //   event.preventDefault()
}
function disableRightMouse(event: any) {
  event.preventDefault()
}
const time = ref(0)
const halfTime = ref(0)
const quaterTime = ref(0)
const lastTime = ref(60)
const endTime = ref(0) // thời gian kết thúc bộ đếm ngược
const isWarningHalfTime = ref(false)
const isWarningQuarter = ref(false)
const isWarningLastTime = ref(false)

const prettyTime = computed(() => {
  const thour: number = time.value / 3600
  const hours = parseInt(`${thour}`, 10)

  const tminute = (time.value - hours * 3600) / 60
  const minutes = parseInt(`${tminute}`, 10)
  const secondes = time.value - hours * 3600 - minutes * 60
  return `${hours > 9 ? hours : `0${hours}`}:${
    minutes > 9 ? minutes : `0${minutes}`
  }:${secondes > 9 ? secondes : `0${secondes}`}`
})

// bắt đầu làm bài
function startExame() {
  if (examData.value.timeRemaining > 0) {
    const totalTime = Math.round(examData.value.minuteOfWork * 60)
    time.value = Math.round(examData.value.timeRemaining * 60)
    halfTime.value = totalTime / 2
    quaterTime.value = totalTime / 4
    if (time.value <= lastTime.value)
      isWarningLastTime.value = true
    else if (time.value <= quaterTime.value)
      isWarningQuarter.value = true
    else if (time.value <= halfTime.value)
      isWarningHalfTime.value = true
    if (time.value > 0)
      startTimer()
  }
}

// đếm thời gian làm bài
const isStopTimer = ref(false)
const documentHidden = ref(false)
const reqAnimationFrameID = ref<any>(null)
const timeCaptureCamera = ref() // mốc thời gian emit sự kiện tự động nhận diện
function startTimer() {
  document.addEventListener('visibilitychange', handleVisibilityChange)
  isStopTimer.value = false
  const totalSeconds = time.value
  endTime.value = new Date().getTime() + totalSeconds * 1000
  const requestAnimationFrame = window?.requestAnimationFrame
                                  || (window as any)?.mozRequestAnimationFrame
                                  || (window as any)?.webkitRequestAnimationFrame
                                  || (window as any)?.msRequestAnimationFrame
  if (requestAnimationFrame) {
    const countDownTime = () => {
      if (isStopTimer.value)
        return
      let timeLeft = Math.round((endTime.value - new Date().getTime()) / 1000)
      if (timeLeft > 0) {
        if (time.value !== timeLeft)
          handleTrackingDownTimer()

        time.value = timeLeft
        reqAnimationFrameID.value = requestAnimationFrame(countDownTime)
      }
      else {
        timeLeft = 0
        time.value = 0
        clearRequestAnimationFrame()
        submitExam(1)
      }
    }
    countDownTime()
    return
  }
  handleDownTimer()
}

// dừng đến thời gian làm bài
function stopTimerExam() {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  isStopTimer.value = true
  if ((window as any)?.requestAnimationFrame) {
    clearRequestAnimationFrame()
    return
  }
  clearTimeout(timer.value)
  timer.value = null
}
function clearRequestAnimationFrame() {
  isStopTimer.value = true
  if (reqAnimationFrameID.value) {
    const cancelAnimationFrame = window.cancelAnimationFrame || (window as any).mozCancelAnimationFrame
    cancelAnimationFrame(reqAnimationFrameID.value)
  }
  reqAnimationFrameID.value = null
}
function handleVisibilityChange() {
  if (document.hidden) {
    documentHidden.value = true
    handleDownTimer()
  }
  else {
    documentHidden.value = false
  }
}
function handleDownTimer() {
  if (!documentHidden.value)
    return
  if (isStopTimer.value)
    return
  const currentTime = Date.now()
  const remainingTime = Math.max(0, endTime.value - currentTime)
  time.value = Math.round(remainingTime / 1000)
  if (remainingTime > 0) {
    handleTrackingDownTimer()
    const delay = 1000 - (currentTime % 1000)
    timer.value = setTimeout(handleDownTimer, delay)
  }
  else {
    clearTimeout(timer.value)
    timer.value = null

    submitExam(1)
  }
}
function handleTrackingDownTimer() {
  // tự động chụp ảnh camera
  if (examData.value?.listTimeShot?.length) {
    const equalTime = examData.value?.listTimeShot.find((item: any) => item === (examData.value.minuteOfWork * 60) - time.value)

    if (equalTime >= 0 && timeCaptureCamera.value !== equalTime)
      timeCaptureCamera.value = equalTime

    // autoCaptureCamera()
  }

  // cảnh báo thời gian 1p
  if (time.value <= lastTime.value && isWarningLastTime.value === false) {
    toast('ERROR', t('warning-last-minutes'))
    isWarningLastTime.value = true
    return
  }

  // cảnh báo 1/4 thời gian
  if (time.value <= quaterTime.value && isWarningQuarter.value === false && !isWarningLastTime.value) {
    toast('ERROR', t('warning-quater-time'))
    isWarningQuarter.value = true
    return
  }

  // cảnh báo nữa thời gian
  if (time.value <= halfTime.value && isWarningHalfTime.value === false && !isWarningLastTime.value && !isWarningQuarter.value) {
    toast('ERROR', t('warning-haft-time'))
    isWarningHalfTime.value = true
  }
}
async function handleClickQuestion(question: any, isConfirm?: boolean, pos = 0) {
  const idQuestion = question.id
  if (question === null)
    return
  if (!((pageOption.value.pageNumber - 1) * pageOption.value.pageSize <= pos && pos < pageOption.value.pageNumber * pageOption.value.pageSize)) {
    // if (quantityFileUploading.value && !isConfirm) {
    //   questionGoTo.value = question
    //   isShowModalUploading.value = true
    //   return
    // }
    const index = questionStore.value.indexOf(question)
    pageOption.value.pageNumber = Math.floor(index / pageOption.value.pageSize) + 1
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
    nextTick(() => {
      const el: any = document.getElementById(`${idQuestion}`)
      const top = el.offsetTop
      el.offsetParent.scrollTop = top
    })
  }
}
function checkShowPage(pos: number) {
  if (pageOption.value.pageSize === 0)
    return true
  return (pageOption.value.pageNumber - 1) * pageOption.value.pageSize <= pos && pos < pageOption.value.pageNumber * pageOption.value.pageSize
}

function pageChange(pageNumber: number, currentSizePage: number, pageOld: number) {
  pageOption.value.pageNumber = pageNumber

  if (quantityFileUploading.value) {
    pageNumberUploadingChange.value = pageNumber
    isShowModalUploading.value = true
    nextTick().then(() => {
      pageOption.value.pageNumber = pageOld
    })
    return
  }
  const el: any = document.getElementById('exam-test-content-scroll')
  el.scrollTop = 0
}

// variant time
const timerVariant = computed(() => {
  if (time.value <= lastTime.value)
    return 'error'
  if (time.value > halfTime.value)
    return 'success'
  if (time.value > quaterTime.value)
    return 'warning'
  return 'error'
})
watch(() => props.isShow, (val: any) => {
  if (val) {
    document.addEventListener('keydown', disableKeyboard)
    document.addEventListener('contextmenu', disableRightMouse)

    // document.addEventListener('keydown', e => {
    //   if (e.key === 'F5')
    //     e.preventDefault()
    //   if (e.key === 'Escape')
    //     e.preventDefault()
    // })
    if (!isReview.value) {
      // Lắng nghe sự kiện kết nối mạng của trình duyệt
      window.addEventListener('online', handleConnected)
      window.addEventListener('offline', handleDisconnected)
    }
  }
}, { immediate: true })
onBeforeUnmount(async () => {
  window.removeEventListener('online', handleConnected)
  window.removeEventListener('offline', handleDisconnected)
  window.removeEventListener('blur', handleChangeTab)
  window.removeEventListener('focus', handleFocusExam)
  document.removeEventListener('mouseleave', mouseLeave)
  document.removeEventListener('fullscreenchange', onFullScreenChange)
  document.removeEventListener('webkitfullscreenchange', onFullScreenChange)
  document.removeEventListener('mozfullscreenchange', onFullScreenChange)
  document.removeEventListener('msfullscreenchange', onFullScreenChange)
  document.removeEventListener('keydown', disableKeyboard)
  document.removeEventListener('contextmenu', disableRightMouse)

  // captureStream.value.stream?.getVideoTracks()[0].stop()
  // captureCamera.value.stream?.getVideoTracks()[0].stop()
  // captureStream.value.stream = null
  // captureCamera.value.stream = null

  // if (this.$checkPortal(470))
  //   unLockPreventUnexpectedAction()

  clearInterval(timer.value)

  // clearTimeout(this.timerScrollQuestion)
  if (connection.value && connection.value !== null) {
    // phát sing signal disconnect
    await connection.value.invoke(
      'DisConnectToExam',
      examData.value.examineeId,
      examData.value.testId,
      examData.value.testShiftId !== null ? examData.value.testShiftId : 0,
    )
    if (connection.value?.stop())
      connection.value?.stop()
  }

  isSubmitting.value = false

  myExamManagerManager.$dispose()
})

defineExpose({
  startExame,
  startTimer,
  stopTimerExam,
})
</script>

<template>
  <div
    class="mt doing-exam-container"
  >
    <div
      class="mt-left h-inherit"
      :class="{ 'w-100': layoutMobile }"
    >
      <div>
        <div class="flex-center">
          <CmChip
            :color="timerVariant"
            class="mb-2"
          >
            <div
              class="text-medium-md color-success"
              :class="`color-${timerVariant}`"
            >
              {{ prettyTime }}
            </div>
          </CmChip>
        </div>
        <div class="text-bold-lg flex-center">
          {{ examData?.testName }}
        </div>
        <div class="flex-center text-semibold-md color-primary mb-4">
          <span>{{ t('time-exam') }}: {{ examData?.minuteOfWork === 0 ? t('empty-date') : (`${examData?.minuteOfWork} ${$t('minute').toLowerCase()}`) }}</span>
        </div>
        <PerfectScrollbar
          id="exam-test-content-scroll"
          :options="config"
          style="height: 70vh;"
        >
          <div
            id="mt-content"
            class="mt-content mt-8"
          >
            <div
              v-for="(qs, pos) in questionStore"
              :key="qs.id"
            >
              <div v-show="checkShowPage(pos)">
                <CpContentView
                  v-model:data="questionStore[pos]"
                  :type="qs.typeId"
                  :number-question="pos + 1"
                  :disabled="isReview"
                  :is-review="isReview"
                  :total-point="totalPoint"
                  is-sentence
                  :is-pause="isPause"
                  :is-show-ans-false="isReview"
                  :is-show-ans-true="isReview"
                  @loaded="emit('loaded')"
                  @saveLocalData="saveLocalData"
                />
              </div>
            </div>
          </div>
        </PerfectScrollbar>
      </div>
      <div
        v-if="isConnected"
        class="exam-pagination"
      >
        <CmPagination
          :type="3"
          :total-items="questionStore?.length"
          :current-page="pageOption?.pageNumber"
          :page-size="pageOption?.pageSize"
          @pageClick="pageChange"
        />
      </div>
    </div>
    <div
      v-if="!layoutMobile"
      class="mt-right h-inherit"
    >
      <CpControlQuestionNumber
        :question-store="questionStore"
        :total-question="questionStore?.length"
        @handle-click-question="handleClickQuestion"
      />
    </div>
  </div>
  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalSubmit"
    :type="1"
    append-to-body
    variant="outlined"
    :confirmation-msg-sub-title="t('confirm-submit')"
    :confirmation-msg="t('submit')"
    @confirm="submitExam(2)"
  >
    <template #sub-title>
      <div
        v-if="quantityFileUploading"
        v-html="t('confirm-uploading-submit', { quantity: `${quantityFileUploading}` })"
      />
    </template>
  </CpConfirmDialog>
  <CpConfirmDialog
    v-model:is-dialog-visible="isShowSubmitError"
    :type="2"
    append-to-body
    persistent
    variant="outlined"
    :is-cancle="false"
    :confirmation-msg-sub-title="t('submit-error')"
    :confirmation-msg="t('submit')"
    @confirm="submitExam(2)"
  />
  <div>
    <CmSheet />
  </div>
</template>

<style  lang="scss">
.doing-exam-container {
  padding: 16px;
  background-color:  rgba(var(--v-theme-surface));
}

#doing-exam-container::backdrop {
  position: relative;
  background: black;
  inset: 0;
}

.mt {
  display: flex;

  .mt-left {
    overflow: hidden;
    width: 70% ;
    margin-right: 12px;
  }

  .mt-right {
    width: 30% ;
    margin-left: 12px;
    overflow: auto;
    .mt-point {
      padding: 24px;
      border: 1px solid rgb(var(--v-gray-300));
      border-radius: var(--v-border-radius-xs);
      background:  rgb(var(--v-gray-50));
      .mt-point-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        .mt-point-item {
          width: 40px;
          height: 40px;
          border: 2px solid rgb(var(--v-gray-500));
          border-radius: var(--v-border-radius-xs);
          margin: 8px ;
          background: #fff;
          cursor: pointer;

          &.item-select {
            border: 2px solid rgb(var(--v-primary-600));
            background:  rgb(var(--v-primary-600));
            color: #fff;
          }

          &.item-flag {
            border: 2px solid rgb(var(--v-warning-500));
          }
        }
      }
    }
    .cm-point{
      overflow: auto;
      max-height: calc(100% - 100px);
    }
  }
}

.mt-mb {
  position: fixed;
  top: 2rem;
  right: 0;
}

.controlQuestionNumberMb {
  position: fixed;
  bottom: 0;
}
</style>
