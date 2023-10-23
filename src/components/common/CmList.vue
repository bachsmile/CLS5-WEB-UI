<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  list: () => ([]),
  keyLabel: 'label',
  isCustom: false,
})
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'click', value: any): void
}

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface Props {
  list: any[]
  keyLabel?: string
  classList?: any
  isCustom?: boolean
}
function handleClickRow(item: any) {
  emit('click', item)
}
</script>

<template>
  <div
    v-for="item in list"
    :key="item.id"
    class="cm-list-item"
    :class="classList"
    @click="handleClickRow(item)"
  >
    <div v-if="isCustom">
      <slot :list-item="item" />
    </div>
    <div v-else>
      {{ item[keyLabel] }}
    </div>
  </div>
</template>

<style scoped>
.cm-list-item{
  padding: 12px 16px;
}
</style>
