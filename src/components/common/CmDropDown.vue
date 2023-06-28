<script setup lang="ts">
import CmCheckBox from './CmCheckBox.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import type { typeVariant } from '@/typescript/enums/enums'
import CmButton from '@/components/common/CmButton.vue'
import { tableStore } from '@/stores/table'

const propsValue = withDefaults(defineProps<Props>(), ({
  listItem: () => ([]),
  icon: 'tabler:dots-vertical',
  checkbox: true,
  multiple: false,
  customKey: 'title',
  dataResend: null,
  type: undefined,
  data: undefined,
  index: 0,
  variant: 'outlined',
  isAction: false,
}))
const emit = defineEmits<Emit>()
const storeTable = tableStore()
const { handleActionTable } = storeTable

/**
 * listItem: danh sách các item
 * item: {
 *  title: tiêu đề,
 *  icon: icon,
 *  colorClass: màu của item
 *  action: function truyền xuống
 *  appendItem: phần sau của item có thể hiển thị cả icon lẫn title
 *  prependItem: checkbox của từng item
 *  dataResend: dữ liệu muốn trả lại kèm theo action
 *  type: a: icon  2: loại button
 * }
 */

interface Props {
  listItem: item[]
  icon?: string
  data?: any
  multiple?: boolean
  isAction?: boolean
  customKey: string
  dataResend?: any
  type?: number
  index?: number
  variant?: typeof typeVariant[number]
  color?: string
  title?: string
  bgColor?: string
  className?: string
  textColor?: string
}
interface item {
  icon?: string
  colorClass?: string
  action?: any
  appendItem?: appendItem
  prependItem?: prependItem
  [key: string]: any
}
interface appendItem {
  icon?: string
  [key: string]: any
}
interface prependItem {
  isShow: boolean
  isDisabled: boolean
  value: boolean
  action: any
}

interface Emit {
  (e: 'change', data: any): void
  (e: 'click', data: any, dataResend?: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

function handleChange(event: any) {
  emit('change', event)
}

function handleClickItem(event: any) {
  // if (propsValue.multiple)
  //   event.stopPropagation()
}
const prefixColor = computed(() => {
  if (propsValue.variant === 'outlined' || propsValue.variant === 'text')
    return 'color-bd'

  return 'btn'
})
const textButton = computed(() => {
  if (propsValue.variant === 'text')
    return 'text-button'

  return ''
})
function handleClickItemList(item: any) {
  if (propsValue.isAction)
    propsValue.type === 1 ? handleActionTable(MethodsUtil.checlActionKey(item, propsValue.data), propsValue.index, propsValue.dataResend) : handleActionTable()
  else if (item?.action)
    propsValue.type === 1 ? item?.action(MethodsUtil.checlActionKey(item, propsValue.data), propsValue.index, propsValue.dataResend) : item?.action()

  else
    emit('click', item, propsValue.dataResend)
}
</script>

<template>
  <div class="text-center cm-drop-down">
    <VMenu
      class="cursor-pointer"
      @update:model-value="handleChange"
    >
      <template #activator="{ props }">
        <div v-bind="props">
          <CmButton
            v-if="type === 2"
            :class="[`${prefixColor}-${color}`, bgColor, className, textButton]"
            :variant="variant"
            v-bind="props"
          >
            <div class="d-flex">
              <div class="text-button-dropdown">
                {{ title }}
              </div>
              <VIcon
                v-if="propsValue.icon"
                v-bind="props"
                :icon="propsValue.icon "
                :size="18"
              />
            </div>
          </CmButton>
          <VIcon
            v-if="type === 1 && propsValue.icon"
            v-bind="props"
            :icon="propsValue.icon"
            :size="18"
          />
        </div>
      </template>

      <VList>
        <VListItem
          v-for="(item, i) in propsValue.listItem"
          :key="i"
          class="cursor-pointer"
          :class="{ 'border-bottom-item': item.underline }"
          :value="item"
          :disabled="item?.disabled"
          @click="($event) => handleClickItem($event)"
        >
          <template
            v-if="propsValue.multiple"
            #prepend
          >
            <CmCheckBox
              v-if="item.prependItem?.isShow"
              v-model:model-value="item.prependItem.value"
              @update:modelValue="item?.prependItem?.action"
            />
          </template>
          <VListItemTitle

            @click="handleClickItemList(item)"
          >
            <VIcon
              v-if="item?.icon || MethodsUtil.checlActionKey(item)[0]?.icon"
              :icon="item?.icon || MethodsUtil.checlActionKey(item)[0]?.icon"
              :size="18"
              class="mr-2"
              :class="[item.colorClass, MethodsUtil.checlActionKey(item)[0]?.color]"
            />
            <span>{{ t(item[customKey]) }}
            </span>
          </VListItemTitle>
          <template #append>
            <VIcon
              v-if="item?.appendItem?.icon"
              :icon="item?.appendItem?.icon"
              :size="12"
              class="mr-2 color-dark"
              :class="[item.colorClass]"
            />
            <span
              v-if="item?.appendItem?.[customKey] "
            > {{ item?.appendItem[customKey] }}</span>
          </template>
        </VListItem>
        <slot />
      </VList>
    </VMenu>
  </div>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;

.cm-drop-down {

  .text-button-dropdown{
    font-style: inherit;
    text-transform: initial !important;
  }
}
.border-bottom-item {
    border-radius: 0 !important;
    border-block-end: 1px solid $color-gray-100;
    margin-inline: 0 !important;
  }
</style>
