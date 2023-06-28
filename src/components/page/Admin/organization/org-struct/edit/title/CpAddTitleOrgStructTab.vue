<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'
import { comboboxStore } from '@/stores/combobox'
import StringUtil from '@/utils/StringUtil'
import { ActionType } from '@/constant/data/actionType.json'
import toast from '@/plugins/toast'
import constant from '@/constant/constant'

const emit = defineEmits<Emit>()

/**
 * component
 */
const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpMdAddCapacityOrg = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/modal/CpMdAddCapacityOrg.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

/**
 * lib
 */
interface Emit {
  (e: 'addTitleSuccess'): void
}

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * store
 */
const storeCombobox = comboboxStore()
const { categoryTitleCombobox } = storeToRefs(storeCombobox)
const { fetchCategoryTitleCombobox } = storeCombobox

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const storeOrgStruct = orgStructManagerStore()
const { title, viewModeAddTitle, titleSelected } = storeToRefs(storeOrgStruct)
const { handleModifineTitleOrg, resetDataTitle } = storeOrgStruct

/**
 * validate
 */

const schema = yup.object({
  name: schemaOption.defaultString,
  categoryTitleId: schemaOption.defaultSelectSingle,
})

/**
 * data
 */
const LABEL = Object.freeze({
  TITLE: `${t('title-name')} *`,
  PLH_TITLE: t('title-name'),
  TITLE1: `${t('list-title')} *`,
  PLH_TITLE1: t('list-title-plh'),
  TITLE2: t('level'),
  TITLE3: t('organizational-owner'),
})
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('capacity-name'), value: 'proficiencyName', width: 300 },
  { text: t('level'), value: 'proficiencyLevelName' },
  { text: '', value: 'actions', width: 50 },
])

const myFormAddTitleOrg = ref()
const searchData = ref<any>([])
const dataComponent = reactive({
  totalRecord: 0,
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
  listId: [],
  isShowDialogAddCapacity: false,
  pageNumber: 1,
  pageSize: 10,
})
const isShowDialogNotiDelete = ref(false)

/**
 * method
 */
function backOrg() {
  viewModeAddTitle.value = false
}

// search ở fillter header
async function handleSearch(value: any) {
  searchData.value = value
}

// Function to handle when click button Delete
function handleDeleteItem(context: any) {
  dataComponent.deleteIds = []
  dataComponent.deleteIds.push(context.id)
  isShowDialogNotiDelete.value = true
}
async function handlePageClick(value: any) {
  dataComponent.pageNumber = value
}
const getProficiency = computed(() => {
  if (searchData.value !== null && searchData.value?.length > 0) {
    dataComponent.pageNumber = 1
    dataComponent.totalRecord = title.value.proficiencies.filter((item: any) => StringUtil.removeAccents(item.proficiencyName.toLowerCase()).includes(StringUtil.removeAccents(searchData.value.toLowerCase()))).length
    return title.value.proficiencies.filter((item: any) => StringUtil.removeAccents(item.proficiencyName.toLowerCase()).includes(StringUtil.removeAccents(searchData.value.toLowerCase())))?.slice((dataComponent.pageNumber - 1) * 10, dataComponent.pageNumber * 10)
  }
  dataComponent.totalRecord = title.value.proficiencies.length
  return title.value.proficiencies.slice((dataComponent.pageNumber - 1) * dataComponent.pageSize, dataComponent.pageNumber * dataComponent.pageSize)
})

async function handleSaveTitle() {
  myFormAddTitleOrg.value.validate().then(async (success: any) => {
    if (success.valid) {
      await handleModifineTitleOrg().then(value => {
        emit('addTitleSuccess')
      })
    }
  })
}

function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerCustomButton':
      titleSelected.value = {}
      title.value.proficiencies.forEach((item: any) => {
        titleSelected.value[item.proficiencyId] = titleSelected.value[item.proficiencyId] ? titleSelected.value[item.proficiencyId] + 1 : 1
      })
      dataComponent.isShowDialogAddCapacity = true

      break

    default:
      break
  }
}
async function handleDeleteMultiple(value: any) {
  dataComponent.deleteIds = dataComponent.selectedRowsIds
  isShowDialogNotiDelete.value = true
}
function selectedRows(e: any) {
  dataComponent.selectedRowsIds = e
}
const disabledDelete = computed(() => !(dataComponent.selectedRowsIds.length > 0))

// delete action
async function deleteAction() {
  title.value.proficiencies = title.value.proficiencies.filter((item: any) => !dataComponent.deleteIds.includes(item.id))
  dataComponent.deleteIds = []
  dataComponent.selectedRowsIds = []
  dataComponent.pageNumber = 1
  toast('SUCCESS', t('delete-success'))
}

// hành động của dialog
function confirmDialog(event: any) {
  if (event)
    deleteAction()
}
if (!categoryTitleCombobox.value.length)
  fetchCategoryTitleCombobox()
onUnmounted(() => {
  resetDataTitle()
})
</script>

<template>
  <div class="box-content my-6">
    <CpActionHeaderPage
      :title="t('add-title-position')"
    />
    <div class="title-form">
      <Form
        ref="myFormAddTitleOrg"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <VSheet
          width="100%"
          class="mx-auto no-background"
        >
          <VRow class="my-3">
            <VCol
              cols="12"
              md="4"
            >
              <Field
                v-slot="{ field, errors }"
                v-model="title.name"
                name="name"
                type="text"
              >
                <CmTextField
                  :field="field"
                  :errors="errors"
                  :text="LABEL.TITLE"
                  :placeholder="LABEL.PLH_TITLE"
                />
              </Field>
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <Field
                v-slot="{ field, errors }"
                v-model="title.categoryTitleId"
                name="categoryTitleId"
              >
                <CmSelect
                  :model-value="title.categoryTitleId"
                  :field="field"
                  :errors="errors"
                  :items="categoryTitleCombobox"
                  item-value="key"
                  custom-key="value"
                  :text="LABEL.TITLE1"
                  :placeholder="LABEL.PLH_TITLE1"
                />
              </Field>
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <Field
                v-slot="{ field, errors }"
                v-model="title.level"
                name="level"
                type="number"
              >
                <CmTextField
                  :field="field"
                  :errors="errors"
                  type="number"
                  :min="constant.MIN_NUMBER"
                  :max="constant.MAX_NUMBER"
                  :text="LABEL.TITLE2"
                  :placeholder="LABEL.TITLE2"
                />
              </Field>
            </VCol>
          </VRow>
        </VSheet>
      </Form>
    </div>
  </div>
  <div class="box-content my-6">
    <CpActionHeaderPage
      :title="t('capacity-list')"
      bg-custom="bg-primary"
      :title-custom="t('add-capacity')"
      is-custom-btn
      @click="handlerActionHeader"
    />
    <div class="title-filter">
      <CpHeaderAction
        :is-fillter="false"
        is-delete
        :disabled-delete="disabledDelete"
        @search="handleSearch"
        @deleteMultiple="handleDeleteMultiple"
      />
    </div>
    <div>
      <CmTable
        :headers="headers"
        :items="getProficiency || []"
        :total-record="dataComponent.totalRecord"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'actions'">
            <span class="px-2">
              <VIcon
                :icon="ActionType[1].icon"
                :size="18"
                class="align-middle"
                :class="ActionType[1].color"
                @click="handleDeleteItem(context)"
              />
              <VTooltip
                activator="parent"
                location="start"
              >
                {{ t(ActionType[1].name) }}
              </VTooltip>
            </span>
          </div>
        </template>
      </CmTable>
    </div>
  </div>
  <div
    width="100%"
    class="user-infor no-background py-5"
  >
    <CpActionFooterEdit
      is-save
      :title-cancel="t('come-back')"
      :title-save="t('save')"
      @onCancel="backOrg"
      @onSave="handleSaveTitle"
    />
  </div>
  <CpMdAddCapacityOrg
    v-model:is-dialog-visible="dataComponent.isShowDialogAddCapacity"
  />
  <CpConfirmDialog
    v-model:is-dialog-visible="isShowDialogNotiDelete"
    :type="2"
    variant="outlined"
    :confirmation-msg="t('delete')"
    @confirm="confirmDialog"
  />
</template>
