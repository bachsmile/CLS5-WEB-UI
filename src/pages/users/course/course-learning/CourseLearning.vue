<script setup lang="ts">
// import CpScreenEnds from '@/components/page/users/course/course-learning/screen/CpScreenEnds.vue'
import CpFrameLearning from '@/components/page/users/course/course-learning/components/CpFrameLearning.vue'
import CpScreenStart from '@/components/page/users/course/course-learning/screen/CpScreenStart.vue'
import CpSideBarContent from '@/components/page/users/course/course-learning/components/CpSideBarContent.vue'
import { myCourseManagerStore } from '@/stores/user/course/course'
import CmButton from '@/components/common/CmButton.vue'
import { myCourseMainManagerStore } from '@/stores/user/course/index'

const CpSurveyLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpSurveyLearning.vue'))
const CpVideoLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpVideoLearning.vue'))
const CpTestLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpTestLearning.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const myCourseManagerManager = myCourseManagerStore()
const { courseData, isShowContent, contentCurrent, doingComplete, isReview, isCompletedContent, contentRef, studyTimeFormat, studyTime, isViewQuestion } = storeToRefs(myCourseManagerManager)
const { timeUpdateChange, GetListContentCourseById, changeStatusContent, saveUserLearningData } = myCourseManagerManager
const myCourseMainManagerManager = myCourseMainManagerStore()
const { isRenderedContent } = storeToRefs(myCourseMainManagerManager)
const { changeContent } = myCourseMainManagerManager
const route = useRoute()

const course = ref({
  courseName: 'a',
  courseId: 2803,
})
function openInforContent() {
  console.log(3333111)
  isShowContent.value = !isShowContent.value
  return 333
}

function componentContentCurrent() {
  console.log(contentCurrent.value.contentArchiveTypeId)

  switch (contentCurrent.value.contentArchiveTypeId) {
    case 4:
      return CpVideoLearning
    case 10:
      return CpTestLearning
    case 11:
      return CpSurveyLearning

    default:
      break
  }
}

function handleActionContent(idbtn: number, unload: any) {
  doingComplete.value.action()
  setTimeout(() => {
    unload(idbtn)
  }, 0)
}

watch(studyTime, async newValue => {
  console.log(newValue)
  if (
    isCompletedContent.value
        || newValue < (contentCurrent.value?.minuteOfLearn || 0)
        || isReview.value
        || !contentCurrent.value?.isAfterTime)
    return

  // Hiển thị popover thông báo (nội dung có 2 điều kiện sau khoản thời gian & câu trả lời cuối bài)
  // if (contentCurrent.value.isAnswerTheQuestion) {
  //   if (!this.$refs.btnShowQuestion) {
  //     this.$nextTick().then(() => {
  //       this.showAnswerQuestionTooltip()
  //     })
  //   }
  //   return
  // }
  isCompletedContent.value = true
  await saveUserLearningData(contentCurrent.value)
  changeStatusContent(contentCurrent.value.courseContentId, 'CourseService.LearnerCompleted')
})

GetListContentCourseById(Number(route.params.id))
changeContent(15182)
</script>

<template>
  <div
    v-if="courseData"
    class="my-course-learning"
  >
    <CpFrameLearning
      :title="courseData.courseName"
      :progress="courseData.progress"
      :disabled="!isRenderedContent"
      @open-infor="openInforContent"
    >
      <template
        v-if="doingComplete && doingComplete.isShow && !isCompletedContent && !isReview"
        #action
      >
        <div class="mr-3">
          <CmButton
            v-if="[1, 3].includes(doingComplete.type)"
            variant="elevated"
            is-load
            :disabled="!isShowContent"
            :color="doingComplete?.color"
            :title="!isViewQuestion ? doingComplete?.title : doingComplete?.titleSub"
            @click="handleActionContent"
          />
          <CmChip
            v-if="doingComplete.type === 2"
            :color="doingComplete?.color"
            height="32px"
            border-radius="16px"
          >
            <span class="text-medium-md">{{ studyTimeFormat }}</span>
          </CmChip>
        </div>
      </template>
      <template #sidebar>
        <div>
          <CpSideBarContent />
        </div>
      </template>
      <template #content>
        <div
          v-show="!isShowContent"
          class="box flex-center page-containter"
        >
          <CpScreenStart
            :is-desc-box="!!(contentCurrent.contentArchiveTypeId && [10, 11].includes(contentCurrent.contentArchiveTypeId))"
            :is-rendered="isRenderedContent"
            :content-data="contentCurrent"
            :description="contentCurrent.content || ''"
            :name="contentCurrent.courseContentName || ''"
            :status="contentCurrent.statusId || 0"
            @click="openInforContent"
          >
            <template
              #descBox
            >
              <div>
                Tổng số câu hỏi: 10 câu
              </div>
              <div>
                Thời gian làm bài: 90 phút
              </div>
            </template>
          </CpScreenStart>
        </div>

        <div
          v-show="isShowContent && !isViewQuestion"
          class="content-in-box"
        >
          <Component
            :is="componentContentCurrent()"
            :key="contentCurrent.id"
            ref="contentRef"
            @timeUpdateChange="timeUpdateChange"
          />
        </div>
        <div v-show="isViewQuestion">
          a
        </div>
      </template>
    </CpFrameLearning>
  </div>
</template>

<style lang="scss">
.my-course-learning {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-surface));
  .box {
    height: inherit;
    border-radius: var(--v-border-radius-xs);
    background: rgb(var(--v-theme-surface));
    width: 100%;
    .box-content {
      width: 80%;
      padding: 1rem;
      border: 1px solid rgb(var(--v-gray-300));
      border-radius: var(--v-border-radius-xs);
      background: rgb(var(--v-gray-50));
      .mc-desc {
        padding: 12px 16px;
        border-radius: var(--v-border-radius-xs);
        background-color: rgb(var(--v-primary-50));
        margin-block: 16px;
        text-align: center;
      }

      .mc-about {
        &.text-over-hide {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; /* Số hàng tối đa muốn hiển thị */
          text-overflow: ellipsis;
        }
      }
    }
  }
  .content-in-box {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
}
</style>
