<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({
  title: '',
  actionUpdate: () => ([]),
  actionAdd: () => ([]),
  actionExport: () => ([]),
  isUpdateBtn: false,
  isExportBtn: false,
  isApproveBtn: false,
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))
interface Props {
  title: string
  titleAprove?: string
  isUpdateBtn?: boolean
  isExportBtn?: boolean
  isApproveBtn?: boolean
  actionUpdate?: Array<any>
  actionAdd?: Array<any>
  actionExport?: Array<any>
}

interface Emit {
  (e: 'click', type: string): void
  (e: 'search', type: any): void
  (e: 'exportExcel'): void
}

const router = useRouter()

const handlerPreButton = () => {
  emit('click', 'handlerAddButton')
}
const handlerApproveButton = () => {
  emit('click', 'handlerApproveButton')
}
</script>

<template>
  <div
    class="d-flex justify-space-between my-8"
    style="flex-wrap: wrap;"
  >
    <div class="text-medium-lg">
      {{ title }}
    </div>
    <div class="d-flex">
      <div
        v-if="isExportBtn"
        cols="12"
        md="3"
        class="d-flex justify-end mr-2"
      >
        <CmButton
          v-if="!actionExport?.length"
          :title="t('export-excel')"
          icon="tabler:download"
          color="50-primary"
          @click="emit('exportExcel')"
        />
        <CmDropDown
          v-else
          :title="t('export-excel')"
          color="dark"
          :list-item="actionExport"
          :type="2"
          icon="tabler:chevron-down"
        />
      </div>
      <div
        v-if="isUpdateBtn"
        cols="12"
        md="3"
        class="d-flex justify-end mr-2"
      >
        <CmDropDown
          :title="t('Update')"
          color="dark"
          :list-item="actionUpdate"
          :type="2"
          icon="tabler:chevron-down"
        />
      </div>
      <div
        v-if="isApproveBtn"
        cols="12"
        md="3"
        class="d-flex justify-end  mr-2"
      >
        <CmButton
          bg-color="bg-success"
          text-color="color-white"
          @click="handlerApproveButton"
        >
          {{ titleAprove }}
        </CmButton>
      </div>
      <div
        cols="12"
        md="3"
        class="d-flex justify-end"
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
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/variables/common/input.cm" as *;
@use "/src/styles/style-global" as *;

.header-action {
  &-field {
    inline-size: $input-min-width;
    max-inline-size: $input-min-width;

    // min-inline-size: $input-min-width;
  }
}
</style>
