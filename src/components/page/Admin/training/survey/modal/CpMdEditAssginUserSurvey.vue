<script lang="ts" setup>
import CpFilterAssignUserSurvey from '../edit/survey-topic/assign/CpFilterAssignUserSurvey.vue'
import CmDialogs from '@/components/common/CmDialogs.vue'
import type { Any } from '@/typescript/interface'
import CmTable from '@/components/common/CmTable.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'

// Khởi tạo
const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',

}))

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'ok', value: any): void
  (e: 'edit', value: any): void
  (e: 'update:isShow', value: any): void
}
interface Props {
  isShow: boolean
  title: string
}

function cancelModal() {
  emit('update:isShow', false)
}

const isShowFilter = ref(true)
const { t } = window.i18n()
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-candidates'), value: 'name' },
  { text: t('email'), value: 'email' },
]

const route = useRoute()

const params = ref<Any>({
  categoryTitleId: null,
  examId: Number(route.params.id),
  excludeIds: [],
  groupId: null,
  keyword: '',
  organizationalStructureId: null,
  pageNumber: 1,
  pageSize: 10,
  roleId: null,
  testId: Number(route.params.topicId),
  titles: null,
  typeId: 6,
  userRole: 1,
})

const items = ref<Any[]>([])
const totalRecord = ref(0)
function getListUser() {
  MethodsUtil.requestApiCustom(QuestionService.PostListUserAddTest, TYPE_REQUEST.POST, params.value).then((result: Any) => {
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}
const selected = ref<number[]>([])
function confirmModal() {
  const payload = {
    userModel: selected.value,
    examId: route.params.id,
    testId: route.params.topicId,
    type: 1,
  }
  emit('ok', payload)
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    :sub-title="title"
    @cancel="cancelModal"
    @confirm="confirmModal"
    @show="getListUser"
  >
    <CmCollapse :is-show="isShowFilter">
      <CpFilterAssignUserSurvey
        v-model:page-size="params.pageSize"
        v-model:page-number="params.pageNumber"
        v-model:category-title-id="params.categoryTitleId"
        v-model:titles="params.titles"
        v-model:group-user="params.groupId"
        v-model:or-structure="params.organizationalStructureId"
        @update:page-number="getListUser"
      />
    </CmCollapse>
    <CpHeaderAction
      v-model:show-filter="isShowFilter"
      v-model:keyword="params.keyword"
      v-model:page-size="params.pageSize"
      v-model:page-number="params.pageNumber"
      @update:keyword="getListUser"
    />
    <div class="mt-3">
      <CmTable
        v-model:selected="selected"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'name'">
            <CpCustomInfo :context="context" />
          </div>
        </template>
      </CmTable>
    </div>
  </CmDialogs>
</template>
