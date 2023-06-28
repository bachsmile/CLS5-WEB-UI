<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import type { Any } from '@/typescript/interface'
import type { Params } from '@/typescript/interface/params'
import MethodsUtil from '@/utils/MethodsUtil'
import { useStoreAddUser } from '@/stores/admin/group-user/modalEditGroupUser'
import StringJwt from '@/utils/Jwt'
import CpSearch from '@/components/page/gereral/CpSearch.vue'

const props = withDefaults(defineProps<Props>(), ({
  customKey: 'listUserId',
  title: 'group-add',
  api: '',
}))

const emit = defineEmits<Emit>()

const { t } = window.i18n()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

const storeUser = useStoreAddUser()
const { dataHeader } = storeToRefs(storeUser)
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
  keyword: string
  roleId: number | null
  titles: string[] | null
  userRole: number | null
  excludeIds: number[] | null
  categoryTitleId: number[] | null
  groupId: number[] | null
  organizationalStructureId: number[] | null
  id: number | null
}
const route = useRoute()

const queryParams = reactive<QueryParams>({
  keyword: '',
  roleId: null,
  titles: '',
  userRole: StringJwt.getRole(),
  excludeIds: [],
  categoryTitleId: null,
  groupId: null,
  organizationalStructureId: null,
  pageNumber: 1,
  pageSize: 10,
  id: Number(route.params.id),
})
const listUser = ref<Any[]>([])
const totalRecord = ref<number>(0)
async function fetchDataModal() {
  const { data } = await MethodsUtil.requestApiCustom(props.api, props.method, queryParams)
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
  { text: t('user-name'), value: 'name', type: 'custom' },
  { text: t('email'), value: 'email' },
]

async function confirm() {
  if (props.returnObject) {
    emit('confirm', { [props.customKey]: listItem.value })
  }
  else {
    const listId = listItem.value.map((item: Any) => item.id)
    emit('confirm', { [props.customKey]: listId })
  }
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isShow"
    :title="t(title)"
    size="lg"
    :disabled-ok="!listItem.length"
    @cancel="hidden"
    @confirm="confirm"
    @show="fetchDataModal"
  >
    <div class="d-flex justify-end mb-6">
      <div class="w-50 d-flex justify-end mb-6">
        <CpSearch
          v-model:key-search="queryParams.keyword"
        />
      </div>
    </div>
    <CmTable
      v-model:page-number="queryParams.pageNumber"
      v-model:selected="listItem"
      :headers="headers"
      :items="listUser"
      :return-object="true"
      :total-record="totalRecord"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'name'">
          <CpCustomInfo
            :context="context"
            :is-show-code="false"
            :is-show-email="false"
          />
        </div>
      </template>
    </CmTable>
  </CmDialogs>
</template>
