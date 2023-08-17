<script setup lang="ts">
import CpAnserMatching from '@/components/page/Admin/content/question/modification/answerType/CpAnserMatching.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpListTypeFileUpload from '@/components/page/gereral/CpListTypeFileUpload.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import { validatorStore } from '@/stores/validatator'
import { questionManagerStore } from '@/stores/admin/content/question/question'

const props = withDefaults(defineProps<Props>(), ({
  question: () => ({
    content: '',
    typeId: 1,
    questionId: 0,
    isDisplay: false,
    isSelected: false,
    contentBasic: '\n',
    urlFile: null,
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
  typeId: null | number
  questionId: null | number
  isSelected: boolean
  isTrue?: boolean
  position?: null | number
  isShuffle?: boolean
  isDisplay: boolean
  urlFile: null | string
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
const trueValue = ref(0)
const typeFile = ref()
function createInitData() {
  anserList.value.answers = []
  for (let i = 0; i < 4; i++) {
    anserList.value?.answers.push({
      left: {
        content: '',
        isTrue: false,
        position: i + 1,
        isShuffle: false,
        urlFile: null,
      },
      right: {
        content: '',
        isTrue: true,
        position: i + 1,
        isShuffle: true,
        urlFile: null,
      },
    })
  }
}
function deleteAns(dataDelete: any) {
  anserList.value.answers.splice(dataDelete.right.position - 1, 1)
  anserList.value.answers?.forEach((element: any, i: number) => {
    if (element?.left)
      element.left.position = i + 1

    if (element?.right)
      element.right.position = i + 1
  })
}
function deleteFile(dataDelete: any) {
  anserList.value.urlFile = ''
}
const answerTrue = ref<any>({
  left: {
    content: '',
    isTrue: false,
    position: anserList.value?.answers?.length + 1,
    isShuffle: false,
    urlFile: null,
  },
  right: {
    content: '',
    isTrue: true,
    position: anserList.value?.answers?.length + 1,
    isShuffle: true,
    urlFile: null,
  },
})
function checkPositionFullAns() {
  return anserList.value.answers?.findIndex((item: any) => item.left === null)
}
function checkDisable(id: number) {
  const listFull = anserList.value.answers?.filter((item: any) => !window._.isEmpty(item.left))
  if (listFull?.length === 1)
    return (listFull[0].right.position === id)

  return false
}
function addAnswer(type: boolean) {
  if (type) {
    if (checkPositionFullAns() >= 0)
      anserList.value.answers?.splice(checkPositionFullAns(), 0, answerTrue.value)
    else
      anserList.value.answers.push(answerTrue.value)
  }
  else {
    anserList.value.answers?.push({
      left: null,
      right: {
        content: '',
        isTrue: true,
        position: anserList.value?.answers?.length + 1,
        isShuffle: true,
        urlFile: null,
      },
    })
  }
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
  anserList.value.urlFile = val
  typeFile.value = typeFileClick.value
}
function updateIsShuffle(type: boolean, val: boolean, position: number) {
  if (!type && anserList.value.answers?.[position].left)
    anserList.value.answers[position].left.isShuffle = val
  if (type && anserList.value.answers?.[position].right)
    anserList.value.answers[position].right.isShuffle = val
}
function updatePostion(type: boolean, val: boolean, position: number) {
  if (!type && anserList.value.answers?.[position].left)
    anserList.value.answers[position].left.position = val
  if (type && anserList.value.answers?.[position].right)
    anserList.value.answers[position].right.position = val
}

function changeValueIContent(type: boolean, position: number, value: any) {
  if (anserList.value.answers?.[position - 1]?.[type ? 'right' : 'left'])
    anserList.value.answers[position - 1][type ? 'right' : 'left'].content = value
}
const myFormQs = ref()
const myFormAns = ref()
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
  }
})
defineExpose({
  isSubmit,
  isSubmitAns,
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
        <div class="d-flex justify-center">
          <div class="w-50">
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
          </div>
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol
        cols="12"
      >
        <div class="answer-list">
          <div
            v-for="(ans, idAns) in anserList.answers"
            :key="idAns"

            class="answer-item mb-6"
          >
            <CpAnserMatching
              ref="myFormAns"
              :is-shuffle-right="ans.right?.isShuffle || false"
              :is-shuffle-left="ans.left?.isShuffle || false"
              :is-view="isView"
              :position="idAns + 1"
              :content-left="ans.left?.content"
              :content-right="ans.right?.content"
              :data="ans"
              :ans-id="idAns"
              :is-true="ans.isTrue"
              :placeholder="t('question-choose', { index: idAns + 1 })"
              :disabled-del="checkDisable(idAns + 1)"
              @update:is-shuffle-left="($value: any) => updateIsShuffle(false, $value, idAns)"
              @update:is-shuffle-right="($value: any) => updateIsShuffle(true, $value, idAns)"
              @update:position-right="($value: any) => updatePostion(true, $value, idAns)"
              @delete="deleteAns"
              @update:content="changeValueIContent"
            />
          </div>
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="6">
        <BLink
          class="cursor-pointer"
          @click="addAnswer(true)"
        >
          <VIcon
            icon="tabler:plus"
            size="16"
            class="color-primary mr-2"
          />
          <span class="color-primary  align-center">{{ $t('add-answer') }}</span>
        </BLink>
      </VCol>
      <VCol cols="6">
        <BLink
          class="cursor-pointer"
          @click="addAnswer(false)"
        >
          <VIcon
            icon="tabler:plus"
            size="16"
            class="color-primary mr-2"
          />
          <span class="color-primary  align-center">{{ $t('add-answer') }}</span>
        </BLink>
      </VCol>
    </VRow>
  </div>
</template>
