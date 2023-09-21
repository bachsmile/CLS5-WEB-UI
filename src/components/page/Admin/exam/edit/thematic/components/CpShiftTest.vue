<script setup lang="ts">
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmTable from '@/components/common/CmTable.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import DateUtil from '@/utils/DateUtil'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CpShiftTestEdit from '@/components/page/Admin/exam/edit/thematic/components/CpShiftTestEdit.vue'
import toast from '@/plugins/toast'
import ExamService from '@/api/exam'
import { tableStore } from '@/stores/table'
import CmButton from '@/components/common/CmButton.vue'

// const props = withDefaults(defineProps<Props>(), ({
// }))
// interface Props {
// //
// }
const emit = defineEmits<Emit>()
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
  testId: null,
})
const modeView = ref('list')
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-exam-antholory'), value: 'name' },
  { text: t('amount-student'), value: 'numberStudent' },
  { text: t('start-time'), value: 'startDateTime', type: 'custom' },
  { text: t('end-time'), value: 'endDateTime', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref<any[]>([])
const totalRecord = ref<number>(0)
const dataComponent = reactive({
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})

const disabledBtnHeaderAction = computed(() => !dataComponent.selectedRowsIds.length)
const idShift = ref(0)

// hàm trả về các loại action từ header filter
// bật tắt filter
const isShowFilter = ref(true)
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break

    case 'delete':
      deleteItems()
      break

    default:
      break
  }
}
const isShowDialogNotiDelete = ref(false)

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
    examId: Number(route.params.id),
    testId: Number(route.params.thematicId),
    userModel: dataComponent.deleteIds,
  }
  await MethodsUtil.requestApiCustom(ExamService.PostPaggingShift, TYPE_REQUEST.POST, params).then((value: any) => {
    getListShiftTest()
    dataComponent.selectedRowsIds = []
    dataComponent.deleteIds = []
    toast('SUCCESS', t(value.message))
  })
}
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.searchData = value
}
function getListShiftTest() {
  queryParams.value.testId = Number(route.params.thematicId)
  MethodsUtil.requestApiCustom(ExamService.PostPaggingShift, TYPE_REQUEST.POST, queryParams.value).then((result: any) => {
    result.data.pageLists.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 1 }),
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}
getListShiftTest()

const storeTable = tableStore()

// hàm trả về các loại action khi click
async function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionEdit':
      idShift.value = type[1].id
      modeView.value = 'edit'
      break
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    default:
      break
  }
}
function goback(isBackRoute: boolean) {
  if (isBackRoute)
    emit('cancel')

  else modeView.value = 'list'
}
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      modeView.value = 'edit'
      break

    default:
      break
  }
}
onMounted(() => {
  const { callBackAction } = storeToRefs(storeTable)
  callBackAction.value = actionItem
})
watch(queryParams.value, (val: any) => {
  getListShiftTest()
})
</script>

<template>
  <div>
    <div v-if="modeView === 'list'">
      <div class="mt-6">
        <CpActionHeaderPage
          :title="t('list-antholory')"
          :title-custom-add="t('add-antholory')"
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
            <div v-if="col === 'startDateTime'">
              <span>{{ DateUtil.formatDateToDDMM(context.startDateTime) }}</span>
            </div>
            <div v-if="col === 'endDateTime'">
              <span>{{ DateUtil.formatDateToDDMM(context.endDateTime) }}</span>
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
      <div class="mt-6 d-flex justify-end">
        <CmButton
          bg-color="bg-white"
          color="white"
          text-color="color-dark"
          @click="goback(true)"
        >
          {{ t('come-back') }}
        </CmButton>
      </div>
    </div>
    <div v-else>
      <CpShiftTestEdit
        :id-shift="idShift"
        @cancel="goback(false)"
      />
    </div>
  </div>
</template>
