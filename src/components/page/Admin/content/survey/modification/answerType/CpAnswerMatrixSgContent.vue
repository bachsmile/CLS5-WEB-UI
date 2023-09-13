<script setup lang="ts">
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import { validatorStore } from '@/stores/validatator'
import CmButton from '@/components/common/CmButton.vue'

interface Props {
  data: any
  ansId: any
  name: any
  isView: boolean
  disabledDel?: boolean
  placeholder?: string
}
const props = withDefaults(defineProps<Props>(), ({
  isView: false,
  disabledDel: false,
  data: () => ({
    name: '',
    position: 0,
    urlFile: null,
  }),

}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:name', value: any): void
  (e: 'update:url', value: any): void
  (e: 'delete', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  name: schemaOption.defaultStringArea,
})
const answerData = ref()
const inputMedia = ref()

function handleChangeContent(val: any) {
  emit('update:name', val)
}
const typeFile = ref()
const isShowFile = ref(false)
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
watch(() => props.name, (val: any) => {
  answerData.value.name = val
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
    <VRow class="ansContentMatrix">
      <VCol
        cols="11"
      >
        <Field
          v-slot="{ field, errors }"
          :model-value="name"
          name="name"
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
            :model-value="name"
            @update:modelValue="handleChangeContent"
          />
        </Field>
      </VCol>
      <VCol
        cols="1"
        class="d-flex action-item mxn-2"
      >
        <CmButton
          :disabled="disabledDel"
          color="infor"
          icon="tabler:trash"
          variant="text"
          :size-icon="20"
          @click="emit('delete', data)"
        />
      </VCol>
    </VRow>
  </Form>
</template>

<style lang="scss" scoped>
.ansContentMatrix{
  .action-item{
    // padding-top: 22px !important;
  }
}
</style>
