<script lang="ts" setup>
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { defaultSetting } from '@/constant/data/settingDefault.json'
import Globals from '@/constant/Globals'

/** ** Interface */
interface Options {
  id: number | string | null
  label?: string
  children?: Options[]
  isDisabled?: boolean // disable từng thành phần
}
interface Props {
  modelValue: any
  options?: Options[]
  placeholder?: string
  text?: string
  multiple?: boolean
  clearable?: boolean // true: Hiện thị button clear lựa chọn ở cuối input
  searchable?: boolean // true:  Cho phép search
  disabled?: boolean
  openOnClick?: boolean // true:  mở bảng chọn option khi click v-select
  openOnFocus?: boolean
  clearOnSelect?: boolean
  maxItem?: number // giới hạn hiện thị
  maxHeight?: number // giới hạn chiều cao
  closeOnSelect?: boolean // đóng option khi chọn
  alwaysOpen?: boolean // true: luôn mở bảng chọn option
  appendToBody?: boolean
  customLable?: boolean // true: hiện thị customLabel
  searchNested?: boolean // search được lồng vào
  flattenSearchResults?: boolean // true: làm phẳng cây khi search sẽ không hiện nút nhánh
  disableBranchNodes?: boolean // true: không thể chọn nút nhánh các nút không phải nhánh vẫn có thể chọn (checked)
  rtl?: boolean // true: hiện thị bên phải
  valueFormat?: 'node' | 'id' // node: truyền vào là một node ; id: truyền vào là id
  flat: boolean // true: không auto check con, false: auto check con
  sortValueBy?: 'ORDER_SELECTED' | 'LEVEL' | 'INDEX' | null // "ORDER_SELECTED" (default) - Order selected "LEVEL" - Level of option: C 🡒 BB 🡒 AAA "INDEX" - Index of option: AAA 🡒 BB 🡒 C
  valueConsistsOf?: 'ALL' | 'BRANCH_PRIORITY' | 'LEAF_PRIORITY' | 'ALL_WITH_INDETERMINATE' | null // All: Hiện thị tất cả các lựa chọn, BRANCH_PRIORITY: Chỉ hiện thị nút nhánh nếu tất cả các con được lựa chọn, LEAF_PRIORITY:  Chỉ hiện thị nút con được chọn, ALL_WITH_INDETERMINATE: tất cả các nút được chọn kể cả intermindate
  normalizerCustomType?: Array<string> // custom key không lấy mặc định là id và lable
  isError?: boolean // trạng thái lỗi
  errors?: any // trạng thái lỗi
}
interface Emit {
  (e: 'update', value: any, instanceId: any): void
  (e: 'update:modelValue', value: any): void
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  modelValue: reactive<Options[]>([]),
  options: () => ([]),
  placeholder: '',
  multiple: false,
  clearable: true,
  searchable: true,
  disabled: false,
  openOnClick: true,
  openOnFocus: true,
  clearOnSelect: false,
  closeOnSelect: false,
  alwaysOpen: false,
  appendToBody: false,
  rtl: false,
  valueFormat: 'id',
  flat: !!defaultSetting?.[0]?.value,
  limitText: (count: any) => `và ${count} lựa chọn`,
  disableBranchNodes: false,
  sortValueBy: null,
  flattenSearchResults: false,
  searchNested: true,
  customLable: false,
  valueConsistsOf: 'ALL',
  maxItem: Globals.MAX_ITEM_SELECT_MULT,
  maxHeight: undefined,
  isError: false,
  normalizerCustomType: () => ['id', 'label', 'children'],
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/** ** Chuẩn hóa dữ liệu */
function normalizer(node: any) {
  return {
    id: node[props?.normalizerCustomType[0]],
    label: node[props?.normalizerCustomType[1]],
    children: node[props?.normalizerCustomType[2]],
  }
}

/** ** Sao chép biến model modelValue từ prop  modelValue ngăn thay đổi */
const modelValue = ref(window._.cloneDeep(props.modelValue))

/** ** Biễn render */
const render = ref(true)

/** ** Cập nhật dữ liệu trên select */
// const updateValue = () => {
//   render.value = false
//   modelValue.value = window._.cloneDeep(props.modelValue)
//   nextTick(() => {
//     render.value = true
//   })
// }

/** ** function: xử lý khi tao tác trên node */
function handleUpdate(value: any, instanceId: any) {
  emit('update:modelValue', value)
}

function limitText(count: any) {
  return t('and-count-more', { count })
}

/** ** watch: check value thay đổi từ bên ngoài */
// watch(() => props.modelValue, value => {
//   updateValue()
// })
</script>

<template>
  <div class="mb-1">
    <label
      class="text-medium-sm color-dark"
    >{{ props.text }}</label>
  </div>
  <div
    v-if="render"
    :dir="rtl ? 'rtl' : 'ltr'"
  >
    <Treeselect
      v-model="modelValue"
      :class="{ styleError: isError || errors?.length > 0 }"
      :value-format="props.valueFormat"
      :options="props.options"
      :placeholder="props.placeholder"
      :multiple="props.multiple"
      :clearable="props.clearable"
      :searchable="props.searchable"
      :disabled="props.disabled"
      :open-on-click="props.openOnClick"
      :open-on-focus="props.openOnFocus"
      :clear-on-select="props.clearOnSelect"
      :close-on-select="props.closeOnSelect"
      :always-open="props.alwaysOpen"
      :append-to-body="props.appendToBody"
      :flat="props.flat"
      :sort-value-by="props.sortValueBy"
      :limit="props.maxItem"
      :limit-text="limitText"
      :value-consists-of="props.valueConsistsOf"
      :disable-branch-nodes="props.disableBranchNodes"
      :flatten-search-results="props.flattenSearchResults"
      :search-nested="props.searchNested"
      :max-height="props.maxHeight"
      :normalizer="normalizer"
      @update:modelValue="handleUpdate"
    >
      <template
        v-if="props.customLable"
        #value-label="{ node }"
      >
        {{ node.raw.customLabel }}
      </template>
    </Treeselect>
    <div
      v-if="errors?.length > 0"
      class="styleError text-errors"
    >
      {{ errors[0] }}
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/variables/common/input.cm" as *;
@use "@/styles/variables/global" as *;

.vue-treeselect__minus-mark {
  background-image: none !important;
}

.vue-treeselect__check-mark {
  background-image: none !important;
}

.vue-treeselect__checkbox--checked {
  border: 1px solid #eff8ff !important;
  background: #1570ef !important;

  .vue-treeselect__check-mark {
    box-sizing: border-box;
    border: 1px solid #eff8ff !important;

    // border-radius: 4px !important;
    block-size: 0.2em;
    border-block-start-style: none !important;
    border-inline-end-style: none !important;
    inline-size: 0.6em;
    transform: translate(0, 1px) rotate(-45deg);
  }
}

.vue-treeselect__checkbox--indeterminate {
  border: 1px solid #eff8ff !important;
  background: #1570ef !important;

  .vue-treeselect__minus-mark {
    box-sizing: border-box;
    border: 2px solid #eff8ff !important;
    block-size: 0.1em;
    border-block-start-style: none !important;
    border-inline-end-style: none !important;
    border-inline-start-style: none !important;
    inline-size: 0.35em;
    transform: translate(0.05em, 0.2em);
  }
}

.vue-treeselect__checkbox {
  border-radius: 4px;
}

.vue-treeselect__control {
  border: $border-xs solid $color-gray-300;
  block-size: $height-min-select;
  box-shadow: $box-shadow-xs;
}
.vue-treeselect__placeholder{
  color:  $color-gray-500;
}
.styleError{
  .vue-treeselect__control{
    outline: 1px solid red;
  }
}
</style>
