<script lang="ts" setup>
import CmTextField from '@/components/common/CmTextField.vue'
import CmtextArea from '@/components/common/CmtextArea.vue'
import { validatorStore } from '@/stores/validatator'
import CmButton from '@/components/common/CmButton.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import { comboboxStore } from '@/stores/combobox'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import UserService from '@/api/user'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'

const storeCombobox = comboboxStore()
const { getComboboxEventType } = storeCombobox
const { eventTypeCombobox } = storeToRefs(storeCombobox)

// validate
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = reactive({
  address: schemaOption.requiredString(),
  description: schemaOption.requiredString(),
  endDate: schemaOption.requiredString(),
  name: schemaOption.requiredString(),
  startDate: schemaOption.requiredString(),
  typeId: schemaOption.requiredString(),
})
const { t } = window.i18n()
const router = useRouter()
const route = useRoute()
interface DataInput {
  address: string | null
  description: string | null
  endDate: string | null
  name: string | null
  startDate: string | null
  typeId: number | null
  [key: string]: any
}
const dataInput = ref<DataInput>({
  address: null,
  description: null,
  endDate: null,
  name: '',
  startDate: null,
  typeId: null,
})
const formEdit = ref()

getComboboxEventType()

const color = computed(() => {
  const colorStatus: Any = {
    1: 'error',
    2: 'success',
    3: 'warning',
    4: 'info',
  }
  return (key: string | number) => colorStatus[key]
})

function cancel() {
  router.push({ name: 'manager-calendar' })
}

function confirm() {
  MethodsUtil.requestApiCustom(UserService.PostCreateEventCalendar, TYPE_REQUEST.POST, dataInput.value).then((res: Any) => {
    router.push({ name: 'manager-calendar-edit', params: { id: res?.data } })
    toast('SUCCESS', t('add-success'))
  }).catch((err: Any) => {
    toast('ERROR', t(err?.response?.data?.message) || t('server-error'))
  })
}

async function getDetailEvent() {
  const { data } = await MethodsUtil.requestApiCustom(UserService.GetDetailEvent, TYPE_REQUEST.GET, { eventCalendarId: route.params.id })
  dataInput.value = data
}
if (route.params.id)
  getDetailEvent()
</script>

<template>
  <Form
    ref="formEdit"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VRow>
      <VCol>
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.name"
          name="name"
          type="text"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            :model-value="dataInput.name"
            :text="`${t('event-name')}*`"
            :placeholder="t('event-name')"
          />
        </Field>
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.typeId"
          name="typeId"
          type="text"
        >
          <CmSelect
            :field="field"
            :errors="errors"
            :items="eventTypeCombobox"
            :model-value="dataInput.typeId"
            item-value="key"
            custom-key="text"
            :text="`${t('event-type')}*`"
            :placeholder="t('event-type')"
          >
            <template #option="{ data }">
              <div class="d-flex justify-between align-center w-100">
                <div
                  class="dot-select mr-2"
                  :style="`background-color: rgb(var(--v-${color(data.key)}-600));`"
                /> <div>{{ data.text }}</div>
              </div>
            </template>
          </CmSelect>
        </Field>
        <VRow>
          <VCol>
            <Field
              v-slot="{ field, errors }"
              v-model="dataInput.startDate"
              name="startDate"
              type="text"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :model-value="dataInput.startDate"
                :text="`${t('start-time')}*`"
                :placeholder="t('start-time')"
              />
            </Field>
          </VCol>
          <VCol>
            <Field
              v-slot="{ field, errors }"
              v-model="dataInput.endDate"
              name="endDate"
              type="text"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :model-value="dataInput.endDate"
                :text="`${t('end-time')}*`"
                :placeholder="t('end-time')"
              />
            </field>
          </VCol>
        </VRow>
      </VCol>
      <VCol>
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.address"
          name="address"
          type="text"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            :model-value="dataInput.address"
            :text="`${t('address')}*`"
            :placeholder="t('address')"
          />
        </Field>

        <CmtextArea
          v-model="dataInput.description"
          :text="t('description')"
        />
      </VCol>
    </VRow>
  </Form>

  <VRow class="justify-end">
    <VCol
      cols="2"
      class="d-flex justify-end"
    >
      <CmButton
        variant="outlined"
        color="secondary"
        :title="t('come-back')"
        @click="cancel"
      />
      <CmButton
        color="primary"
        class="ml-3"
        :title="t('save')"
        @click="confirm"
      />
    </VCol>
  </VRow>
</template>

<style lang="scss">
.dot-select {
  border-radius: 50%;
  width:8px;
  height: 8px;
  background-color: red;
}
</style>
