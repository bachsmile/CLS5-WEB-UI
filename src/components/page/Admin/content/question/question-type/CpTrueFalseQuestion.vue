<script setup lang="ts">
import CpAnserTrueFalse from '@/components/page/Admin/content/question/modification/answerType/CpAnserTrueFalse.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpListTypeFileUpload from '@/components/page/gereral/CpListTypeFileUpload.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import { validatorStore } from '@/stores/validatator'
import { questionManagerStore } from '@/stores/admin/content/question/question'

const props = withDefaults(defineProps<Props>(), ({
  question: () => ({
    content: '',
    isGroup: false,
    urlFile: null,
    isAutoApprove: true,
    levelId: null,
    typeId: 1,
    topicId: null,
    contentBasic: '\n',
    answers: [],
  }),
  isEdit: false,
  isView: false,
  index: 0,
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update', value: any): void
}
const { t } = window.i18n()
interface Props {
  isEdit: boolean
  question: AnswerItem
  isView: boolean
  index?: number
}
interface AnswerItem {
  content?: string
  isGroup?: boolean
  urlFile?: null | string
  contentBasic?: null | string
  answers?: any
  isAutoApprove?: boolean
  levelId?: null | number
  typeId?: null | number
  topicId?: null | number
}
const storeQuestionManager = questionManagerStore()
const { refListQsCluse } = storeToRefs(storeQuestionManager)

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  content: schemaOption.defaultStringArea,
})
const anserList = ref<any>()
const trueValue = ref(0)
const typeFile = ref()
function createInitData() {
  anserList.value.answers = []
  for (let i = 0; i < 2; i++) {
    anserList.value?.answers.push({
      content: '',
      isTrue: i === 0,
      position: i + 1,
      isShuffle: false,
      urlFile: null,
    })
  }
}
function changeValueIsTrue(val: any) {
  trueValue.value = val
  anserList.value?.answers?.forEach((item: any) => {
    item.isTrue = item.position === val
  })
}

function deleteFile(dataDelete: any) {
  anserList.value.urlFile = ''
}

const inputMedia = ref()
const typeFileClick = ref()
const myFormQs = ref()
const isSubmit = computed(() => {
  return myFormQs.value?.validate
})
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
  anserList.value.urlFile = val

  typeFile.value = typeFileClick.value
}
watch(() => anserList, (val: any) => {
  emit('update', anserList.value)
}, { deep: true, immediate: true })
watch(() => props.question, (val: any) => {
  anserList.value = props.question
}, { immediate: true })
onMounted(() => {
  if (!props.isEdit)
    createInitData()
})
onMounted(() => {
  refListQsCluse.value[props.index] = {
    isSubmit,
  }
})
defineExpose({
  isSubmit,
})
</script>

<template>
  <div>
    <div class="mb-2 text-medium-sm">
      {{ t('question-content') }}
    </div>
    <Form
      ref="myFormQs"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="anserList.content"
            name="content"
            type="string"
          >
            <CmInputEditor
              v-model="anserList.content"
              v-model:basic="anserList.basic"
              :field="field"
              :errors="errors"
              :disabled="isView"
            />
          </Field>
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
            :src="anserList.urlFile"
            :type-media="typeFile"
            @update:fileFolder="handleUpadateUrlFile"
            @deleteFile="deleteFile"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <div class="answer-list">
            <div
              v-for="(ans, idAns) in anserList.answers"
              :key="idAns"
              class="answer-item mb-6"
            >
              <CpAnserTrueFalse
                v-model:isShuffle="ans.isShuffle"
                :is-view="isView"
                :data="ans"
                :ans-id="idAns + 1"
                :is-true="ans.isTrue"
                @update:isTrue="changeValueIsTrue"
              />
            </div>
          </div>
        </VCol>
      </VRow>
    </Form>
  </div>
</template>
