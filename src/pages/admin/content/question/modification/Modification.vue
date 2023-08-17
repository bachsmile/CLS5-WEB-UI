<script setup lang="ts">
import CpQuestionItemFilter from '@/components/page/Admin/content/question/modification/CpQuestionItemFilter.vue'
import CpQuestionTypeOption from '@/components/page/Admin/content/question/modification/CpQuestionTypeOption.vue'
import CpQuestionCluseSetting from '@/components/page/Admin/content/question/modification/CpQuestionCluseSetting.vue'
import CpQuestionListClause from '@/components/page/Admin/content/question/modification/CpQuestionListClause.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import QuestionService from '@/api/question'

import CpSingleChoiceQuestion from '@/components/page/Admin/content/question/question-type/CpSingleChoiceQuestion.vue'
import CpUnderlinedQuestion from '@/components/page/Admin/content/question/question-type/CpUnderlinedQuestion.vue'
import CpFillBlankQuestion from '@/components/page/Admin/content/question/question-type/CpFillBlankQuestion.vue'
import CpFillBlank2Question from '@/components/page/Admin/content/question/question-type/CpFillBlank2Question.vue'
import CpEssayQuestion from '@/components/page/Admin/content/question/question-type/CpEssayQuestion.vue'
import CpMultiChoiceQuestion from '@/components/page/Admin/content/question/question-type/CpMultiChoiceQuestion.vue'
import CpTrueFalseQuestion from '@/components/page/Admin/content/question/question-type/CpTrueFalseQuestion.vue'
import CpClauseTrueFalseQuestion from '@/components/page/Admin/content/question/question-type/CpClauseTrueFalseQuestion.vue'
import CpMatchingQuestion from '@/components/page/Admin/content/question/question-type/CpMatchingQuestion.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import { load } from '@/stores/loadComponent.js'
import toast from '@/plugins/toast'
import { questionManagerStore } from '@/stores/admin/content/question/question'

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
  isGroup: false,
  urlFile: null,
  isAutoApprove: true,
  levelId: null,
  typeId: 1,
  topicId: null,
  answers: [],
  questions: [],
})
const clusterQs = ref<any>(
  {
    content: '',
    urlFile: null,
    isGroup: null,
    levelId: null,
    isShuffle: null,
    typeId: 1,
    topicId: null,
    answers: [],
  },
)

const questionData = ref<any>(window._.cloneDeep(dataGeneral.value))
const dataPost = ref<any>()
const selectedCurrent = ref<number>(0)
function handleFilter(filter: any) {
  questionData.value = {
    ...questionData.value,
    ...filter,
  }
}
function checkTypeQuestionItem(typeId: number | null) {
  switch (typeId) {
    case 1:
      return CpSingleChoiceQuestion
    case 2:
      return CpMultiChoiceQuestion
    case 3:
      return CpUnderlinedQuestion
    case 4:
      return CpTrueFalseQuestion
    case 5:
      return CpClauseTrueFalseQuestion
    case 6:
      return CpFillBlankQuestion
    case 7:
      return CpFillBlank2Question
    case 8:
      return CpMatchingQuestion
    case 9:
      return CpEssayQuestion

    default:
      return CpSingleChoiceQuestion
  }
}

function handleUpdateQuestion(dataQs: any, id: number) {
  if (questionData.value)
    questionData.value.listQuestions[id] = dataQs
}
function changeQuestion(dataQs: any, id: number | null, value: number) {
  dataQs.typeId = value
  dataQs.content = ''
}
async function getInforQuestion() {
  await MethodsUtil.requestApiCustomV5(QuestionService.GetDetailQuestion(Number(route.params.id)), TYPE_REQUEST.GET).then(({ data }: any) => {
    if (data.isGroup)
      standardizedDataInitCluse(data)
    else
      standardizedDataInitSingle(data)
  })
}

function onCancel() {
  router.push({ name: 'question-list' })
}
const myFormSettingQs = ref() // thông tin chung của câu hỏi
const myFormOptionQsSingle = ref() // loại câu hỏi đơn
const myFormOptionQsClause = ref() // loại câu hỏi cho từng câu chùm
const myFormQsSingle = ref() // content câu hỏi đơn
const myFormContentCLuse = ref() // content câu hỏi chùm
const storeQuestionManager = questionManagerStore()
const { refListQsCluse } = storeToRefs(storeQuestionManager) // content câu hỏi cho từng câu chùm
async function handleSave(id: any) {
  /**
 * promise1: validate phần chung chủ đề và mức độ
 * promise2: validate phần loại câu hỏi
 * promise3: validate phần nội dung câu hỏi
 * promise4: validate phần câu trả lời
 */
  const promise1 = await myFormSettingQs.value?.isSubmit().then((data: any) => data.valid)
  let promise2
  let promise3
  const promise4: Promise<boolean>[] = []

  if (questionData.value.isGroup) {
    promise2 = await myFormOptionQsClause.value[selectedCurrent.value]?.isSubmit().then((data: any) => data.valid)
    promise3 = await refListQsCluse.value[selectedCurrent.value]?.isSubmit().then((data: any) => data.valid)

    if (refListQsCluse.value[selectedCurrent.value]?.isSubmitAns) {
      for (const item of refListQsCluse.value[selectedCurrent.value].isSubmitAns)
        promise4.push(item.isSubmit().then((data: any) => data.valid))
    }
  }
  else {
    promise2 = await myFormOptionQsSingle.value?.isSubmit().then((data: any) => data.valid)
    promise3 = await myFormQsSingle.value?.isSubmit().then((data: any) => data.valid)
    if (myFormQsSingle.value?.isSubmitAns) {
      for (const item of myFormQsSingle.value.isSubmitAns)
        promise4.push(item.isSubmit().then((data: any) => data.valid))
    }
  }

  Promise.all([promise1, promise2, promise3, ...promise4])
    .then(async (results: any) => {
      console.log(results)
      const allTrue = results.every((result: boolean) => result === true)
      if (allTrue) {
        dataPost.value = window._.cloneDeep(questionData.value)

        // Khi tất cả promise đã hoàn thành, đây là nơi xử lý kết quả
        if (questionData.value.typeId !== 0 && checkQuestionValidSingle(dataPost.value))
          standardizedDataSingle(id)
        if (questionData.value.typeId === 0 && checkQuestionValidCluse(dataPost.value))
          standardizedDataCluse(id)
      }
      unLoadComponent(id)
    })
    .catch(error => {
    // Xử lý lỗi nếu có bất kỳ promise nào bị từ chối
      unLoadComponent(id)
      console.error(error)
    })
}
async function postData(id: any) {
  await MethodsUtil.requestApiCustomV5(QuestionService.AddQuestion, isEdit.value ? TYPE_REQUEST.PUT : TYPE_REQUEST.POST, dataPost.value)
    .then(({ data, status }: any) => {
      console.log(data)
      window.notificationApiStatus(status, t)
      unLoadComponent(id)
      onCancel()
    })
}
function standardizedDataInitSingle(valueQs: any) {
  if (valueQs.typeId === 6) {
    const answers: any[] = []
    const answerBlank: any[] = []
    valueQs.answers.forEach((element: any) => {
      if (element.isTrue)
        answerBlank[answerBlank.length] = element

      else
        answers[answers.length] = element
    })
    valueQs.answers = answers.map((item: any, index: number) => {
      item.position = index + 1
      return item
    })
    valueQs.answerBlank = answerBlank.map((item: any, index: number) => {
      item.position = index + 1
      return item
    })
  }

  if (valueQs.typeId === 8) {
    const answers: any[] = []
    valueQs.answers.forEach((element: any) => {
      const position = element.position - 1
      if (position > -1) {
        if (answers[position] === undefined) {
          answers[position] = {
            left: null,
            right: null,
          }
        }
        if (element.isTrue === false)
          answers[position].left = element
        else answers[position].right = element
      }
    })
    valueQs.answers = answers
  }

  valueQs.isAutoApprove = MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true
  questionData.value = valueQs
}
function standardizedDataInitCluse(valueQsList: any) {
  valueQsList?.questions.forEach((valueQs: any) => {
    if (valueQs.typeId === 6) {
      const answers: any[] = []
      const answerBlank: any[] = []
      valueQs.answers.forEach((element: any) => {
        if (element.isTrue)
          answerBlank[answerBlank.length] = element

        else
          answers[answers.length] = element
      })
      valueQs.answers = answers.map((item: any, index: number) => {
        item.position = index + 1
        return item
      })
      valueQs.answerBlank = answerBlank.map((item: any, index: number) => {
        item.position = index + 1
        return item
      })
    }
    if (valueQs.typeId === 8) {
      const answers: any[] = []
      valueQs.answers.forEach((element: any) => {
        const position = element.position - 1
        if (position > -1) {
          if (answers[position] === undefined) {
            answers[position] = {
              left: null,
              right: null,
            }
          }
          if (element.isTrue === false)
            answers[position].left = element
          else answers[position].right = element
        }
      })
      valueQs.answers = answers
    }

    valueQs.isAutoApprove = MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true
    questionData.value = valueQs
  })
}
function standardizedDataSingle(id?: any) {
  delete dataPost.value.questions
  if (dataPost.value.typeId === 6) {
    dataPost.value.answers = [
      ...dataPost.value.answerBlank,
      ...dataPost.value.answers,
    ]
    console.log(dataPost.value.answers)

    dataPost.value.answers.forEach((item: any, index: number) => {
      item.position = index + 1
    })
    delete dataPost.value.answerBlank
  }
  if (dataPost.value.typeId === 7) {
    dataPost.value.answers.forEach((item: any) => {
      console.log(dataPost.value.answerBlank[item.blank]?.length)
      if (dataPost.value.answerBlank[item.blank]?.length) {
        dataPost.value.answerBlank[item.blank]?.forEach((itemBlank: any) => {
          console.log(itemBlank)
          itemBlank.position = item.position
          dataPost.value.answers.push(itemBlank)
        })
      }
    })
    delete dataPost.value.answerBlank
    delete dataPost.value.basic
    console.log(dataPost.value)
  }
  if (dataPost.value.typeId === 8) {
    const answers: any[] = []
    dataPost.value.answers.forEach((element: any) => {
      if (element && element.left !== null)
        answers.push(element.left)
      if (element && element.right !== null)
        answers.push(element.right)
    })
    dataPost.value.answers = answers
  }

  postData(id)
}
function standardizedDataCluse(id?: any) {
  delete dataPost.value.answers
  dataPost.value?.questions?.forEach((element: any) => {
    if (element.typeId === 6) {
      element.answers = [
        ...element.answerBlank,
        ...element.answers,
      ]
      console.log(element.answers)

      element.answers.forEach((item: any, index: number) => {
        item.position = index + 1
      })
      delete element.answerBlank
    }
    if (element.typeId === 8) {
      const answers: any[] = []
      element.answers.forEach((qs: any) => {
        if (qs && qs.left !== null)
          answers.push(qs.left)
        if (qs && qs.right !== null)
          answers.push(qs.right)
      })
      element.answers = answers
    }
  })

  postData(id)
}

function handleChangeTypeQs(group: boolean) {
  if (group) {
    questionData.value.typeId = 0
    console.log(questionData.value.questions)
    questionData.value.questions = questionData.value.questions?.length ? questionData.value.questions : [window._.cloneDeep(clusterQs.value)]
  }
  else {
    questionData.value.typeId = 1
  }
}
function addQuestions() {
  if (questionData.value?.isGroup) {
    const newData = window._.cloneDeep(clusterQs.value)
    questionData.value.questions[questionData.value.questions.length] = newData
    selectedCurrent.value = questionData.value.questions.length - 1
  }
}

// kiểm tra tính hợp lệ câu hỏi
function checkQuestionValidSingle(data: any) {
  /// Trắc nghiệm nhiều lựa chọn: 2
  /// Gạch chân: 3
  /// Lựa chọn đúng sai: 4
  /// Mệnh đề đúng sai: 5
  /// Điền khuyết: 6
  /// Điền khuyết loại 2: 7
  /// Ghép đôi: 8
  /// Tự luận: 9
  /// Đa loại câu hỏi: 0
  let isValid = true
  const questionNoInvalid = null
  let messageErr
  console.log(data)

  if (!data?.content || data?.content === '<br>') {
    messageErr = t('pls-add-content', { questionNoInvalid })
    isValid = false
  }
  console.log(messageErr)

  // bắt validate chưa chọn đáp án đúng
  switch (data.typeId) {
    case 1:
    case 3:
    case 5:
      // eslint-disable-next-line no-case-declarations
      const answerCorrect = data.answers.find((item: any) => item.isTrue === true)
      if (!answerCorrect) {
        messageErr = t('pls-choose-true')
        isValid = false
        break
      }
      break

    default:
      break
  }
  if (messageErr)
    toast('WARNING', t(messageErr))

  return isValid
}
function checkQuestionValidCluse(data: any) {
  /// Trắc nghiệm nhiều lựa chọn: 2
  /// Gạch chân: 3
  /// Lựa chọn đúng sai: 4
  /// Mệnh đề đúng sai: 5
  /// Điền khuyết: 6
  /// Điền khuyết loại 2: 7
  /// Ghép đôi: 8
  /// Tự luận: 9
  /// Đa loại câu hỏi: 0
  let isValid = true
  let questionNoInvalid = null
  let messageErr
  console.log(data.questions)
  for (let i = 0; i < data.questions.length; i += 1) {
    const element = data.questions[i]

    if (!element?.content || element?.content === '<br>') {
      questionNoInvalid = i + 1
      messageErr = t('pls-add-content-qs', { questionNoInvalid })
      isValid = false
      break
    }

    // bắt validate nội dung câu hỏi và các câu trả lời bỏ trống
    switch (element.typeId) {
      case 1:
      case 2:
      case 3:
      case 5:
        // eslint-disable-next-line no-case-declarations
        const index = element?.answers.findIndex((item: any) => !item.content)
        if (index > -1) {
          questionNoInvalid = i + 1
          messageErr = t('pls-add-ans-qs', { index: index + 1, questionNoInvalid })
          isValid = false
        }
        break
      case 8:
        // eslint-disable-next-line no-case-declarations
        const leftAnswersIndex = element.answers.findIndex((item: any) => item.left !== null && !item.left?.content)
        if (leftAnswersIndex > -1) {
          questionNoInvalid = i + 1
          messageErr = t('pls-add-ans-match-left-qs', { index: leftAnswersIndex + 1, questionNoInvalid })
          isValid = false
        }
        // eslint-disable-next-line no-case-declarations
        const rightAnswersIndex = element.answers.findIndex((item: any) => item.right !== null && !item.right?.content)
        if (rightAnswersIndex > -1) {
          questionNoInvalid = i + 1
          messageErr = t('pls-add-ans-match-right-qs', { index: rightAnswersIndex + 1, questionNoInvalid })
          isValid = false
        }
        break

      default:
        break
    }

    // bắt validate chưa chọn đáp án đúng
    switch (element.typeId) {
      case 1:
      case 3:
      case 5:
        // eslint-disable-next-line no-case-declarations
        const answerCorrect = element.answers.find((item: any) => item.isTrue === true)
        if (!answerCorrect) {
          questionNoInvalid = i + 1
          messageErr = t('pls-choose-true', { questionNoInvalid })
          isValid = false
          break
        }
        break

      default:
        break
    }
  }
  console.log(messageErr)

  if (messageErr)
    toast('WARNING', t(messageErr))

  return isValid
}
if (route.name === 'question-edit' && Number(route.params.id))
  getInforQuestion()
isEdit.value = route?.name === 'question-edit'
</script>

<template>
  <div class="mt-3">
    <VRow>
      <VCol>
        <CpQuestionItemFilter
          ref="myFormSettingQs"
          v-model:topicId="questionData.topicId"
          v-model:levelId="questionData.levelId"
          v-model:isShuffle="questionData.isShuffle"
          v-model:isGroup="questionData.isGroup"
          :is-edit="isEdit"
          @update:is-group="handleChangeTypeQs"
          @update:is-auto-approve="($value) => questionData.isAutoApprove = $value"
        />
      </VCol>
    </VRow>
    <VRow
      v-show="questionData.isGroup"
      class="mb-6"
    >
      <VCol
        cols="12"
        sm="6"
      >
        <CpQuestionCluseSetting
          ref="myFormContentCLuse"
          v-model:urlFile="questionData.urlFile"
          v-model:content="questionData.content"
          :is-edit="isEdit"
        />
      </VCol>
      <VCol
        cols="12"
        sm="6"
      >
        <CpQuestionListClause
          v-model:selected-current="selectedCurrent"
          :items="questionData.questions"
          @addQuestion="addQuestions"
        />
      </VCol>
    </VRow>
    <div v-show="questionData.isGroup">
      <VRow
        v-for="(question, index) in questionData.questions"
        :key="index"
      >
        <VCol
          v-show="selectedCurrent === index"
          cols="12"
        >
          <div class="mb-4 text-medium-lg ">
            {{ t('create-question') }}
          </div>
          <CpQuestionTypeOption
            ref="myFormOptionQsClause"
            :type-id="question.typeId"
            :is-edit="isEdit"
            @update:typeId="($value:any) => changeQuestion(question, index, $value)"
          />
        </VCol>
        <VCol>
          <Component
            :is="checkTypeQuestionItem(question.typeId)"
            v-show="selectedCurrent === index"
            :index="index"
            :question="question"
            :is-edit="isEdit"
          />
        </VCol>
      </VRow>
    </div>
    <div
      v-show="!questionData.isGroup"
      class="mt-2"
    >
      <VRow>
        <VCol cols="12">
          <div class="mb-4 text-medium-lg ">
            {{ t('create-question') }}
          </div>
          <CpQuestionTypeOption
            ref="myFormOptionQsSingle"
            v-model:questionLevelId="questionData.questionLevelId"
            :type-id="questionData.typeId"
            :is-edit="isEdit"
            @update:typeId="($value:any) => changeQuestion(questionData, null, $value)"
          />
        </VCol>
        <VCol>
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
