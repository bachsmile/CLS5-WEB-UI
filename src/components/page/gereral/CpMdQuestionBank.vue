<script lang="ts" setup>
import CpActionHeaderPage from './CpActionHeaderPage.vue'
import CpHeaderAction from './CpHeaderAction.vue'
import SkUser from './skeleton/SkUser.vue'
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
  MethodsUtil.requestApiCustom(QuestionService.GetListQuestion, TYPE_REQUEST.GET, queryParams.value).then(({ data }: { data: Any }) => {
    items.value = data.pageLists
    totalRecord.value = data.totalRecord
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
function confirmModal() {
  emit('update:selected', selected.value)
  emit('update:isShow', false)
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
      <CpHeaderAction v-model:show-filter="isShowFilter" />
    </div>
    <div>
      <CmTable
        v-model:selected="selected"
        v-model:page-number="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'question'">
            {{ t(context.contentBasic) }}
          </div>

          <div v-if="col === 'questionType'">
            {{ t(context.questionTypeName || 'QuestionService.GroupQuestion') }}
          </div>
        </template>
      </CmTable>
    </div>
  </CmDialogs>
</template>
