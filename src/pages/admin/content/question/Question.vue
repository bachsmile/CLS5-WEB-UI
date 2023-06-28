<script setup lang="ts">
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpQuestionList = defineAsyncComponent(() => import('@/components/page/Admin/content/question/question-list/CpQuestionList.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'list',
    title: 'question-bank',
    component: CpQuestionList,
    isRendered: true,
    isDisabled: false,
  },

  // {
  //   key: 'title',
  //   title: 'title-position',
  //   component: CpTitleOrgStructTab,
  //   isRendered: false,
  //   isDisabled: !isEdit.value,
  // },
  // {
  //   key: 'user',
  //   title: 'user',
  //   component: CpUserOrgStructTab,
  //   isRendered: false,
  //   isDisabled: !isEdit.value,
  // },
]
</script>

<template>
  <div>
    <div
      class="d-flex justify-content-center mb-5"
      style="margin-top: 20px;"
    >
      <CmTab
        :is-render="true"
        :list-tab="listTab"
        label="tab"
        type="button"
      />
    </div>
  </div>
</template>
