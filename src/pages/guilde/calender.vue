<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventSourceInput } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import vi from '@fullcalendar/core/locales/vi'
import en from '@fullcalendar/core/locales/en-au'

// import $ from 'jquery'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

const handleDateClick = function (arg: any) {
  alert(`date click! ${arg.dateStr}`)
}
const isRenderSideBar = ref<boolean>(false)
const calendarOptions = reactive<CalendarOptions>({
  locales: [vi, en],

  // plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  dateClick: handleDateClick,
  events: fetchEvents as EventSourceInput,
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
      text: 'sidebar',
      click: () => {
        isRenderSideBar.value = !isRenderSideBar.value
      },
    },
  },
  headerToolbar: {
    start: 'sidebarToggle, prev,next, title',
    end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
  },
  editable: true,
  dragScroll: true,
  navLinks: true,
  rerenderDelay: 100,

  // dateClick: handleDateClick,
  // eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize,
  eventMouseEnter: handleEventHover,
})
const eventType = ['LAN_EventCourse', 'LAN_EventExam', 'LAN_EventTrainingRoute', 'LAN_EventOther']
async function fetchEvents(fetchInfo: Any, successCallback: any, failureCallback: void) {
  const params = {
    startTime: fetchInfo.startStr.slice(0, 19),
    endTime: fetchInfo.endStr.slice(0, 19),
  }
  const { data } = await MethodsUtil.requestApiCustom('/event/get-list-event', TYPE_REQUEST.GET, params)
  const events = data.map((item: Any) => {
    return {
      title: item.eventName,
      start: item.startDate,
      end: item.endDate,
      extendedProps: {
        type: item.typeName,
        id: item.eventId,
        description: item.eventDescription,
      },
    }
  })
  const result = events.filter((item: Any) => eventType.includes(item.extendedProps.type))
  successCallback(result)
}

function handleEventResize() {
  //
}
function handleEventHover(event: any) {

  // $(event.el).tooltip({
  //   title: event.event.title,
  //   placement: 'top',
  //   trigger: 'hover focus',
  //   container: '#calendarAdmin',
  // })
}

async function handleEventDrop({ event: droppedEvent }: {
  event: any
}) {

  // const event = {
  //   id: droppedEvent.extendedProps.id,
  //   name: droppedEvent.title,
  //   description: droppedEvent.extendedProps.description,
  //   startDate: droppedEvent.startStr.slice(0, 19),
  //   endDate: droppedEvent.endStr.slice(0, 19),
  // }
  // const eventTypeObj = comboboxEventType.find(item => item.value === droppedEvent.extendedProps.type)
  // if (eventTypeObj)
  //   event.typeId = eventTypeObj.key

  // const { data } = await MethodsUtil.requestApiCustom
  // const calendar = this.$refs.refCalendar.getApi()
  // calendar.refetchEvents()
}
</script>

<template>
  <div class="cm-calender">
    <FullCalendar
      :options="calendarOptions"
    />
  </div>
</template>

<style lang="scss">
@use '@/styles/style-global.scss' as *;

.cm-calender {
  :root {
  --fc-small-font-size: .85em;
  --fc-page-bg-color: #fff;
  --fc-neutral-bg-color: hsla(0,0%,82%,.3);
  --fc-neutral-text-color: grey;
  --fc-border-color: #ddd;
  --fc-button-text-color: #fff;
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
  --fc-event-resizer-thickness: 8px;
  --fc-event-resizer-dot-total-width: 8px;
  --fc-event-resizer-dot-border-width: 1px;
  --fc-non-business-color: hsla(0,0%,84%,.3);
  --fc-bg-event-color: #8fdf82;
  --fc-bg-event-opacity: 0.3;
  --fc-highlight-color: rgba(188,232,241,.3);
  --fc-today-bg-color: rgba(255,220,40,.15);
  --fc-now-indicator-color: red;
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
}
</style>
