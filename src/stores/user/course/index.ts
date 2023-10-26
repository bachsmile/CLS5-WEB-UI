import { defineStore } from 'pinia'
import { myExamCourseManagerStore } from '@/stores/user/course/courseExam'
import { myCourseManagerStore } from '@/stores/user/course/course'

export const myCourseMainManagerStore = defineStore('myCourseMainManager', () => {
  const myExamCourseManagerManager = myExamCourseManagerStore()
  const { } = storeToRefs(myExamCourseManagerManager)
  const { getExamInfo, getTestQuestion } = myExamCourseManagerManager
  const myCourseManagerManager = myCourseManagerStore()
  const { contentCurrent, currentContentTypeId } = storeToRefs(myCourseManagerManager)
  const { getDetailContent, checkTypeDoingComplete, checkSurveyInfo, getSurveyInfo } = myCourseManagerManager
  const isRenderedContent = ref(false)

  /** **general */
  async function changeContent(courseContentId: any) {
    isRenderedContent.value = false
    await getDetailContent(courseContentId)
    await changeCurrentContent()
    await checkTypeDoingComplete(contentCurrent.value)
    currentContentTypeId.value = contentCurrent.value.contentArchiveTypeId
    isRenderedContent.value = true
  }
  async function changeCurrentContent() {
    if (contentCurrent.value.contentArchiveTypeId === 11) {
      await checkSurveyInfo()
      await getSurveyInfo()
    }
    else if (contentCurrent.value.contentArchiveTypeId === 10) {
      await getExamInfo().then(() => {
        getTestQuestion()
      })
    }
    // eslint-disable-next-line sonarjs/no-duplicated-branches
    else if (contentCurrent.value.isAnswerTheQuestion) {
      await getExamInfo().then(() => {
        getTestQuestion()
      })
    }
  }
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    isRenderedContent,
    changeContent, // xử lý khi change content
    changeCurrentContent,
  }
})
