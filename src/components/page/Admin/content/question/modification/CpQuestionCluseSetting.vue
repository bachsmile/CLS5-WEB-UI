<script setup lang="ts">
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpListTypeFileUpload from '@/components/page/gereral/CpListTypeFileUpload.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), ({
  content: '',
  urlFile: '',
  isEdit: false,
  isView: false,
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:urlFile', value: any): void
  (e: 'update:content', value: any): void
}
const { t } = window.i18n()
interface Props {
  isEdit: boolean
  content: string
  urlFile: string
  isView: boolean
}

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  content: schemaOption.defaultStringArea,
})
const urlFileCluse = ref<any>(props.urlFile)
const contentCluse = ref<any>(props.content)
const typeFile = ref()
function deleteFile(dataDelete: any) {
  urlFileCluse.value = ''
  typeFile.value = null
}

const inputMedia = ref()
const typeFileClick = ref()
function hanleUploadFileContent(val: any) {
  switch (val[0]?.type) {
    case 'image':
      typeFileClick.value = 1
      nextTick(() => {
        inputMedia.value?.openImage()
      },
      )
      break
    case 'audio':
      typeFileClick.value = 2
      nextTick(() => inputMedia.value?.openAudio())
      break
    case 'video-local':
      typeFileClick.value = 3

      nextTick(() => inputMedia.value?.openVideo())
      break
    case 'video-youtube':
      typeFileClick.value = 4
      nextTick(() => inputMedia.value?.openYoutube())
      break

    default:
      break
  }
}

function handleUpadateUrlFile(val: any) {
  urlFileCluse.value = val
  typeFile.value = typeFileClick.value
  emit('update:urlFile', val)
}
const myFormCluse = ref()
const isSubmit = computed(() => {
  return myFormCluse.value.validate
})

watch(contentCluse, (val: any) => {
  emit('update:content', val)
})
watch(() => props.content, (val: any) => {
  contentCluse.value = val
})
defineExpose({
  isSubmit,
})
</script>

<template>
  <div>
    <div class="mb-2 text-medium-sm">
      {{ t('question-content') }} *
    </div>
    <VRow>
      <VCol
        cols="12"
      >
        <Form
          ref="myFormCluse"
          :validation-schema="schema"
          @submit.prevent="submitForm"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="contentCluse"
            name="content"
            type="string"
          >
            <CmInputEditor
              v-model="contentCluse"
              :field="field"
              :errors="errors"
              :disabled="isView"
            />
          </Field>
        </Form>
        <CpListTypeFileUpload
          :type="1"
          :disabled="isView"
          class="mb-4"
          @upload="hanleUploadFileContent"
        />
        <CpMediaContent
          ref="inputMedia"
          :disabled="isView"
          class="w-100"
          :type="2"
          :src="urlFileCluse"
          :type-media="typeFile"
          @update:fileFolder="handleUpadateUrlFile"
          @deleteFile="deleteFile"
        />
      </VCol>
    </VRow>
  </div>
</template>
