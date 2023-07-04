<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import moment from 'moment'
import CmButton from './CmButton.vue'
import CmTextField from '@/components/common/CmTextField.vue'

const props = withDefaults(defineProps<Props>(), {
  range: false,
  multiCalendars: false,
  timePicker: false,
  modalValue: null,
  fromDate: null,
  toDate: null,
})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
const LABEL = Object.freeze({
  selectText: t('implement'),
  cancelText: t('cancel-title'),
})
interface Props {
  range?: boolean
  multiCalendars?: boolean
  timePicker?: boolean
  modalValue?: any
  fromDate?: any
  toDate?: any
  text?: string
}
interface Emit {
  (e: 'update:modelValue', data: any): void
  (e: 'update:fromDate', data: any): void
  (e: 'update:toDate', data: any): void
}

const marginHeader = computed(() => {
  if (props.multiCalendars)
    return 'auto'

  return '60px'
})
const displayCalendar = computed(() => {
  if (props.timePicker)
    return 'none'

  return 'block'
})

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
const time = props.range ? ref<any[]>([]) : ref<any>(null)

// hiển thị thời gian chọn chưa xác nhận
function formatPreview(val: any, isRangeEnd = false) {
  let startTime: any = time.value.length ? time.value[0] : null
  let endTime: any
  if (!isRangeEnd) {
    startTime = val
  }
  else {
    endTime = val
    const start = moment(startTime).valueOf()
    const end = moment(val).valueOf()
    if ((start - end) > 0) {
      time.value = [endTime, startTime]
      return
    }
  }
  time.value = [startTime, endTime]
}
function showPreview(val: any) {
  if (!props.range && val)
    time.value = moment(val).format('DD/MM/YYYY hh:mm') || ''
}

const datepicker = ref()

function show() {
  datepicker.value.openMenu()
}
const placeholder = computed(() => {
  if (props.range)
    return 'DD/MM/YYYY hh:mm - DD/MM/YYYY hh:mm'
  else return 'DD/MM/YYYY hh:mm'
})

const date = ref()
const temp = ref()

function updateInput(val: any, isUpdate: any) {
  if (isUpdate) {
    emit('update:modelValue', val)
    if (props.range && val) {
      emit('update:fromDate', val[0] ? val[0] : null)
      emit('update:toDate', val[1] ? val[1] : null)
    }
  }

  if (!val) {
    temp.value = null
    return
  }
  date.value = val
  if (props.range) {
    temp.value = `${moment(val[0]).format('DD/MM/YYYY hh:mm a')} - ${moment(val[1]).format('DD/MM/YYYY hh:mm a')}`
    return
  }
  temp.value = moment(val).format('DD/MM/YYYY hh:mm a')
}

function updateDate(val: string) {
  debugger
  if (props.range && val.search(' - ') > 0) {
    const arrayDate = val.split(' - ')
    const start = arrayDate[0].split('/').reverse().join('-')
    const end = arrayDate[1].split('/').reverse().join('-')
    date.value = [new Date(start), end ? new Date(end) : null]
  }
  else if (val) {
    date.value = new Date(val.split('/').reverse().join('-'))
  }
}
watch(() => props.modalValue, (val: any) => {
  date.value = val
}, { immediate: true })
watch(date, (val: any) => {
  updateInput(val, false)
})

// watch(() => props.fromDate, val => {
//   date.value = [val, (date.value && date.value.length) ? date.value[1] : null]
// }, { immediate: true })
// watch(() => props.toDate, val => {
//   date.value = [date.value[0], val]
// }, { immediate: true })
watchEffect(() => {
  if (props.fromDate || props.toDate)
    date.value = [props.fromDate, props.toDate]
})
</script>

<template>
  <div class="cm-date-time-picker">
    <div class="mb-1 ">
      <label class="text-medium-sm color-dark"> {{ text }}</label>
    </div>
    <div style="position: relative;">
      <VueDatePicker
        ref="datepicker"
        :model-value="date"
        time-picker-inline
        v-bind="LABEL"
        locale="vi"
        text-input
        :multi-calendars-solo="multiCalendars"
        class="rounded-lg date-picker"
        :multi-calendars="multiCalendars"
        :time-picker="timePicker"
        :range="props.range"
        :placeholder="placeholder"
        @range-start="val => formatPreview(val, false)"
        @range-end="val => formatPreview(val, true)"
        @update:model-value="updateInput($event, true)"
        @cleared="() => { date = null }"
      >
        <template #calendar-header="{ index }">
          <div>
            {{ t(getDay(index)) }}
          </div>
        </template>

        <template
          v-if="!multiCalendars && !timePicker"
          #action-extra="item"
        >
          <div class="action-extra">
            <div
              v-if="time"
              class="w-100"
            >
              <div
                v-if="!props.range"
                class="time-preview v-btn outlined-secondary pa-2 rounded-lg w-100 mr-2"
              >
                {{ time }}
              </div>
              <div
                v-else
                class="d-flex justify-center align-center w-100"
              >
                <div
                  class="time-preview v-btn outlined-secondary pa-2 rounded-lg"
                >
                  {{ moment(time[0]).format('DD/MM/YYYY') }}
                </div>
                <span>
                  <VIcon
                    icon="fe:minus"
                    size="14"
                    class="mx-2"
                  />
                </span>
                <div

                  class="time-preview v-btn outlined-secondary pa-2 rounded-lg"
                >
                  {{ moment(time[1]).format('DD/MM/YYYY') }}
                </div>
              </div>
            </div>

            <span v-else>{{ t('please-select-day') }}</span>
            <CmButton
              v-if="!props.range"
              :title="t('today')"
              variant="outlined"
              color="secondary"
              @click="item.selectCurrentDate"
            />
          </div>
        </template>

        <template #action-preview="{ value }">
          {{ showPreview(value) }}
          <div
            v-if="props.multiCalendars"
            class="d-flex justify-center align-center w-100"
          >
            <div
              class="time-preview v-btn outlined-secondary pa-2 rounded-lg"
            >
              {{ moment(time[0]).format('DD/MM/YYYY') }}
            </div>
            <span>
              <VIcon
                icon="fe:minus"
                size="14"
                class="mx-2"
              />
            </span>
            <div

              class="time-preview v-btn outlined-secondary pa-2 rounded-lg"
            >
              {{ moment(time[1]).format('DD/MM/YYYY') }}
            </div>
          </div>
        </template>
      </VueDatePicker>

      <CmTextField
        class="input-date-time"
        :model-value="temp"
        @focused="show"
        @update:model-value="updateDate"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
:root {
  --dp-primary-color: rgb(var(--v-primary-600))
  --dp-border-radius: $border-radius-xs
}
.cm-date-time-picker {
  position: relative;
  .dp__main {
    height: 40px;
    .dp__input_icon_pad {
      height: 40px;
      border: 1px solid $color-gray-300;
      border-radius: $border-radius-xs;
    }
  }
  .input-date-time {
    position: absolute;
    top: 1px;
    right: 28px;
    width: calc(100% - 56px);
    height: inherit;
    .v-field__field {
      height: 36px;
    }
    .v-field__input {
        border: unset !important;
        border-radius: $border-radius-xs;
      }
      .v-field__outline {
        --v-field-border-width: 0
      }
  }
  .dp__menu_inner {
    width: auto;
    .dp__month_year_row{
      margin-bottom: v-bind(marginHeader);
    }
  }
.dp__calendar {
  width: 100%;
  display: v-bind(displayCalendar);
  .dp__calendar_item {
    width: 40px;
    height: 40px;
    .dp__cell_inner {
      border-radius: 20px;
      width: 100%;
      height: 100%;
      &.dp__range_start {
        border-radius: 20px;
      }
    }
    .date-picker {
      position: absolute;
    }
    .dp__range_start, .dp__range_end{
      color: $color-white;
      background-color: $color-primary-600 !important;
    }
    .dp__range_between {
      background-color: $color-primary-50 !important;
      border: 1px solid $color-primary-50;
      color: $color-primary-600;
    }
  }
    .dp__calendar_item:has(> .dp__range_start) {
      background-color: $color-primary-50 !important;
      border-bottom-left-radius: 20px;
      border-top-left-radius: 20px;
    }
    .dp__calendar_item:has(> .dp__range_end) {
      background-color: $color-primary-50 !important;
      border-bottom-right-radius: 20px;
      border-top-right-radius: 20px;
    }
    .dp__calendar_item:has(> .dp__range_between) {
      background-color: $color-primary-50 !important;
      border: 1px solid $color-primary-50;
      color: $color-primary-600;
      border-radius: 0;
    }
    .dp__calendar_item:has(> .dp__range_between):last-child {
      border-bottom-right-radius: 20px;
      border-top-right-radius: 20px;
    }
    .dp__calendar_item:has(> .dp__range_between):first-child {
      border-bottom-left-radius: 20px;
      border-top-left-radius: 20px;
    }
    .dp__calendar_item:has(> .dp__date_hover_end):hover {
      background-color: $color-primary-50 !important;
      border-bottom-right-radius: 20px;
      border-top-right-radius: 20px;
    }
    .dp__calendar_item:has(> .dp__date_hover_start):hover {
      background-color: $color-primary-50 !important;
      border-bottom-left-radius: 20px;
      border-top-left-radius: 20px;
    }

  }
  .dp__overlay {
    height: 160px;
    bottom: 0;
    top: unset;
    .dp__time_input {
      width: 50% !important;
      padding: 0;
      .dp__time_col {
        padding: 0;
      }
      .dp__button {
        display: none;
      }
    }
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
    border-top: 1px solid $color-gray-300;
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
  .dp__time_picker_inline_container {
  // .dp__time_input:first-child {
  //   border-right: 1px solid $color-gray-300;
  // }
    .dp__flex {
      width: 100%;
    }
    .dp__tp_inline_btn_top {
      display: flex;
      margin-bottom: 6px;
    .dp__tp_inline_btn_bottom:hover .dp__tp_btn_in_l {
      transform: rotate(-12deg) scale(1.15) translateY(0);
    }
    .dp__tp_inline_btn_bottom:hover .dp__tp_btn_in_r {
      transform: rotate(12deg) scale(1.15) translateY(0);
    }
    .dp__tp_btn_in_l {
      // transform: rotate(-12deg) scale(1.15) translateY(0);
      border-top-left-radius: $border-radius-xs;
      border-bottom-left-radius: $border-radius-xs;
    }
    .dp__tp_btn_in_r {
      // transform: rotate(12deg) scale(1.15) translateY(0);
      border-top-right-radius: $border-radius-xs;
      border-bottom-right-radius: $border-radius-xs;
    }
  }
  .dp__tp_inline_btn_bottom {
    display: flex;
    margin-top: 5px;
    .dp__tp_btn_in_l {
      // transform: rotate(12deg) scale(1.15) translateY(-2px);
      border-top-left-radius: $border-radius-xs;
      border-bottom-left-radius: $border-radius-xs;
    }
    .dp__tp_btn_in_r {
      // transform: rotate(-12deg) scale(1.15) translateY(-2px);
      border-top-right-radius: $border-radius-xs;
      border-bottom-right-radius: $border-radius-xs;
    }
  }
  .dp__time_col_reg_inline {
    padding: 5px;
  }
  .dp__inc_dec_button_inline {
    display: flex;
    justify-content: center;
    width: 16px  !important;
  }
  .dp__inc_dec_button_inline:focus {
    outline:none;
  }
  .dp__tp_inline_btn_bar {
    width: 10px;
    height: 3px !important;
  }
  .dp__time_display {
    border: 1px solid $color-gray-300;
    padding: 8px 10px;
  }

}
  .dp__action_extra {
    width: 100%;
    position: absolute;
    top: 39px;
    .action-extra {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
    }
    .time-preview {
      width: 128px;
      height: 40px;
    }
  }
}
</style>
