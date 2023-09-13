<script setup lang="ts">
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import { validatorStore } from '@/stores/validatator'

interface Props {
  data: any
  ansId: any
  content: any
  isView: boolean
  disabledDel?: boolean
  placeholder?: string
}
const props = withDefaults(defineProps<Props>(), ({
  isView: false,
  disabledDel: false,
  data: () => ({
    content: '',
    position: 0,
    urlFile: null,
  }),

}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:content', value: any): void
  (e: 'update:url', value: any): void
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
const inputMedia = ref()

function handleChangeContent(val: any) {
  emit('update:content', val)
}
const typeFile = ref()
const isShowFile = ref(false)
const getIndex = computed(() => props.data.position)
function hanleUploadFileContent(val: any) {
  switch (val[0]?.type) {
    case 'image':
      typeFile.value = 1
      nextTick(() => inputMedia.value?.openImage())
      break
    case 'audio':
      typeFile.value = 2
      nextTick(() => inputMedia.value?.openAudio())
      break
    case 'video-local':
      typeFile.value = 3

      nextTick(() => inputMedia.value?.openVideo())
      break
    case 'video-youtube':
      typeFile.value = 4
      nextTick(() => inputMedia.value?.openYoutube())
      break
    case 'delete':
      typeFile.value = null

      emit('delete', props.data)
      break

    default:
      break
  }
}
function handleUpadateUrlFile(val: any) {
  emit('update:url', val)
}

const myFormAnsItem = ref()
const isSubmit = computed(() => {
  return myFormAnsItem.value.validate
})
function deleteFile(dataDelete: any) {
  emit('update:url', '')
}

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
        cols="1"
        class="d-flex align-center justify-end"
      >
        <div class="px-3">
          {{ getIndex }}
        </div>
      </VCol>
      <VCol
        cols="11"
        class="mln-4"
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
            :disabled="isView"
            rlt="end"
            is-menu-simple
            min-height="44px"
            :placeholder="placeholder"
            width="100%"
            :model-value="content"
            @update:modelValue="handleChangeContent"
          />
        </Field>
      </VCol>
    </vrow>
  </Form>
</template>
