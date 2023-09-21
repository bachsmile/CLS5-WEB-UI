<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import QuestionService from '@/api/question'
import StringJwt from '@/utils/Jwt'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import CpFilterAsignUser from '@/components/page/gereral/asign-user/filter/CpFilterAsignUser.vue'

const props = withDefaults(defineProps<Props>(), ({
  customKey: 'listUserId',
  title: 'add-teacher',
  typeId: 2,
  roleId: 2,
  sizeMd: 'lg',
  api: QuestionService.PostListUserAddTest,
  isFilter: true,
  methodGet: TYPE_REQUEST.POST,
  headers: () => ([]),
}))

const emit = defineEmits<Emit>()

const { t } = window.i18n()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))

interface Props {
  isDialogVisible: boolean
  title?: string
  typeId?: number
  roleId?: number
  sizeMd?: string
  returnObject?: boolean
  isFilter?: boolean
  customKey?: string
  api?: string
  excludeIds?: any[]
  headers?: any[]
  paramsExtra?: any
  methodGet?: any
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data: any): void
}

const queryParams = reactive<any>({
  titles: [],
  categoryTitleId: [],
  organizationalStructureId: [],
  groupId: [],
  keyword: '',
  search: '',
  pageNumber: 1,
  pageSize: 10,
  excludeIds: [],
  roleId: 2,
  userRole: StringJwt.getRole(),
  examId: null,
  testId: null,
  typeId: 2,
})
const route = useRoute()

const listUser = ref<Any[]>([])
const totalRecord = ref<number>(0)
async function getListUserTeacher() {
  const params = {
    ...queryParams,
    examId: Number(route.params.id),
    testId: Number(route.params.thematicId),
    typeId: Number(props.typeId),
    ...props.paramsExtra,
  }
  MethodsUtil.requestApiCustom(props.api, props.methodGet, params).then((result: any) => {
    listUser.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}

watch(queryParams, val => {
  getListUserTeacher()
})
function hidden() {
  emit('update:isDialogVisible', false)
}

const listItem = ref<any>([])

async function confirm(idbtn: number, unload: any) {
  emit('confirm', listItem.value)
  setTimeout(() => {
    unload(idbtn)
  }, 1000)
}

const isShowFilter = ref(true)

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    default:
      break
  }
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.pageNumber = 1
  queryParams.keyword = value
  queryParams.search = value
}
const headerData = ref<any[]>([])
onMounted(() => {
  queryParams.excludeIds = props.excludeIds
  if (!props.headers.length) {
    headerData.value = [
      { text: '', value: 'checkbox', width: 50 },
      { text: t('lecturer-name'), value: 'name' },
      { text: t('email'), value: 'email' },
    ]
  }
  else {
    headerData.value = props.headers
  }
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isDialogVisible"
    :title="t(title)"
    :size="sizeMd"
    :disabled-ok="!listItem.length"
    @cancel="hidden"
    @confirm="confirm"
    @show="getListUserTeacher"
  >
    <CmCollapse
      v-if="isFilter"
      :is-show="isShowFilter"
    >
      <CpFilterAsignUser
        v-model:orStructure="queryParams.organizationalStructureId"
        v-model:groupUser="queryParams.groupId"
        v-model:categoryTitleId="queryParams.categoryTitleId"
        v-model:titles="queryParams.titles"
        :sm="6"
      />
    </CmCollapse>
    <div class="mb-5">
      <CpHeaderAction
        :is-fillter="isFilter"
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      />
    </div>

    <CmTable
      v-model:page-number="queryParams.pageNumber"
      v-model:selected="listItem"
      is-update-row-force
      :headers="headerData"
      :items="listUser"
      :total-record="totalRecord"
      :type-pagination="2"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'name'">
          <CpCustomInfo
            is-show-code
            :context="context"
            label-code="code"
          />
        </div>
      </template>
    </CmTable>
  </CmDialogs>
</template>
