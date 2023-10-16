<script setup lang="ts">
import CmCard from '@/components/common/CmCard.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmImg from '@/components/common/CmImg.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import StringUtil from '@/utils/StringUtil'

const propsValue = withDefaults(defineProps<Props>(), ({
  data: null,
}))

// Khai báo biến Emit
const emit = defineEmits<Emit>()
interface Props {
  data: any
  groupType?: any
}

// Cấu trúc Emit
interface Emit {
  (e: 'click', item: any, action: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ.
const action = ref()
const router = useRouter()

// lấy ảnh nền random
function getImage(type = 0) {
  return MethodsUtil.getRandomImage(type)
}
function goToDetail() {
  router.push({ name: 'course-detail', params: { id: propsValue.data?.id } })
}

function getButtonTitle(groupType: any) {
  if (groupType === 'going-on') {
    switch (propsValue.data?.statusName) {
      case 'CourseService.LearnerStudying':
        action.value = 'continue'
        return t('continue-now')
      case 'CourseService.LearnerHaveNotStudiedYet':
        action.value = 'start'
        return t('start-learn')
      case 'CourseService.LearnerCompleted':
        action.value = 'review'
        return t('review')
      default:
        action.value = 'registry'
        return ''
    }
  }
  if (groupType === 'upcoming') {
    action.value = 'detail'
    return t('detail')
  }
  if (groupType === 'completed' || groupType === 'finished') {
    if (propsValue.data?.isReviewExpired) {
      action.value = 'detail'
      return t('detail')
    }
    action.value = 'review'
    return t('review')
  }
  action.value = 'registry'
  return t('register-now')
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
            :src="MethodsUtil.urlImageFile(data.thumbnail || getImage())"
            height="12rem"
            cover
          />
        </div>
        <VCardTitle>
          <div
            v-if="data.completionRatio"
            class="d-flex flex-nowrap"
          >
            <div class="w-100 mr-3">
              <VProgressLinear
                rounded-bar
                :model-value="data.completionRatio.toFixed()"
                color="success"
                class="mt-6"
                rounded
                height="8"
              />
            </div>
            <div class="text-medium-sm d-flex align-end label-ratio">
              {{ data.completionRatio.toFixed() }} %
            </div>
          </div>
        </VCardTitle>
      </template>
      <template #text>
        <div class="text-semibold-sm label-author mb-2">
          {{ StringUtil.formatFullName(data?.author?.firstName || data?.user?.firstName, data?.author?.lastName || data?.user?.lastName) }}
        </div>
        <div class="text-semibold-md label-course ">
          <span
            class="text-ellipsis label-course-name"
            :title="data?.name"
          >
            <span
              v-if="data?.code"
              :title="data?.code"
              class="mr-1 label-author"
            >
              {{ t('code-log') }}
            </span>
            {{ data?.name }}
          </span>
        </div>
      </template>
      <div class="box-content">
        <slot />
        <div
          v-if="groupType !== 'homePage'"
          style="height: 40px; margin-bottom: 8px;"
        />
        <CmButton
          v-if="groupType !== 'homePage'"
          class="w-100 button-action"
          :title="getButtonTitle(groupType)"
          color="primary"
          @click="emit('click', data, action)"
          @touchstart="emit('click', data, action)"
        />
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
