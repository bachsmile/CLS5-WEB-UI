<script setup lang="ts">
import DateUtil from '@/utils/DateUtil'
import StringUtil from '@/utils/StringUtil'

const propsValue = withDefaults(defineProps<Props>(), ({
  data: null,
}))

interface Props {
  data: any
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
</script>

<template>
  <div>
    <div
      v-if="data.completeDate"
      class="d-flex mb-3"
    >
      <div class="mr-2 d-flex align-center">
        <VIcon
          icon="tabler:calendar-check"
          size="16"
          color="error"
        />
      </div>
      <div class="text-regular-sm">
        <div>{{ DateUtil.formatTimeToHHmm(data.completeDate) }} {{ DateUtil.formatDateToDDMM(data.completeDate, '-') }}</div>
      </div>
    </div>
    <div
      v-if="data.point"
      class="d-flex mb-3"
    >
      <div class="mr-2 d-flex align-center">
        <VIcon
          icon="solar:pen-2-linear"
          size="16"
          color="warning"
        />
      </div>
      <div class="text-regular-sm">
        <div>{{ StringUtil.decimalToFixed(Number(data.point), 2) }} {{ t('scores') }}</div>
      </div>
    </div>
    <div
      v-if="data.ratingScaleName"
      class="d-flex mb-4"
    >
      <div class="mr-2 d-flex align-center">
        <VIcon
          icon="lucide:bar-chart"
          size="16"
          color="success"
        />
      </div>
      <div class="text-regular-sm">
        <div> {{ t('data.ratingScaleName') }}</div>
      </div>
    </div>
  </div>
</template>
