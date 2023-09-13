<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpInputFileDrop from '@/components/page/gereral/CpInputFileDrop.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ServerFileService from '@/api/server-file/index'

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  [name: string]: any
}
interface Props {
  data: question
  showContent: boolean
  showMedia: boolean
  showAnswerTrue: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
}))
const urlFile = ref()
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const { t } = window.i18n()
async function getInfor(folder: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
}

const typeFile = ref<any>()
const dataFile = ref<any>({
  filePath: null,
  fileFolder: null,
})
async function uploadFileLocal(data: any, file: any) {
  if (data?.fileFolder) {
    await getInfor(data?.fileFolder).then((value: any) => {
      if (value?.filePath) {
        typeFile.value = MethodsUtil.getMediaType(value.fileExtension)
        urlFile.value = value.filePath
        dataFile.value.filePath = value.filePath
        dataFile.value.fileFolder = data.fileFolder
        dataFile.value.serverCode = data?.serverCode
      }
    })
  }
}
const inputFile = ref<any>(null)
function hanleUploadFileContent(val: any) {
  inputFile.value?.openChooseFile()
}
</script>

<template>
  <div class="content-view">
    <div
      v-if="showContent"
      class="text-medium-md mb-5"
      v-html="data.content"
    />
    <div
      v-if="showMedia && data.urlFile"
      class="view-media mb-5"
    >
      <CpMediaContent
        :disabled="true"
        :src="data.urlFile"
      />
    </div>
    <div v-if="!showAnswerTrue">
      <CmInputEditor
        :text="t('answers')"
        :disabled="true"
      />
      <div class="mt-6">
        <CpInputFileDrop
          ref="inputFile"
          v-model:src="urlFile"
          class="w-100 "
          :disabled="true"
          :is-btn-download="false"
          @change="uploadFileLocal"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view{

  .item-answer {
    display:flex;
    width: 100%;
    border-radius: 8px;
    border: 1px solid rgb(var(--v-gray-300));
    background: #FFF;
    padding: 1rem;
    margin-bottom: 12px;
  }
  .item-answer:last-child {
    margin-bottom: unset;
  }
  .view-media{
    width: 60%;
  }
}
</style>
