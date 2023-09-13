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
  <div
    v-if="data.courseEndDate"
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
      <div>{{ DateUtil.formatTimeToHHmm(data.courseEndDate) }} {{ DateUtil.formatDateToDDMM(data.courseEndDate, '-') }}</div>
    </div>
  </div>
</template>
