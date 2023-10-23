<script setup lang="ts">

// import CpScreenEnds from '@/components/page/users/course/course-learning/screen/CpScreenEnds.vue'
import CpFrameLearning from '@/components/page/users/course/course-learning/components/CpFrameLearning.vue'
import CpScreenStart from '@/components/page/users/course/course-learning/screen/CpScreenStart.vue'
import CpSideBarContent from '@/components/page/users/course/course-learning/components/CpSideBarContent.vue'
import { myCourseManagerStore } from '@/stores/user/course/course'
import { myExamCourseManagerStore } from '@/stores/user/course/courseExam'

const CpSurveyLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpSurveyLearning.vue'))
const CpVideoLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpVideoLearning.vue'))
const CpTestLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpTestLearning.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const myCourseManagerManager = myCourseManagerStore()
const { contentCurrent } = storeToRefs(myCourseManagerManager)
const { getDetailContent, checkSurveyInfo, getSurveyInfo, GetListContentCourseById } = myCourseManagerManager
const myExamCourseManagerManager = myExamCourseManagerStore()
const { } = storeToRefs(myExamCourseManagerManager)
const { getExamInfo, getTestQuestion } = myExamCourseManagerManager
const isShowDialogCert = ref(false)
const route = useRoute()
function openCertification() {
  isShowDialogCert.value = true
}

const course = ref({
  courseName: 'a',
  courseId: 2803,
})
const isShowContent = ref(false)
const isRenderedContent = ref(false)
function openInforContent() {
  isShowContent.value = !isShowContent.value
}

async function changeCurrentContent() {
  isRenderedContent.value = false
  if (contentCurrent.value.contentArchiveTypeId === 11) {
    await checkSurveyInfo()
    await getSurveyInfo()
  }
  if (contentCurrent.value.contentArchiveTypeId === 10) {
    await getExamInfo().then(() => {
      getTestQuestion().then(value => {
        isRenderedContent.value = true
      })
    })
  }
}
function componentContentCurrent() {
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
onMounted(async () => {
  await GetListContentCourseById(Number(route.params.id))
  await getDetailContent(8611)
  await changeCurrentContent()
})
</script>

<template>
  <div class="my-course-learning">
    <CpFrameLearning>
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
            is-desc-box
            :is-rendered="isRenderedContent"
            @click="openInforContent"
          >
            <template #descBox>
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
          v-show="isShowContent"
          class="content-in-box"
        >
          <Component
            :is="componentContentCurrent()"
          />
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

    .box-content {
      max-width: 80%;
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
