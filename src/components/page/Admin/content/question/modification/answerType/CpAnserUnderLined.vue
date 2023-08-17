<script setup lang="ts">
import CmRadio from '@/components/common/CmRadio.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import { validatorStore } from '@/stores/validatator'
import CmButton from '@/components/common/CmButton.vue'

interface Props {
  data: any
  ansId: any
  isTrue: any
  content: any
  isView: boolean
  disabledDel?: boolean
  placeholder?: string
}
const props = withDefaults(defineProps<Props>(), ({
  isTrue: null,
  isShuffle: false,
  isView: false,
  disabledDel: false,
  data: () => ({
    content: '',
    isTrue: false,
    position: 0,
    isShuffle: true,
    urlFile: null,
  }),

}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:isTrue', value: any): void
  (e: 'update:content', value: any): void
  (e: 'update:url', value: any): void
  (e: 'update:isShuffle', value: any): void
  (e: 'delete', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  content: schemaOption.defaultStringArea,
})
const answerData = ref()
function changeValue(val: any) {
  answerData.value.isTrue = val === props.ansId

  emit('update:isTrue', val)
}

function handleChangeContent(val: any) {
  emit('update:content', val)
}
const getIndex = computed(() => `${String.fromCharCode(65 + props.data.position - 1)}.`)
function actionItemDelete() {
  emit('delete', props.data)
}
const myFormAnsItem = ref()
const isSubmit = computed(() => {
  return myFormAnsItem.value.validate
})

watch(() => props.data, (val: any) => {
  answerData.value = val
}, { deep: true, immediate: true })
watch(() => props.content, (val: any) => {
  answerData.value.content = val
}, { deep: true })
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
        cols="2"
        class="d-flex align-center justify-end"
      >
        <CmRadio
          :model-value="isTrue ? data.position : null"
          :disabled="isView"
          name="result"
          :value="ansId"
          @update:model-value="changeValue"
        />
        <div class="px-3">
          {{ getIndex }}
        </div>
      </VCol>
      <VCol
        cols="9"
        class="d-flex align-center"
      >
        <Field
          v-slot="{ field, errors }"
          :model-value="content"
          name="content"
          type="string"
        >
          <CmInputEditor
            :field="field"
            :errors="errors"
            :disabled="true"
            rlt="end"
            is-menu-simple
            min-height="50px"
            :placeholder="placeholder"
            class="w-100"
            :model-value="content"
            @update:modelValue="handleChangeContent"
          />
        </Field>
        <CmButton
          :disabled="disabledDel"
          color="infor"
          is-rounded
          icon="fe:trash"
          class="pa-2 ml-3"
          :size-icon="20"
          variant="text"
          @click="actionItemDelete"
        />
      </VCol>
    </VRow>
  </Form>
</template>
