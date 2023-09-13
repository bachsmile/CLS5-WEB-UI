<script setup lang="ts">
import CpSurveyGeneral from '@/components/page/Admin/content/survey/modification/CpSurveyGeneral.vue'
import CpSurveyTypeOption from '@/components/page/Admin/content/survey/modification/CpSurveyTypeOption.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import QuestionService from '@/api/question'
import ArraysUtil from '@/utils/ArrayUtil'
import CpSingleChoiceSurvey from '@/components/page/Admin/content/survey/survey-type/CpSingleChoiceSurvey.vue'
import CpMultiChoiceSurvey from '@/components/page/Admin/content/survey/survey-type/CpMultiChoiceSurvey.vue'
import CpEssaySurvey from '@/components/page/Admin/content/survey/survey-type/CpEssaySurvey.vue'
import CpRangeSurvey from '@/components/page/Admin/content/survey/survey-type/CpRangeSurvey.vue'
import CpEvaluateSurvey from '@/components/page/Admin/content/survey/survey-type/CpEvaluateSurvey.vue'
import CpMatrixSingle from '@/components/page/Admin/content/survey/survey-type/CpMatrixSingle.vue'
import CpMatrixMulti from '@/components/page/Admin/content/survey/survey-type/CpMatrixMulti.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import { load } from '@/stores/loadComponent.js'

const store = load()
const { unLoadComponent } = store
const component = ref()
const route = useRoute()
const router = useRouter()
const isEdit = ref(false)
const { t } = window.i18n()

/// loại dữ liệu câu hỏi
/** ==> Câu hỏi chùm */
const dataGeneral = ref({
  id: null,
  content: '',
  urlFile: null,
  isAutoApprove: true,
  isArchive: true,
  typeId: 1,
  topicId: null,
  answers: [],
})

const questionData = ref<any>(window._.cloneDeep(dataGeneral.value))
const dataPost = ref<any>()
function checkTypeQuestionItem(typeId: number | null) {
  switch (typeId) {
    case 1:
      return CpSingleChoiceSurvey
    case 2:
      return CpMultiChoiceSurvey
    case 3:
      return CpEssaySurvey
    case 4:
      return CpRangeSurvey
    case 5:
      return CpEvaluateSurvey
    case 6:
      return CpMatrixSingle
    case 7:
      return CpMatrixMulti
    default:
      return CpSingleChoiceSurvey
  }
}

function changeQuestion(dataQs: any, id: number | null, value: number) {
  dataQs.typeId = value
  dataQs.content = ''
}
async function getInforQuestion() {
  // await MethodsUtil.requestApiCustomV5(QuestionService.GetDetailQuestion(Number(route.params.id)), TYPE_REQUEST.GET).then(({ data }: any) => {
  //   standardizedDataInitSingle(data)
  // })
  const params = {
    listId: [Number(route.params.id)],
  }
  await MethodsUtil.requestApiCustom(QuestionService.PostSurveyDetail, TYPE_REQUEST.POST, params).then(({ data }: any) => {
    standardizedDataInitSingle(data[0])
  })
}

function onCancel() {
  router.push({ name: 'question-survey-list' })
}
const myFormSettingQs = ref() // thông tin chung của câu hỏi
const myFormOptionQsSingle = ref() // loại câu hỏi đơn
const myFormQsSingle = ref() // content câu hỏi đơn
async function handleSave(id: any) {
  /**
 * promise1: validate phần chung chủ đề và mức độ
 * promise2: validate phần loại câu hỏi
 * promise3: validate phần nội dung câu hỏi
 * promise4: validate phần câu trả lời
 */
  const promise1 = await myFormSettingQs.value?.isSubmit().then((data: any) => data.valid)
  const promise4: Promise<boolean>[] = []

  const promise2 = await myFormOptionQsSingle.value?.isSubmit().then((data: any) => data.valid)
  const promise3 = await myFormQsSingle.value?.isSubmit().then((data: any) => {
    return data.valid
  })
  if (myFormQsSingle.value?.isSubmitAns) {
    for (const item of myFormQsSingle.value.isSubmitAns)
      promise4.push(item.isSubmit().then((data: any) => data.valid))
  }
  Promise.all([promise1, promise2, promise3, ...promise4])
    .then(async (results: any) => {
      const allTrue = results.every((result: boolean) => result === true)
      if (allTrue)
        dataPost.value = window._.cloneDeep(questionData.value)

      // Khi tất cả promise đã hoàn thành, đây là nơi xử lý kết quả
      standardizedDataSingle(id)
      unLoadComponent(id)
    })
    .catch(error => {
    // Xử lý lỗi nếu có bất kỳ promise nào bị từ chối
      unLoadComponent(id)
      console.error(error)
    })
}
async function postData(id: any) {
  // await MethodsUtil.requestApiCustomV5(QuestionService.AddQuestion, isEdit.value ? TYPE_REQUEST.PUT : TYPE_REQUEST.POST, dataPost.value)
  //   .then(({ data, status }: any) => {
  //     console.log(data)
  //     window.notificationApiStatus(status, t)
  //     unLoadComponent(id)
  //     onCancel()
  //   })
  await MethodsUtil.requestApiCustom(isEdit.value ? QuestionService.PostUpdateSurvey : QuestionService.PostAddSurvey, TYPE_REQUEST.POST, dataPost.value)
    .then(({ data, status }: any) => {
      window.notificationApiStatus(status, t)
      unLoadComponent(id)
      onCancel()
    })
}
function standardizedDataInitSingle(valueQs: any) {
  // cls4
  valueQs.typeId = valueQs.questionTypeId
  valueQs.urlFile = valueQs.urlMedia
  if ([6, 7].includes(valueQs.typeId))
    valueQs.surveyCategoryRatings = ArraysUtil.fromListToTree(valueQs.surveyCategoryRatings, 'randomId', 'groupId', undefined, undefined)

  valueQs.isAutoApprove = MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true

  /////////////////////////////
  questionData.value = valueQs
}
function standardizedDataSingle(id?: any) {
  if ([6, 7].includes(dataPost.value.typeId) && dataPost.value.isGroup)
    dataPost.value.surveyCategoryRatings = ArraysUtil.unFlatMapTree(dataPost.value.surveyCategoryRatings)
  dataPost.value.urlMedia = dataPost.value.urlFile
  dataPost.value.contentBasic = dataPost.value.contentBasic || dataPost.value.basic

  postData(id)
}

if (route.name === 'survey-edit' && Number(route.params.id))
  getInforQuestion()
isEdit.value = route?.name === 'survey-edit'
</script>

<template>
  <div class="mt-3">
    <div
      class="mt-2"
    >
      <VRow>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <CpSurveyTypeOption
            ref="myFormOptionQsSingle"
            :type-id="questionData.typeId"
            :is-edit="isEdit"
            @update:typeId="($value:any) => changeQuestion(questionData, null, $value)"
          />
        </VCol>
        <VCol
          cols="12"
          md="8"
        >
          <CpSurveyGeneral
            ref="myFormSettingQs"
            v-model:topicId="questionData.topicId"
            v-model:isObligatory="questionData.isObligatory"
            :is-edit="isEdit"
            @update:is-auto-approve="($value) => questionData.isSent = $value"
          />
        </VCol>
        <VCol>
          <div class="mb-4 text-medium-lg ">
            {{ t('create-survey') }}
          </div>
          <Component
            :is="checkTypeQuestionItem(questionData.typeId)"
            v-if="questionData.typeId"
            ref="myFormQsSingle"
            v-model:question="questionData"
            :is-edit="isEdit"
          />
        </VCol>
      </VRow>
    </div>

    <div>
      <CpActionFooterEdit
        is-cancel
        is-save
        :title-cancel="t('come-back')"
        :title-save="t('save')"
        :title-save-and-update="t('save-and-update')"
        @onCancel="onCancel"
        @onSave="(idx: any) => handleSave(idx)"
      />
    </div>
  </div>
</template>
