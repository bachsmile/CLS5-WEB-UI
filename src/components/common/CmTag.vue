<script setup lang="ts">
import Vue3TagsInput from 'vue3-tags-input'

interface Props {
  modelValue: any
}
interface Emit {
  (e: 'update:modelValue', value: any): void
}
const propsValue = withDefaults(defineProps<Props>(), ({
  modelValue: () => ([]),
}))
const emit = defineEmits<Emit>()
const tags = ref(propsValue?.modelValue)
function handleChangeTag(tagsValue: any) {
  tags.value = tagsValue
  emit('update:modelValue', tags.value)
}
</script>

<template>
  <div>
    <Vue3TagsInput
      :tags="tags"
      placeholder="Nhập một số thẻ"
      @on-tags-changed="handleChangeTag"
    />
  </div>
</template>
