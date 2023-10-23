<script setup lang="ts">
import CmIcon from '@/components/common/CmIcon.vue'

const props = withDefaults(defineProps<Props>(), {
  title: '',
  level: 0,
  isVisible: false,
})
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'visible', value: any, item: any): void
}

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface Props {
  title: string
  level?: number
  isVisible?: boolean
  item: any
}
const visible = ref(false)
function updateVisible(val = true) {
  visible.value = val
  console.log(val)

  emit('visible', val, props.item)
}
watch(() => props.isVisible, val => {
  visible.value = val
}, { immediate: true })
</script>

<template>
  <div
    class="thematic"
    :style="{ paddingLeft: `${(level + 1) * 20}px` }"
    :class="{ active: visible }"
    @click="updateVisible(!visible)"
  >
    <div class="d-flex justify-space-between w-100">
      <div class="text-medium-md color-text-900">
        {{ title }}
      </div>
      <div class="text-regular-sm mr-3">
        {{ item?.total || 0 }} nội dung
      </div>
    </div>

    <CmIcon
      v-if="visible"
      :type="2"
      bg-color="second"
      color="second"
      variant="text"
      icon="tabler:chevron-down"
      :size="20"
    />
    <CmIcon
      v-else
      :type="2"
      bg-color="second"
      color="second"
      variant="text"
      icon="tabler:chevron-up"
      :size="20"
    />
  </div>
</template>

<style scoped lang="scss">
.thematic{
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 12px 16px;
  justify-content: space-between;
  border-bottom: 1px solid rgb(var(--v-gray-200));
  &.active{
    background-color: rgb(var(--v-gray-100)) ;
  }
}
</style>
