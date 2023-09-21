<script setup lang="ts">
import DateUtil from '@/utils/DateUtil'
import { ContentType } from '@/constant/data/contentCourseType.json'
import MethodsUtil from '@/utils/MethodsUtil'

const props = defineProps<Props>()

interface Props {
  data?: any
}
</script>

<template>
  <div class="content-child">
    <div
      class="d-flex"
      style="max-width: 85%;"
    >
      <div class="mr-3">
        <VIcon
          :icon="MethodsUtil.checkType(data.typeId, ContentType, 'id')?.icon"
          size="16"
        />
      </div>
      <div>
        {{ data.name }}
      </div>
    </div>
    <div
      v-if="data.time"
      class="text-regular-sm "
    >
      {{ DateUtil.formatTimeSecondToCustom(data.time) }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-child{
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
}
</style>
