<script lang="ts" setup>
import CpHeaderAction from '../../organization/user-group/CpHeaderAction.vue'
import CpMdDeleteTopic from './Modal/CpMdDeleteTopic.vue'
import sharedService from '@/api/shared'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import ArraysUtil from '@/utils/ArrayUtil'
import type { typeToast } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), {
  typeId: 2,
})

const SkTree = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkTree.vue'))
const CpMdEditTopic = defineAsyncComponent(() => import('./Modal/CpMdEditTopic.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const TITLE = Object.freeze({
  ADD: t('Add-new'),
  ADD_FROM_FILE: t('add-from-file'),
  EXPORT_EXCEL: t('export-excel'),
  TITLE_PAGE: t('Menu_TopicManaging'),
  TOPIC_NAME: t('topicName'),
  TOPIC_PARENT: t('topic-parent'),
  PLACEHOLDER_PARENT_TOPIC: t('Select-topic'),
  DESCRIPTRION: t('description'),
  TITLE_MODAL: t('add-topic'),
  TITLE_MODAL_EDIT: t('add-topic'),
  SYSMBOL: t('symbol'),
  TITLE_MODAL_DELETE: t('Delete-topic'),
})
const CmTreeView = defineAsyncComponent(() => import('@/components/common/CmTreeView.vue'))
interface Props {
  typeId: number
}
const config = reactive({
  roots: [] as any[],
  keyboardNavigation: false,
  dragAndDrop: false,
  checkboxes: false,
  editable: false,
  disabled: false,
  padding: 25,
})

const dataTree = ref<any[]>([])
const isRender = ref<boolean>(false)
async function getInformationTopic() {
  isRender.value = false
  const { data } = await MethodsUtil.requestApiCustom(sharedService.GetInformationTopic, TYPE_REQUEST.GET, { typeId: props.typeId })
  for (let i = 0; i < data.length; i++) {
    data[i] = {
      ...data[i],
      actions: [
        {
          id: 16,
          name: t('Add-new'),
        },
        {
          id: 1,
          name: t('QuestionService.ActionEdit'),
        },
        {
          id: 2,
          name: t('Delete'),
        },
      ],
    }
  }
  dataTree.value = data

  // Cấu hình node roots cho vue tree
  isRender.value = true
}
const dataOption = computed(() => {
  const result = ArraysUtil.formatTreeData(ArraysUtil.unFlatMapTree(ArraysUtil.formatSelectTree(dataTree.value, 'parentId', 'id')), config.roots, t, 'children')
  const filteredKeys = Object.keys(result).filter(key => result[key].parentId === 0)
  config.roots = filteredKeys
  return result
})
getInformationTopic()
interface DataInput {
  id?: number | null
  parentId?: number | null
  description: string
  icon: string
  typeId: number
  name: string
}
const dataInput = ref<DataInput>({
  id: null,
  parentId: null,
  description: '',
  icon: '',
  typeId: props.typeId,
  name: '',
})

// Thêm chủ đề
const isShowModalEdit = ref<boolean>(false)
const isEdit = ref<boolean>(false)
function showModalEdit(id: number | null = null) {
  if (id)
    dataInput.value.parentId = id
  isShowModalEdit.value = true
}
async function getDetailTopic(id: number) {
  const { data } = await MethodsUtil.requestApiCustom(sharedService.GetDetailTopic, TYPE_REQUEST.GET, { id })
  dataInput.value = {
    ...data,
    parentId: !data.parentId ? null : data.parentId,
  }
  isShowModalEdit.value = true
}
async function handleAddTopic(val: DataInput) {
  let mes = t('add-success')
  let status: typeToast = 'SUCCESS'
  const payload = {
    ...val,
    parentId: val.parentId || undefined,
  }
  MethodsUtil.requestApiCustom(sharedService.PostCreateTopic, TYPE_REQUEST.POST, payload).then(() => {
    getInformationTopic()
    isShowModalEdit.value = false
    toast(status, mes)
  })
    .catch((error: any) => {
      status = 'ERROR'
      mes = t(error.response.data.errors[0].message)
      toast(status, mes)
    })
}

async function handleEditTopic(val: DataInput) {
  let mes = t('USR_UpdateSuccess')
  let status: typeToast = 'SUCCESS'
  const payload = {
    ...val,
    parentId: val.parentId || undefined,
  }
  MethodsUtil.requestApiCustom(sharedService.PostUpdateTopic, TYPE_REQUEST.POST, payload).then(() => {
    getInformationTopic()
    isShowModalEdit.value = false
    toast(status, mes)
  })
    .catch((error: any) => {
      status = 'ERROR'
      mes = t(error.response.data.errors[0].message)
      toast(status, mes)
    })
}

function confirm(val: DataInput) {
  if (isEdit)
    handleEditTopic(val)
  else
    handleAddTopic(val)
}

const isShowModalDelete = ref<boolean>(false)
interface DataDelete {
  listId: number[]
  topicIdNew: number | null
}
const dataDelete = reactive<DataDelete>({
  listId: [],
  topicIdNew: null,
})
function handleAction(value: any, node: any) {
  switch (value?.id) {
    case 1:
      isEdit.value = true
      getDetailTopic(node.ids)
      break
    case 2:
      dataDelete.listId = [node.ids]
      isShowModalDelete.value = true
      break
    case 16:
      showModalEdit(node.ids)
      break
    default:
      break
  }
}

function exportExcel() {
  MethodsUtil.dowloadSampleFile(sharedService.PostExportExcelTopic, TYPE_REQUEST.POST, 'topic.xlsx', { lang: 'vi', topicType: props.typeId })
}

const router = useRouter()
const listItemButtonGroup = [
  {
    title: 'Thêm từ tập tin',
    icon: 'tabler:file-plus',
    key: 'importFile',
    action: () => {
      router.push({ name: 'admin-organization-user-groups-import' })
    },
  },
]

// Xóa chủ đề
function confirmDelete(topicId: number) {
  dataDelete.topicIdNew = topicId
  MethodsUtil.requestApiCustom(sharedService.DeleteTopic, TYPE_REQUEST.DELETE, dataDelete).then(() => {
    toast('SUCCESS', t('success-delete-gift-group'))
    isShowModalEdit.value = false
    getInformationTopic()
  }).catch((res: any) => {
    toast('ERROR', t('error'))
  })
}
</script>

<template>
  <CpHeaderAction
    :is-show-add="false"
    :button-prepend="TITLE.EXPORT_EXCEL"
    :button-add="TITLE.ADD"
    :is-show-delete="false"
    :title-page="TITLE.TITLE_PAGE"
    :list-item-button-group="listItemButtonGroup"
    @click-export="exportExcel"
    @click-add="showModalEdit"
  />
  <SkTree v-if="!isRender" />
  <div
    v-else
    class="page-containter-box"
  >
    <CmTreeView
      :config="config"
      is-action
      :nodes="dataOption"
      @handle-action="handleAction"
    />
  </div>
  <CpMdEditTopic
    v-model:is-show="isShowModalEdit"
    :data-tree="dataTree"
    :topic-name="TITLE.TOPIC_NAME"
    :topic-parent="TITLE.TOPIC_PARENT"
    :data="dataInput"
    :placeholder-select-topic="TITLE.PLACEHOLDER_PARENT_TOPIC"
    :description="TITLE.DESCRIPTRION"
    :title="TITLE.TITLE_MODAL"
    :symbol="TITLE.SYSMBOL"
    @confirm="confirm"
  />
  <CpMdDeleteTopic
    v-model:is-show="isShowModalDelete"
    :data-tree="dataTree"
    :placeholder-select-topic="TITLE.PLACEHOLDER_PARENT_TOPIC"
    @confirm="confirmDelete"
  />
</template>
