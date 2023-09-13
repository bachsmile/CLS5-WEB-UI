<script setup lang="ts">
import DateUtil from '@/utils/DateUtil'

const propsValue = withDefaults(defineProps<Props>(), ({
  data: null,
}))

interface Props {
  data: any
}
</script>

<template>
  <div>
    <div
      v-if="data.startDate"
      class="d-flex mb-3"
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
</template>
