<script setup lang="ts">
import { useRouter } from 'vue-router'
import CmButton from '@/components/common/CmButton.vue'
import CmTable from '@/components/common/CmTable.vue'
import { excelFileExtention } from '@/constant/Globals'
import { useImportFileStore } from '@/stores/ImportFile'
import MethodsUtil from '@/utils/MethodsUtil'
import type { Action, Config } from '@/typescript/interface/import'
import { comboboxStore } from '@/stores/combobox'

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  config: () => ({
    titleList: 'Danh sách', /** title @params Tên danh sách */
    customId: 'id',
    table: {
      header: [],
    },
  }),
  customKeyError: 'errors',
  actions: () => ([{
    title: 'Thêm từ dữ liệu từ tập tin',
  }]),
  titleButtonAdd: 'Thêm',
  titleButtonCancel: 'Quay lại',
  titlePageUpload: ' Trang bắt đầu',
  isFilter: false,
  filterConfig: () => ({
    list: [],
    customKey: 'value',
    itemValue: 'key',
  }),
}))

const emit = defineEmits<Emit>()

const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

const { t } = window.i18n()
interface Emit {
  (e: 'filter', data: any): void
}

// interface
interface filter {
  list: Array<any>
  customKey?: string
  itemValue?: string
  modelValue?: any
}
interface Props {
  config: Config
  titleList?: string
  customKeyError?: string
  actions?: Action[]
  titleButtonAdd?: string
  titleButtonCancel?: string
  titlePageUpload?: string
  isFilter?: boolean
  filterConfig?: filter
}

/** ** Khởi tạo store */
const store = useImportFileStore()
const storeCombobox = comboboxStore()
const router = useRouter()
const { paramsImport } = store
const { organizationsCombobox } = storeToRefs(storeCombobox)
const { type, refTableValid } = storeToRefs(store)
const { checkInvalidData, fileChange, updateFromFile } = store
// eslint-disable-next-line vue/no-setup-props-destructure
store.customKeyError = props.customKeyError
const isEditing = ref(false)

const headers = reactive([
  { text: '', value: 'checkbox' },
  ...props?.config?.table?.header,
])

const headersInvalid = computed(() => {
  const select = {
    text: 'Select',
    value: 'select',
    thClass: 'custom-th-class',
    sortable: false,
  }
  const columns = window._.cloneDeep(headers)
  columns.shift()
  columns.unshift(select)
  return columns
})
const typeFillter = ref(props.filterConfig?.modelValue)
const inputFile = ref()
watch(() => props.config, value => {
  store.$patch({
    config: {
      ...props.config,
    },
  })
}, { immediate: true })

/** Method */
async function dowloadSampleFile() {
  MethodsUtil.dowloadSampleFile(
    props.config?.dowloadSample?.urlFileDefault || '',
    props.config?.dowloadSample?.method || 'GET',
    props.config?.dowloadSample?.nameFile || 'file.xlsx',
    props.config?.dowloadSample?.paramsDowload || {},
  )
}

// thay đổi dữ liệu trên bảng
function changeCellvalue(event: any, field: string, key: number, keyCustomValue?: any, keyCustomIdValue?: any) {
  if (field === 'organizational') {
    paramsImport.invalidData[key][keyCustomIdValue] = event
    const org: any = organizationsCombobox.value.find((item: any) => item.id === event)
    paramsImport.invalidData[key][keyCustomValue] = org?.name
  }

  else { paramsImport.invalidData[key][field] = event as never }
}

function handleEditTable() {
  isEditing.value = !isEditing.value
}

async function updateFromFileHandle() {
  const back = await updateFromFile()
  if (back === 'back' && props?.config?.routerBack) {
    store.$dispose()
    router.push({ name: props.config.routerBack })
  }
}
const isDisabledSubmit = computed(() => {
  const listSelected = paramsImport.validData.filter((item: any) => item.isSelected === true)
  return !listSelected.length
})
const isShowTemplateImport = computed(() => {
  return paramsImport.validData.length || paramsImport.invalidData.length
})

function uploadFile(val: string | number | undefined) {
  type.value = val
  inputFile.value.click()
}
function filterUpdate(event: any) {
  emit('filter', event)
}

onBeforeUnmount(() => {
  store.$dispose()
  store.$reset()
})
</script>

<template>
  <div
    v-if="!isShowTemplateImport"
    class="template-no-data page-container"
  >
    <div class="d-flex justify-space-between align-center">
      <h3>{{ titlePageUpload }}</h3>
      <CmButton
        title="Tải tập tin mẫu"
        icon="solar:download-minimalistic-bold"
        @click="dowloadSampleFile"
      />
    </div>
    <div
      v-if="isFilter"
      class="d-flex justify-center my-4"
    >
      <CmSelect
        v-model:model-value="typeFillter"
        style="width: 400px;"
        :items="filterConfig?.list"
        :custom-key="filterConfig?.customKey"
        :item-value="filterConfig?.itemValue"
        @update:model-value="filterUpdate"
      />
    </div>
    <div
      class="d-flex w-100 button-group"
    >
      <div
        v-for="item in actions"
        :key="item.key"
        class="button-import-file cursor-pointer"
        @click="uploadFile(item?.key || undefined)"
      >
        <VIcon :icon="item.icon ? item.icon : 'bi:upload'" />
        <span
          class="mt-3"
        >{{ item.title }}</span>
      </div>
    </div>
    <div class="d-flex w-100">
      <slot name="actions" />
    </div>
  </div>
  <div v-else>
    <div class="cp-import-file">
      <div class="cp-import-file-valid">
        <div class="cp-import-file-header">
          <div class="cp-import-file-title">
            {{ `${titleList} ${t('valid')}` }}
          </div>
          <div class="cp-import-file-action">
            <div class="cp-import-file-btn mr-3">
              <CmButton @click="dowloadSampleFile">
                {{ t('download-file') }}
              </CmButton>
            </div>
            <div class="cp-import-file-btn">
              <CmButton @click="inputFile.click()">
                {{ t('select-file') }}
              </CmButton>
            </div>
          </div>
        </div>
        <div class="cp-import-file-table">
          <CmTable
            ref="refTableValid"
            :headers="headers"
            :items="paramsImport.validData"
            return-object
            is-import-file
          />
        </div>
      </div>
      <div
        v-if="paramsImport.invalidData.length"
        class="cp-import-file-invalid"
      >
        <div class="cp-import-file-header">
          <div class="cp-import-file-title">
            {{ `${titleList} ${t('invalid')}` }}
          </div>
          <div class="cp-import-file-action">
            <div class="cp-import-file-btn mr-3">
              <CmButton @click="checkInvalidData">
                {{ t('check') }}
              </CmButton>
            </div>
            <div class="cp-import-file-btn">
              <CmButton @click="handleEditTable">
                Chỉnh sửa
              </CmButton>
            </div>
          </div>
        </div>
        <div class="cp-import-file-table">
          <CmTable
            :headers="headersInvalid"
            :items="paramsImport.invalidData"
            :is-editing="isEditing"
            :min-height="300"
            is-import-file
            :custom-key-error="customKeyError"
            @changeCellvalue="changeCellvalue"
          />
        </div>
      </div>
    </div>
  </div>
  <input
    ref="inputFile"
    type="file"
    :accept="excelFileExtention"
    hidden
    @change="fileChange"
  >
  <div class="cp-import-file-action-footer mt-3">
    <div class="cp-import-file-btn-footer ">
      <CmButton
        variant="outlined"
        bg-color="bg-white"
        color="dark"
        text-color="color-dark"
        @click="() => { router.push({ name: props.config.routerBack }) }"
      >
        {{ titleButtonCancel }}
      </CmButton>
    </div>
    <div
      v-if="isShowTemplateImport"
      class="cp-import-file-btn-footer ml-3"
    >
      <CmButton
        :disabled="isDisabledSubmit"
        @click="updateFromFileHandle"
      >
        {{ titleButtonAdd }}
      </CmButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cp-import-file {
  .cp-import-file-header {
    display: flex;
    justify-content: space-between;

    .cp-import-file-title {
      color: #101828;
      font-size: 18px;
      font-weight: 500;
      line-height: 28px;
      padding-block: 20px;
      padding-inline: 0;
    }

    .cp-import-file-action {
      display: flex;
      justify-content: space-between;

      .cp-import-file-btn {
        display: flex;
        align-items: center;
        align-self: center;
      }
    }
  }

  .cp-import-file-invalid {
    margin-block-start: 40px;
  }
}
.button-import-file:nth-child(n+2) {
  margin-left: 8px;
}
.button-import-file {
  border: 1px solid rgba(208, 213, 221, 1);
  width: inherit;
  padding: 16px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  flex-direction: column;
  background-color: white;
  margin-top: 24px;
}
.cp-import-file-action-footer {
    display: flex;
    justify-content: flex-end;

    .cp-import-file-btn-footer {
      display: flex;
      align-items: center;
      align-self: center;
      width: max-content;
    }
  }
</style>
