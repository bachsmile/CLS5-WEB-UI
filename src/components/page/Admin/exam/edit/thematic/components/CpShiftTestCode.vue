<script setup lang="ts">
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmTable from '@/components/common/CmTable.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CpMdAddTestCodeShift from '@/components/page/Admin/exam/edit/thematic/modal/CpMdAddTestCodeShift.vue'
import toast from '@/plugins/toast'
import ExamService from '@/api/exam'
import { tableStore } from '@/stores/table'
import StringUtil from '@/utils/StringUtil'

const props = withDefaults(defineProps<Props>(), ({
  idShift: null,
}))
const emit = defineEmits<Emit>()
interface Props {
  idShift?: any
}
interface Emit {
  (e: 'cancel'): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

const queryParams = ref<any>({
  pageNumber: 1,
  pageSize: 10,
  searchData: null,
  shiftId: null,
  sort: ['-authorName'],
})
const modeView = ref('list')
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('test-code'), value: 'name' },
  { text: t('creator'), value: 'creator', type: 'custom' },
  { text: t('time-exam'), value: 'minuteOfWork' },
  { text: t('number-question'), value: 'numberOfQuestion' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref<any[]>([])
const totalRecord = ref<number>(0)
const dataComponent = reactive({
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})

const disabledBtnHeaderAction = computed(() => !dataComponent.selectedRowsIds.length)

// hàm trả về các loại action từ header filter
// bật tắt filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'delete':
      deleteItems()
      break

    default:
      break
  }
}
const isShowDialogNotiDelete = ref(false)
const isShowDialogAddTestCode = ref(false)

// Function to handle when click button Delete
function deleteItem(id: number) {
  dataComponent.deleteIds = [id as never]
  isShowDialogNotiDelete.value = true
}
function deleteItems() {
  dataComponent.deleteIds = dataComponent.selectedRowsIds
  isShowDialogNotiDelete.value = true
}
function confirmDialogDelete(event: any) {
  if (event)
    deleteAction()
}

// delete action
// Hành động xóa năng lực
async function deleteAction() {
  const params = {
    shiftId: props.idShift,
    listModel: dataComponent.deleteIds,
  }
  await MethodsUtil.requestApiCustom(ExamService.PostDelTestCodeShift, TYPE_REQUEST.POST, params).then((value: any) => {
    getPagingTestCodeShift()
    dataComponent.selectedRowsIds = []
    dataComponent.deleteIds = []
    toast('SUCCESS', t(value.message))
  })
}
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.searchData = value
}
function getPagingTestCodeShift() {
  queryParams.value.shiftId = props.idShift
  MethodsUtil.requestApiCustom(ExamService.PostPagingTestCodeShift, TYPE_REQUEST.POST, queryParams.value).then((result: any) => {
    result.data.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    items.value = result.data
    totalRecord.value = result.data.totalRecord
  })
}
getPagingTestCodeShift()

const storeTable = tableStore()

// hàm trả về các loại action khi click
async function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    default:
      break
  }
}
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      isShowDialogAddTestCode.value = true
      break

    default:
      break
  }
}

async function handleAddTestCode(data: any) {
  const params = {
    shiftId: props.idShift,
    testId: Number(route.params.thematicId),
    userModel: data,
  }
  MethodsUtil.requestApiCustom(ExamService.PostSaveTestCodeShift, TYPE_REQUEST.POST, params).then((result: any) => {
    getPagingTestCodeShift()
    toast('SUCCESS', t(result.message))
    isShowDialogAddTestCode.value = false
  }).catch((err: any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.error, t))
  })
}
onMounted(() => {
  const { callBackAction } = storeToRefs(storeTable)
  callBackAction.value = actionItem
})
watch(queryParams.value, (val: any) => {
  getPagingTestCodeShift()
})
</script>

<template>
  <div>
    <div class="mt-6">
      <CpActionHeaderPage
        :title="t('list-tests')"
        :title-custom-add="t('add-exam-papers')"
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <div class="my-3">
      <CpHeaderAction
        is-delete
        :disabled-delete="disabledBtnHeaderAction"
        :is-fillter="false"
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      />
    </div>
    <div>
      <CmTable
        v-model:pageNumber="queryParams.pageNumber"
        v-model:pageSize="queryParams.pageSize"
        v-model:selected="dataComponent.selectedRowsIds"
        is-border-row
        is-update-row-force
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'creator'">
            <span>{{ StringUtil.formatFullName(context.firstName, context.lastName) }}</span>
          </div>
        </template>
      </CmTable>
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :confirmation-msg-sub-title="t('confirm-delete-teacher')"
      :confirmation-msg="t('delete-teacher')"
      @confirm="confirmDialogDelete"
    />
    <CpMdAddTestCodeShift
      v-if="isShowDialogAddTestCode"
      v-model:is-dialog-visible="isShowDialogAddTestCode"
      :id-shift="props.idShift"
      @confirm="handleAddTestCode"
    />
  </div>
</template>
