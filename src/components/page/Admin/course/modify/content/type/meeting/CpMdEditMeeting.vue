<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import { validatorStore } from '@/stores/validatator'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import CmTextArea from '@/components/common/CmTextArea.vue'
import toast from '@/plugins/toast'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',
}))

// Khởi tạo

const emit = defineEmits<Emit>()
const route = useRoute()
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup, ruleMessage } = storeValidate
const { submitForm } = useForm()
const { t } = window.i18n()
interface Emit {
  (e: 'add', value: any, unload: any): void
  (e: 'edit', value: any, unload: any): void
  (e: 'update:isShow', value: any): void
}
interface Props {
  isShow: boolean
  title: string
  dataDetail: Any
}
function cancelModal() {
  emit('update:isShow', false)
}

const myForm = ref()
const schema = computed(() => ({
  name: schemaOption.defaultString,
  startTime: schemaOption.defaultString,
  endTime: schemaOption.defaultString,
  meetingTypeId: schemaOption.defaultString,
}))
interface DataInput {
  id?: number | null
  archiveTypeId: number | null
  courseId: number | null
  dateTimeEnd: any
  dateTimeStart: any
  description: string | null
  joinUrl: string
  meetingSettingTypeId: number | null
  meetingTypeId: number | null
  name: string
  ownerId: number | null
  startUrl: string
  time: number | null
  url: string
}

const dataInput = ref<DataInput>({
  archiveTypeId: 3,
  courseId: Number(route.params.id),
  dateTimeEnd: null,
  dateTimeStart: null,
  description: '',
  joinUrl: '',
  meetingSettingTypeId: 1,
  meetingTypeId: null,
  name: '',
  ownerId: null,
  startUrl: '',
  time: null,
  url: '',
})
watch(() => props.dataDetail, (val: DataInput) => {
  dataInput.value = val
})

function confirmModal(idx: number, unloadButton: any) {
  const now: any = new Date()
  if (dataInput.value.dateTimeStart - now < 0 && dataInput.value.courseId) {
    toast('ERROR', t('start-date-after-now'))
    unloadButton()
    return
  }
  dataInput.value.time = (dataInput.value.dateTimeEnd - dataInput.value.dateTimeStart) / 1000
  if (dataInput.value.time < 0) {
    toast('ERROR', t('notice-start-end-date'))
    unloadButton()
    return
  }
  if (dataInput.value.id)
    emit('edit', dataInput.value, unloadButton)
  else
    emit('add', dataInput.value, unloadButton)
}
function resetData() {
  dataInput.value = {
    archiveTypeId: 3,
    courseId: Number(route.params.id),
    dateTimeEnd: null,
    dateTimeStart: null,
    description: '',
    joinUrl: '',
    meetingSettingTypeId: 1,
    meetingTypeId: 1,
    name: '',
    ownerId: null,
    startUrl: '',
    time: null,
    url: '',
  }
}
const listType = [
  { key: 1, value: 'Google Meet' },
  { key: 2, value: 'Zoom' },
  { key: 3, value: 'MS Team' },
]
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    persistent
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
  >
    <Form
      ref="myForm"
      :validation-schema="schema"
      class="mt-3"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol cols="12">
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.name"
            name="name"
            type="text"
          >
            <CmTextField
              :model-value="dataInput.name"
              :field="field"
              :errors="errors"
              :text="`${t('meeting-name')}*`"
            />
          </Field>
        </VCol>
        <VCol
          lg="6"
          cols="12"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.dateTimeStart"
            name="startTime"
            type="text"
          >
            <CmDateTimePicker
              :model-value="dataInput.dateTimeStart"
              :field="field"
              :errors="errors"
              :text="`${t('start-time')}*`"
            />
          </Field>
        </VCol>
        <VCol
          lg="6"
          cols="12"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.dateTimeEnd"
            name="endTime"
            type="text"
          >
            <CmDateTimePicker
              :model-value="dataInput.dateTimeEnd"
              :field="field"
              :errors="errors"
              :text="`${t('end-time')}*`"
            />
          </Field>
        </VCol>
        <VCol
          lg="6"
          cols="12"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.meetingTypeId"
            name="meetingTypeId"
            type="text"
          >
            <CmSelect
              :model-value="dataInput.meetingTypeId"
              :field="field"
              :items="listType"
              item-value="key"
              custom-key="value"
              append-to-body
              :errors="errors"
              :text="`${t('meeting-type')}*`"
            />
          </Field>
        </VCol>
        <VCol
          lg="6"
          cols="12"
        >
          <CmSelect
            v-model="dataInput.ownerId"
            :items="listType"
            item-value="key"
            custom-key="value"
            append-to-body
            :text="`${t('teacher')}`"
          />
        </VCol>
        <VCol cols="12">
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.url"
            name="URL"
            type="text"
          >
            <CmTextField
              :model-value="dataInput.url"
              :field="field"
              :errors="errors"
              :text="`${t('URL')}*`"
            />
          </Field>
        </VCol>
        <VCol cols="12">
          <CmTextArea
            :model-value="dataInput.url"
            :text="`${t('description')}`"
          />
        </VCol>
      </VRow>
    </Form>
  </CmDialogs>
</template>
