<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import CpManagerTopic from '@/components/page/Admin/training/topic/CpManagerTopic.vue'

const listtab = [
  {
    key: 'training',
    title: 'training',
    component: CpManagerTopic,
    dataTab: {
      typeId: 2,
      title: 'training',
    },
  },
  {
    key: 'exam',
    title: 'exam',
    component: CpManagerTopic,
    dataTab: {
      typeId: 3,
      title: 'exam',
    },
  },
  {
    key: 'survey',
    title: 'survey',
    component: CpManagerTopic,
    dataTab: {
      typeId: 6,
      title: 'survey',
    },
  },
  {
    key: 'question',
    title: 'question',
    component: CpManagerTopic,
    dataTab: {
      typeId: 4,
      title: 'question',
    },
  },
  {
    key: 'train-route',
    title: 'train-route',
    component: CpManagerTopic,
    dataTab: {
      typeId: 1,
      title: 'train-route',
    },
  },
  {
    key: 'forum',
    title: 'forum',
    component: CpManagerTopic,
    dataTab: {
      typeId: 7,
      title: 'forum',
    },
  },
  {
    key: 'library',
    title: 'lib',
    component: CpManagerTopic,
    dataTab: {
      typeId: 9,
      title: 'lib',
    },
  },
]
</script>

<template>
  <CmTab
    :list-tab="listtab"
    label="tab"
  />
</template>
