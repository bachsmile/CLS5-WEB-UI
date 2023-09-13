<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpAsginUser from '@/components/page/Admin/training/calendar/edit/CpAsginUser.vue'
import CpEventInfo from '@/components/page/Admin/training/calendar/edit/CpEventInfo.vue'

const route = useRoute()
const isEdit = computed(() => !route.params.id) as unknown as boolean
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
    isDisabled: isEdit,
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
