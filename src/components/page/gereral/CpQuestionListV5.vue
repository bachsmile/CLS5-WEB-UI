<script setup lang="ts">
import CpHeaderAction from './CpHeaderAction.vue'
import CpActionHeaderPage from './CpActionHeaderPage.vue'
import CpMdQuestionBankV5 from './CpMdQuestionBankV5.vue'
import CpContentView from './CpContentView.vue'
import CpQuestionName from './CpQuestionName.vue'
import type { Any } from '@/typescript/interface'
import CmDropDown from '@/components/common/CmDropDown.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { tableStore } from '@/stores/table'
import StringUtil from '@/utils/StringUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

/**
 *  Danh sách câu hỏi điều kiện hoàn thành
 *
 */
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)

const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('questions'), value: 'questions', type: 'custom' },
  { text: t('point'), value: 'unitPoint', type: 'custom', width: 200 },
  { text: '', value: 'actions', width: 150 },
]
interface Props {
  items: Any[]
}
interface Emit {
  (e: 'update:items', data: Any[] | undefined): void
  (e: 'clickAddQuestion'): void
  (e: 'editItem', val: Any): void
}
const selected = ref<Any[]>([])

const actionTakenFromAnother = ref<Any[]>([
  {
    title: t('apply-bank-question'),
    icon: 'ci:help-circle',
    action: showModalEditQuestion,
  },
  {
    title: t('AddFromFiles'),
    icon: 'fe:document',
  },
])
function actionItem([{ id, name }, content]: [Any, Any]) {
  switch (id) {
    case 2:
      deleteItem(content)
      break
    case 1:
      emit('editItem', content)
      break
    default:
      break
  }

  //
}
const listQuestions = ref<Any[]>([])
watch(() => props.items, val => {
  const temp = val || []
  temp?.forEach((element: Any) => {
    element.actions = [
      MethodsUtil.checkActionType({ id: 4 }),
      MethodsUtil.checkActionType({ id: 1 }),
      MethodsUtil.checkActionType({ id: 2 }),
    ]
    element.unitPoint = element.unitPoint ? element.unitPoint : 1
  })
  listQuestions.value = window._.clone(temp)
  console.log(val)
}, { immediate: true })
onMounted(() => {
  callBackAction.value = actionItem
})

function deleteItem(val: Any) {
  listQuestions.value?.splice(val.originIndex, 1)
  emit('update:items', listQuestions.value)
}

function deleteItems() {
  listQuestions.value = listQuestions.value?.filter((value: Any) => {
    return !selected.value.includes(value.id)
  })
  selected.value = []
  emit('update:items', listQuestions.value)
}

// Thêm câu hỏi từ Ngân hàng
const isShowModalEditQuestion = ref(false)
const listQuestionId = ref<number[]>([])
function showModalEditQuestion() {
  isShowModalEditQuestion.value = true
}
function getListQuestion(val: Any[]) {
  val.forEach((element: Any) => {
    element.point = element.point ? element.point : 1
    element.actions = [
      MethodsUtil.checkActionType({ id: 4 }),
      MethodsUtil.checkActionType({ id: 1 }),
      MethodsUtil.checkActionType({ id: 2 }),
    ]
  })
  listQuestions.value?.push(...val)

  emit('update:items', listQuestions.value)
}

const keyword = ref<string>('')
const getRows = computed(() => {
  const listQs = window._.cloneDeep(listQuestions.value)
  if (keyword.value !== null && keyword.value.length > 0) {
    const qts: Any[] = []
    listQs?.forEach(element => {
      if (element.isQuestionGroup && element.isQuestionGroup === true) {
        if (element.questionGroupContent
          && StringUtil.removeAccents(element.questionGroupContent?.toLowerCase()).includes(StringUtil.removeAccents(keyword.value?.toLowerCase())) === true
        )
          qts.push(element)
      }
      else if (element?.listQuestions && element.listQuestions.length > 0 && StringUtil.removeAccents(
        element.listQuestions[0].contentBasic?.toLowerCase(),
      ).includes(StringUtil.removeAccents(keyword.value.toLowerCase())) === true) {
        qts.push(element)
      }
    })
    return qts
  }
  return listQs
})
function updatePoint(val: number, row: Any) {
  const item = listQuestions.value?.find(i => i.id === row.id)
  if (item) {
    item.unitPoint = val
    emit('update:items', listQuestions.value)
  }
}
const loadingShow = ref(false)
const isShowDetailAll = ref(false)
const contentNameRef = ref<any>({})
function getContentNameRef(context: any) {
  if (!contentNameRef[`CpQuestionName${context?.id}`])
    contentNameRef[`CpQuestionName${context?.id}`] = ref(null)

  return contentNameRef[`CpQuestionName${context.id}`]
}

/* xem chi tiết */
function standardizedDataInitSingle(valueQs: any) {
  if (valueQs.typeId === 6) {
    const answers: any[] = []
    const answerBlank: any[] = []
    valueQs.answersClone = valueQs.answers

    valueQs.answers.forEach((element: any) => {
      if (element.isTrue)
        answerBlank[answerBlank.length] = element

      else
        answers[answers.length] = element
    })

    valueQs.answers = answers.map((item: any, index: number) => {
      item.position = 6
      return item
    })

    valueQs.answerBlank = answerBlank.map((item: any, index: number) => {
      item.position = 6
      return item
    })
    const tempElement = document.createElement('div')
    tempElement.innerHTML = valueQs.content

    // Lấy tất cả các phần tử <span> có class="answer-fill-blank"
    const spanElements = tempElement.querySelectorAll('span.answer-fill-blank')

    // Lặp qua từng phần tử và xóa nội dung bên trong
    spanElements.forEach((spanElement: any, index: number) => {
      spanElement.innerHTML = `<span >${valueQs.answerBlank[index]?.content}</span>`
    })
    valueQs.content = tempElement.innerHTML
  }
  if (valueQs.typeId === 7) {
    const tempElement = document.createElement('div')
    tempElement.innerHTML = valueQs.content
    const spanElements = tempElement.querySelectorAll('.answer-select')
    const listAnserView = ref<any[]>([])
    valueQs.answers.forEach((item: any, index: number) => {
      if (!listAnserView.value[item.position])
        listAnserView.value[item.position] = [toRaw(item)]
      else
        listAnserView.value[item.position].push(item)
    })

    // Lặp qua từng phần tử và xóa nội dung bên trong
    spanElements.forEach((spanElement, idx) => {
      const isTrue = listAnserView.value[idx + 1].findIndex((item: any) => item.isTrue)
      spanElement.innerHTML = `<span>Đáp án ${getIndex(isTrue)} <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9l6 6l6-6"></path></svg>
</span>`
    })

    valueQs.content = tempElement.innerHTML
  }

  valueQs.isAutoApprove = MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true
  return valueQs
}

function getIndex(position: number) {
  return `${String.fromCharCode(65 + position)}.`
}

function handleSpanClick(event: any, pos: number, dataQs: any) {
  // Xử lý sự kiện khi thẻ span được click
  listQuestions.value[dataQs.originIndex].listCurrentId = pos
}
function attachClickEvent(el: any, dataQs: any) {
  nextTick(() => {
    const answerSpans = el?.querySelectorAll('.answer-select')

    answerSpans?.forEach((span: any, pos: any) => {
      span.addEventListener('click', ($event: any) => handleSpanClick($event, pos + 1, dataQs))
    })
  })
}
async function getInforQuestion(result: any, id: number) {
  loadingShow.value = true
  await MethodsUtil.requestApiCustomV5(QuestionService.GetDetailQuestion(Number(id)), TYPE_REQUEST.GET).then(({ data }: any) => {
    if (data.isGroup)
      result.value = standardizedDataInitCluse(data)
    else
      result.value = standardizedDataInitSingle(data)
  })
}
async function openDetail(dataQs: any, el: any) {
  if (dataQs.id) {
    const result = ref()
    listQuestions.value[dataQs.originIndex].loadingShow = true

    if (dataQs.isGroup)
      result.value = standardizedDataInitCluse(dataQs)
    else
      result.value = standardizedDataInitSingle(dataQs)
    listQuestions.value[dataQs.originIndex] = {
      ...listQuestions.value[dataQs.originIndex],
      ...result.value,
    }
    setTimeout(() => {
      listQuestions.value[dataQs.originIndex].loadingShow = false
    }, 500)
    nextTick(() => {
      attachClickEvent(el.value, dataQs)
    })
  }
  listQuestions.value[dataQs.originIndex].isExpand = true
}
async function closeDetail(dataQs: any) {
  listQuestions.value[dataQs.originIndex].isExpand = false
}
function standardizedDataInitCluse(valueQsList: any) {
  valueQsList?.questions.forEach((valueQs: any) => {
    if (valueQs.typeId === 6) {
      valueQs.answersClone = valueQs.answers
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
    valueQs.isAutoApprove = MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true
  })
  return valueQsList
}
</script>

<template>
  <div class="mt-6">
    <CpActionHeaderPage
      :title="t('questions')"
      :is-custom-add-btn="true"
      :title-custom-add="t('create-question')"
      @click="emit('clickAddQuestion')"
    >
      <template #actions>
        <CmDropDown
          :title="t('taken-from-another')"
          color="success"
          variant="flat"
          :list-item="actionTakenFromAnother"
          :type="2"
          icon="tabler:chevron-down"
        />
      </template>
    </CpActionHeaderPage>
    <CpHeaderAction
      v-model:keyword="keyword"
      :is-fillter="false"
      :disabled-delete="selected.length === 0"
      is-delete
      @delete-multiple="deleteItems"
    >
      <template #actionLeft>
        <CmButton
          variant="tonal"
          disabled
          :title="t('preview')"
        />
        <CmButton
          class-name="ml-2"
          disabled
          :title="t('ActionUpdatePointOffline')"
        />
      </template>
    </CpHeaderAction>
    <div>
      <CmTable
        v-model:selected="selected"
        is-update-row-force
        :headers="headers"
        :items="getRows"
        disiable-pagination
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'questions'">
            <CpQuestionName
              :ref="getContentNameRef(context)"
              :status="context.statusId"
              :content-basic="context.isExpand && [3, 6, 7].includes(context.typeId) ? context.content : (context.basic ? context.basic : context.contentBasic)"
              :is-expand="isShowDetailAll || context.isExpand"
              @update:open="($event: any) => openDetail(context, $event)"
              @update:close="closeDetail(context)"
            >
              <div v-show="context.loadingShow">
                <VProgressLinear
                  indeterminate
                  color="primary"
                />
              </div>
              <div v-if="!context.loadingShow && context.isExpand">
                <CpContentView
                  :type="context.typeId"
                  :data="context"
                  :show-content="false"
                  :list-current-id="context.listCurrentId"
                  :show-media="false"
                  disabled
                  show-answer-true
                />
              </div>
            </CpQuestionName>
          </div>
          <div v-if="col === 'unitPoint'">
            <CmTextField
              v-model="context.point"
              type="number"
              @update:model-value="updatePoint($event, context)"
            />
          </div>
        </template>
      </CmTable>
    </div>

    <CpMdQuestionBankV5
      v-model:is-show="isShowModalEditQuestion"
      v-model:selected="listQuestionId"
      :title="t('add-from-question-bank')"
      @update:selected="getListQuestion"
    />
  </div>
</template>
