<script setup lang="ts">
import CpAnswerRangeContent from '@/components/page/Admin/content/survey/modification/answerType/CpAnswerRangeContent.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpListTypeFileUpload from '@/components/page/gereral/CpListTypeFileUpload.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import { validatorStore } from '@/stores/validatator'
import { questionManagerStore } from '@/stores/admin/content/question/question'
import CmSelect from '@/components/common/CmSelect.vue'

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
  content: string
  isGroup: false
  urlFile: null | string
  isAutoApprove: true
  levelId: null
  typeId: null | number
  topicId: null
  contentBasic: null | string
  answers: any
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
const typeFile = ref()
const startRanges = [
  {
    value: '0',
    key: 0,
  },
  {
    value: '1',
    key: 1,
  },
]
const endRanges = [
  {
    value: '2',
    key: 2,
  },
  {
    value: '3',
    key: 3,
  },
  {
    value: '4',
    key: 4,
  },
  {
    value: '5',
    key: 5,
  },
  {
    value: '6',
    key: 6,
  },
  {
    value: '7',
    key: 7,
  },
  {
    value: '8',
    key: 8,
  },
  {
    value: '9',
    key: 9,
  },
  {
    value: '10',
    key: 10,
  },
]
function createInitData() {
  anserList.value.answers = []
  for (let i = 0; i < 2; i++) {
    anserList.value?.answers.push({
      content: '',
      position: 2 * i,
      isShuffle: false,
      urlFile: null,
    })
  }
}

function deleteAns(dataDelete: any) {
  anserList.value?.answers?.splice(dataDelete.position - 1, 1)

  anserList.value?.answers?.forEach((element: any, i: number) => {
    element.position = i + 1
  })
}
function deleteFile(dataDelete: any) {
  anserList.value.urlFile = ''
}
const inputMedia = ref()
function hanleUploadFileContent(val: any) {
  switch (val[0]?.type) {
    case 'image':
      typeFile.value = 1
      nextTick(() => {
        inputMedia.value?.openImage()
      },
      )
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

    default:
      break
  }
}

function handleUpadateUrlFile(val: any) {
  anserList.value.urlFile = val
}
const myFormQs = ref()
const myFormAns = ref()
const inputAns = ref()

const isSubmit = computed(() => {
  return myFormQs.value.validate
})
const isSubmitAns = computed(() => {
  return myFormAns.value
})

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
    isSubmitAns,
    inputAns,
  }
})
defineExpose({
  isSubmit,
  isSubmitAns,
  inputAns,
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
        sm="6"
      >
        <Form
          ref="myFormQs"
          :validation-schema="schema"
          @submit.prevent="submitForm"
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
        <div class="answer-select-range d-flex  mb-5">
          <div class="answer-range">
            <CmSelect
              :disabled="false"
              :clearable="false"
              :model-value="anserList.answers[0].position"
              :items="startRanges"
              item-value="key"
              custom-key="value"
              :placeholder="t('from')"
              @update:model-value="($value) => anserList.answers[0].position = $value"
            />
          </div>
          <div
            class="d-flex align-center justify-center text-lowercase answer-select-mid"
          >
            <div> {{ t('to') }}</div>
          </div>

          <div class="answer-range">
            <CmSelect
              :disabled="false"
              :clearable="false"
              :model-value="anserList.answers[1].position"
              :items="endRanges"
              item-value="key"
              custom-key="value"
              :placeholder="t('to')"
              @update:model-value="($value) => anserList.answers[1].position = $value"
            />
          </div>
        </div>
        <div class="answer-list">
          <div
            v-for="(ans, idAns) in anserList.answers"
            :key="idAns"

            class="answer-item mb-6"
          >
            <CpAnswerRangeContent
              ref="myFormAns"
              v-model:content="ans.content"
              v-model:url="ans.urlFile"
              v-model:isShuffle="ans.isShuffle"
              :placeholder="t('scope-content-holder')"
              :is-view="isView"
              :data="ans"
              :ans-id="idAns + 1"
              :disabled-del="anserList.answers.length <= 1"
              @delete="deleteAns"
            />
          </div>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
.answer-select-range{
  .answer-range{
    width: 45%;
  }
  .answer-select-mid{
    width: 10%;
  }
}
</style>
