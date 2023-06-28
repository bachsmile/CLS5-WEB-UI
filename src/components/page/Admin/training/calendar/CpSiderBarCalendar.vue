<script lang="ts" setup>
import CmButton from '@/components/common/CmButton.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'

interface Props {
  eventType: string[]
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
const TITLE = Object.freeze({
  BUTTON_ADD: t('add-new-event'),
  TITLE_FILTER: t('filter'),
  FILTER_SEE_ALL: t('see-all'),
  FILTER_COURSE: 'LAN_EventCourse',
  FILTER_EXAM: 'LAN_EventExam',
  FILTER_TRAINING_PATH: 'LAN_EventTrainingRoute',
  FILTER_OTHER: 'LAN_EventOther',
})
interface Emit {
  (e: 'click-button-add'): void
  (e: 'update:eventType', data: string[]): void
}
const values = ref<string[]>([])
watch(() => props.eventType, val => {
  values.value = val
}, { immediate: true })
const calendarOptions = [
  {
    color: 'error',
    label: TITLE.FILTER_COURSE,
  },
  {
    color: 'success',
    label: TITLE.FILTER_EXAM,
  },
  {
    color: 'warning',
    label: TITLE.FILTER_TRAINING_PATH,
  },
  {
    color: 'info',
    label: TITLE.FILTER_OTHER,
  },
]
const seeAll = window._.cloneDeep(props.eventType)

function onChangeValue() {
  emit('update:eventType', values.value)
}
function filterCalendar() {
  if (seeAll.length === values.value.length)
    values.value = seeAll

  emit('update:eventType', values.value)
}
</script>

<template>
  <div class="sidebar-calendar">
    <div>
      <CmButton
        class-name="w-100"
        :title="TITLE.BUTTON_ADD"
        @click="emit('click-button-add')"
      />
    </div>
    <div class="sidebar-filter">
      <span class="text-medium-sm"> {{ TITLE.TITLE_FILTER }}</span>
      <CmCheckBox
        v-model="values"
        color="primary"
        :label="TITLE.FILTER_SEE_ALL"
        :multiple="false"
        :true-value="seeAll"
        :false-value="[]"
        @update:model-value="onChangeValue"
      />
      <CmCheckBox
        v-for="item in calendarOptions"
        :key="item.label"
        v-model="values"
        :multiple="true"
        :value="item.label"
        :color="item.color"
        :label="t(item.label)"
        @update:model-value="filterCalendar"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.sidebar-calendar {
  // background-color: yellow;
  display: flex;
  flex-direction: column;
  padding: $xl;
  border: 1px solid rgb(var(--v-gray-300))!important;
  border-bottom-left-radius: $border-radius-xs !important;
  border-top-left-radius: $border-radius-xs !important;
  border-right: unset;
  .sidebar-filter {
    margin-top: $xl-3;
    .text-medium-sm {
      @extend .text-medium-sm;
      text-transform: uppercase;
    }
  }
}
</style>
