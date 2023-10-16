<script lang="ts" setup>
import CpActionHeaderPage from './CpActionHeaderPage.vue'
import CpHeaderAction from './CpHeaderAction.vue'
import SkUser from './skeleton/SkUser.vue'
import CpQuestionName from './CpQuestionName.vue'
import CpContentView from './CpContentView.vue'
import CmDialogs from '@/components/common/CmDialogs.vue'
import type { Any } from '@/typescript/interface'
import CmTable from '@/components/common/CmTable.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import QuestionService from '@/api/question'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Params } from '@/typescript/interface/params'
import { comboboxStore } from '@/stores/combobox'
import UserService from '@/api/user'
import CmButton from '@/components/common/CmButton.vue'

// Khởi tạo
const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',
}))

const emit = defineEmits<Emit>()

const CmSelectTree = defineAsyncComponent(() => import('@/components/common/CmSelectTree.vue'))

const storeCombobox = comboboxStore()
const { topicCombobox } = storeToRefs(storeCombobox)
const { getComboboxTopic } = storeCombobox
const { t } = window.i18n()
const isShowFilter = ref(true)
interface Emit {
  (e: 'ok', value: any): void
  (e: 'edit', value: any): void
  (e: 'update:isShow', value: any): void
  (e: 'update:selected', value: any): void
}
interface Props {
  isShow: boolean
  title: string
}

function cancelModal() {
  emit('update:isShow', false)
}

const dataInput = ref<Any>({})

function resetData() {
  dataInput.value = {
    id: '',
    name: '',
    description: '',
  }
}
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('question'), value: 'question' },
  { text: t('question-type'), value: 'questionType', type: 'custom', width: 250 },
]

interface QueryParams extends Params {
  topicId: Any[] | null
  levelId: number | null
  statusId: number | null
  userId: number | null
  typeId: number | null
  groupId: number | null
  sort: string | null
  dateFrom: any | null
  dateTo: any | null
  keyword: string
  includeIds?: number[]
}
const queryParams = ref<QueryParams>({
  pageNumber: 1,
  pageSize: 10,
  keyword: '',
  topicId: null,
  levelId: null,
  statusId: null,
  userId: null,
  typeId: null,
  sort: null,
  dateFrom: null,
  groupId: null,
  dateTo: null,
})
const items = ref<Any[]>([])
const totalRecord = ref(0)
function getListQuestion() {
  MethodsUtil.requestApiCustomV5(QuestionService.GetListQuestionDetailV5, TYPE_REQUEST.GET, queryParams.value).then(({ data }: { data: Any }) => {
    data.listData.forEach((element: Any) => {
      element.questionId = element.id
      element.questionTypeId = element.typeId
    })
    items.value = data.listData
    totalRecord.value = data.totalRecords
  })
}
watch(queryParams.value, val => {
  getListQuestion()
})
function filterHandle() {
  queryParams.value.pageNumber = 1
  queryParams.value.pageSize = 10
}
const selected = ref<number[]>([])
getComboboxTopic(4)

const questionType = ref<Any[]>([])
function getComboboxQuestionType() {
  MethodsUtil.requestApiCustom(QuestionService.GetComboboxQuestionType, TYPE_REQUEST.GET).then(({ data }: { data: Any[] }) => {
    data.forEach((item: Any) => {
      item.text = t(item.value)
    })
    questionType.value = data
  })
}
getComboboxQuestionType()
const questionLevel = ref<Any[]>([])
function getComboboxQuestionLevel() {
  MethodsUtil.requestApiCustom(QuestionService.GetComboboxQuestionLevel, TYPE_REQUEST.GET).then(({ data }: { data: Any[] }) => {
    questionLevel.value = data
  })
}

// Lấy thông tin giảng viên

const vSelectOwner = ref<any>({
  listCombobox: [],
  totalRecord: 0,
  pageNumber: 1,
  pageSize: 30,
  search: '',
  excludeList: [],
  currentUserIds: [],
  itemSelected: {} as any,
})
async function isIntersecting() {
  vSelectOwner.value.pageNumber += 1
  getTeacherOwnerCourse(true)
}
async function getTeacherOwnerCourse(loadMore?: any) {
  // loadMore dùng khi infinity scroll
  const params = {
    pageSize: vSelectOwner.value.pageSize,
    pageNumber: vSelectOwner.value.pageNumber,
    keyword: vSelectOwner.value.search,
    excludeIds: vSelectOwner.value.excludeList,
    currentUserIds: vSelectOwner.value.currentUserIds,
  }
  await MethodsUtil.requestApiCustom(UserService.PostGetTeacher, TYPE_REQUEST.POST, params).then((value: any) => {
    if (value?.data?.pageLists.length) {
      vSelectOwner.value.totalRecord = value.data.totalRecord

      if (loadMore)
        vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.concat(value.data.pageLists)

      else
        vSelectOwner.value.listCombobox = value.data.pageLists
      vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.map((itemValue: any) => ({
        ...itemValue,
        name: `${itemValue.lastName} ${itemValue.firstName}`,
      }))
      if (vSelectOwner.value.itemSelected?.id && !loadMore) {
        const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item.id === vSelectOwner.value.itemSelected.id)
        if (indexOwner === -1) {
          vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value.itemSelected)
          vSelectOwner.value.excludeList = [vSelectOwner.value.itemSelected.id]
        }
      }
    }
    else {
      vSelectOwner.value.listCombobox = []
      vSelectOwner.value.totalRecord = 0
    }
  })
}
const sort = [{ key: '+questionContent', value: 'sort-name-az' }, { key: '-questionContent', value: 'sort-name-za' }, { key: '+time', value: 'sort-time-az' }, { key: '-time', value: 'sort-time-za' }]
const listQuestionGroupId = [
  {
    value: t('single-question'),
    key: 0,
  },
  {
    value: t('cluster-question'),
    key: 1,
  },
]
const isDisabled = computed(() => {
  return selected.value.length > 0
})
const loadingShow = ref(false)
function confirmModal() {
  emit('update:selected', selected.value)
  emit('update:isShow', false)
}
const isShowDetailAll = ref(false)
const contentNameRef = ref<any>({})
function getContentNameRef(context: any) {
  if (!contentNameRef[`CpQuestionName${context?.id}`])
    contentNameRef[`CpQuestionName${context?.id}`] = ref(null)

  return contentNameRef[`CpQuestionName${context.id}`]
}
async function showDetailAll() {
  isShowDetailAll.value = !isShowDetailAll.value
  await getInforQuestionDetail(isShowDetailAll.value)
}

/* xem chi tiết */
function standardizedDataInitSingle(valueQs: any) {
  if (valueQs.typeId === 6) {
    const answers: any[] = []
    const answerBlank: any[] = []
    valueQs.answersClone = window._.cloneDeep(valueQs.answers)

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

async function getInforQuestionDetail(isShow: boolean) {
  loadingShow.value = true
  items.value.forEach((element: any, index: number) => {
    const dynamicRef = getContentNameRef(element) // Truy vấn đến ref của CpQuestionName có id 1
    element.isExpand = isShow
    const result = ref()
    if (element.isGroup)
      result.value = standardizedDataInitCluse(element)
    else
      result.value = standardizedDataInitSingle(element)
    items.value[index] = {
      ...items.value[index],
      ...result.value,
    }

    attachClickEvent(dynamicRef.value.qsNameContentRef, items.value[index])
  })
}
function handleSpanClick(event: any, pos: number, dataQs: any) {
  // Xử lý sự kiện khi thẻ span được click
  items.value[dataQs.originIndex].listCurrentId = pos
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
  const result = ref()
  items.value[dataQs.originIndex].loadingShow = true

  await getInforQuestion(result, dataQs.id).then(() => {
    items.value[dataQs.originIndex] = {
      ...items.value[dataQs.originIndex],
      ...result.value,
    }
    setTimeout(() => {
      items.value[dataQs.originIndex].loadingShow = false
    }, 500)
  })
  items.value[dataQs.originIndex].isExpand = true
  nextTick(() => {
    attachClickEvent(el.value, dataQs)
  })
}
async function closeDetail(dataQs: any) {
  items.value[dataQs.originIndex].isExpand = false
}
function standardizedDataInitCluse(valueQsList: any) {
  valueQsList?.questions.forEach((valueQs: any) => {
    if (valueQs.typeId === 6) {
      valueQs.answersClone = window._.cloneDeep(valueQs.answers)
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
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    size="xl"
    :disabled-ok="!isDisabled"
    persistent
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
    @show="getListQuestion"
  >
    <div>
      <CpActionHeaderPage
        :title="t('questions')"
        is-export-btn
      />
    </div>
    <CmCollapse :is-show="isShowFilter">
      <VRow>
        <VCol
          lg="4"
          cols="12"
        >
          <CmSelectTree
            v-model:model-value="queryParams.topicId"
            :options="topicCombobox"
            :normalizer-custom-type="['id', 'name', 'children']"
            :text="t('topic')"
            :placeholder="t('topic')"
            multiple
            value-format="id"
            @update:model-value="filterHandle"
          />
        </VCol>
        <VCol
          lg="4"
          cols="12"
        >
          <CmSelect
            v-model:model-value="queryParams.levelId"
            :text="t('level')"
            :items="questionLevel"
            item-value="key"
            custom-key="value"
            @open="getComboboxQuestionLevel"
            @update:model-value="filterHandle"
          />
        </VCol>
        <VCol
          lg="4"
          cols="12"
        >
          <CmSelect
            v-model:model-value="queryParams.groupId"
            :text="t('question-format')"
            :items="listQuestionGroupId"
            item-value="key"
            custom-key="value"
            @update:model-value="filterHandle"
          />
        </VCol>
        <VCol
          lg="4"
          cols="12"
        >
          <CmSelect
            v-model:model-value="queryParams.userId"
            :text="t('user-create')"
            :placeholder="t('user-create')"
            :items="vSelectOwner.listCombobox"
            is-infinity-scroll
            :total-record="vSelectOwner.totalRecord"
            item-value="id"
            custom-key="name"
            :append-to-body="false"
            @open="getTeacherOwnerCourse"
            @isIntersecting="isIntersecting"
            @update:model-value="filterHandle"
          >
            <template #infinityItem>
              <SkUser
                :number="2"
              />
            </template>
          </CmSelect>
        </VCol>
        <VCol
          lg="4"
          cols="12"
        >
          <CmSelect
            v-model:model-value="queryParams.typeId"
            :text="t('question-type')"
            :items="questionType"
            item-value="key"
            custom-key="value"
            @update:model-value="filterHandle"
          />
        </VCol>
        <VCol
          lg="4"
          cols="12"
        >
          <CmSelect
            v-model:model-value="queryParams.sort"
            :text="t('question-type')"
            :items="sort"
            item-value="key"
            custom-key="value"
            @update:model-value="filterHandle"
          />
        </VCol>
        <VCol
          lg="4"
          cols="12"
        >
          <VRow>
            <VCol cols="6">
              <CmDateTimePicker
                v-model:model-value="queryParams.dateFrom"
                :text="t('start-day')"
                :teleport="true"
                @update:model-value="filterHandle"
              />
            </VCol>
            <VCol cols="6">
              <CmDateTimePicker
                v-model:model-value="queryParams.dateTo"
                :text="t('to-day')"
                :teleport="true"
                @update:model-value="filterHandle"
              />
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </CmCollapse>
    <div>
      <CpHeaderAction v-model:show-filter="isShowFilter">
        <template #actionRight>
          <CmButton
            class="ml-3"
            bg-color="bg-white"
            color="white"
            text-color="color-dark"
            :size-icon="20"
            :icon="isShowDetailAll ? 'tabler:eye' : 'tabler:eye-off'"
            :title="isShowDetailAll ? t('collapse-all') : t('show-all')"
            @click="showDetailAll"
          />
        </template>
      </CpHeaderAction>
    </div>
    <div>
      <CmTable
        v-model:selected="selected"
        v-model:page-number="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :headers="headers"
        :items="items"
        return-object
        :total-record="totalRecord"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'question'">
            <CpQuestionName
              :ref="getContentNameRef(context)"
              :status="context.statusId"
              :content-basic="context.isExpand && [3, 6, 7].includes(context.typeId) ? context.content : context.contentBasic"
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

          <div v-if="col === 'questionType'">
            {{ t(context.typeId || 'QuestionService.GroupQuestion') }}
          </div>
        </template>
      </CmTable>
    </div>
  </CmDialogs>
</template>
