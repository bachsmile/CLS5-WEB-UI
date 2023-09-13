<script setup lang="ts">
import CpAnserFillBlank from '@/components/page/Admin/content/question/modification/answerType/CpAnserFillBlank.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpListTypeFileUpload from '@/components/page/gereral/CpListTypeFileUpload.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import { validatorStore } from '@/stores/validatator'
import { questionManagerStore } from '@/stores/admin/content/question/question'
import toast from '@/plugins/toast'
import CmButton from '@/components/common/CmButton.vue'

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
const anserList = ref<any>({
  answerBlank: [],
})
const trueValue = ref(0)
const typeFile = ref()
function createInitData() {
  anserList.value.answers = []
  anserList.value.answerBlank = []
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
  anserList.value = val
}, { immediate: true })
if (!props.isEdit)
  createInitData()
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

/// /////////////thao tác với input underline
const CmInputEditorRef = ref()
const haveSelection = ref(false)

// kiểm tra có selection trong input để bật nút thêm đáp án
function selectionChange(type: any) {
  let selection: any
  let range: any
  if (type) {
    setTimeout(() => {
      selection = window.getSelection()
      range = selection.getRangeAt(0)
      const text = window.getSelection()?.toString()
      haveSelection.value = range !== null && (Math.abs(range?.startOffset - range?.endOffset) > 0) && !!text
    }, 0)
  }
  else {
    selection = null
    range = null
    haveSelection.value = false
  }
}
function addAnswerUnder() {
  // Kiểm tra xem có phần tử nào đã được chọn không.
  const selection: any = window.getSelection()

  // lấy text đang được bôi đen
  let text: any = window.getSelection()?.toString()
  const firstCharacter = text.slice(0, 1)
  if (firstCharacter === ' ')
    text = text.slice(1)

  const lastCharacter = text.slice(text.length - 1)

  if (lastCharacter === ' ')
    text = text.slice(0, text.length - 1)

  // lấy vùng range được selection
  const range = selection.getRangeAt(0)

  // kiểm tra xem có chứa đáp án underline đã tạo không nếu không sẽ tạo có sẽ cảnh báo
  if (!checkHasBlank(range.commonAncestorContainer)) {
    // html cần chèn vào vị trí được chọn
    const htmlAnswer = `${firstCharacter === ' ' ? '<span> </span>' : ''}<span class="answer-fill-blank" contenteditable="false" answer-position="${anserList.value.answers.length}">${text}</span>${lastCharacter === ' ' ? '<span> </span>' : ''}`
    insertHtml(selection, htmlAnswer)

    // thêm vào câu trả lời
    // addAnswer(text)

    // cập nhật positon
    updatePositionAns()
    selectionChange(false)
  }
  else {
    toast('WARNING', t('area-overwritten'))
  }
}

function checkHasBlank(commonAncestorContainer: any) {
  let isHaveUnder = false
  if (commonAncestorContainer.nodeType === 1) {
    commonAncestorContainer.children?.forEach((itemEl: any) => {
      if (itemEl.classList.contains('answer-fill-blank'))
        isHaveUnder = true
    })
    return isHaveUnder
  }
  else { return false }
}
function addAnswer(content: any) {
  anserList.value.answers[anserList.value.answers.length] = {
    content,
    isTrue: false,
    position: anserList.value?.answers?.length + 1,
    isShuffle: false,
    urlFile: null,
  }
}
function addAnswerBlank(content: any, pos: number) {
  anserList.value.answerBlank[pos] = {
    content,
    isTrue: true,
    position: pos + 1,
    isShuffle: false,
    urlFile: null,
  }
}
function updatePositionAns() {
  const editableDiv = CmInputEditorRef.value.inputEditor
  anserList.value.answerBlank = []

  // tìm kiếm đáp án underline
  const elementAns = editableDiv.querySelectorAll('.answer-fill-blank')
  elementAns.forEach((el: any, pos: number) => {
    el.setAttribute('answer-position', pos)
    addAnswerBlank(el.innerHTML, pos)
  })
}

// phương thức xóa đáp án
function deleteAns(dataDelete: any) {
  //  ref của input editor
  const editableDiv = CmInputEditorRef.value.inputEditor

  // tìm kiếm đáp án underline
  const elementAns = editableDiv.querySelectorAll('.answer-fill-blank')
  for (let i = 0; i < elementAns.length; i++) {
    const element = elementAns[i]
    const answerIndex = element.getAttribute('answer-position')

    // kiểm tra vị trí delete có trùng với vị trí của element được tìm thấy
    if (dataDelete.position - 1 === Number(answerIndex)) {
      // tạo một  vùng được chọn mới
      const range = document.createRange()

      // bao bọc vùng chọn cho element
      range.selectNode(element)

      // tạo một selection
      const selection: any = window.getSelection()

      // xóa tất cả các range hiện tại
      selection.removeAllRanges()

      // add range đã tạo để selection cho vùng được chọn
      selection.addRange(range)
      const textReset = selection?.toString()
      insertHtml(selection, textReset)
    }
  }

  anserList.value?.answers?.splice(dataDelete.position - 1, 1)

  anserList.value?.answers?.forEach((element: any, i: number) => {
    element.position = i + 1
  })
  updatePositionAns()
}

// phương thức xóa vùng được chọn
function deleteSelectedText(selection: any) {
  const editableDiv = CmInputEditorRef.value.inputEditor

  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0)
    range.deleteContents()
  }
}

// phương thức chèn html vào vùng được chọn
function insertHtml(selection: any, html: any) {
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0)
    const fragment = range.createContextualFragment(html)
    range.deleteContents()
    range.insertNode(fragment)
    selection.removeAllRanges()
    CmInputEditorRef.value.handleChangeValue()
  }
}
function changeValueContent() {
  updatePositionAns()
}
</script>

<template>
  <div>
    <div class="mb-6 mt-2">
      <CmButton
        variant="text"
        :disabled="!haveSelection"
        class=" btn-full cursor-pointer"
        style="border: none"
        @click="addAnswerUnder"
      >
        <div>
          <VIcon
            icon="tabler:plus"
            size="16"
            class="color-primary mr-2"
          />
          <span class="color-primary  align-center">{{ $t('add-answer') }}</span>
        </div>
      </CmButton>
    </div>
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
              ref="CmInputEditorRef"
              v-model="anserList.content"
              v-model:basic="anserList.basic"
              :field="field"
              :errors="errors"
              :disabled="isView"
              @update:model-value="changeValueContent"
              @mouseUp="selectionChange(true)"
              @mouseDown="selectionChange(false)"
              @blur="selectionChange(true)"
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
        <div class="answer-list">
          <div
            v-for="(ans, idAns) in anserList.answers"
            :key="idAns"

            class="answer-item mb-6"
          >
            <CpAnserFillBlank
              ref="myFormAns"
              v-model:content="ans.content"
              v-model:url="ans.urlFile"
              v-model:isShuffle="ans.isShuffle"
              :is-view="isView"
              :data="ans"
              :ans-id="idAns + 1"
              :is-true="ans.isTrue"
              @delete="deleteAns"
              @update:isTrue="changeValueIsTrue"
            />
          </div>
        </div>
        <BLink
          class="cursor-pointer"
          @click="addAnswer('')"
        >
          <VIcon
            icon="tabler:plus"
            size="16"
            class="color-primary mr-2"
          />
          <span class="color-primary  align-center">{{ $t('add-interference-plan') }}</span>
        </BLink>
      </VCol>
    </VRow>
  </div>
</template>
