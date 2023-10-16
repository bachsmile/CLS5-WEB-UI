<script setup lang="ts">
import CpApproveTest from '../CpApproveTest.vue'
import CpEditTest from './edit-test/CpEditTest.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmTable from '@/components/common/CmTable.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import DateUtil from '@/utils/DateUtil'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import toast from '@/plugins/toast'
import ExamService from '@/api/exam'
import { tableStore } from '@/stores/table'
import CmButton from '@/components/common/CmButton.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import { StatusTypeCourse } from '@/constant/data/status.json'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), ({
}))
const emit = defineEmits<Emit>()
interface Props {
  type: any
}
interface Emit {
  (e: 'cancel'): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

const queryParams = ref<any>({
  thematicId: route.params.thematicId,
  pageSize: 10,
})

const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('test-code'), value: 'name', type: 'custom' },
  { text: t('creator'), value: 'registerDate', type: 'custom' },
  { text: t('time-exam'), value: 'time' },
  { text: t('totalQs'), value: 'totalQuestion' },
  { text: t('number-question'), value: 'randomPick' },
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
async function deleteAction() {
  const params = {
    examId: Number(route.params.id),
    testId: Number(route.params.thematicId),
    userModel: dataComponent.deleteIds,
  }
  await MethodsUtil.requestApiCustom(ExamService.PostDeletePeople, TYPE_REQUEST.POST, params).then((value: any) => {
    getListTeacher()
    dataComponent.selectedRowsIds = []
    dataComponent.deleteIds = []
    toast('SUCCESS', t(value.message))
  })
}
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.searchKey = value
}
function getListTeacher() {
  MethodsUtil.requestApiCustomV5(QuestionService.testCodes, TYPE_REQUEST.GET, queryParams.value).then((result: any) => {
    // const userIds = result.data.map((i: Any) => i.createdBy)
    result.data.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 1 }),
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    items.value = result.data
  })
}
getListTeacher()

const storeTable = tableStore()

// hàm trả về các loại action khi click
async function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    case 'ActionEdit':
      editItem(type[1].id)
      break
    default:
      break
  }
}

const isShow = ref('list')
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      isShow.value = 'add'
      break
    case 'handlerCustomButton':
      isShow.value = 'approve'
      break

    default:
      break
  }
}

const dataDetail = ref<Any>({})
function editItem(id: number) {
  router.push({ query: { ...route.query, testCodeId: id } })
  MethodsUtil.requestApiCustomV5(`${QuestionService.testCodes}/${id}`).then((result: Any) => {
    isShow.value = 'add'
    dataDetail.value = result.data
  })
}

onMounted(() => {
  const { callBackAction } = storeToRefs(storeTable)
  callBackAction.value = actionItem
})
watch(queryParams.value, (val: any) => {
  getListTeacher()
})
</script>

<template>
  <div v-if="isShow === 'list'">
    <div class="mt-6">
      <CpActionHeaderPage
        :title="t('list-tests')"
        :title-custom-add="t('add-exam-papers')"
        :title-custom="t('review-exam-questions')"
        is-custom-add-btn
        is-custom-btn
        @click="handlerActionHeader"
      >
        <template #left>
          <CmButton
            class="mr-4"
            color="primary"
            variant="tonal"
          >
            {{ t('Xem cấu hình đề thi') }}
          </CmButton>
        </template>
      </CpActionHeaderPage>
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
        v-model:selected="dataComponent.selectedRowsIds"
        is-border-row
        is-update-row-force
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        disiable-pagination
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'name'">
            <div>{{ context.name }}</div>
            <div
              :class="`color-${MethodsUtil.checkStatus(context.statusId, StatusTypeCourse)?.color}`"
            >
              {{ t(MethodsUtil.checkStatus(context.statusId, StatusTypeCourse)?.name) }}
            </div>
          </div>
          <div v-if="col === 'registerDate'">
            <span>{{ DateUtil.formatDateToDDMM(context.registeredDate) }}</span>
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
    <CpActionFooterEdit
      @on-cancel="emit('cancel')"
    />
  </div>
  <div v-if="isShow === 'add'">
    <CpEditTest
      v-model:isShowAdd="isShow"
      :data-detail="dataDetail"
    />
  </div>
  <div
    v-if="isShow === 'approve'"
  >
    <CpApproveTest />
  </div>
</template>
