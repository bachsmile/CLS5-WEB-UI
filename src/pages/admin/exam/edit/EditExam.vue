<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpInfoExam from '@/components/page/Admin/exam/edit/CpInfoExam.vue'// validate

const route = useRoute()
const listTab: Tab[] = [
  {
    key: 'info',
    title: 'info',
    component: CpInfoExam,
  },
  {
    key: 'list-test',
    title: 'list-test',
    isDisabled: !route.params.id,
  },
  {
    key: 'cost',
    title: 'cost-management',
    isDisabled: !route.params.id,
  },
]
</script>

<template>
  <CmTab
    :list-tab="listTab"
    label="tab"
  />
</template>
