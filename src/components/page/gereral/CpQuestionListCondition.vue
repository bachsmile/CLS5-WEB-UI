<script setup lang="ts">
import CpHeaderAction from './CpHeaderAction.vue'
import CpActionHeaderPage from './CpActionHeaderPage.vue'
import CpMdQuestionBank from './CpMdQuestionBank.vue'
import type { Any } from '@/typescript/interface'
import CmDropDown from '@/components/common/CmDropDown.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { tableStore } from '@/stores/table'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringUtil from '@/utils/StringUtil'

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
    default:
      break
  }

  //
}
const listQuestions = ref<Any[]>()
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
  listQuestions.value = temp
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
function getListQuestion() {
  MethodsUtil.requestApiCustom(QuestionService.GetListQuestionById, TYPE_REQUEST.GET, { listId: listQuestionId.value }).then(({ data }: { data: Any[] }) => {
    data.forEach((element: Any) => {
      element.unitPoint = element.unitPoint ? element.unitPoint : 1
      element.actions = [
        MethodsUtil.checkActionType({ id: 4 }),
        MethodsUtil.checkActionType({ id: 1 }),
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    listQuestions.value = [
      ...listQuestions.value as Any[],
      ...data,
    ]
    emit('update:items', listQuestions.value)
  })
}

const keyword = ref<string>('')
const getRows = computed(() => {
  if (keyword.value !== null && keyword.value.length > 0) {
    const qts: Any[] = []
    listQuestions.value?.forEach(element => {
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
  return listQuestions.value
})
function updatePoint(val: number, row: Any) {
  const item = listQuestions.value?.find(i => i.id === row.id)
  if (item) {
    item.unitPoint = val
    emit('update:items', listQuestions.value)
  }
}
</script>

<template>
  <div class="mt-6">
    <CpActionHeaderPage
      :title="t('questions')"
      :is-custom-add-btn="true"
      :title-custom-add="t('create-question')"
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
            {{ context.contentBasic }}
          </div>
          <div v-if="col === 'unitPoint'">
            <CmTextField
              v-model="context.unitPoint"
              type="number"
              @update:model-value="updatePoint($event, context)"
            />
          </div>
        </template>
      </CmTable>
    </div>

    <CpMdQuestionBank
      v-model:is-show="isShowModalEditQuestion"
      v-model:selected="listQuestionId"
      :title="t('add-from-question-bank')"
      @update:selected="getListQuestion"
    />
  </div>
</template>
