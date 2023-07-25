<script setup lang="ts">
import CmButtonGroup from '@/components/common/CmButtonGroup.vue'
import CpSearch from '@/components/page/gereral/CpSearch.vue'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'
import ServerFileService from '@/api/server-file/index'
import constant from '@/constant/constant'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmButton from '@/components/common/CmButton.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  name: 'course',
  listItem: () => ([]),
})
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmItemFileUpload = defineAsyncComponent(() => import('@/components/common/CmItemFileUpload.vue'))
interface Props {
  isShowModal: boolean
  listItem: Array<any>
  name: string
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
  (e: 'search', value: any): void
  (e: 'cancel'): void
  (e: 'update:dowloading', value: boolean): void
  (e: 'update:itemDownloading', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const LABEL = Object.freeze({
  TITLE: t('feedback-management'),
})
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const fileUpload = ref(props.listItem)
const fileNames = ref<any[]>([])
const fileURLs = ref<any[]>([])
const totalSize = ref(0)
const foldersRepeat = ref<any>()
const isShowMdConfirmFile = ref(false)
const actionAdd = [
  {
    title: t('download-zip'),
    icon: 'tabler:file-plus',
    action: () => dowloadItems(null, 'zip'),
  },
  {
    title: t('download-in-folder'),
    icon: 'tabler:file-plus',
    action: downloadContentCourse,
  },
]
function isDownloading() {
  if (!window._.isEmpty(fileUpload.value)) {
    const items = fileUpload.value?.filter((item: any) => {
      console.log(item.statusDownload)

      return item.statusDownload === 2
    })
    console.log(items.length)
    emit('update:dowloading', items.length > 0)
    emit('update:itemDownloading', items)
    return items.length > 0
  }
  console.log(items.length)
  emit('update:dowloading', false)
  emit('update:itemDownloading', null)
  return false
}
async function downloadContentCourse() {
  try {
    const dirHandle = await (window as any).showDirectoryPicker()
    dowloadItems(null, 'folder', dirHandle)
  }
  catch {
    downloadFileInFolderDefault()
  }
}

const keyword = ref<any>(null)
async function onCancel() {
  console.log('cancel')

  emit('cancel')
}
async function handleSearch(key: any) {
  emit('search', key)
}

async function dowloadFile(file: any) {
  return await MethodsUtil.dowloadSampleFile(
    file?.fileUri,
    'GET',
    file?.fileName,
  )
}

async function downloadDetailFile(item: any) {
  if (item?.statusDownload === 1) {
    item.statusDownload = 2
    await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${item.folder}`, TYPE_REQUEST.GET).then(async (infoFile: any) => {
      const params = {
        fileUri: infoFile?.serverCode ? `${SERVERFILE}/${infoFile.serverCode}/api/File/downloadDocument/${item.folder}` : `${SERVERFILE}/sfv4/api/File/downloadDocument/${item.folder}`,
        fileName: infoFile.fileName,
      }

      await dowloadFile(params).then(value => {
        item.statusDownload = 3
        console.log(params)
      }).catch(value => {
        item.statusDownload = 4
      })
    })
  }
  return true
}

async function downloadFileInFolderDefault() {
  for (let index = 0; index < fileUpload.value.length; index) {
    const element = fileUpload.value[index]

    const status = await downloadDetailFile(element.id)
    if (status)
      index += 1
  }
}
async function dowloadItems(item: any, type?: any, dirHandle?: any) {
  if (isDownloading() && !item?.id) {
    toast('SUCCESS', t('progress-file'))
    return
  }
  if (item?.id) {
    downloadDetailFile(item)
  }
  else if (fileURLs.value.length > 0) {
    handlerZipFileContinute(type)
  }
  else {
    // Tải tất cả các file
    fileNames.value = []
    fileURLs.value = []
    totalSize.value = 0
    foldersRepeat.value = [...new Set(fileUpload.value.map(e => e.folder))]
    await getBlobFiles(0, fileUpload.value, foldersRepeat.value, type, dirHandle)
  }
}

// tải từng file, nén file sau khi tải tất cả và tải file đã nén về
const timeProcess = ref()
async function getBlobFiles(i: number, list: any[], listFile: any[], type: string, dirHandle: any) {
  if (i < listFile.length) {
    list.forEach((element: any) => {
      if (element.folder === listFile[i]) {
        element.statusDownload = 2
        timeProcess.value = setInterval(() => {
          console.log(element.size, element.sizes)

          if (element.processing < 90) {
            element.processing += 10
            if (element.sizes)
              element.size = element.processing * element.sizes * 1.5 / 100
          }
          else { clearInterval(timeProcess.value) }
        }, 1000)
      }
    })
    isDownloading()
    await getInfor(listFile[i]).then(async (infoFile: any) => {
      console.log(infoFile)
      list.forEach(element => {
        if (element.folder === listFile[i])
          element.sizes = infoFile.fileSize
      })
      await MethodsUtil.requestApiCustom(ServerFileService.GetBlobFile(SERVERFILE, infoFile?.serverCode, listFile[i]), TYPE_REQUEST.GET).then((value: any) => {
        const response = {
          blob: new Blob([value]),
        }
        console.log(response)
        if (response) {
          totalSize.value += response.blob.size
          console.log(response.blob.size)

          list.forEach(element => {
            if (element.folder === listFile[i]) {
              element.statusDownload = 3
              element.processing = 100
              element.size = response.blob.size
              clearInterval(timeProcess.value)
            }
          })
          if (type === 'zip') {
            fileURLs.value.push(response.blob)
            fileNames.value.push(infoFile.fileName)
          }
          else {
            MethodsUtil.writeFileDownload(response.blob, infoFile.fileName, dirHandle).then((valueWrite: any) => {
              console.log(valueWrite)
            })
          }
          i += 1
          getBlobFiles(i, list, listFile, type, dirHandle)
        }
        else {
          list.forEach(element => {
            if (element.folder === listFile[i])
              element.statusDownload = 4
          })
          i += 1
          getBlobFiles(i, list, listFile, type, dirHandle)
        }
      })
    })
  }
  else {
    const params = {
      blobs: fileURLs.value,
      fileNames: fileNames.value,
      zipName: `${props.name}.zip`,
    }
    if (type === 'zip') {
      if (totalSize.value > constant.MAX_CAPACITY_DOWNLOAD_FILE) {
        showModalConfirmDownload(totalSize.value)
        return
      }
      toast('WARNING', t('compressing-files'))

      // gọi store nén .zip và tải về
      setTimeout(() => {
        handlerZipFile(params)
      }, 1000)
    }
  }
}
function handlerZipFileContinute(type: any) {
  const params = {
    blobs: fileURLs.value,
    fileNames: fileNames.value,
    zipName: `${props.name}.zip`,
  }
  if (type === 'zip') {
    if (totalSize.value > constant.MAX_CAPACITY_DOWNLOAD_FILE) {
      showModalConfirmDownload(totalSize.value)
      return
    }
    toast('WARNING', t('compressing-files'))

    // gọi store nén .zip và tải về
    setTimeout(() => {
      handlerZipFile(params)
    }, 1000)
  }
}
async function handlerZipFile(params: any) {
  await MethodsUtil.exportBlobZipMulFile(params, document, window).then(value => {
    console.log(value)
    isDownloading()
  })
}
const titleModalConfirm = ref('')
const modalContentDownloadFile = ref('')
function showModalConfirmDownload(size: any) {
  const total = MethodsUtil.formatCapacity(size)

  titleModalConfirm.value = t('capacity-download', [total])
  modalContentDownloadFile.value = t('limited-capacity')
  isShowMdConfirmFile.value = true
  isDownloading()
}
async function selectFolderDownload() {
  try {
    const dirHandle = await (window as any)?.showDirectoryPicker({ writable: true })
    handlerDownload(dirHandle)
  }
  catch {
    fileURLs.value.forEach((blob, index) => {
      const fileURL = window.URL.createObjectURL(new Blob([blob]))
      const fileLink = document.createElement('a')
      fileLink.href = fileURL
      fileLink.setAttribute('download', fileNames.value[index])
      document.body.appendChild(fileLink)
      fileLink.click()
      document.body.removeChild(fileLink)
      window.URL.revokeObjectURL(fileURL)
    })
  }
}
function handlerDownload(dirHandle: any) {
  const res = []
  fileURLs.value.forEach(async (element, index) => {
    MethodsUtil.writeFileDownload(element, fileNames.value[index], dirHandle).then((response: any) => {
      res.push(response)
    })
  })
  if (res.length > 0)
    toast('WARNING', t('one-or-more-errors-file'))

  else
    toast('SUCCESS', t('downloaded'))
}

async function getInfor(folder: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
}

watch(() => props.listItem, val => {
  fileUpload.value = val
  isDownloading()
})
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="isShowModal"
      persistent
      :is-ok="false"
      :is-cancle="false"
      :title="t('download-file-course')"
      :is-div-space="false"
      size="sm"
      @cancel="onCancel"
    >
      <div class="d-flex align-center mb-6">
        <CpSearch
          v-model:key-search="keyword"
          class="mr-3"
          @update:key-search="handleSearch"
        />
        <CmButtonGroup
          is-load
          :list-item="actionAdd"
          :title="t('download-all')"
          @clickPrepend="dowloadItems(null, 'zip')"
        >
          {{ t('download-all') }}
        </CmButtonGroup>
      </div>
      <div class="mxn-3">
        <CmItemFileUpload
          icon-status
          :files="fileUpload"
          @downloadFile="dowloadItems"
        />
      </div>
      <template #actions>
        <VRow class=" pb-3">
          <VCol>
            <CmButton
              variant="outlined"
              color="secondary"
              class="w-100"
              @click="emit('cancel')"
            >
              {{ t('come-back') }}
            </CmButton>
          </VCol>
        </VRow>
      </template>
    </CmDialogs>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowMdConfirmFile"
      :type="2"
      variant="outlined"
      :max-width="400"
      :confirmation-msg-sub-title="titleModalConfirm"
      :confirmation-msg="modalContentDownloadFile"
      @confirm="selectFolderDownload"
    />
  </div>
</template>
