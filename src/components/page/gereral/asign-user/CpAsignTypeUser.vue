<script setup lang="ts">
import CpFilterAsignUser from '@/components/page/gereral/asign-user/filter/CpFilterAsignUser.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import CmTable from '@/components/common/CmTable.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import DateUtil from '@/utils/DateUtil'
import CmAccodion from '@/components/common/CmAccodion.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CpMdAddTypeUser from '@/components/page/gereral/asign-user/modal/CpMdAddTypeUser.vue'
import toast from '@/plugins/toast'
import ExamService from '@/api/exam'
import { tableStore } from '@/stores/table'

const props = withDefaults(defineProps<Props>(), ({
  typeId: 2,
  title: 'list-teacher',
  titleCustomBtn: 'add-teacher',
  typeTitleName: 'name-lecturers',
}))
interface Props {
  typeId?: number
  title?: string
  typeTitleName?: string
  titleCustomBtn?: string
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

const queryParams = ref<any>({
  categoryTitleId: [],
  examId: null,
  groupUser: [],
  orStructure: [],
  titles: [],
  pageNumber: 1,
  pageSize: 10,
  searchKey: null,
  testId: null,
  typeId: 2,
  userIds: [],
})

const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t(props.typeTitleName), value: 'name', type: 'custom' },
  { text: t('register-date'), value: 'registerDate', type: 'custom' },
  { text: t('organization'), value: 'organization', type: 'custom' },
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
const isShowDialogAddTeacher = ref(false)

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
    typeId: props.typeId,
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
  const orgModels = {
    value: 1,
    label: t('orgStruct'),
    icon: 'tabler-briefcase',
    colorClass: 'color-error',
    content: [],
  }
  const titleModels = {
    value: 1,
    label: 'Chức danh',
    icon: 'prime-check-circle',
    colorClass: 'color-success',
    content: [],
  }
  const groupModels = {
    value: 1,
    label: 'Nhóm người dùng',
    icon: 'lucide:users',
    colorClass: 'color-warning',
    content: [],
  }
  queryParams.value.examId = Number(route.params.id)
  queryParams.value.typeId = props.typeId
  queryParams.value.testId = Number(route.params.thematicId)
  MethodsUtil.requestApiCustom(QuestionService.PostGetListInfobyTest, TYPE_REQUEST.POST, queryParams.value).then((result: any) => {
    result.data.pageLists.forEach((element: any) => {
      if (element.orgModels) {
        let titleData = window._.clone(element.orgModels)
        titleData = titleData.filter((item: any) => !!item.titleName)
        element.orgModels = {
          ...orgModels,
          content: element.orgModels,
        }
        if (titleData.length) {
          element.titleModels = {
            ...titleModels,
            content: titleData,
          }
        }
      }
      if (element.groupModels) {
        element.groupModels = {
          ...groupModels,
          content: element.groupModels,
        }
      }
      element.actions = [
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    queryParams.UserIds = result.data.pageLists.map((i: any) => i.id)
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
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
    default:
      break
  }
}
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      isShowDialogAddTeacher.value = true
      break

    default:
      break
  }
}
async function handleAddTeacher(data: any) {
  const params = {
    examId: Number(route.params.id),
    testId: Number(route.params.thematicId),
    typeId: props.typeId,
    userModel: data,
  }
  await MethodsUtil.requestApiCustom(ExamService.PostCreatePeople, TYPE_REQUEST.POST, params).then((result: any) => {
    getListTeacher()
    toast('SUCCESS', t(result.message))
    isShowDialogAddTeacher.value = false
  })
    .catch((err: any) => {
      toast('ERROR', window.getErrorsMessage(err.response.data.error, t))
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
  <div>
    <div class="mt-6">
      <CpActionHeaderPage
        :title="t(title)"
        :title-custom-add="t(titleCustomBtn)"
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <CmCollapse :is-show="isShowFilter">
      <CpFilterAsignUser
        v-model:orStructure="queryParams.orStructure"
        v-model:groupUser="queryParams.groupUser"
        v-model:categoryTitleId="queryParams.categoryTitleId"
        v-model:titles="queryParams.titles"
      />
    </CmCollapse>
    <div class="my-3">
      <CpHeaderAction
        is-delete
        :disabled-delete="disabledBtnHeaderAction"
        is-fillter
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
          <div
            v-if="col === 'organization'"
          >
            <CmAccodion
              v-if="context.orgModels?.content?.length"
              :data="[context.orgModels]"
              custom-key="content"
              custom-key-child="name"
              is-open
            />
            <CmAccodion
              v-if="context.groupModels?.content?.length"
              :data="[context.groupModels]"
              custom-key="content"
              custom-key-child="name"
              is-open
            />

            <CmAccodion
              v-if="context.titleModels?.content?.length"
              is-custom
              :data="[context.titleModels]"
              custom-key="content"
              is-open
            >
              <template #title>
                <div>
                  <VAvatar
                    size="32"
                    class="mr-2"
                    :class="[context.titleModels.colorClass]"
                    variant="tonal"
                  >
                    <VIcon
                      v-if="context.titleModels.icon"
                      :icon="context.titleModels.icon"
                      size="14"
                      :class="[context.titleModels.colorClass]"
                    />
                  </VAvatar>
                </div>
                <span
                  class="text-regular-sm"
                >{{ context.titleModels.label }}</span>
              </template>
              <template #text>
                <div
                  v-for="(listItem, idItem) in context.titleModels.content"
                  :key="idItem"
                  class="mb-2"
                >
                  <div
                    v-if="listItem.titleName"
                    class="content-item text-regular-sm"
                  >
                    <span
                      :title="t('list-title')"
                    >
                      {{ listItem.categoryTitleName }} -
                    </span>
                    <span
                      :title="t('career-titles')"
                      class="color-primary"
                    >
                      {{ listItem.titleName }}
                    </span>

                    <span
                      :title="t('level')"
                      class="color-success"
                    >
                      ({{ listItem.level }})
                    </span>
                  </div>
                </div>
              </template>
            </CmAccodion>
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
      :confirmation-msg-sub-title="t('confirm-delete-section')"
      :confirmation-msg="t('deleteUser')"
      @confirm="confirmDialogDelete"
    />
    <CpMdAddTypeUser
      v-if="isShowDialogAddTeacher"
      v-model:is-dialog-visible="isShowDialogAddTeacher"
      :title="titleCustomBtn"
      :headers="[
        { text: '', value: 'checkbox', width: 50 },
        { text: t(typeTitleName), value: 'name' },
        { text: t('email'), value: 'email' },
      ]"
      :type-id="typeId"
      @confirm="handleAddTeacher"
    />
  </div>
</template>
