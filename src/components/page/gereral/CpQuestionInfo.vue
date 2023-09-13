<script lang="ts" setup>
interface Props {
  name: string
  isGroup: boolean
  topic: string
}
const props = withDefaults(defineProps<Props>(), {})
const { t } = window.i18n()
const type = computed(() => {
  if (props.isGroup) {
    return {
      name: 'QuestionService.SingleQuestion',
      color: 'warning',
    }
  }

  return {
    name: 'QuestionService.GroupQuestion',
    color: 'primary',
  }
})
</script>

<template>
  <div v-if="name">
    {{ t(name) }}
  </div>
  <span v-if="isGroup !== null">
    <span :class="`text-${type.color}`">
      {{ t(type.name) }}
    </span>
    <span v-if="topic">{{ topic }}</span>
  </span>
</template>
