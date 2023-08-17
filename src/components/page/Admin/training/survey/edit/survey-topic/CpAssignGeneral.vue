<script lang="ts" setup>
import CpAssignUserSurvey from './CpAssignUserSurvey.vue'
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'

const listTab: Tab[] = [
  {
    key: 'candidate',
    title: 'candidate',
    component: CpAssignUserSurvey,
  },
  {
    key: 'user-group',
    title: 'user-group',
    component: CpAssignUserSurvey,
  },
]
</script>

<template>
  <CmTab
    :list-tab="listTab"
    label="assignTab"
  />
</template>
