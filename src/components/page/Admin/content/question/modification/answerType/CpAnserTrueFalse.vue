<script setup lang="ts">
import CmRadio from '@/components/common/CmRadio.vue'
import { validatorStore } from '@/stores/validatator'

interface Props {
  data: any
  ansId: any
  isTrue: any
  isView: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  isTrue: true,
  isShuffle: false,
  isView: false,
  data: () => ({
    content: '',
    isTrue: false,
    position: null,
    isShuffle: true,
    urlFile: null,
  }),

}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:isTrue', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  content: schemaOption.defaultStringArea,
})
const answerData = ref(props.data)
function changeValue(val: any) {
  answerData.value.isTrue = val === answerData.value.position
  emit('update:isTrue', val)
}

const myFormAnsItem = ref()
const isSubmit = computed(() => {
  return myFormAnsItem.value.validate
})
defineExpose({
  isSubmit,
})
</script>

<template>
  <Form
    ref="myFormAnsItem"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VRow>
      <VCol
        cols="12"
        class="d-flex align-center "
      >
        <CmRadio
          :model-value="isTrue ? data.position : null"
          :disabled="isView"
          name="true-false"
          :value="ansId"
          @update:model-value="changeValue"
        />
        <div class="px-3">
          {{ ansId === 1 ? t('true') : t('false') }}
        </div>
      </VCol>
    </VRow>
  </Form>
</template>
