<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import CpManagerTopic from '@/components/page/Admin/training/topic/CpManagerTopic.vue'

const listtab = ref([
  {
    key: 'training-title',
    title: 'topic-training-title',
    component: CpManagerTopic,
    dataTab: {
      typeId: 2,
    },
  },
  {
    key: 'topic-exam',
    title: 'ShareService_TopicExam',
    component: CpManagerTopic,
    dataTab: {
      typeId: 3,
    },
  },
  {
    key: 'topic-survey',
    title: 'topic-survey',
    component: CpManagerTopic,
    dataTab: {
      typeId: 6,
    },
  },
  {
    key: 'topic-question',
    title: 'ShareService_TopicQuestion',
    component: CpManagerTopic,
    dataTab: {
      typeId: 4,
    },
  },
  {
    key: 'training-route',
    title: 'topic-training-route',
    component: CpManagerTopic,
    dataTab: {
      typeId: 1,
    },
  },
  {
    key: 'topic-forum',
    title: 'topic-forum',
    component: CpManagerTopic,
    dataTab: {
      typeId: 7,
    },
  },
])
</script>

<template>
  <CmTab
    :list-tab="listtab"
    label="tab"
  />
</template>
