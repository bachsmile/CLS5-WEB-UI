<script setup lang="ts">
import CpAnserFillBlank2 from '@/components/page/Admin/content/question/modification/answerType/CpAnserFillBlank2.vue'
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
  (e: 'update:question', value: any): void
}
const { t } = window.i18n()
interface Props {
  isEdit: boolean
  question: any
  isView: boolean
  index?: number
}

/** Store */
const storeQuestionManager = questionManagerStore()
const { refListQsCluse } = storeToRefs(storeQuestionManager)
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  content: schemaOption.require,
})

/** state */

const anserList = ref<any>({
  answerBlank: [] as any[],
})
const CmInputEditorRef = ref()
const isActiveAnsCurrent = ref(0)

/** function */

/** init */
function createInitData() {
  anserList.value.answers = []
  anserList.value.answerBlank = []
}

/***
 * hàm hỗ trợ
 */
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

// kiểm tra có selection trong input để bật nút thêm đáp án
const haveSelection = ref(false)

function selectionChange(type: any) {
  let selection: any
  let range: any
  if (type) {
    setTimeout(() => {
      selection = window.getSelection()
      range = selection?.getRangeAt(0)
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

// kiểm tra các đáp án blank có đáp án nào là đáp án đúng không
function checkAnswerCorrest(keyBlank: number) {
  return anserList.value?.answerBlank?.[keyBlank]?.filter((item: any) => item.isTrue === true)
}

// Tên đáp án A B C .... theo position
function getIndex(pos: any) {
  return `${String.fromCharCode(65 + pos)}`
}

// kiểm tra khu vực select có bị chồng với vùng đã tạo đáp án trước đó
function checkHasBlank(commonAncestorContainer: any) {
  let isHaveUnder = false
  if (commonAncestorContainer.nodeType === 1) {
    commonAncestorContainer.children?.forEach((itemEl: any) => {
      if (itemEl.classList.contains('answer-select'))
        isHaveUnder = true
    })
    return isHaveUnder
  }
  else { return false }
}

// cập nhật lại event khi click vào đáp án blank 2 trong input editor khi edit
function updateActionClickAns(key: number) {
  const keyDataDrop = `answer-select[data-blank="${key}"]`
  const dropdownElement = CmInputEditorRef.value.inputEditor.querySelector(`.${keyDataDrop}`)
  dropdownElement?.addEventListener('click', ($event: any) => myFunction($event, dropdownElement, anserList.value.answers[dropdownElement.getAttribute('answer-position')]))
}

function changeValueContent() {
  updatePositionAns()
}

/** **************************************** */
// ===> thêm phương án blank vào input editor
function addAnswerBlank2() {
  // Kiểm tra xem có phần tử nào đã được chọn không.
  const selection: any = window.getSelection()

  // lấy text đang được bôi đen
  const text = window.getSelection()?.toString()

  // lấy vùng range được selection
  const range = selection.getRangeAt(0)

  const div = document.createElement('div')
  div.appendChild(range.cloneContents())
  const htmlContent = encodeURIComponent(div.innerHTML)

  // kiểm tra xem có chứa đáp án blank2 đã tạo không nếu không sẽ tạo có sẽ cảnh báo
  if (!checkHasBlank(range.commonAncestorContainer)) {
    // html cần chèn vào vị trí được chọn
    const keyDataDrop = `answer-select[data-blank="${anserList.value.answers.length}"]`
    const htmlAnswer = `<p class="answer-select ${keyDataDrop}" data-blank="${anserList.value.answers.length}" data="${text}" data-text="${htmlContent}" contenteditable="false" answer-position="${anserList.value.answers.length}">${t('Đáp án A')}</p>`
    anserList.value.answerBlank[anserList.value.answers.length] = []

    /** thêm mẫu blank2 vào input */
    insertHtml(selection, htmlAnswer)

    /** thêm action khi click vào blank2 */
    const dropdownElement = CmInputEditorRef.value.inputEditor.querySelector(`.${keyDataDrop}`)
    dropdownElement.addEventListener('click', ($event: any) => myFunction($event, dropdownElement, anserList.value.answers[dropdownElement.getAttribute('answer-position')]))

    // cập nhật positon
    // updatePositionAns()
    selectionChange(false)
  }
  else {
    toast('WARNING', t('area-overwritten'))
  }
}

// ===> thêm phương án nhiễu blank2
function addAnswerBlank(content: any, pos: number) {
  const positionBlank = anserList.value.answers[pos - 1]?.blank
  if (window._.isEmpty(anserList.value.answerBlank[positionBlank]))
    anserList.value.answerBlank[positionBlank] = []

  anserList.value.answerBlank[positionBlank][anserList.value.answerBlank[positionBlank]?.length ?? 0] = {
    content,
    isTrue: false,
    position: anserList.value.answerBlank[positionBlank]?.length + 2 ?? 0,
    isShuffle: false,
    urlFile: null,

  }
}

// ===> thêm phương án blank vào danh sách đáp án
function addAnswer(content: any, pos: number = anserList.value?.answers?.length + 1, keyBlank?: any, isCheckTrue?: boolean, id?: any) {
  anserList.value.answers[anserList.value.answers.length] = {
    ...(id ? { id } : {}),
    content,
    isTrue: window._.isEmpty(isCheckTrue),
    position: pos,
    isShuffle: false,
    urlFile: null,
    blank: keyBlank,
  }
}
function checkShowAnsIsTrue(el: any) {
  let correst = 1 // vị trí đáp án đúng của từng blank2
  const positionBlank = Number(el.getAttribute('data-blank')) // vị trí blank
  const isCheckTrue = checkAnswerCorrest(positionBlank) // check đáp án đúng trong danh sách câu trả lời nhiễu
  if (!window._.isEmpty(isCheckTrue)) {
    // nếu có thì gắn vị trí đó cho biến correst
    anserList.value?.answerBlank[positionBlank]?.forEach((item: any) => {
      if (item.isTrue === true) {
        correst = item.position
        return false
      }
    })
  }

  el.innerHTML = `Đáp án ${isCheckTrue ? getIndex(correst - 1) : getIndex(0)}`
}

// format dữ liệu cho blank 2 khi edit
function formatFillBlank2() {
  anserList.value.answerBlank = []
  const answer: any[] = []
  const listAns: any[] = []
  anserList.value?.answers?.forEach((item: any, index: number) => {
    const position = item.position - 1
    if (!listAns?.[position])
      listAns[position] = [] as any

    item.position = listAns[position]?.length + 1
    listAns[position][listAns[position]?.length] = item
  })
  listAns.forEach((item: any, index: number) => {
    anserList.value.answerBlank[anserList.value.answerBlank.length] = item.slice(1)
    const ansHtml = item.slice(0, 1)[0]
    ansHtml.blank = index

    answer[answer.length] = ansHtml
  })

  anserList.value.answers = answer

  const editableDiv = CmInputEditorRef.value.inputEditor
  const elementAns = editableDiv.querySelectorAll('.answer-select')
  elementAns.forEach((el: any, pos: number) => {
    el.setAttribute('data-blank', pos)
    el.setAttribute('answer-position', pos)
    el.setAttribute('data-text', anserList.value.answers[pos].content)
    el.setAttribute('data-id', anserList.value.answers[pos].id ?? '')
    checkShowAnsIsTrue(el)
  })

  anserList.value.answers.forEach((item: any, idx: number) => {
    item.position = idx + 1
    updateActionClickAns(item.blank)
  })
}

/** Khi thay đổi vị trí đáp án đúng */
const trueValue = ref(0)

function changeValueIsTrue(isAnsOrigin: any, val: any) {
  trueValue.value = val
  const positionBlank = anserList.value.answers[isActiveAnsCurrent.value - 1]?.blank
  anserList.value.answers[isActiveAnsCurrent.value - 1].isTrue = isAnsOrigin ? anserList.value.answers[isActiveAnsCurrent.value - 1]?.position === val : false
  anserList.value?.answerBlank[positionBlank]?.forEach((item: any) => {
    item.isTrue = !isAnsOrigin ? item.position === val : false
  })
  updatePositionAns(true)

  // // do chèn data content bằng dom nên input không phản hồi cập nhật dữ liệu=> reactive lại input content
  anserList.value.content = CmInputEditorRef.value.inputEditor.innerHTML
  nextTick(() => {
    anserList.value.answers.forEach((item: any) => {
      updateActionClickAns(item.blank)
    })
  })
}

/** Hàm thực thi khi click vào các vị trí blank2 trong input */
function myFunction(ev?: any, el?: any, dataEl?: any) {
  isActiveAnsCurrent.value = dataEl.position
  el.classList.add('active')
}

/** cập nhật dữ liệu và vị trí các đáp án trong dk loại 2 */

function updatePositionAns(type?: boolean) {
  const editableDiv = CmInputEditorRef.value.inputEditor
  anserList.value.answers = []

  if (!type)
    isActiveAnsCurrent.value = 0

  // tìm kiếm đáp án blank2
  const elementAns = editableDiv.querySelectorAll('.answer-select')
  const listBlank = ref<any[]>([])
  elementAns.forEach((el: any, pos: number) => {
    let correst = 1 // vị trí đáp án đúng của từng blank2
    const positionBlank = Number(el.getAttribute('data-blank')) // vị trí blank
    const isCheckTrue = checkAnswerCorrest(positionBlank) // check đáp án đúng trong danh sách câu trả lời nhiễu
    if (!window._.isEmpty(isCheckTrue)) {
      // nếu có thì gắn vị trí đó cho biến correst
      anserList.value?.answerBlank[positionBlank]?.forEach((item: any) => {
        if (item.isTrue === true) {
          correst = item.position
          return false
        }
      })
    }

    // thay dữ liệu vị trí đó thành dạng 'Đáp án ...'
    el.innerHTML = `Đáp án ${isCheckTrue ? getIndex(correst - 1) : getIndex(0)}`

    // cập nhật lại vị trí dom của đáp án blank2 trong input
    el.setAttribute('answer-position', pos)
    listBlank.value.push(Number(el.getAttribute('data-blank')))

    // Thêm đáp án vào danh sách đáp án lựa chọn
    addAnswer(decodeURIComponent(el.getAttribute('data-text')), pos + 1, positionBlank, isCheckTrue, el.getAttribute('data-id') ? Number(el.getAttribute('data-id')) : null)
  })
}

/** * thao tác với các file đính kèm */
const typeFile = ref()
const inputMedia = ref()

function deleteFile(dataDelete: any) {
  anserList.value.urlFile = ''
}

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

/** hook */
// kiểm tra sự thay đổi của setting để cập nhật dữ liệu cho question
watch(() => anserList, (val: any) => {
  emit('update:question', anserList.value)
}, { deep: true, immediate: true })

// Kiểm tra question truyền xuống cập nhật cho anserlist
watch(() => props.question, (val: any) => {
  anserList.value = val
}, { immediate: true })

if (!props.isEdit)
  createInitData()

// khi edit format dữ liệu api về dạng chuẩn của câu dk loại 2
onMounted(() => {
  if (props.isEdit)
    formatFillBlank2()
})

// submit dữ liệu validate
const myFormQs = ref()
const myFormAns = ref()
const inputAns = ref()
const isSubmit = computed(() => {
  return myFormQs.value.validate
})
const isSubmitAns = computed(() => {
  return myFormAns.value
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

/** ******************************************************** */

/// /////////////thao tác với input underline

// phương thức xóa đáp án
function deleteAns(dataDelete: number, posBlank: number) {
  anserList.value?.answerBlank[posBlank]?.splice(dataDelete, 1)

  anserList.value?.answerBlank[posBlank]?.forEach((element: any, i: number) => {
    element.position = i + 2
  })
}

// phương thức xóa vùng được chọn
function deleteSelectedText(selection: any) {
  const editableDiv = CmInputEditorRef.value.inputEditor

  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0)
    range.deleteContents()
  }
}
</script>

<template>
  <div class="qs-blank2">
    <div class="mb-6 mt-2">
      <CmButton
        variant="text"
        :disabled="!haveSelection"
        class=" btn-full cursor-pointer"
        style="border: none"
        @click="addAnswerBlank2"
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
          <template
            v-for="(ans, idAns) in anserList.answers"
            :key="idAns"
          >
            <div
              v-if="isActiveAnsCurrent === ans.position"
              class="answer-item mb-6"
            >
              <CpAnserFillBlank2
                ref="myFormAns"
                v-model:content="ans.content"
                v-model:url="ans.urlFile"
                v-model:isShuffle="ans.isShuffle"
                is-ans-origin
                :is-view="isView"
                :data="ans"
                :ans-id="1"
                :is-true="ans.isTrue"
                disabled-del
                @update:isTrue="changeValueIsTrue"
              />
            </div>
          </template>
          <div
            v-for="(ans, idAns) in anserList.answerBlank?.[ anserList.answers[isActiveAnsCurrent - 1]?.blank]"
            :key="idAns"
            class="answer-item mb-6"
          >
            <CpAnserFillBlank2
              ref="myFormAns"
              v-model:content="ans.content"
              v-model:url="ans.urlFile"
              v-model:isShuffle="ans.isShuffle"
              :is-view="isView"
              :data="ans"
              :ans-id="idAns + 2"
              :is-true="ans.isTrue"
              @delete="($value: any) => deleteAns(idAns, anserList.answers[isActiveAnsCurrent - 1]?.blank)"
              @update:isTrue="changeValueIsTrue"
            />
          </div>
        </div>
        <BLink
          v-if="isActiveAnsCurrent"
          class="cursor-pointer"
          @click="addAnswerBlank('', isActiveAnsCurrent)"
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

<style lang="scss">
.qs-blank2{
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    padding: 12px 16px;
    z-index: 1;
    left: 0;
    bottom: 0px;
    transform: translate(0%, 102%);
  }
  .dropdown::after{
    content:  url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 9l6 6l6-6'/%3E%3C/svg%3E");
    vertical-align: text-top;
  }
  .dropdown.active::after{
    content:   url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 15l6-6l6 6'/%3E%3C/svg%3E");
    vertical-align: text-top;
  }
  .dropdown.active .dropdown-content {
    display: block;
  }
}
</style>
