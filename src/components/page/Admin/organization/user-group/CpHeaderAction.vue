<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({
  isShowAddGroup: true,
  isShowDelete: true,
  isShowAdd: true,
  isDisabledMove: false,
  isDisabledDelete: false,
  isShowExportExcel: true,
}))

const emit = defineEmits<Emit>()
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
interface Props {
  listItemButtonGroup?: any[]
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

}
interface Emit {
  (e: 'update:keySearch', key: string): void
  (e: 'clickAdd'): void
  (e: 'clickDelete'): void
  (e: 'clickMoveMultiple'): void
}

const showAdd = () => {
  emit('clickAdd')
}

// Tìm kiếm
const timer = ref<any>(null)
const handleSearch = (val: string) => {
  if (timer) {
    clearTimeout(timer.value)
    timer.value = null
  }
  timer.value = setTimeout(() => {
    emit('update:keySearch', val)
  }, 500)
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
          :title="props.buttonPrepend"
          icon="tabler:download"
          color="50-primary"
        />
        <CmButtonGroup
          v-if="props.isShowAddGroup"
          :title="props.buttonAdd"
          color="primary"
          class="ml-1"
          :list-item="props.listItemButtonGroup"
          @click-prepend="showAdd"
        />
        <CmButton
          v-if="props.isShowAdd"
          :title="props.buttonAdd"
          class="ml-1"
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
        <CmTextField
          label="Tìm kiếm"
          class="header-action-field"
          placeholder="Tìm kiếm"
          prepend-inner-icon="tabler-search"
          @update:model-value="handleSearch"
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
