<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import CpAdd from '@/components/page/Admin/organization/user-group/CpAdd.vue'
import CpUserTab from '@/components/page/Admin/organization/user-group/CpUserTab.vue'
import CpCourseTab from '@/components/page/Admin/organization/user-group/CpCourseTab.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const route = useRoute()

const isDisabledTab = computed(() => {
  return !route.params.id
})

const listtab = ref([
  {
    key: 'info',
    title: 'info',
    component: CpAdd,
    dataTab: {
      TITLE: {
        titlePageAdd: t('add-user-group'),
        titlePageEdit: t('edit-user-group'),
        titleButton: t('save'),
        titleCancel: t('cancel'),
        titleButtonAndUpdate: t('save-and-update'),
      },
    },
    isDisabled: false,
  },
  {
    key: 'user',
    title: 'user',
    isDisabled: isDisabledTab.value,
    component: CpUserTab,
  },
  {
    key: 'course',
    title: 'course',
    isDisabled: isDisabledTab.value,
    component: CpCourseTab,
  },
])
</script>

<template>
  <CmTab
    type="button"
    :list-tab="listtab"
    label="tab"
    :is-use-component="true"
  />
</template>
