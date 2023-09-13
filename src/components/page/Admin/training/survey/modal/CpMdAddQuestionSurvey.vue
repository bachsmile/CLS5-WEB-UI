<script lang="ts" setup>
import type { Item } from 'vue3-easy-data-table'
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'
import CmTable from '@/components/common/CmTable.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import type { Params } from '@/typescript/interface/params'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import type { Any } from '@/typescript/interface'

// Khởi tạo
const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',
}))

const emit = defineEmits<Emit>()

const { t } = window.i18n()

interface Emit {
  (e: 'ok', value: any): void
  (e: 'update:isShow', value: any): void
}
interface Props {
  isShow: boolean
  title: string
  cancelIds?: number[]
}

function cancelModal() {
  emit('update:isShow', false)
}

const selected = ref<Item[]>([])

function resetData() {
  selected.value = []
}

interface QueryParams extends Params {
  keyword: string
  topicId?: number[]
  statusId?: number
  typeId?: number
  cancelIds?: number[]
  sort?: string
  newUserId?: number
  dateFrom?: any
  dateTo?: any
}
const queryParams = reactive<QueryParams>({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
  statusId: 3,
})
watch(() => props.cancelIds, val => {
  queryParams.cancelIds = val
})

const isShowFilter = ref(true)
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('survey-content'), value: 'contentBasic' },
  { text: t('question-type'), value: 'questionType', type: 'custom', width: 200 },
  { text: '', value: 'actions', width: 150 },
]
const items = ref<Item[]>([])
const totalRecord = ref(0)
function getListTestSurvey() {
  MethodsUtil.requestApiCustom(QuestionService.GetListTestSurveyFromBankSurvey, TYPE_REQUEST.GET, queryParams).then((result: Any) => {
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}

function filterData() {
  queryParams.pageNumber = 1
  queryParams.pageSize = 10
  getListTestSurvey()
}
function confirmModal() {
  emit('ok', selected.value)
  emit('update:isShow', false)
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    size="xl"
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
    @show="getListTestSurvey"
  >
    <div>
      <CpActionHeaderPage
        :title="title"
      />
    </div>
    <CmCollapse :is-show="isShowFilter">
      <VRow class="flex-wrap">
        <VCol
          cols="12"
          lg="4"
        >
          <CpTopicSelect
            v-model:model-value="queryParams.topicId"
            :text="t('topic')"
            :type="4"
            :is-show-add="false"
            multiple
            :placeholder="t('select')"
            @update:model-value="filterData"
          />
        </VCol>
        <VCol
          cols="12"
          lg="4"
        >
          <CmSelect
            v-model:model-value="queryParams.newUserId"
            :text="t('user-create')"
            multiple
            @update:model-value="filterData"
          />
        </VCol>
        <VCol
          cols="12"
          lg="4"
        >
          <CmSelect
            v-model:model-value="queryParams.typeId"
            :type="4"
            :text="t('question-type')"
            :is-show-add="false"
            multiple
            @update:model-value="filterData"
          />
        </VCol>
        <VCol
          cols="12"
          lg="4"
        >
          <VRow>
            <VCol
              cols="12"
              lg="6"
            >
              <CmDateTimePicker
                v-model:model-value="queryParams.dateFrom"
                :text="t('start-time')"
                @update:model-value="filterData"
              />
            </VCol>
            <VCol
              cols="12"
              lg="6"
            >
              <CmDateTimePicker
                v-model:model-value="queryParams.dateTo"
                :text="t('end-time')"
                @update:model-value="filterData"
              />
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </CmCollapse>

    <div>
      <CpHeaderAction
        v-model:show-filter="isShowFilter"
        v-model:keyword="queryParams.keyword"
        @update:keyword="filterData"
      />
    </div>

    <div>
      <CmTable
        v-model:selected="selected"
        v-model:page-number="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        @update:page-number="getListTestSurvey"
        @update:page-size="getListTestSurvey"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'questionType'">
            {{ t(context.questionTypeName) }}
          </div>
        </template>
      </CmTable>
    </div>
  </CmDialogs>
</template>
