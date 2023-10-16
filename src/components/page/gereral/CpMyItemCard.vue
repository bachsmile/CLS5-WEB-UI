<script setup lang="ts">
import CmCard from '@/components/common/CmCard.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmImg from '@/components/common/CmImg.vue'
import MethodsUtil from '@/utils/MethodsUtil'

const propsValue = withDefaults(defineProps<Props>(), ({}))

// Khai báo biến Emit
const emit = defineEmits<Emit>()
interface Props {
  code: string
  name: string
  groupType?: any
  titleButton?: string
  label?: string
  thumbnail?: string
  isShowButton?: boolean
  completionRatio?: any
}

// Cấu trúc Emit
interface Emit {
  (e: 'click'): void
  (e: 'goDetail'): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ.

// lấy ảnh nền random
function getImage(type = 0) {
  return MethodsUtil.getRandomImage(type)
}
function goToDetail() {
  emit('goDetail')
}
function handleClickButton() {
  emit('click')
}
</script>

<template>
  <div class="my-course-card">
    <CmCard
      padding="14px 8px"
      hide-action
      height="100%"
      @click="goToDetail"
    >
      <template #title>
        <div class="v-card-img">
          <CmImg
            :src="MethodsUtil.urlImageFile(thumbnail || getImage())"
            height="12rem"
            cover
          />
        </div>
        <VCardTitle>
          <div
            v-if="completionRatio"
            class="d-flex flex-nowrap"
          >
            <div class="w-100 mr-3">
              <VProgressLinear
                rounded-bar
                :model-value="completionRatio.toFixed()"
                color="success"
                class="mt-6"
                rounded
                height="8"
              />
            </div>
            <div class="text-medium-sm d-flex align-end label-ratio">
              {{ completionRatio.toFixed() }} %
            </div>
          </div>
        </VCardTitle>
      </template>
      <template #text>
        <div class="text-semibold-sm label-author mb-2">
          {{ label }}
        </div>
        <div class="text-semibold-md label-course ">
          <span
            class="text-ellipsis label-course-name"
            :title="code"
          >
            <span
              v-if="code"
              :title="code"
              class="mr-1 label-author"
            >
              {{ t('code-log') }}
            </span>
            {{ name }}
          </span>
        </div>
      </template>
      <div class="box-content">
        <slot />
        <div v-if="isShowButton">
          <CmButton
            class="w-100"
            :title="titleButton"
            color="primary"
            @click="handleClickButton"
            @touchstart="handleClickButton"
          />
        </div>
      </div>
    </CmCard>
  </div>
</template>

<style scoped>
.my-course-card{
  height: 100%;
  .label-author{
    color:  rgb(var(--v-primary-700));
  }
  .label-course{
    color:  rgb(var(--v-gray-900));
    .label-course-name{
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Số hàng tối đa muốn hiển thị */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre-wrap;
    }
  }
  .label-ratio{
    color:  rgb(var(--v-gray-700));
  }
  .box-content{
    padding: 8px 16px;
  }
  .button-action{
    position: absolute;
    width: calc(100% - 48px) !important;
    left: 24px;
    bottom: 24px;
  }
}
</style>
