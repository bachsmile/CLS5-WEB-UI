<script setup lang="ts">
const emit = defineEmits<Emit>()
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))
const CmSwitch = defineAsyncComponent(() => import('@/components/common/CmSwitch.vue'))

/**
 * lib
 */
interface Emit {
  (e: 'click', type: string): void
  (e: 'search', type: any): void
  (e: 'exportExcel'): void
}

// Khởi tạo biến đa ngôn ngữ
const { t } = window.i18n()

/**
 * params
 */
const actionAdd = [
  {
    title: t('add-from-file'),
    icon: 'tabler:file-plus',

    // action: () => {
    //   router.push({ name: 'admin-organization-user-import-file-add-user' })
    // },
  },
  {
    title: t('add-from-api'),
    icon: 'tabler:folder-plus',

    // action: actionAddFromApi,
  },
]
const action = [{
  icon: 'ic:baseline-format-list-bulleted',

  // action: handleItem1,
},
{
  icon: 'tabler:layout-grid',

  // action: handleItem2,
}]

/**
 * method
 */
const handlerPreButton = () => {
  emit('click', 'handlerAddButton')
}
</script>

<template>
  <div
    class="d-flex justify-space-between my-8"
    style="flex-wrap: wrap;"
  >
    <div class="text-medium-lg">
      {{ t('choose-org-struct') }}
    </div>
    <div class="d-flex">
      <div
        cols="12"
        md="3"
        class="d-flex justify-end mr-2"
      >
        <CmButton
          :title="t('export-excel')"
          icon="tabler:download"
          color="50-primary"
          @click="emit('exportExcel')"
        />
      </div>
      <div
        cols="12"
        md="3"
        class="d-flex justify-end mr-2"
      >
        <CmButtonGroup
          is-load
          :list-item="actionAdd"
          :title="t('Add-new')"
          @click-prepend="handlerPreButton"
        >
          {{ t('Add-new') }}
        </CmButtonGroup>
      </div>
      <div
        cols="12"
        md="3"
        class="d-flex justify-end"
      >
        <CmSwitch :list-item="action" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
</style>
