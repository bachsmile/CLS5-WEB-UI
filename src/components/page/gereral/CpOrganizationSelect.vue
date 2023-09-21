<script setup lang="ts">
import CmSelectTree from '@/components/common/CmSelectTree.vue'
import { comboboxStore } from '@/stores/combobox'
import ArrayUtil from '@/utils/ArrayUtil'

interface Props {/** ** Interface */
  modelValue?: any
  orgStructs?: Array<any>
  valueFormat?: 'id' | 'node' | undefined
  excludeId?: any
  maxItem?: number
  typeOrg?: number
  maxHeight?: number
  customKey?: string
  multiple?: boolean
  disabled?: boolean
  parentId?: number
  appendToBody?: boolean
  isRender?: boolean // có muốn render trước
  closeOnSelect?: boolean
  error?: boolean
  bgColor?: string
  text?: string
  placeholder?: string
}
interface Emit {
  (e: 'update:modelValue', value: any): void
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  multiple: false,
  closeOnSelect: false,
  isRender: true,
  disabled: false,
  error: false,
  customKey: 'id',
  label: undefined,
  bgColor: 'white',
  text: undefined,
  placeholder: 'Chọn',
  valueFormat: 'id',
  typeOrg: 0, // 0: get all, 1: có cả title
}))

const emit = defineEmits<Emit>()

/** ** Khởi tạo store */
const store = comboboxStore()
const { organizationsCombobox } = storeToRefs(store)
const { fetchTOrgStructCombobox, fetchTOrgStructTitleCombobox } = store
const organizationsValue = ref<any>(props.modelValue)

const options = ref()

async function getAllOrgStruct() {
  if (!window._.isEmpty(organizationsCombobox.value)) {
    const data = window._.cloneDeep(organizationsCombobox.value)

    if (props.excludeId && typeof props.excludeId === 'number') {
      const positionExclude = data.findIndex((item: any) => item[props.customKey] === props.excludeId)
      window._.pullAt(data, positionExclude)
      organizationsCombobox.value = data
    }
    else {
      props.excludeId?.forEach((item: any) => {
        const positionExclude = data.findIndex((itemArr: any) => itemArr[props.customKey] === item)
        window._.pullAt(data, positionExclude)
        organizationsCombobox.value = data
      })
    }

    options.value = ArrayUtil.formatSelectTree(organizationsCombobox.value, 'parentId', props.customKey)
  }
}

function handleChangeSelect(data: any) {
  emit('update:modelValue', data)
}
async function dataOrgSelect() {
  if (window._.isEmpty(organizationsCombobox.value)) {
    if (!props.typeOrg)
      await fetchTOrgStructCombobox()

    else
      await fetchTOrgStructTitleCombobox()

    await getAllOrgStruct()
  }
}
onMounted(async () => {
  if (props.isRender)
    await dataOrgSelect()
})
</script>

<template>
  <div class="mb-1">
    <label
      class="text-medium-sm color-dark"
    >{{ props.text }}</label>
  </div>
  <div>
    <CmSelectTree
      v-model="organizationsValue"
      :max-height="maxHeight"
      :is-error="error"
      :options="options"
      :placeholder="props.placeholder"
      :value-format="valueFormat"
      :close-on-select="multiple ? false : true"
      :multiple="multiple"
      :disabled="disabled"
      :normalizer-custom-type="[props.customKey, 'name', 'children']"
      @update:model-value="handleChangeSelect"
      @open="dataOrgSelect"
    />
  </div>
</template>
