<script setup lang="ts">
import CmInputEditorMenu from './CmInputEditorMenu.vue'

interface Emit {
  (e: 'update:modelValue', value: any): void
}
interface Props {
  modelValue: any
  text?: any
  isDebounce?: boolean
}
const propsValue = withDefaults(defineProps<Props>(), ({
  modelValue: '',
  text: '',
  isDebounce: true,
}))
const emit = defineEmits<Emit>()
const inputEditor = ref()
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE

/**
 * method
 */

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
  emit('update:modelValue', inputEditor.value.innerHTML)
}, propsValue?.isDebounce ? 500 : 0)

onMounted(() => {
  inputEditor.value.innerHTML = propsValue.modelValue
})

watch(() => propsValue.modelValue, (val: any) => {
  inputEditor.value.innerHTML = val
}, { deep: true })
</script>

<template>
  <div>
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
    <div
      v-if="propsValue.text"
      class="mb-1"
    >
      <label
        class="text-label-default"
      >{{ propsValue.text }}</label>
    </div>
    <div>
      <CmInputEditorMenu />
    </div>
    <div
      id="inputEditor"
      ref="inputEditor"
      contenteditable="true"
      class="input-math border box-textarea p-1"
      @input="handleChangeValue"
    />
    <!--
      :style="`textAlign:${textAlign}; color:${generalConfig.textColor};`"
      @input="handleChangeValue"
      @mousedown="mousedowns"
      @click="dblclickEditText"
    -->
  </div>
</template>

<style scoped>
  .input-math{
    padding: 10px;
    min-height: 200px;
    margin-top: -1px;
    border: 1px solid rgba(var(--v-border-color)) !important;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .input-math:focus{
    outline: unset !important;
  }
</style>
