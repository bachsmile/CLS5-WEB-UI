<script lang="ts" setup>
import CpGeneralInfo from '@/components/page/Admin/system/setting/tab/CpGeneralInfo.vue'
import CpExpPoint from '@/components/page/Admin/system/setting/tab/CpExpPoint.vue'
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpRatingScale from '@/components/page/Admin/system/setting/tab/CpRatingScale.vue'
import CpCertification from '@/components/page/Admin/system/setting/tab/CpCertification.vue'
import CpNotification from '@/components/page/Admin/system/setting/tab/CpNotification.vue'

const listTab: Tab[] = [
  {
    key: 'setting-info',
    title: 'general-info',
    component: CpGeneralInfo,
  },
  {
    key: 'experience-point',
    title: 'experience-point-setting',
    component: CpExpPoint,
  },
  {
    key: 'rating-scale',
    title: 'rating-scale',
    component: CpRatingScale,
  },
  {
    key: 'certification',
    title: 'certification',
    component: CpCertification,
  },
  {
    key: 'notification',
    title: 'notification',
    component: CpNotification,
  },
]
</script>

<template>
  <CmTab
    :list-tab="listTab"
  />
</template>
