<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'

const emit = defineEmits<Emit>()
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))

/** lib */
interface Emit {
  (e: 'changeTitleAll', value: any): void
  (e: 'changeDataFilter', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** store */
const storeOrgStruct = orgStructManagerStore()
const { listTitles } = storeToRefs(storeOrgStruct)
const { getPagingByTitles } = storeOrgStruct

/** data */
const LABEL = Object.freeze({
  FILLTER1: t('choose-all-titles'),
  PHD_FILLTER1: t('choose-titles'),
  FILLTER2: t('course'),
  FILLTER3: t('training-path'),
})

const formFilter = reactive({
  titleId: null,
  isCourse: false,
  isTraining: false,
})

const changeAllTitles = (value: any) => {
  emit('changeTitleAll', value)
}
const changeDataFilter = (value: any) => {
  emit('changeDataFilter', formFilter)
}

// load
</script>

<template>
  <VRow class="mt-3">
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.titleId"
        :items="listTitles"
        item-value="id"
        custom-key="name"
        :text="LABEL.FILLTER1"
        :placeholder="LABEL.PHD_FILLTER1"
        @update:model-value="changeAllTitles"
      />
    </VCol>
    <VCol
      cols="12"
      md="8"
      sm="8"
    >
      <div class="mb-1">
        <label
          class="text-medium-sm color-dark"
        >{{ t('auto-assign-content') }}</label>
      </div>
      <div class="d-flex">
        <CmCheckBox
          v-model="formFilter.isCourse"
          class="mr-2"
          @update:model-value="changeDataFilter"
        >
          <span class="text-medium-md ">{{ LABEL.FILLTER2 }}</span>
        </CmCheckBox>
        <CmCheckBox
          class="mr-2"
          :model-value="formFilter.isTraining"
          @update:model-value="changeDataFilter"
        >
          <span class="text-medium-md ">{{ LABEL.FILLTER3 }}</span>
        </CmCheckBox>
      </div>
    </VCol>
  </VRow>
</template>

