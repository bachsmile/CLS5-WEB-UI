<script setup lang="ts">
import type { size } from '@/typescript/enums/enums'

/**
 * ListItem: danh sách các item
 * trong
 * {
 *  title:
 *  icon:
 *  class:
 *  action: function từ cha truyền xuống, nếu ko thì dùng click item
 *  key: nếu dùng event clickItem thì dùng key để xử lí từng sự kiện
 * }
 * icon: icon hiển thị của prepend button
 * isBorder: có hiển thị border giữa 2 button
 * isDiabledPrepend: boolean này tự hiểu
 * isDiabledAppend: boolean này tự hiểu
 * size: 'x-small', 'small', 'default', 'large', 'x-large'
*/

interface Props {
  listItem: ListItem[]
  icon?: string
  color?: string
  isBorder?: boolean
  isDiabledPrepend?: boolean
  isDiabledAppend?: boolean
  size?: typeof size[any]
  title: string
  type?: string
}
interface ListItem {
  title: string
  icon?: string
  colorClass?: string
  action?: any
  key?: any
}

interface Emit {
  (e: 'clickPrepend', event?: any): void
  (e: 'clickItem', item: object): void
}

const props = withDefaults(defineProps<Props>(), ({
  listItem: () => ([]),
  icon: 'tabler:chevron-down',
  isBorder: true,
  color: 'primary',
  isDiabledPrepend: false,
  isDiabledAppend: false,
  size: 'default',
  title: '',
}))

const emit = defineEmits<Emit>()

const handlerPrepend = (event: any) => {
  emit('clickPrepend')
}

const buttonActive = ref(false)

const activeButton = () => {
  buttonActive.value = !buttonActive.value
}

const clickItem = (item: object) => {
  emit('clickItem', item)
}
</script>

<template>
  <div class="btn-group-style">
    <VBtn
      :class="`button-group button-group-prepend btn-${props.color}`"
      activator="parent"
      :size="props.size"
      :disabled="props.isDiabledPrepend"
      class="text-style-btn"
      @click="handlerPrepend"
    >
      <span v-if="props.title">{{ props.title }}</span>
      <slot v-if="!props.title" />
    </VBtn>
    <VBtn
      :size="props.size"
      :disabled="props.isDiabledAppend"
      :class="`button-group button-group-append pa-0 btn-${props.color} ${isBorder ? `border-left-${props.color}` : ''}`"
    >
      <VMenu
        location="bottom right"
        class="button-dropdown"
        activator="parent"
      >
        <template #activator>
          <VIcon
            v-if="icon"
            :icon="icon"
            size="18"
          />
        </template>
        <VList>
          <VListItem
            v-for="(item, index) in listItem"
            :key="index"
            :class="item.colorClass"
            :value="index"
            @click="item?.action ? item?.action(item) : clickItem(item)"
          >
            <VListItemTitle class="jutify-content-center">
              <VIcon
                v-if="item.icon"
                :icon="item.icon"
                size="18"
                :class="[item.colorClass]"
              />
              <span class="ml-3">{{ item.title }}</span>
            </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </VBtn>
  </div>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;
.btn-group-style{
  height: $button-default-height;
}
.button-group-prepend {
  border-end-end-radius: unset;
  border-start-end-radius: unset;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.button-group-append {
  border-end-start-radius: unset;
  border-start-start-radius: unset;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  min-width: 40px;
  &:focus{
    box-shadow: none !important;
  }
}

.button-group {
 height:  -webkit-fill-available;
}

.text-style-btn {
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  padding-block: 10px;
  padding-inline: 16px;
  text-transform: inherit;
}
</style>
