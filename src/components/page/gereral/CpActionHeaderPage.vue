<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({
  title: '',
  titleCustomAddGroup: 'Add-new',
  actionUpdate: () => ([]),
  actionAdd: () => ([]),
  actionExport: () => ([]),
  isUpdateBtn: false,
  isExportBtn: false,
  isCustomBtn: false,
  isCustomGroupBtn: false,
  bgCustom: 'bg-success',
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))
interface Props {
  title: string
  titleCustom?: string
  titleCustomAdd?: string
  titleCustomAddGroup?: string
  bgCustom?: string
  isUpdateBtn?: boolean
  isExportBtn?: boolean
  isCustomGroupBtn?: boolean
  isCustomBtn?: boolean
  isCustomAddBtn?: boolean
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

function handlerPreButton() {
  emit('click', 'handlerAddButton')
}
function handlerCustomButton() {
  emit('click', 'handlerCustomButton')
}
</script>

<template>
  <div
    class="d-flex justify-space-between my-6"
    style="flex-wrap: wrap;"
  >
    <div class="text-medium-lg">
      {{ title }}
    </div>
    <div class="d-flex justify-end">
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
          color="primary"
          variant="tonal"
          @click="emit('exportExcel')"
        />
        <CmDropDown
          v-else
          :title="t('export-excel')"
          color="secondary"
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
          color="secondary"
          :list-item="actionUpdate"
          :type="2"
          icon="tabler:chevron-down"
        />
      </div>
      <div
        v-if="isCustomBtn"
        cols="12"
        md="3"
        class="d-flex justify-end  mr-2"
      >
        <CmButton
          color="success"
          @click="handlerCustomButton"
        >
          {{ titleCustom }}
        </CmButton>
      </div>
      <slot name="actions" />
      <div
        v-if="isCustomAddBtn"
        cols="12"
        md="3"
        class="d-flex justify-end ml-2"
      >
        <CmButton
          @click="handlerPreButton"
        >
          {{ titleCustomAdd }}
        </CmButton>
      </div>
      <slot />

      <div
        v-if="isCustomGroupBtn"
        cols="12"
        md="3"
        class="d-flex justify-end"
      >
        <CmButtonGroup
          is-load
          :list-item="actionAdd"
          :title="t(titleCustomAddGroup)"
          @click-prepend="handlerPreButton"
        >
          {{ t(titleCustomAddGroup) }}
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
