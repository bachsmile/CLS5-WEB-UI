<script setup lang="ts">
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmTable from '@/components/common/CmTable.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CpMdAddTypeUser from '@/components/page/gereral/asign-user/modal/CpMdAddTypeUser.vue'
import CpMdAddTypeUserAuto from '@/components/page/Admin/exam/edit/thematic/modal/CpMdAddTypeUserAuto.vue'
import toast from '@/plugins/toast'
import ExamService from '@/api/exam'
import { tableStore } from '@/stores/table'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import DateUtil from '@/utils/DateUtil'
import UserService from '@/api/user'

const props = withDefaults(defineProps<Props>(), ({
  typeId: 1,
  typeIdMd: 6,
  idShift: null,
  title: 'list-candidates',
  titleCustomBtn: 'add-candidates',
  typeTitleName: 'name-lecturers',
}))
interface Props {
  typeId?: number
  typeIdMd?: number
  idShift?: any
  typeTitleName?: string
  title?: string
  titleCustomBtn?: string
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

const queryParams = ref<any>({
  testId: null,
  shiftId: null,
  typeId: null,
  search: null,
  pageSize: 10,
  pageNumber: 1,
})
const isShowDialogNotiDelete = ref(false)
const isShowDialogAddUser = ref(false)
const isShowDialogAddUserAuto = ref(false)
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t(props.typeTitleName), value: 'name', type: 'custom' },
  { text: t('Email'), value: 'email' },
  { text: t('Register_Date'), value: 'registerDates', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const actionAdd = [
  {
    title: t('add-auto'),
    action: () => {
      getNumberPeopleInShiftAuto()
    },
  },
  {
    title: t('add-hand'),
    action: () => {
      isShowDialogAddUser.value = true
    },
  },
]
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
    testId: Number(route.params.thematicId),
    listModel: dataComponent.deleteIds,
  }
  await MethodsUtil.requestApiCustom(props?.typeId === 1 ? ExamService.PostDeleteUserShift : ExamService.PostDeleteSupervisorShift, TYPE_REQUEST.POST, params).then((value: any) => {
    getListUser()
    dataComponent.selectedRowsIds = []
    dataComponent.deleteIds = []
    toast('SUCCESS', t(value.message))
  })
}

async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.search = value
}
function getListUser() {
  queryParams.value.shiftId = props.idShift
  queryParams.value.typeId = props.typeId
  queryParams.value.testId = Number(route.params.thematicId)

  MethodsUtil.requestApiCustom(ExamService.GetPeopleInShiftById, TYPE_REQUEST.GET, queryParams.value).then((result: any) => {
    result.data.pageLists.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}
getListUser()

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
      isShowDialogAddUser.value = true
      break

    default:
      break
  }
}
async function handleAddCandiates(data: any) {
  const params = {
    testId: Number(route.params.thematicId),
    shiftId: props.idShift,
    userModel: data,
  }

  MethodsUtil.requestApiCustom(props?.typeId === 1 ? ExamService.PostSaveUserShift : ExamService.PostSaveSupervisorShift, TYPE_REQUEST.POST, params).then((result: any) => {
    isShowDialogAddUser.value = false
    toast('SUCCESS', t(result.message))
    getListUser()
  }).catch((err: any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
const numberUser = ref(0)
async function getNumberPeopleInShiftAuto() {
  const params = {
    id: Number(route.params.thematicId),
  }
  await MethodsUtil.requestApiCustom(ExamService.GetNumberPeopleInShiftAuto, TYPE_REQUEST.GET, params).then((result: any) => {
    numberUser.value = result.data
    isShowDialogAddUserAuto.value = true
  })
}
onMounted(() => {
  const { callBackAction } = storeToRefs(storeTable)
  callBackAction.value = actionItem
})
watch(queryParams.value, (val: any) => {
  getListUser()
})
</script>

<template>
  <div>
    <div class="mt-6">
      <CpActionHeaderPage
        :title="t(title)"
        :title-custom-add-group="t(titleCustomBtn)"
        :title-custom-add="t(titleCustomBtn)"
        :is-custom-group-btn="typeId === 1"
        :is-custom-add-btn="typeId === 2"
        :action-add="actionAdd"
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
          <div v-if="col === 'name'">
            <CpCustomInfo
              :is-show-email="false"
              :context="context"
            />
          </div>
          <div v-if="col === 'registerDates'">
            <span>{{ DateUtil.formatDateToDDMM(context.registeredDate) }}</span>
          </div>
        </template>
      </CmTable>
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :confirmation-msg-sub-title="t('confirm-delete-section')"
      :confirmation-msg="t('deleteUser')"
      @confirm="confirmDialogDelete"
    />
    <CpMdAddTypeUser
      v-if="isShowDialogAddUser"
      v-model:is-dialog-visible="isShowDialogAddUser"
      :type-id="typeIdMd"
      :is-filter="false"
      :title="t('add-candidates')"
      :api="UserService.GetPeopleService"
      :headers="[
        { text: '', value: 'checkbox', width: 50 },
        { text: t('name-candidates'), value: 'name' },
        { text: t('email'), value: 'email' },
      ]"
      :params-extra="{
        isPaging: true,
        param3: Number(route.params.thematicId),
      }"
      :method-get="TYPE_REQUEST.GET"
      @confirm="handleAddCandiates"
    />
    <CpMdAddTypeUserAuto
      v-if="isShowDialogAddUserAuto"
      v-model:is-dialog-visible="isShowDialogAddUserAuto"
      :number-user="numberUser"
      :id-shift="props.idShift"
      @confirm="getListUser"
    />
  </div>
</template>
