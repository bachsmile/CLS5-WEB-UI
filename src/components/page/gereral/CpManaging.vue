<script lang="ts" setup>
import type { Header, Item } from 'vue3-easy-data-table'
import CpHeaderAction from '../Admin/organization/user-group/CpHeaderAction.vue'
import CpConfirmDialog from './CpConfirmDialog.vue'
import CmTable from '@/components/common/CmTable.vue'
import toast from '@/plugins/toast'
import type { Params } from '@/typescript/interface/params'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), {
  header: () => ([]),
  actions: () => ([]),
  typeRequest: '',
  actionAdd: null,
  actionsTable: () => ([]),
  componentEdit: null,
  componentPropsEdit: null,
  apiDetail: null,
  titlePage: '',
  routeReport: '',
  customId: 'id',
  isShowExportExcel: true,
  isExpand: false,
})
interface Emit {
  (e: 'updateFetchData', data: any): void
}
const { emitEvent } = props.emit()
const CpCustomInfo = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInfo.vue'))
const CmAccodion = defineAsyncComponent(() => import('@/components/common/CmAccodion.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CpTableSub = defineAsyncComponent(() => import('@/components/page/gereral/CpTableSub.vue'))
const CpTableSubIconList = defineAsyncComponent(() => import('@/components/page/gereral/CpTableSubIconList.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const router = useRouter()
interface Api {
  api: string
  method: string
  payload: Any
  fileName: string
  [e: string]: any
}
interface Props {
  header: Header[]
  actions: Item[]
  apiList: Api
  apiAdd: Api
  typeRequest: string
  actionAdd?: void | null
  isDisabledAdd: boolean
  actionsTable: Item[]
  componentEdit: null
  apiGetDetail: Api
  apiEdit: Api
  apiDelete: Api
  apiExportExcel: Api
  titlePage: string
  routeReport: string
  routerEdit?: string | null
  params?: Any
  customId: string
  keySearch?: string
  isShowExportExcel: boolean
  isExpand?: boolean
  componentPropsEdit?: any
  emit?: any
}

interface QueryParams extends Params {
  keyword: string
  [e: string]: any
}
const queryParams = ref<QueryParams>({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
})
const orgModels = {
  value: 1,
  label: t('orgStruct'),
  icon: 'tabler-briefcase',
  colorClass: 'color-error',
  content: [],
}

const groupModels = {
  value: 1,
  label: 'Nhóm người dùng',
  icon: 'lucide:users',
  colorClass: 'color-warning',
  content: [],
}

const titleModels = {
  value: 1,
  label: 'Chức danh',
  icon: 'prime-check-circle',
  colorClass: 'color-success',
  content: [],
}

watch(() => props.params, (val: Any) => {
  queryParams.value = {
    ...queryParams.value,
    ...val,
  }
}, { immediate: true })

const isEdit = ref<boolean>(false)
const isShowModalEdit = ref<boolean>(false)
function showModalEdit() {
  if (!props.routerEdit) {
    isEdit.value = false
    isShowModalEdit.value = true
  }
  else {
    router.push({ name: `${props.routerEdit}-add` })
  }
}
const dataDetail = ref<any>({})
async function getDataDetail(id: number) {
  if (!props.routerEdit) {
    const { data } = await MethodsUtil.requestApiCustom(props.apiGetDetail.api, props.apiGetDetail.method, { id })
    dataDetail.value = data
  }
  else {
    router.push({ name: `${props.routerEdit}-edit`, params: { id } })
  }
}

// xóa item
const isShowModalDelete = ref<boolean>(false)
const listId = ref<number[] | undefined>([])
function showModalDelete(id?: number) {
  if (id)
    listId.value = [id]
  isShowModalDelete.value = true
}
async function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionDelete':
      showModalDelete(type[1][props.customId])
      break
    case 'ActionEdit':
      await getDataDetail(type[1].id)
      isEdit.value = true
      isShowModalEdit.value = true
      break
    case 'ActionViewReport':
      router.push({ name: props?.routeReport })
      break
    default:
      break
  }
}

// lấy data table
const items = ref<Item[]>([])
const totalRecord = ref<number>(0)
async function getDataTable() {
  const params = {
    ...queryParams.value,
    ...props.apiList.payload,
  }
  const { data } = await MethodsUtil.requestApiCustom(props.apiList.api, props.apiList.method, params)

  const result = data.pageLists ?? data
  if (result) {
    result.forEach((element: Item) => {
      if (element.orgModels) {
        const titleData = window._.clone(element.orgModels)
        element.orgModels = {
          ...orgModels,
          content: element.orgModels,
        }
        element.titleModels = {
          ...titleModels,
          content: titleData,
        }
      }
      if (element.groupModels) {
        element.groupModels = {
          ...groupModels,
          content: element.groupModels,
        }
      }

      element.actions = props.actionsTable

      element.actions = element.actions.map((el: any) => {
        return MethodsUtil.checkActionType(el, actionItem)
      })
    })
    emitEvent('updateFetchData', result)
    items.value = result
    totalRecord.value = data.totalRecord
  }
}
getDataTable()

function handlerSearch(val: string) {
  queryParams.value[props.keySearch || 'keyword'] = val
  queryParams.value.pageNumber = 1
  queryParams.value.pageSize = 10
  getDataTable()
}
function handlePageClick(pageNumber: number, pageSize: number) {
  queryParams.value.pageNumber = pageNumber
  queryParams.value.pageSize = pageSize
  getDataTable()
}

// Xác nhận thêm hoặc sửa
function handlerAdd(data: any) {
  const payload = {
    ...data,
    ...props.apiAdd?.params,
  }
  if (!props.apiAdd.api)
    return
  MethodsUtil.requestApiCustom(props.apiAdd.api, props.apiAdd.method, payload).then(() => {
    isShowModalEdit.value = false
    getDataTable()
    toast('SUCCESS', t('add-success'))
  }).catch((err: any) => {
    toast('ERROR', t(err.response.data.errors[0].message))
  })
}
function handlerEdit(data: any) {
  const payload = {
    ...data,
    ...props.apiEdit.params,
  }
  MethodsUtil.requestApiCustom(props.apiEdit.api, props.apiEdit.method, payload).then(() => {
    isShowModalEdit.value = false
    getDataTable()
    toast('SUCCESS', t('USR_UpdateSuccess'))
  }).catch((err: any) => {
    toast('ERROR', t(err.response.data.errors[0].message))
  })
}

function confirmModal(val: any) {
  if (isEdit.value)
    handlerEdit(val)
  else handlerAdd(val)
}

function confirmDelete() {
  const payload = {
    [props.apiDelete.label || 'listId']: listId.value,
    ...props.apiDelete.params,
  }
  MethodsUtil.requestApiCustom(props.apiDelete.api, props.apiDelete.method, payload).then(() => {
    isShowModalDelete.value = false
    getDataTable()
    toast('SUCCESS', t('USR_DeleteSuccess'))
  }).catch((err: any) => {
    toast('ERROR', t(err.response.data.errors[0].message))
  })
}

function cancelModalDelete() {
  listId.value = []
}
function exportExcel() {
  MethodsUtil.dowloadSampleFile(props.apiExportExcel.api, props.apiExportExcel.method, props.apiExportExcel.fileName, props.apiExportExcel?.payload)
}
</script>

<template>
  <CpHeaderAction
    class="mt-6"
    :title-page="titlePage"
    :is-show-add-group="false"
    :is-disabled-delete="!listId?.length"
    :is-show-export-excel="isShowExportExcel"
    :is-disabled-add="isDisabledAdd"
    @click-add="showModalEdit"
    @click-delete="() => { isShowModalDelete = true }"
    @update:key-search="handlerSearch"
    @click-export="exportExcel"
  />
  <CmTable
    v-model:selected="listId"
    :headers="header"
    :items="items"
    :total-record="totalRecord"
    :custom-id="customId"
    :is-expand="isExpand"
    @handlePageClick="handlePageClick"
  >
    <template #rowItem="{ col, context, dataCol }">
      <div v-if="dataCol?.isFullName">
        <CpCustomInfo
          :context="context"
        />
      </div>
      <div
        v-if="col === 'organization'"
      >
        <CmAccodion
          v-if="context.orgModels?.content?.length"
          :data="[context.orgModels]"
          custom-key="name"
          is-open
        />
        <CmAccodion
          v-if="context.groupModels?.content?.length"
          :data="[context.groupModels]"
          custom-key="name"
          is-open
        />

        <CmAccodion
          v-if="context.titleModels?.content?.length"
          :data="[context.titleModels]"
          custom-key="titleName"
          is-open
        />
      </div>
      <div v-if="dataCol?.isDate">
        {{ DateUtil.formatDateToDDMM(context[col]) }}
      </div>
      <div v-if="dataCol?.isDataId">
        <span>{{ t(MethodsUtil.checkStatus(context[col], dataCol.statusType)?.name) }}</span>
      </div>
      <div v-if="dataCol?.isStatus">
        <CmChip
          class="ma-2"
          :color="MethodsUtil.checkStatus(context.statusId, dataCol.statusType)?.color"
        >
          <VIcon
            start
            icon="carbon:dot-mark"
            size="12"
          />
          <span>{{ t(MethodsUtil.checkStatus(context.statusId, dataCol.statusType)?.name) }}</span>
        </CmChip>
      </div>
    </template>
    <template
      v-if="isExpand"
      #tableSub
    >
      <VRow>
        <slot name="tableSub" />
        <VCol
          col="12"
          sm="12"
          md="6"
        >
          <CpTableSub />
        </VCol>
        <VCol
          col="12"
          sm="6"
          md="3"
        >
          <CpTableSubIconList />
        </VCol>
        <VCol
          col="12"
          sm="6"
          md="3"
        >
          <CpTableSubIconList />
        </VCol>
      </VRow>
    </template>
  </CmTable>

  <Component
    :is="props.componentEdit"
    v-if="props.componentEdit"
    v-model:is-show="isShowModalEdit"
    :data-detail="dataDetail"
    :custom-key="props.apiAdd?.customKey"
    :api="props.apiAdd?.apiModal"
    :method="props.apiAdd?.methodModal"
    :exclude-ids="props.apiEdit?.excludeIds || []"
    :params="props.apiEdit?.params"
    @confirm="confirmModal"
  />

  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalDelete"
    :type="2"
    :confirmation-msg="t('delete')"
    @confirm="confirmDelete"
    @update:is-dialog-visible="cancelModalDelete"
  />
</template>
