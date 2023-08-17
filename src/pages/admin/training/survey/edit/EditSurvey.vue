<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpEditInfoSurvey from '@/components/page/Admin/training/survey/edit/CpEditInfoSurvey.vue'
import CpSurveyTopics from '@/components/page/Admin/training/survey/edit/CpSurveyTopics.vue'

const route = useRoute()
const isDisabled = computed(() => !route.params.id)
const listTab: Tab[] = [
  {
    key: 'info',
    title: 'information-survey',
    component: CpEditInfoSurvey,
  },
  {
    key: 'survey-topic',
    title: 'list-survey-topics',
    component: CpSurveyTopics,
    isDisabled: isDisabled.value,
  },
]
</script>

<template>
  <CmTab
    :list-tab="listTab"
  />
</template>
