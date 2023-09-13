<script setup lang="ts">
import CpAnswerRangeContent from '@/components/page/Admin/content/survey/modification/answerType/CpAnswerRangeContent.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpListTypeFileUpload from '@/components/page/gereral/CpListTypeFileUpload.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import { validatorStore } from '@/stores/validatator'
import { questionManagerStore } from '@/stores/admin/content/question/question'
import CmSelect from '@/components/common/CmSelect.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmPickColor from '@/components/common/inputEditor/CmPickColor.vue'

const props = withDefaults(defineProps<Props>(), ({
  question: () => ({
    content: '',
    isGroup: false,
    urlFile: null,
    isAutoApprove: true,
    levelId: null,
    color: null,
    reactionId: 1,
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
  color?: any
  reactionId?: any
}
const storeQuestionManager = questionManagerStore()
const { refListQsCluse } = storeToRefs(storeQuestionManager)

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  content: schemaOption.defaultStringArea,
})
const anserList = ref<any>({
  color: '#1570EF',
  reactionId: 1,
})
const typeFile = ref()
const ranges = [
  {
    value: '1',
    key: 1,
  },
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
const reaction = [
  {
    key: 'Thích',
    value: 1,
    color: '#1570EF',
    icon: 'tabler:thumb-up',
  },
  {
    key: 'Yêu Thích',
    value: 2,
    color: '#D92D20',
    icon: 'tabler:heart',
  },
  {
    key: 'Ngôi Sao',
    value: 3,
    color: '#F79009',
    icon: 'tabler:star',
  },
  {
    key: 'Biểu Tượng Cảm Xúc',
    value: 4,
    color: '#039855',
    icon: 'tabler:mood-happy',
  },

]
const amountAnswer = ref(1)

function createInitData() {
  anserList.value.answers = []
  anserList.value?.answers.push({
    content: '',
    position: 1,
    isShuffle: false,
    urlFile: null,
  })
  amountAnswer.value = anserList.value?.answers?.length
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

// thay đổi số lượng đánh giá
const isAddContent = ref(false)
function factorChange(value: number) {
  amountAnswer.value = value
  anserList.value.answers = []
  for (let index = 0; index < amountAnswer.value; index += 1) {
    anserList.value.answers.push({
      position: index + 1,
      content: '',
    })
  }
}
function changeReaction(value: any) {
  anserList.value.reactionId = value
  anserList.value.color = reaction[anserList.value.reactionId - 1]?.color
}
watch(() => anserList, (val: any) => {
  emit('update', anserList.value)
}, { deep: true, immediate: true })
watch(() => props.question, (val: any) => {
  anserList.value = props.question
  if (!anserList.value.reactionId)
    anserList.value.reactionId = 1
  if (!anserList.value.color)
    anserList.value.color = reaction[anserList.value.reactionId - 1]?.color
  isAddContent.value = !anserList.value?.answers.find((item: any) => window._.isEmpty(item?.content.trim()))
  amountAnswer.value = anserList.value?.answers?.length
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
  <div class="survey-evaluate">
    <VRow class="text-medium-sm">
      <VCol
        cols="12"
        sm="6"
        class="mbn-2"
      >
        {{ t('question-content') }} *
      </VCol>
      <VCol
        cols="12"
        sm="6"
        class="mbn-2"
      >
        <div class="answer-select-range d-flex">
          <div class="answer-evaluate-select">
            {{ t('factor') }}
          </div>
          <div class="answer-evaluate-select">
            {{ t('Shape') }}
          </div>
          <div class="answer-select-end" />
        </div>
      </VCol>
    </VRow>
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
          <div class="answer-evaluate-select">
            <CmSelect
              :disabled="false"
              :clearable="false"
              :model-value="amountAnswer"
              :items="ranges"
              item-value="key"
              custom-key="value"
              :placeholder="t('factor')"
              @update:model-value="factorChange"
            />
          </div>
          <div class="answer-evaluate-select">
            <CmSelect
              :model-value="anserList.reactionId"
              :disabled="false"
              :clearable="false"
              :items="reaction"
              item-value="value"
              custom-key="key"
              :placeholder="t('Shape')"
              @update:model-value="changeReaction"
            />
          </div>
          <div class="answer-select-end d-flex align-center">
            <CmPickColor
              v-model:color="anserList.color"
              is-hide-input-color
              :type="2"
              class="mr-2"
            />
            <VIcon
              :icon="reaction[anserList.reactionId - 1]?.icon"
              :style="{ color: reaction[anserList.reactionId - 1]?.color }"
              size="32"
            />
          </div>
        </div>
        <div class="mb-6">
          <CmCheckBox
            v-model="isAddContent"
            :disabled="isView"
            :label="t('add-evaluate-content')"
          />
        </div>
        <div
          v-if="isAddContent"
          class="answer-list"
        >
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
.survey-evaluate{
  .answer-select-range{
    .answer-evaluate-select{
      width: 40%;
      margin-right: 16px;
    }
    .answer-select-end{
      width: 20%;
    }
  }
}
</style>
