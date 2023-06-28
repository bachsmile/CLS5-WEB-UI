<script setup lang="ts">
const emit = defineEmits<Emit>()
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))
const CmSwitch = defineAsyncComponent(() => import('@/components/common/CmSwitch.vue'))

/**
 * lib
 */
interface Emit {
  (e: 'click', data: string): void
  (e: 'search', type: any): void
  (e: 'exportExcel'): void
  (e: 'changeView', type: boolean): void
}

// Khởi tạo biến đa ngôn ngữ
const { t } = window.i18n()
const router = useRouter()

/**
 * params
 */

/**
 * method
 */
const actionAddFromApi = () => {
  emit('click', 'actionAddFromApi')
}
const actionAddFromApiTitle = () => {
  emit('click', 'actionAddFromApiTitle')
}

const handlerPreButton = () => {
  emit('click', 'handlerAddButton')
}

/** action */
const actionAdd = [
  {
    title: t('add-from-file'),
    icon: 'tabler:file-plus',

    action: () => {
      router.push({ name: 'admin-organization-org-struct-import-file' })
    },
  },
  {
    title: t('add-from-api'),
    icon: 'tabler:folder-plus',

    action: actionAddFromApi,
  },
  {
    title: t('add-title-from-api'),
    icon: 'tabler:folder-plus',

    action: actionAddFromApiTitle,
  },
]
const activeSwitch = ref(false)
const action = reactive([{
  icon: 'ic:baseline-format-list-bulleted',
  value: false,

  action: handleOrgTree,
},
{
  icon: 'tabler:layout-grid',
  value: true,

  action: handleOrgTreeDiagram,
}])
function handleOrgTree() {
  activeSwitch.value = false
  emit('changeView', false)
}
function handleOrgTreeDiagram() {
  activeSwitch.value = true
  emit('changeView', true)
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
          color="primary"
          variant="tonal"
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
        <CmSwitch
          v-model="activeSwitch"
          color="secondary"
          :list-item="action"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
</style>
