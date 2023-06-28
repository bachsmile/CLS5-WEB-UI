<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpAsginUser from '@/components/page/Admin/training/calendar/edit/CpAsginUser.vue'
import CpEventInfo from '@/components/page/Admin/training/calendar/edit/CpEventInfo.vue'

const listTab: Tab[] = [
  {
    title: 'event-info',
    key: 'event-info',
    component: CpEventInfo,
  },
  {
    title: 'asign-user',
    key: 'asign-user',
    component: CpAsginUser,
  },
]
</script>

<template>
  <div>
    <CmTab
      :list-tab="listTab"
      label="tab"
    />
  </div>
</template>
