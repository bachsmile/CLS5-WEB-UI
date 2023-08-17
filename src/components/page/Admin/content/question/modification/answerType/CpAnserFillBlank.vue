<script setup lang="ts">
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
const inputMedia = ref()
const listMenu = ref([
  {
    title: 'shuffled-question',
    icon: 'tabler:arrows-cross',
    actived: false,
  },
])
function changeValue(val: any) {
  answerData.value.isTrue = val === props.ansId
  emit('update:isTrue', val)
}
function eventToolShuffle(val: any) {
  listMenu.value[0].actived = !listMenu.value[0].actived
  emit('update:isShuffle', listMenu.value[0].actived)
}
function handleChangeContent(val: any) {
  emit('update:content', val)
}
const typeFile = ref()
const isShowFile = ref(false)
const getIndex = computed(() => `${String.fromCharCode(65 + props.data.position - 1)}.`)
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
function actionItemDelete() {
  emit('delete', props.data)
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
        cols="10"
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
            :disabled="isView"
            :list-menu="listMenu"
            rlt="end"
            is-menu-simple
            min-height="50px"
            :placeholder="placeholder"
            class="w-100"
            :model-value="content"
            @update:event="eventToolShuffle"
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
