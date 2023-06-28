<script setup lang="ts">
const SingleChoiceQuestion = defineAsyncComponent(() => import('@/components/page/Admin/content/question/question-type/SingleChoiceQuestion.vue'))

const component = ref(SingleChoiceQuestion)
</script>

<template>
  <div>
    <div>
      <Component
        :is="component"
        v-if="component"
      />
    </div>
  </div>
</template>
