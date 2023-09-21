<script lang="ts" setup>
import CmButton from '@/components/common/CmButton.vue'
import type { Any } from '@/typescript/interface'

interface Props {
  point?: number
  heightStep: number
  nameStep?: string
  data: Any
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()

const marginArchivePoint = computed(() => {
  return (props.heightStep / (props.data.minimumPoint - props.data.pointData)) * (props.data.minimumPoint - props.data.archivePoint) + 15
})

interface Emit {
  (e: 'add'): void
  (e: 'edit'): void
  (e: 'delete'): void
}
</script>

<template>
  <div
    class="step-rating-scale d-flex justify-center flex-column align-center"
    :style="`height: ${heightStep}px;${heightStep === 0 ? 'margin-top: 30px' : ''}`"
  >
    <div class="step-rating">
      <div class="content-step">
        {{ point }}
      </div>
    </div>
    <div
      v-if="heightStep"
      class="w-100 h-100 d-flex align-center"
    >
      <VRow>
        <VCol cols="5">
          {{ nameStep }}
        </VCol>
        <VCol
          cols="2"
          class="d-flex justify-center"
        >
          <CmButton
            icon="material-symbols:add-circle-outline"
            size="36"
            style="height: 36px !important;display: flex;"
            :size-icon="20"
            @click="emit('add')"
          />
        </VCol>
        <VCol
          cols="5"
          class="d-flex justify-end"
        >
          <CmButton
            icon="fe:edit"
            size="36"
            variant="text"
            style="height: 36px !important;display: flex;"
            :size-icon="20"
            @click="emit('edit')"
          />
          <CmButton
            icon="fe:trash"
            size="36"
            color="error"
            variant="text"
            style="height: 36px !important;display: flex;"
            :size-icon="20"
            @click="emit('delete')"
          />
        </VCol>
      </VRow>
    </div>
    <div
      v-if="data?.archivePoint"
      class="limitLevel"
      :style="`top: ${marginArchivePoint}px`"
    >
      <div>
        <div
          class="line"
        />
      </div>

      <div
        v-b-tooltip.hover.right="'Mức đạt'"
        class=""
      >
        <VIcon
          icon="fxemoji:graduationcap"
          size="50"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/styles/style-global.scss' as *;

.step-rating {
  border: 2px solid $color-primary-600;
  padding: 25px;
  border-radius: 50px;
  background: rgb(255, 255, 255);
  left: auto;
  right: auto;
  height: 60px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 1px;
}
.content-step {
  @extend .text-semibold-sm;
}
.line {
  border: 1px dashed  $color-gray-400;
  width: 60px;
}
.step-rating-scale {
  position: relative;
}
.limitLevel {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  position: absolute;
  display: flex;
  left: 50%;
  justify-content: start;
  align-items: center;
}
</style>
