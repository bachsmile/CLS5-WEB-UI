<script setup lang="ts">
import ISelect from 'vue-select'
import Fuse from 'fuse.js'
import Globals from '@/constant/Globals'
import StringUtil from '@/utils/StringUtil'

interface Props {/** ** Interface */
  modelValue?: any
  items?: Array<any>
  maxItem?: number
  totalRecord?: number
  multiple?: boolean
  disabled?: boolean
  isInfinityScroll?: boolean
  returnObject?: boolean
  appendToBody?: boolean
  customKey?: string
  itemValue?: string
  label?: string
  bgColor?: string
  text?: string
  placeholder?: string
  errors?: any
  field?: any
}
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'open', value: any): void
  (e: 'isIntersecting', value: any): void
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  items: () => ([]),
  maxItem: Globals.MAX_ITEM_SELECT_MULT,
  multiple: false,
  returnObject: false,
  appendToBody: true,
  customKey: 'key',
  itemValue: 'value',
  label: undefined,
  bgColor: 'white',
  text: undefined,
  placeholder: 'Chọn',
  totalRecord: 0,
  isInfinityScroll: true,
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const stackValue = ref()
const valueCurrent = ref(null)
const observer = ref<any>(null)
const load = ref()
const ul = ref()
const scrollTop = ref()

/** method */

const messageError = computed(() => {
  if (props.errors?.length)
    return t(props.errors[0])

  return ''
})

const handleChangeValue = (e: any) => {
  emit('update:modelValue', valueCurrent.value)
}
const optionsModel = computed(() => {
  const optionsModels = props.items?.map((item: any) => {
    item = {
      ...item,
      keySearch: typeof item[props.customKey] === 'string' ? StringUtil.removeAccents(item[props.customKey]) : null,
    }

    return item
  })

  return optionsModels || []
})
const hasNextPage = computed(() => {
  return optionsModel.value.length < props.totalRecord
})
const open = (e: any) => {
  if (!props.multiple) {
    stackValue.value = window._.clone(valueCurrent.value)
    valueCurrent.value = null
  }
  if (hasNextPage && props.isInfinityScroll) {
    nextTick(() => {
      observer.value.observe(load.value)
    })
  }
  emit('open', valueCurrent)
}

const close = (e: any) => {
  if (!valueCurrent.value && !props.multiple)
    valueCurrent.value = stackValue.value
  if (props.isInfinityScroll) {
    observer.value.disconnect()
    ul.value = null
    scrollTop.value = 0
  }
}

const fetchOptions = (options: any, search: any) => {
  const searchKey = StringUtil.removeAccents(search)

  const optionsFuse = {
    keys: ['keySearch'],
    shouldSort: true,
    includeScore: true,
    threshold: 0.3,
  }

  const fuse: any = new Fuse(options, optionsFuse)

  fuse.search(searchKey).map((result: any) => result?.item)

  return searchKey?.length
    ? fuse.search(searchKey).map((result: any) => result?.item)
    : fuse.list
}

const infiniteScrollLoading = async ([{ isIntersecting, target }]: any) => {
  if (isIntersecting) {
    ul.value = target.offsetParent
    scrollTop.value = target.offsetParent?.scrollTop
    emit('isIntersecting', target)
  }
}
onMounted(() => {
  if (props.isInfinityScroll)
    observer.value = new IntersectionObserver(infiniteScrollLoading)
})
onUpdated(() => {
  if (ul.value && props.isInfinityScroll)
    ul.value.scrollTop = scrollTop.value
})
watch(() => props.modelValue, newValue => {
  valueCurrent.value = newValue
}, { immediate: true })
</script>

<template>
  <div>
    <div class="mb-1">
      <label
        class="text-medium-sm color-dark"
      >{{ props.text }}</label>
    </div>
    <div class="cm-select">
      <ISelect
        v-model="valueCurrent"
        v-bind="field"
        :options="optionsModel"
        :label="customKey"
        :multiple="multiple"
        :placeholder="placeholder"
        :reduce="(value: any) => returnObject ? value : value[itemValue]"
        :filter="fetchOptions"
        class="v-select-limit-width v-select-cls"
        :class="{ 'is-invalid': !!errors?.length }"
        :disabled="disabled"
        :input-id="(option: any) => option.id"
        :append-to-body="appendToBody "
        @open="open"
        @close="close"
        @update:modelValue="handleChangeValue"
      >
        <template #no-options="{ search, searching }">
          <template v-if="searching">
            {{ t('no-search', { search: `${search}` }) }}
          </template>
          <em
            v-else
            style="opacity: 0.5;"
          >{{ t('start-search') }}</em>
        </template>
        <template #list-footer>
          <div v-if="isInfinityScroll">
            <div
              v-show="hasNextPage"
              ref="load"
              class="123"
            >
              <slot name="infinityItem" />
            </div>
          </div>
        </template>
      </ISelect>
      <div
        v-if="errors?.length"
        class="color-error error-label"
      >
        {{ messageError }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
@import "vue-select/dist/vue-select.css";
.v-select-cls.is-invalid {
  // Vue Select
  &.v-select {
    .vs__dropdown-toggle {
      border-color: red;
    }
  }

  // Flatpickr
  &.flatpickr-input {
    border-color: red;
  }
}

.vs {
  /* stylelint-disable-next-line no-descending-specificity */
  &__dropdown-toggle {
    block-size: 40px;
  }
  &__search {
    color:  $color-gray-500;
  }
}

.error-label {
  font-size: 12px;
  padding-block: 6px 0;
  padding-inline: 16px;
}
.cm-select .vs__dropdown-toggle{
  border-radius: $border-radius-xs;
  background: $color-input-default;
}
.vs__dropdown-menu{
  z-index: 9999 !important;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
</style>
