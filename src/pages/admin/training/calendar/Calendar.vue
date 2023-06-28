<script lang="ts" setup>
import CpSiderBarCalendar from '@/components/page/Admin/training/calendar/CpSiderBarCalendar.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import UserService from '@/api/user'
import type { Any } from '@/typescript/interface'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmCalendar from '@/components/common/CmCalendar.vue'

const router = useRouter()
function addEvent() {
  router.push({ name: 'manager-calendar-add', params: { tab: 'event-info' } })
}

const options = {
  // dateClick: handleDateClick,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,

  // eventResize: handleEventResize,
  // eventMouseEnter: handleEventHover,
  events: fetchEvents,
}
const eventType = ref<string[]>([
  'LAN_EventCourse', 'LAN_EventExam', 'LAN_EventTrainingRoute', 'LAN_EventOther',
])
async function fetchEvents(fetchInfo: any, successCallback: any) {
  const params = {
    startTime: fetchInfo.startStr.slice(0, 19),
    endTime: fetchInfo.endStr.slice(0, 19),
  }
  const { data } = await MethodsUtil.requestApiCustom(UserService.GetDataCalender, TYPE_REQUEST.GET, params)
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
  const result = events.filter((item: Any) => eventType.value.includes(item.extendedProps.type))
  successCallback(result)
}
const calendar = ref()
function filterData() {
  const cal = calendar.value.fullCalendar.getApi()
  cal.refetchEvents()
}
const comboboxEventType = ref<Any[]>([])
async function getComboboxEventTypes() {
  const { data } = await MethodsUtil.requestApiCustom(UserService.GetEventTypeCombobox, TYPE_REQUEST.GET)
  comboboxEventType.value = data
}
getComboboxEventTypes()

async function handleEventDrop({ event: droppedEvent }: Any) {
  const event: Any = {
    id: droppedEvent.extendedProps.id,
    name: droppedEvent.title,
    description: droppedEvent.extendedProps.description,
    startDate: droppedEvent.startStr.slice(0, 19),
    endDate: droppedEvent.endStr.slice(0, 19),
  }
  const eventTypeObj = comboboxEventType.value.find(item => item.value === droppedEvent.extendedProps.type)
  if (eventTypeObj)
    event.typeId = eventTypeObj.key
  MethodsUtil.requestApiCustom(UserService.PostUpdateEventCalendar, TYPE_REQUEST.POST, event).then(() => {
    const cal = calendar.value.fullCalendar.getApi()
    cal.refetchEvents()
  })
}

function handleEventClick({ event: clickedEvent }: Any) {
  // if (checkPermission('TrainingScheduleManaging', 14)) {
  router.push({ name: 'manager-calendar-edit', params: { tab: 'event-info', id: clickedEvent.extendedProps.id } })

  // }
}
</script>

<template>
  <div class="admin-calendar d-flex">
    <div class="sidebar w-25">
      <CpSiderBarCalendar
        v-model:eventType="eventType"
        class="h-100"
        @click-button-add="addEvent"
        @update:event-type="filterData"
      />
    </div>
    <div class="content">
      <CmCalendar
        ref="calendar"
        :options="options"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
.admin-calendar {
  box-shadow: $box-shadow-md;
  border-radius: $border-radius-xs !important;
  .sidebar {
    height: auto;
  }
  .content {
    width: 100%;
  }
}
@media only screen and (max-width: 1200px) {
  .admin-calendar {
    position: relative;
    .sidebar {
      position: absolute;
    }
    .content {

    }
  }
}
</style>
