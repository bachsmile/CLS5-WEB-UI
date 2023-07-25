<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusTypeCourse } from '@/constant/data/status.json'
import StringUtil from '@/utils/StringUtil'

const props = withDefaults(defineProps<Props>(), {
  returnObject: false,
  isStartTime: false,
  isEndTime: false,
  isShowContentReq: false,
})
const emit = defineEmits<Emit>()
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface Props {
  headers?: any[]
  items?: Any[]
  returnObject?: boolean
  isStartTime?: boolean
  isEndTime?: boolean
  isShowContentReq?: boolean
  selected?: any[]
  dateTimeStart?: any
  dateTimeEnd?: any
}

/** store */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm } = storeValidate
const { submitForm } = useForm()

/** state */
const schema = computed(() => ({
  ...(props.isStartTime ? { isStartTime: schemaOption.defaultString } : {}),
  ...(props.isEndTime ? { isEndTime: schemaOption.defaultString } : {}),
}))
interface Emit {
  (e: 'update:isStartTime', status: boolean): void
  (e: 'update:isEndTime', status: boolean): void
  (e: 'update:dateTimeStart', data: any): void
  (e: 'update:dateTimeEnd', data: any): void
  (e: 'update:selected', data: any): void
}
const LABEL = Object.freeze({
  TITLE1: t('setting-time'),
  LABEL1: 'Thời gian bắt đầu',
  LABEL2: 'Thời gian kết thúc',
})

function updateModel(val: any, text: any) {
  emit(text, val)
}

function selectedRows(val: Any) {
  emit('update:selected', val)
}
const FormCondition = ref()
const dateTimeStartData = ref<any>(null)
const dateTimeEndData = ref<any>(null)
watchEffect(() => {
  dateTimeStartData.value = props.dateTimeStart
  dateTimeEndData.value = props.dateTimeEnd
})
const isIntersecting = ref<boolean>(false)
function onIntersect(val: boolean) {
  isIntersecting.value = val
}

defineExpose({
  FormCondition,
  isIntersecting,
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="FormCondition"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <div class="text-semibold-md color-text-900 mb-4">
        {{ t('setting-time') }}
      </div>
      <VRow
        v-intersect="onIntersect"
      >
        <VCol
          cols="12"
        >
          <div class="d-flex align-start flex-wrap">
            <CmCheckBox
              :model-value="isStartTime"
              :label="LABEL.LABEL1"
              @update:model-value="emit('update:isStartTime', $event)"
            />

            <div class="w-100 d-flex flex-column ml-7">
              <Field
                v-slot="{ field, errors }"
                v-model:model-value="dateTimeStartData"
                name="isStartTime"
              >
                <div v-if="isStartTime">
                  <VRow>
                    <VCol
                      lg="4"
                      cols="12"
                    >
                      <div class="mr-3">
                        <div class="mr-3 ">
                          <CmDateTimePicker
                            :model-value="dateTimeStartData"
                            class="w-100"
                            :field="field"
                            :errors="errors"
                            :text="`${t(LABEL.LABEL1)}*`"
                            :placeholder="t(LABEL.LABEL1)"
                            @update:model-value="emit('update:dateTimeStart', $event)"
                          />
                        </div>
                      </div>
                    </VCol>
                  </VRow>
                </div>
              </Field>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        v-intersect="onIntersect"
      >
        <VCol
          cols="12"
          class="mb-6"
        >
          <div class="d-flex align-start flex-wrap">
            <CmCheckBox
              :model-value="isEndTime"
              :label="LABEL.LABEL2"
              @update:model-value="emit('update:isEndTime', $event)"
            />

            <div class="w-100 d-flex flex-column ml-7">
              <div v-if="isEndTime">
                <VRow>
                  <VCol
                    lg="4"
                    cols="12"
                  >
                    <Field
                      v-slot="{ field, errors }"
                      v-model:model-value="dateTimeEndData"
                      name="isEndTime"
                    >
                      <div class="mr-3">
                        <div class="mr-3 ">
                          <CmDateTimePicker
                            :model-value="dateTimeEndData"
                            class="w-100"
                            :field="field"
                            :errors="errors"
                            :text="`${t(LABEL.LABEL2)}*`"
                            :placeholder="t(LABEL.LABEL2)"
                            @update:model-value="emit('update:dateTimeEnd', $event)"
                          />
                        </div>
                      </div>
                    </Field>
                  </VCol>
                </VRow>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
      <div
        v-if="isShowContentReq"
        class="mb-6"
      >
        <div class="text-medium-lg mb-6">
          {{ t('list-content-req') }}
        </div>
        <CmTable
          is-local-table
          is-update-row-force
          :selected="selected"
          :headers="headers"
          :items="items"
          custom-id="courseContentId"
          :return-object="returnObject"
          @update:selected="selectedRows"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'statusName'">
              <CmChip
                class="ma-2"
                :color="MethodsUtil.checkStatus(context.statusId, StatusTypeCourse)?.color"
              >
                <VIcon
                  start
                  icon="carbon:dot-mark"
                  size="12"
                />
                <span>{{ t(context.statusName) }}</span>
              </CmChip>
            </div>
            <div v-if="col === 'author'">
              {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
            </div>
          </template>
        </CmTable>
      </div>
    </Form>
  </div>
</template>
