<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { Calendar, CalendarOptions } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import vi from '@fullcalendar/core/locales/vi'
import en from '@fullcalendar/core/locales/en-au'
import CmButton from './CmButton.vue'

// import $ from 'jquery'
import type { Any } from '@/typescript/interface'

interface Props {
  options: CalendarOptions
}
const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
})
const handleDateClick = function (arg: any) {
  alert(`date click! ${arg.dateStr}`)
}
const isRenderSideBar = ref<boolean>(false)
const calendarOptions = ref<CalendarOptions>({
  locales: [vi, en],
  initialView: 'dayGridMonth',
  dateClick: handleDateClick,
  locale: 'vi',
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
  themeSystem: 'litera',
  eventClassNames(arg) {
    const calendarsColor: Any = {
      LAN_EventCourse: 'error',
      LAN_EventExam: 'success',
      LAN_EventTrainingRoute: 'warning',
      LAN_EventOther: 'info',
    }
    const colorName = calendarsColor[arg.event.extendedProps.type]
    return [
      `bg-cm-calendar-light-${colorName}`,
    ]
  },
  customButtons: {
    sidebarToggle: {
      text: '',
      icon: 'list-task',
      click: () => {
        isRenderSideBar.value = !isRenderSideBar.value
      },
    },
  },
  headerToolbar: {
    start: 'sidebarToggle prev,next title',
    end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
  },
  editable: true,
  dragScroll: true,
  navLinks: true,
  rerenderDelay: 100,
})
watch(() => props.options, (val: CalendarOptions) => {
  calendarOptions.value = {
    ...calendarOptions.value,
    ...val,
  }
}, { immediate: true })
const fullCalendar = ref<Calendar | null>()
defineExpose({
  fullCalendar,
})
</script>

<template>
  <div class="cm-calender">
    <CmButton
      icon="fe:bar"
      :size-icon="24"
      variant="text"
      color="secondary"
      class-name="sidebarToggle"
    />

    <FullCalendar
      ref="fullCalendar"
      class="content-calendar"
      :options="calendarOptions"
    />
  </div>
</template>

<style lang="scss">
@use '@/styles/style-global.scss' as *;

.cm-calender {
  position: relative;
  border-top-right-radius: $border-radius-xs;
  .content-calendar {
    tbody {
      tr {
        td:first-child {
          border-bottom-right-radius: $border-radius-xs;
        }
      }

      border-bottom-right-radius: $border-radius-xs;
    }
    .fc-toolbar-title {
      margin-left: 0 !important;
    }
    .fc-header-toolbar {
      height: 5rem;
      margin-bottom: 0 !important;
      border: .0625rem solid $color-gray-300;
      border-top-right-radius: $border-radius-xs;
      .fc-toolbar-chunk {
        display: flex;
        justify-content: center;
        align-items: center;
        .fc-button-group {
          .fc-prev-button,.fc-next-button {
            background: transparent;
            border: unset !important;
            color: $color-gray-700;
          }
          [class^=fc-timeGrid] {
            border: $color-primary-600;
          }
          .fc-button {
            background: transparent;
            border: unset;
            // border-right: .0625rem solid $color-primary-400;
            border: .0625rem solid $color-primary-400;
          }
          .fc-button:first-child {
            border-top-left-radius: $border-radius-xs;
            border-bottom-left-radius: $border-radius-xs;
          }
          .fc-button:last-child {
            border-top-right-radius: $border-radius-xs;
            border-bottom-right-radius: $border-radius-xs;
          }
          .fc-button:first-child {

          }
          .fc-button-active {
            background-color: rgba(var(--v-primary-600), 0.0833333);
          }
        }
        .fc-button-group:last-child {
          margin-right: $xl;
        }
        .fc-toolbar-title {
          @extend .text-medium-xl
        }
        .fc-sidebarToggle-button {
          display: none;
          background: transparent;
          border: unset;
        }
      }
      .fc-icon {
        align-items: center;
        font-size: 1.5em;
        vertical-align: middle;
        display: flex;
      }
    }
  }
  .sidebarToggle {
    position: absolute;
    top: 1.125rem;
    display: none;
  }

  .fc-daygrid-event-harness {

  }
  .fc-event-main {
    @extend .text-medium-xs;
    color: inherit;
  }
  .bg-cm-calendar-light-error {
    background-color: rgba(var(--v-error-600), 0.0833333) !important;
    // background-color: rgb(var(--v-error-50)) !important;
    color: rgb(var(--v-error-600)) !important;
    border: unset;
  }
  .bg-cm-calendar-light-success {
    background-color: rgba(var(--v-success-600), 0.0833333) !important;
    color: rgb(var(--v-success-600)) !important;
    border: unset;
  }
  .bg-cm-calendar-light-secondary {
    background-color: rgba(var(--v-gray-600), 0.0833333) !important;
    color: rgb(var(--v-gray-600)) !important;
    border: unset;
  }
  .bg-cm-calendar-light-primary {
    background-color: rgba(var(--v-primary-600), 0.0833333) !important;
    color: rgb(var(--v-primary-600)) !important;
    border: unset;
  }
  .bg-cm-calendar-light-info {
    background-color: rgba(var(--v-info-600), 0.0833333) !important;
    color: rgb(var(--v-info-600)) !important;
    border: unset;
  }
  .bg-cm-calendar-light-warning {
    background-color: rgba(var(--v-warning-600), 0.0833333) !important;
    color: rgb(var(--v-warning-600)) !important;
    border: unset;
  }
  .bg-cm-calendar-light-info {
    background-color: rgba(var(--v-info-600), 0.0833333) !important;
    color: rgb(var(--v-info-600)) !important;
    border: unset;
  }
  .fc-col-header-cell-cushion {
    @extend .text-semibold-sm;
    color: $color-gray-700
  }
  .fc-daygrid-day-number {
    @extend .text-regular-md
  }
  .fc-day-today {
    background-color: $color-primary-50 !important;
  }
}
:root {
  --fc-small-font-size: .85em;
  --fc-page-bg-color: #fff;
  --fc-neutral-bg-color: hsla(0,0%,82%,.3);
  --fc-neutral-text-color: grey;
  --fc-border-color: rgb(var(--v-gray-300));
  --fc-button-text-color: rgb(var(--v-primary-600)) !important;
  --fc-button-bg-color: #2c3e50;
  --fc-button-border-color: #2c3e50;
  --fc-button-hover-bg-color: red;
  --fc-button-hover-border-color: #1a252f;
  --fc-button-active-bg-color: #1a252f;
  --fc-button-active-border-color: #151e27;
  --fc-event-bg-color: rgb(var(--v-primary-600));
  --fc-event-border-color: #3788d8;
  --fc-event-text-color: #fff;
  --fc-event-selected-overlay-color: rgba(0,0,0,.25);
  --fc-more-link-bg-color: #d0d0d0;
  --fc-more-link-text-color: inherit;
  --fc-event-resizer-thickness: .5rem;
  --fc-event-resizer-dot-total-width: .5rem;
  --fc-event-resizer-dot-border-width: .0625rem;
  --fc-non-business-color: hsla(0,0%,84%,.3);
  --fc-bg-event-color: #8fdf82;
  --fc-bg-event-opacity: 0.3;
  --fc-highlight-color: rgba(188,232,241,.3);
  --fc-today-bg-color: rgba(255,220,40,.15);
  --fc-now-indicator-color: red;
}
</style>
