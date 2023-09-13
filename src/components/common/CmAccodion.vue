<script setup lang="ts">
import GlobalUtil from '@/utils/Global'

/**
 * Common accorrdion: danh sách đóng mở
 * input:
 * output
 * ex: dánh sách cơ cấu tổ chức, nhóm người dùng, chức danh,... trong table
 */
interface Props {
  data: dataAccodion[]
  customKey?: string
  customLabel?: string
  classNameLabel?: Array<any>
  isOpen?: boolean
  isTree?: boolean
}
interface dataAccodion {
  label?: any
  icon?: any
  colorClass?: any
  value?: any
  content?: any
  [name: string]: any
}
interface Emit {
  (e: 'change', data: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  data: () => ([{
    label: 'Title',
    content: 'Content',
  }]),
  customKey: 'content',
  customLabel: 'label',
  classNameLabel: () => ([]),
  isOpen: false,
  isTree: false,

}))

const emit = defineEmits<Emit>()

function checkAllValue() {
  return props.data.map(item => item.value)
}

const panel = props.isOpen ? ref(checkAllValue()) : ref([])
</script>

<template>
  <div>
    <VExpansionPanels
      v-model="panel"
      class="no-background"
      multiple
    >
      <template v-if="!isTree">
        <VExpansionPanel
          v-for="(item, index) in data"
          :key="index"
          :value="item.value || item.label"
        >
          <template #title>
            <div>
              <VAvatar
                size="32"
                class="mr-2"
                :class="[item.colorClass]"
                variant="tonal"
              >
                <VIcon
                  v-if="item.icon"
                  :icon="item.icon"
                  size="14"
                  :class="[item.colorClass]"
                />
              </VAvatar>
            </div>
            <span
              :class="[props.classNameLabel[0]]"
              class="text-regular-sm"
            >{{ item[customLabel] }}</span>
            <slot
              class="text-regular-sm"
              name="title"
            />
          </template>
          <template #text>
            <div
              v-if="GlobalUtil.checkTypeContent(item[customKey]) === 'array'"
            >
              <div
                v-for="(listItem, idItem) in item[customKey]"
                :key="idItem"
                class="mb-2"
              >
                <div
                  v-if="listItem?.icon"
                  class="icon-item"
                >
                  <VIcon
                    :icon="listItem?.icon"
                    size="14"
                    :class="[item?.colorClass]"
                  />
                </div>
                <div
                  v-if="listItem[customKey]"
                  class="content-item text-regular-sm"
                  :class="[props.classNameLabel[1]]"
                >
                  {{ listItem[customKey] }}
                </div>
              </div>
            </div>
            <div
              v-else
              class="text-regular-sm mb-2"
            >
              {{ item?.[customKey] }}
            </div>
            <slot
              name="text"
              class="text-regular-sm"
            />
          </template>
        </VExpansionPanel>
      </template>
      <VExpansionPanel v-else>
        <template #title>
          <slot name="title" />
        </template>
        <template #text>
          <slot name="text" />
        </template>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.v-expansion-panel {
  background-color: unset !important;
}

.v-expansion-panel__shadow {
  box-shadow: unset !important;
}

.v-expansion-panel:not(:first-child)::after {
  border-block-start-style: unset !important;
}

.v-expansion-panel-text__wrapper {
  padding-inline: 2.5rem 1rem !important;
}
.v-expansion-panel-title{
  padding: 0px 16px !important;
  &[aria-expanded="true"] {
    /* CSS styles cho khi aria-expanded="true" */
    background-color: rgb(var(--v-gray-200));
  }
}
</style>
