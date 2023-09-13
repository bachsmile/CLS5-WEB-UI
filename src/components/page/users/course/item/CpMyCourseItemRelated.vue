<script setup lang="ts">
import CmImg from '@/components/common/CmImg.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'
import CmButton from '@/components/common/CmButton.vue'

const propsValue = withDefaults(defineProps<Props>(), ({
  data: null,
}))

interface Props {
  data: any
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()

// lấy ảnh nền random
function getImage(type = 0) {
  return MethodsUtil.getRandomImage(type)
}
function goDetailCourse() {
  router.push({ name: 'course-detail', params: { id: propsValue.data?.id }, query: { type: 'introduce' } })
}
</script>

<template>
  <div class="course-related-card">
    <div class="rl-left">
      <div class="rl-img">
        <CmImg
          height="100%"
          :src="MethodsUtil.urlImageFile(data.thumbnail || getImage())"
          cover
        />
      </div>
    </div>
    <div class="rl-right">
      <div>
        <div class="rl-name-course text-ellipsis text-medium-md">
          <!-- v-if="data?.code" -->
          <span
            :title="data?.code"
            class="mr-1 rl-code"
          >
            {{ t('code-log') }}
          </span>
          {{ data?.name }}
        </div>
        <div
          v-if="data.startDate"
          class="d-flex mb-3 mt-2"
        >
          <div class="mr-2 d-flex align-center">
            <VIcon
              icon="tabler:calendar-check"
              size="16"
              color="success"
            />
          </div>
          <div class="text-regular-sm">
            <div>{{ DateUtil.formatTimeToHHmm(data.startDate) }} {{ DateUtil.formatDateToDDMM(data.startDate, '-') }}</div>
          </div>
        </div>
        <div
          v-if="data.endDate"
          class="d-flex mb-4"
        >
          <div class="mr-2 d-flex align-center">
            <VIcon
              icon="tabler:calendar-cancel"
              size="16"
              color="error"
            />
          </div>
          <div class="text-regular-sm">
            <div>{{ DateUtil.formatTimeToHHmm(data.endDate) }} {{ DateUtil.formatDateToDDMM(data.endDate, '-') }}</div>
          </div>
        </div>
      </div>
      <div class="rl-review text-semibold-sm">
        <CmButton
          :title="t('view-detail')"
          variant="text"
          @click="goDetailCourse"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .course-related-card{
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10);
    margin-block: 1.5rem;
    padding: 1rem;
    display: flex;
    .rl-left{
      .rl-img{
        width: 5.5rem;
        height: 5.5rem;
      }
    }
    .rl-right{
      margin-left: 1rem;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
     .rl-code{
      color:  rgb(var(--v-primary-700));
     }
     .rl-name-course{
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Số hàng tối đa muốn hiển thị */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre-wrap;
     }
     .rl-review{
      text-align: end;
      color:  rgb(var(--v-primary-700));
     }
    }
  }
</style>
