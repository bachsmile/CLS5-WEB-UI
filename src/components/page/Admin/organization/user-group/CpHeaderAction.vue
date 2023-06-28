<script setup lang="ts">
import CpSearch from '@/components/page/gereral/CpSearch.vue'

const emit = defineEmits<Emit>()
const { t } = window.i18n()

// eslint-disable-next-line vue/define-macros-order
const props = withDefaults(defineProps<Props>(), ({
  isShowAddGroup: true,
  isShowDelete: true,
  isShowAdd: true,
  isDisabledMove: false,
  isDisabledDelete: false,
  disabledFilter: false,
  isShowExportExcel: true,
  isFillter: false,
  buttonAdd: 'Add-new',
  buttonPrepend: 'export-excel',
  isShowFilter: true,
}))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

interface Props {
  listItemButtonGroup?: Item[]
  isShowAddGroup?: boolean
  isShowDelete?: boolean
  isShowMove?: boolean
  isShowAdd?: boolean
  isShowExportExcel?: boolean
  titlePage: string
  buttonAdd: string
  buttonPrepend: string
  isDisabledMove: boolean
  isDisabledDelete: boolean
  isFillter: boolean
  isDisabledAdd?: boolean
  isShowFilter: boolean
  disabledFilter: boolean
}
interface Item {
  title: string
  icon?: string
  colorClass?: string
  action?: any
  key?: any
}
interface Emit {
  (e: 'update:keySearch', key: string): void
  (e: 'clickAdd'): void
  (e: 'clickDelete'): void
  (e: 'clickMoveMultiple'): void
  (e: 'clickExport'): void
  (e: 'update:isShowFilter', data: boolean): void
}

function showAdd() {
  emit('clickAdd')
}

// Tìm kiếm
function handleSearch(val: string) {
  emit('update:keySearch', val)
}
function exportExcel() {
  emit('clickExport')
}

function handleFilter() {
  emit('update:isShowFilter', !props.isShowFilter)
}
</script>

<template>
  <div class="mb-6">
    <VRow>
      <VCol>
        <h3>{{ props.titlePage }}</h3>
      </VCol>
      <VCol class="d-flex justify-end">
        <CmButton
          v-if="isShowExportExcel"
          :title="t(props.buttonPrepend)"
          icon="tabler:download"
          variant="tonal"
          color="primary"
          @click="exportExcel"
        />
        <CmButtonGroup
          v-if="props.isShowAddGroup"
          :title="t(props.buttonAdd)"
          color="primary"
          class="ml-1"
          :list-item="props.listItemButtonGroup"
          @click-prepend="showAdd"
        />
        <CmButton
          v-if="props.isShowAdd"
          :title="t(props.buttonAdd)"
          :disabled="isDisabledAdd"
          class="ml-1"
          variant="flat"
          color="primary"
          @click="showAdd"
        />
      </VCol>
    </VRow>

    <VRow class="mr-1">
      <VCol class="d-flex">
        <CmButton
          v-if="props.isShowDelete"
          icon="tabler:trash"
          color="error"
          size="40"
          :disabled="props.isDisabledDelete"
          :size-icon="18"
          class="d-flex align-middle justify-center mr-2"
          @click="emit('clickDelete')"
        />

        <CmButton
          v-if="props.isShowMove"
          icon="simple-line-icons:cursor-move"
          color="success"
          size="40"
          :disabled="props.isDisabledMove"
          :size-icon="18"
          class="d-flex align-middle justify-center"
          @click="emit('clickMoveMultiple')"
        />

        <slot name="buttonBottom" />
      </VCol>
      <VCol class="d-flex justify-end pr-0">
        <CpSearch
          label="Tìm kiếm"
          class="header-action-field"
          placeholder="Tìm kiếm"
          prepend-inner-icon="tabler-search"
          @update:model-value="handleSearch"
        />
        <CmButton
          v-if="isFillter"
          class="ml-3"
          :disabled="disabledFilter"
          variant="outlined"
          color="secondary"
          :size-icon="20"
          icon="ic:round-filter-list"
          :title="isShowFilter ? t('hide-filter') : t('show-filter')"
          @click="handleFilter"
        />
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@/styles/variables/common/input.cm" as *;

.header-action {
  &-field {
    inline-size: $input-min-width;
    max-inline-size: $input-min-width;

    // min-inline-size: $input-min-width;
  }
}
</style>
