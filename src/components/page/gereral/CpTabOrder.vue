<script lang="ts" setup>
import CmButton from '@/components/common/CmButton.vue'

interface Props {
  text: string
  isEnd: boolean
  icon: string
  isActive?: boolean
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const { t } = window.i18n()
const colorTab = computed(() => {
  return props.isActive ? 'primary' : 'success'
})
</script>

<template>
  <div class="d-flex align-center cursor-pointer mb-2">
    <CmButton
      :disabled="disabled"
      size="40"
      class="d-flex align-center"
      :color="colorTab"
    >
      <VIcon
        size="24"
        :icon="icon"
      />
    </CmButton>
    <span
      class="text-semibold-md ml-3"
      :class="`text-${colorTab}`"
    >{{ t(text) }}</span>
    <span class="mx-6">
      <VIcon
        v-if="!isEnd"
        size="24"
        icon="material-symbols:chevron-right-rounded"
      />
    </span>
  </div>
</template>
