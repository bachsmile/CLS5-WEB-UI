<script setup lang="ts">
import CmInputEditorMenu from '@/components/common/inputEditor/CmInputEditorMenu.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import 'katex/dist/katex.min.css'

interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'update:basic', value: any): void
  (e: 'update:event', value?: any): void
  (e: 'blur', value?: any): void
  (e: 'focus', value?: any): void
  (e: 'mouseUp', value?: any): void
  (e: 'mouseDown', value?: any): void
}
interface Props {
  modelValue: any
  text?: any
  minHeight?: any
  width?: any
  isDebounce?: boolean
  isMenuSimple?: boolean
  disabled?: boolean
  rlt?: string
  listMenu?: any[]
  errors?: any
  isErrors?: boolean
  placeholder?: string
  field?: any
}
const propsValue = withDefaults(defineProps<Props>(), ({
  modelValue: '',
  text: '',
  minHeight: '200px',
  placeholder: 'enter-placeholder',
  width: 'auto',
  isDebounce: true,
  isMenuSimple: false,
  disabled: false,
  isErrors: true,
  rlt: 'left',
  listMenu: () => ([]),
}))
const emit = defineEmits<Emit>()
const inputEditor = ref()
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const { t } = window.i18n()

/**
 * method
 */
const hasContentChanged = ref(false)

// async function handlePaste(event: any) {
//   event.preventDefault()
//   const items = event.clipboardData.items
//   console.log(items)

//   for (let i = 0; i < items.length; i++) {
//     const item = items[i]
//     console.log(item)
//     if (item.kind === 'string' && item.type.includes('text/html')) {
//       // Lấy dữ liệu đã dán vào
//       const clipboardData = event.clipboardData
//       const regex = /<img[^>]+>/g
//       const count = 0
//       const pastedData = event.clipboardData.getData('text/html')
//       const regexComment = /<!--[\s\S]*?-->/img
//       const cleanedHtml = pastedData.replace(regexComment, '')
//       console.log(cleanedHtml.match(regex))
//       const listImg = cleanedHtml.match(regex)
//       const listImgHtml: any = []
//       listImg.forEach((value, index, array) => {
//         const div = document.createElement('div')
//         div.innerHTML = value
//         listImgHtml.push(div.innerHTML)
//         const imgElement = div.querySelector('img')
//         const src = imgElement.src
//         const localFileURL = src

//         // Remove 'file://' protocol
//         const filePath = localFileURL.replace('file://', '')

//         // Create a Blob URL
//         const blobURL = URL.createObjectURL(new Blob([filePath], { type: 'image/png' }))

//         // const divs = document.createElement('div')
//         // divs.innerHTML = value
//         // divs.innerHTML = `<img src='${blobURL}' />`
//         console.log(blobURL)
//         const editor: any = document.getElementById('inputEditor')
//         editor.innerHTML = `<img  src='${blobURL}' />`
//       })

//       console.log(listImgHtml)

//       // const base64Images = cleanedHtml.replace(regex, (match: any) => {
//       //   count++
//       //   return `(__${count}__)`
//       // })
//       // const editor: any = document.getElementById('inputEditor')
//       // editor.innerHTML = cleanedHtml
//     }

//     // if (item.kind === 'string' && item.type.includes('text/html')) {
//     //   item.getAsString(data => {
//     //     console.log(data)
//     //     const regex = /<img[^>]+>/g
//     //     let count = 0
//     //     const base64Images = data.replace(regex, match => {
//     //       count++
//     //       return `(-------------${count}---------------)`
//     //     })
//     //     data = base64Images
//     //   })
//     // }

//     // console.log(inputEditor.value.innerHTML)

//     if (item.kind === 'file' && item.type.includes('image/')) {
//       const file = item.getAsFile()
//       console.log(file)
//       const reader = new FileReader()
//       console.log(reader)
//       reader.onloadend = async () => {
//         const base64String: any = reader.result
//         const dataBase64 = base64String?.replace('data:image/png;base64,', '')

//         // console.log(base64String)
//         // console.log(dataBase64)
//         const params = {
//           imageBytes: dataBase64,
//         }
//         // await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.UploadFileImgBase64}`, TYPE_REQUEST.POST, params).then((value: any) => {
//         //   console.log('dataBase64', value)
//         // })

//         // const byteCharacters = atob(base64String);
//         // const byteArrays = [];
//         // Sử dụng chuỗi base64String theo ý muốn (ví dụ: hiển thị trên trang web)
//       }

//       reader.onerror = () => {
//         console.error('Đã xảy ra lỗi khi chuyển đổi thành base64')
//       }

//       reader.readAsDataURL(file)
//       break // Chỉ xử lý một tệp ảnh nếu có nhiều hơn một tệp được dán vào
//     }
//   }
// }

// thay đổi dữ liệu data update
const handleChangeValue = window._.debounce((val: any) => {
  hasContentChanged.value = true
  emit('update:modelValue', (!inputEditor.value.innerHTML || inputEditor.value.innerHTML === '<br>') ? null : inputEditor.value.innerHTML)
  emit('update:basic', inputEditor.value.innerText)
}, propsValue?.isDebounce ? 500 : 0)

/** method */
function applyFormatting(formatType: 'bold' | 'italic' | 'underline', value: any) {
  document.execCommand(formatType)
}

function applyAlignment(alignmentType: 'left' | 'center' | 'justify') {
  document.execCommand(alignmentType)

  // const contentDiv = document.getElementById('myContent')

  // // Kiểm tra xem có phần tử nào đã được chọn không.
  // const selection: any = window.getSelection()

  // if (selection && selection.rangeCount > 0) {
  //   const range = selection.getRangeAt(0)
  //   const parentElement = selection?.anchorNode.parentElement
  //   const textAlign = parentElement.style.textAlign
  //   if (textAlign) {
  //     // Nếu đã có text-align, thay thế nó bằng giá trị mới (ở đây là 'center' cho ví dụ)
  //     parentElement.style.textAlign = alignmentType
  //   }
  //   else {
  //     // Tạo một phần tử div mới và chèn nội dung đã được chọn vào đó.
  //     const alignElement = document.createElement('div')
  //     alignElement.style.textAlign = alignmentType
  //     console.log(range)

  //     // Tạo một phạm vi rõ ràng để chứa nội dung đã chọn.
  //     const fragment = range.cloneContents()
  //     alignElement.appendChild(fragment)

  //     // Xóa bỏ các phần tử div chứa căn chỉnh cũ trong phạm vi đã chọn trước khi chèn phần tử div mới.
  //     const divsToRemove = alignElement.querySelectorAll('div[style^="text-align"]')
  //     for (const div of divsToRemove)
  //       div.outerHTML = div.innerHTML

  //     // Chèn phần tử div mới vào vị trí của phạm vi đã chọn.
  //     range.deleteContents()
  //     range.insertNode(alignElement)
  //   }
  // }
}

function applyOrderedList(key: any) {
  document.execCommand(key)
}
function applyColor(key: any, option: any, value: any) {
  document.execCommand(key, option, value)
}
function addMathType(htmlString: any) {
  document.execCommand('insertHTML', false, htmlString)
}
function addLinkUrl(key: any, option: any, value: any, selection: any, range: any) {
  const inputEditorTa: any = document.getElementById('inputEditor')
  const {
    anchorNode, extentNode, anchorOffset, extentOffset,
  } = selection
  range.setStart(anchorNode, anchorOffset)
  range.setEnd(extentNode, extentOffset)

  nextTick(() => {
    window?.getSelection()?.removeAllRanges()
    window?.getSelection()?.addRange(range)

    setTimeout(() => {
      document.execCommand(key, option, value)
    }, 500)
  })
}
onMounted(() => {
  inputEditor.value.innerHTML = propsValue.modelValue
})
watch(() => propsValue.modelValue, val => {
  if (!hasContentChanged.value)
    inputEditor.value.innerHTML = val

  hasContentChanged.value = false
})
const statusMenu = reactive({
  bold: false,
  underline: false,
  italic: false,
  strikeThrough: false,
  left: false,
  right: false,
  center: false,
  justify: false,
  insertOrderedList: false,
  insertUnorderedList: false,
})
function click(event: MouseEvent) {
  const target = event.target as HTMLElement // Lấy phần tử được click

  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)

    // Lấy danh sách các phần tử con trong range
    // eslint-disable-next-line sonarjs/no-unused-collection
    const nodes: Node[] = []
    range.commonAncestorContainer.childNodes.forEach(node => {
      if (node instanceof HTMLElement)
        nodes.push(node)
    })

    // Kiểm tra các thuộc tính CSS của từng phần tử con
    statusMenu.bold = document.queryCommandState('bold')
    statusMenu.underline = document.queryCommandState('underline')
    statusMenu.italic = document.queryCommandState('italic')
    statusMenu.strikeThrough = document.queryCommandState('strikeThrough')
    statusMenu.left = ['left', 'start'].includes(window.getComputedStyle(target).textAlign)
    statusMenu.right = ['right'].includes(window.getComputedStyle(target).textAlign)
    statusMenu.center = ['center'].includes(window.getComputedStyle(target).textAlign)
    statusMenu.justify = ['justify'].includes(window.getComputedStyle(target).textAlign)
    statusMenu.insertOrderedList = document.queryCommandState('insertOrderedList')
    statusMenu.insertUnorderedList = document.queryCommandState('insertUnorderedList')
  }
}
function handleBlur() {
  emit('blur')
}
function handleFocus() {
  emit('focus')
}
function handleMouseUp() {
  emit('mouseUp')
}
function handleMouseDown() {
  emit('mouseDown')
}

defineExpose({
  inputEditor,
  handleChangeValue,
})
</script>

<template>
  <div>
    <div
      v-if="propsValue.text"
      class="mb-1"
    >
      <label
        class="text-label-default"
      >{{ propsValue.text }}</label>
    </div>
    <div
      :style="{ width }"
      class="inputEditor"
      :class="{ styleError: errors?.length }"
      :title="t(MethodsUtil.showErrorsYub(errors)) ?? '' "
    >
      <!--
        <div>
        <ToolBarEditor
        :is-show-input="isShowInput"
        :actived-tool="activedTool"
        :data-side-bar="dataSideBar"
        @handerStyleText="execCommand"
        @addItemToTemplateMail="addItemToTemplateMailText"
        />
        </div>
      -->
      <div>
        <CmInputEditorMenu
          :status-menu="statusMenu"
          :is-menu-simple="isMenuSimple"
          :list-menu="listMenu"
          :rlt="rlt"
          :disabled="disabled"
          @change="applyFormatting"
          @changeAlign="applyAlignment"
          @order="applyOrderedList"
          @changeColor="applyColor"
          @addLinkUrl="addLinkUrl"
          @addMathType="addMathType"
          @update:event="($item: any) => emit('update:event', $item)"
        />
      </div>
      <div
        id="inputEditor"
        ref="inputEditor"
        :class="{ 'input-math-disable': disabled }"
        :contenteditable="disabled ? false : true"
        :style="[`${isMenuSimple && !listMenu.length ? 'borderRadius: 8px' : ''}`, `minHeight: ${minHeight}`]"
        class="input-math border box-textarea p-1 placeholder custom-underline"
        :placeholder="t(placeholder)"
        @input="handleChangeValue"
        @mouseup="handleMouseUp"
        @mousedown="handleMouseDown"
        @click="click"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>
    <div
      v-if="errors?.length > 0 && isErrors"
      class="styleError text-errors"
    >
      {{ t(MethodsUtil.showErrorsYub(errors)) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .input-math{
    position: relative;
    padding: 10px;
    margin-top: -1px;
    border: 1px solid rgba(var(--v-border-color)) !important;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    background-color: rgb(var(--v-theme-surface));
    max-height: 500px;
    overflow: hidden;
    overflow-y: auto;
    font-size: 14px;
  }
  .input-math:focus{
    outline: unset !important;
  }
  .input-math-disable{
    background-color:  rgb(var(--v-gray-100)) ;
  }
</style>

<style lang="scss">
.input-math {
    ol {
        display: block;
        list-style-type: decimal;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px !important;
    }
    ul {
      display: block;
      list-style-type: disc;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      padding-inline-start: 40px;
    }
 }
 .inputEditor{
  border-radius: 8px;
 }
 .styleError.inputEditor{
  outline: 1px solid red;
}

[contenteditable][placeholder]:empty:before {
  content: attr(placeholder);
  position: absolute;
  color: gray;
  background-color: transparent;
}

.custom-underline {
  u {
    text-decoration: underline;
    color:  rgb(var(--v-primary-600)) !important;
  }
}
</style>
