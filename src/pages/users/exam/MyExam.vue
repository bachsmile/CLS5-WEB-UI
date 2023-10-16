<script setup lang="ts">
import CmTab from '@/components/common/CmTab.vue'
import CpMyExam from '@/components/page/users/exam/exam-list/CpMyExam.vue'
import type { Tab } from '@/typescript/interface'

const listTab: Tab[] = [
  {
    key: 'going-on',
    title: 'exam-in-progress',
    isRendered: true,
  },

  {
    key: 'comming',
    title: 'exam-is-coming',
    isRendered: false,
  },
  {
    key: 'complete',
    title: 'exam-complete',
    isDisabled: false,
    isRendered: false,
  },
  {
    key: 'finished',
    title: 'exam-finish',
    isRendered: false,
  },
]

const tab = ref('going-on')
const type = ref(2)
function tabActive(val: string) {
  tab.value = val
  switch (val) {
    case 'going-on':
      type.value = 2
      break
    case 'comming':
      type.value = 1
      break
    case 'finished':
      type.value = 3
      break
    default:
      break
  }
}
</script>

<template>
  <CmTab
    :is-render="false"
    :list-tab="listTab"
    label="type"
    @activeTab="tabActive"
  />
  <CpMyExam
    :key="tab"
    :type="type"
  />
</template>
