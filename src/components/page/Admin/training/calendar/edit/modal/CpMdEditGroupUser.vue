<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import type { Any } from '@/typescript/interface'
import type { Params } from '@/typescript/interface/params'
import MethodsUtil from '@/utils/MethodsUtil'
import CpSearch from '@/components/page/gereral/CpSearch.vue'
import UserService from '@/api/user'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

const props = withDefaults(defineProps<Props>(), ({
  customKey: 'listUserId',
  title: 'group-add',
  api: '',
}))

const emit = defineEmits<Emit>()

const { t } = window.i18n()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

interface Props {
  isShow: boolean
  title: string
  returnObject: boolean
  customKey: string
  api: string
  method: string
}
interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'confirm', data: any): void
}
interface QueryParams extends Params {
  searchData: string
  listId: any
  isMinus: boolean
  typeId: number
}

const queryParams = reactive<QueryParams>({
  searchData: '',
  isMinus: true,
  typeId: 2,
  listId: '',
  pageNumber: 1,
  pageSize: 10,
})
const route = useRoute()

function getListExculeId() {
  MethodsUtil.requestApiCustom(UserService.GetListIdUserGroupById, TYPE_REQUEST.GET, { eventCalendarId: route.params.id }).then((result: any) => {
    queryParams.listId = JSON.stringify(result.data)
  })
}
const listUser = ref<Any[]>([])
const totalRecord = ref<number>(0)
async function fetchDataModal() {
  const { data } = await MethodsUtil.requestApiCustom(UserService.GetPagingUserGroup, TYPE_REQUEST.GET, queryParams)
  listUser.value = data.pageLists
  totalRecord.value = data.totalRecord
}
watch(queryParams, val => {
  fetchDataModal()
})
function hidden() {
  emit('update:isShow', false)
}

const listItem = ref<any>([])
const headers = [
  { text: '', value: 'checkbox' },
  { text: t('user-name'), value: 'name' },
  { text: t('description'), value: 'description' },
]

async function confirm() {
  const model = {
    listGroupUserId: listItem.value,
    eventCalendarId: route.params.id,
  }
  emit('confirm', model)
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isShow"
    :title="t(title)"
    size="xl"
    :disabled-ok="!listItem.length"
    @cancel="hidden"
    @confirm="confirm"
    @show="getListExculeId"
  >
    <div class="d-flex justify-end mb-6">
      <div class="w-50 d-flex justify-end mb-6">
        <CpSearch
          v-model:key-search="queryParams.searchData"
        />
      </div>
    </div>
    <CmTable
      v-model:page-number="queryParams.pageNumber"
      v-model:selected="listItem"
      is-update-row-force
      :headers="headers"
      :items="listUser"
      :total-record="totalRecord"
    />
  </CmDialogs>
</template>
