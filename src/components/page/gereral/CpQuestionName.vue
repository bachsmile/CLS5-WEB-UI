<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusQuestion } from '@/constant/data/status.json'
import CmButton from '@/components/common/CmButton.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'

interface Props {
  content?: any
  contentBasic?: any
  width?: any
  status?: any
  typeStatus?: string
  isExpand?: boolean
}

const props = withDefaults(defineProps<Props>(), ({
  content: '',
  contentBasic: '',
  typeStatus: 'id',
  status: null,
}))

const isExpandValue = ref(props.isExpand)
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

function expand(valueExpand: boolean) {
  isExpandValue.value = valueExpand
}
watch(() => props.isExpand, val => {
  isExpandValue.value = val
}, { deep: true })
</script>

<template>
  <div
    class="qs-content"
    :class="{ 'mb-3': isExpandValue }"
  >
    <div
      class="qs-name"
      :style="{ width: `${width}px` }"
      :title="t(MethodsUtil.converContentHtmlToText(contentBasic))"
      v-html="contentBasic"
    />
    <div
      class="qs-icon-action mr-3"
    >
      <CmButton
        is-rounded
        variant="tonal"
        size="20"
        :size-icon="12"
        :icon="MethodsUtil.checkType(status, StatusQuestion, typeStatus).icon"
        :color="MethodsUtil.checkType(status, StatusQuestion, typeStatus).color"
      />
    </div>
    <div class="question-expand">
      <CmButton
        v-show="!isExpandValue"
        is-rounded
        size="20"
        :size-icon="20"
        icon="tabler:chevron-down"
        color="infor"
        @click="expand(true)"
      />
      <CmButton
        v-show="isExpandValue"
        is-rounded
        size="20"
        :size-icon="20"
        icon="tabler:chevron-up"
        color="infor"
        @click="expand(false)"
      />
    </div>
  </div>
  <div
    class="qs-content-expand"
  >
    <CmCollapse :is-show="isExpandValue">
      <div
        class="qs-more"
        :style="{ width: `${width}px` }"
      >
        <slot />
      </div>
    </CmCollapse>
  </div>
</template>

<style scoped>
.qs-content{
  width: 100%;
  min-width: 200px;
  display: flex;
  padding-block: 9px;
  .qs-name{
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width:100%;
    padding-right: 12px;
  }
}
.qs-content-expand{
  width: 100%;
  min-width: 200px;
  display: flex;
  .qs-more{
    width: 100%;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
    max-width:100%;
    padding-right: 12px;
  }
}
</style>
