<script lang="ts" setup>
import type { Any } from '@/typescript/interface'
import DateUtil from '@/utils/DateUtil'

interface Props {
  item: Any
  isShowPoint: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isShowPoint: false,
})
const { t } = window.i18n()
</script>

<template>
  <div class="mb-6">
    <div class="mr-2 d-flex align-center">
      <VIcon
        icon="tabler:calendar-cancel"
        size="16"
        color="success"
        class="my-2 mr-2"
      />
      <div class="text-regular-sm">
        <span>{{ DateUtil.formatTimeToHHmm(item.startDate) }}  {{ DateUtil.formatDateToDDMM(item.startDate) }} </span>
      </div>
    </div>

    <div class="mr-2 d-flex align-center">
      <VIcon
        icon="tabler:calendar-cancel"
        size="16"
        color="error"
        class="my-2 mr-2"
      />
      <div class="text-regular-sm">
        <span>{{ DateUtil.formatTimeToHHmm(item.endDate) }}  {{ DateUtil.formatDateToDDMM(item.endDate) }}  </span>
      </div>
    </div>
    <div
      v-if="item.isDisplayPoint && item.isComplete && !item.isSuspended"
      class="d-flex align-center"
    >
      <VIcon
        icon="fe:edit"
        size="16"
        color="error"
        class="my-2 mr-2"
      />
      <div class="text-regular-sm">
        {{ item.testPoint }} {{ t('point') }}
      </div>
    </div>
    <div
      v-if="item.isDisplayRating && item.isMarkEssay !== false && item.ratingScaleName"
      class="d-flex align-center"
    >
      <VIcon
        icon="fe:bar-chart"
        size="16"
        color="error"
        class="my-2 mr-2"
      />
      <div class="text-regular-sm">
        {{ item.ratingScaleName }}
      </div>
    </div>
  </div>
</template>
