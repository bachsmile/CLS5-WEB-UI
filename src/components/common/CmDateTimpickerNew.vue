<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import moment from 'moment'
import CmButton from './CmButton.vue'
import type { Any } from '@/typescript/interface'

// interface Props {
//   multiCalendars: boolean
//   textInput: boolean
// }
// const props = withDefaults(de)
const { t } = window.i18n()
const LABEL = Object.freeze({
  selectText: t('implement'),
  cancelText: t('cancel-title'),
})

const date = ref(null)

function getDay(params: number) {
  switch (params) {
    case 0:
      return 'Mo'
    case 1:
      return 'Tu'
    case 2:
      return 'We'
    case 3:
      return 'Th'
    case 4:
      return 'Fr'
    case 5:
      return 'Sa'
    case 6:
      return 'Su'
    default:
  }
}
const time = ref<any>(null)

const showPreviewDate = computed(() => {
  return (data: Any) => {
    time.value = data.value ? moment(data.value).format('DD/MM/YYYY hh:mm') : null
  }
})
</script>

<template>
  <VueDatePicker
    v-model="date"
    v-bind="LABEL"
    time-picker-inline
    locale="vi"
    text-input
  >
    <template #calendar-header="{ index }">
      <div>
        {{ t(getDay(index)) }}
      </div>
    </template>

    <template #action-extra="item">
      <div class="action-extra">
        <div>
          {{ time }}
        </div>

        <CmButton
          :title="t('today')"
          variant="outlined"
          color="secondary"
          @click="item.selectCurrentDate"
        />
      </div>
    </template>

    <template #action-preview="data">
      {{ showPreviewDate(data) }}
    </template>
  </VueDatePicker>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
:root {
  --dp-primary-color: rgb(var(--v-primary-600))
}
.dp__menu_inner {
  width: 300px;
}
.dp__calendar {
  width: 100%;
}
.dp__action_button {
    white-space: nowrap;
    border-radius: 8px;
    height: 40px !important;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    padding: 10px 16px;
    text-transform: inherit;
    font-family: inherit;
  }
.dp__action_row {
  width: 100% !important;
}
  .dp__action_select {
    --v-theme-overlay-multiplier: var(--v-theme-primary-overlay-multiplier);
    background-color: rgb(var(--v-theme-primary)) !important;
    color: rgb(var(--v-theme-on-primary)) !important;
  }
  .dp__action_cancel {
    --v-theme-overlay-multiplier: var(--v-theme-primary-overlay-multiplier);
    background-color: transparent !important;
    color: rgb(var(--v-theme-secondary)) !important;
    border: 1px solid rgb(var(--v-gray-300)) !important;
  }
.custom-time-picker-component {
    display: flex;
    justify-content: center;
    align-items: center;
    .select-input {
      border: 1px solid rgb(var(--v-gray-300));
      padding: 8px 14px;
      gap: 8px;
      border-radius: $xs
    }
    .select-input:focus-visible {
      // border: unset;
    }
  }

.dp__tp_inline_btn_top {
  display: flex;
  margin-bottom: 6px;
  .dp__tp_btn_in_l {
    transform: rotate(-12deg) scale(1.15) translateY(-2px);
  }
  .dp__tp_btn_in_r {
    transform: rotate(12deg) scale(1.15) translateY(-2px);
  }
}
.dp__tp_inline_btn_bottom {
  display: flex;
  margin-top: 10px;
  .dp__tp_btn_in_l {
    transform: rotate(12deg) scale(1.15) translateY(-2px);
  }
  .dp__tp_btn_in_r {
    transform: rotate(-12deg) scale(1.15) translateY(-2px);
  }
}
.dp__time_col_reg_inline:hover .dp__tp_inline_btn_bottom {
  display: flex;
}
.dp__time_col_reg_inline:hover .dp__tp_inline_btn_top {
  display: flex;
}
.dp__time_display {
  border: 1px solid $color-gray-300;
  padding: 8px 10px;
}
.action-extra {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
