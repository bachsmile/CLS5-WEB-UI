<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { contentDocTypeManagerStore } from '@/stores/admin/course/type/contentDocumentTypeModify'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import UserService from '@/api/user/index'
import toast from '@/plugins/toast'
import Globals from '@/constant/Globals'
import ServerFileService from '@/api/server-file/index'
import { load } from '@/stores/loadComponent.js'

const CpInputFile = defineAsyncComponent(() => import('@/components/page/gereral/CpInputFile.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmRadio = defineAsyncComponent(() => import('@/components/common/CmRadio.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmItemFileUpload = defineAsyncComponent(() => import('@/components/common/CmItemFileUpload.vue'))
const CmPreviewFile = defineAsyncComponent(() => import('@/components/common/CmPreviewFile.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CpMdProcessing = defineAsyncComponent(() => import('@/components/page/gereral/modal/CpMdProcessing.vue'))

/** store */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const route = useRoute()
const router = useRouter()
const storeContentDocTypeModifyManager = contentDocTypeManagerStore()
const { documentData, timeComplete, contentId, isViewDetail } = storeToRefs(storeContentDocTypeModifyManager)
const {
  handleUpdateContent, fetchContent, resetDataDoc,
} = storeContentDocTypeModifyManager
const store = load()
const { unLoadComponent } = store
const schemaInit = reactive({
  name: schemaOption.defaultString,
  url: schemaOption.defaultString,
})
const schemaTime = reactive({
  selfMinute: schemaOption.defaultNumberTime,
  selfSecond: schemaOption.defaultNumberTime,
})
const schema = computed(() => ({
  ...schemaInit,
  ...(documentData.value.timeTypeId === 2 ? schemaTime : {}),
}))

/** state */
const LABEL = Object.freeze({
  TITLE1: `${t('KW_Lesson_Name')}*`,
  TITLE2: t('thematics'),
  TITLE3: t('Teacher'),
  TITLE4: t('auto-approve'),
  TITLE5: t('get-study-time-by-duration'),
  TITLE6: t('setting-speed-video'),
  TITLE7: t('permistion-fringed'),
})
const comboboxThemetic = ref([])
const myFormAddContentDoc = ref()
const errorsInputFile = ref<any>([])
const vSelectOwner = ref<any>({
  listCombobox: [],
  totalRecord: 0,
  pageNumber: 1,
  pageSize: 30,
  search: '',
  excludeList: [],
  currentUserIds: [],
  itemSelected: {} as any,
})
const time = ref({ selfMinute: 0, selfSecond: 0, contentMinute: 0, contentSecond: 0 })
const acceptDownload = ref<any>(false)
const documentFile = ref({
  alterPath: '',
  name: '',
  size: 0,
  processing: 0,
  fileName: '',
  fileType: null,
  fileExtension: '',
  filePath: '',
  fileOrigin: '',
  fileFolder: '',
  haveDocument: false,
  file: [] as any[],
  localDocFileName: null as any,
  localUrl: '',
  urlDownload: '',
})

const uploadFile = ref({
  timer: null as any,
  errUploadFile: false,
  uploadedFileSecure: false,
  uploadedFileNoSecure: false,
})
const fileUpload = ref([{ name: 'Real-Time', icon: 'tabler:file', size: 0, processing: 95 }])
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const isLoadingFile = ref(true)

/** method */
async function getListThematicContent() {
  const params = {
    courseId: Number(route.params.id),
  }

  await MethodsUtil.requestApiCustom(CourseService.GetListThematicContent, TYPE_REQUEST.GET, params).then((value: any) => {
    comboboxThemetic.value = value.data
  })
}
async function isIntersecting() {
  vSelectOwner.value.pageNumber += 1
  getTeacherOwnerCourse(true)
}

// get list teacher
async function getTeacherOwnerCourse(loadMore?: any) {
  // loadMore dùng khi infinity scroll
  const params = {
    pageSize: vSelectOwner.value.pageSize,
    pageNumber: vSelectOwner.value.pageNumber,
    keyword: vSelectOwner.value.search,
    excludeIds: vSelectOwner.value.excludeList,
    currentUserIds: vSelectOwner.value.currentUserIds,
  }
  await MethodsUtil.requestApiCustom(UserService.PostGetTeacher, TYPE_REQUEST.POST, params).then((value: any) => {
    if (value?.data?.pageLists.length) {
      vSelectOwner.value.totalRecord = value.data.totalRecord

      if (loadMore)
        vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.concat(value.data.pageLists)

      else
        vSelectOwner.value.listCombobox = value.data.pageLists
      vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.map((itemValue: any) => ({
        ...itemValue,
        name: `${itemValue.lastName} ${itemValue.firstName}`,
      }))
      if (vSelectOwner.value.itemSelected?.id && !loadMore) {
        const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item.id === vSelectOwner.value.itemSelected.id)
        if (indexOwner === -1) {
          vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value.itemSelected)
          vSelectOwner.value.excludeList = [vSelectOwner.value.itemSelected.id]
        }
      }
    }
    else {
      vSelectOwner.value.listCombobox = []
      vSelectOwner.value.totalRecord = 0
    }
  })
}

async function getDocLocalInfo(folder: any, getFileSize?: any) {
  await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET).then((data: any) => {
    documentFile.value.localDocFileName = data.fileName
    documentFile.value = {
      ...documentFile.value,
      ...data,
    }
    console.log(data)

    if (data.isProcessing)
      isLoadingFile.value = false
  })
}
async function getDocLocalInfoFileDown(folder: any, getFileSize?: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET).then((data: any) => data.filePath)
}

// cập nhật dữ liệu chỉnh sửa
function getDetailDocContent() {
  if (documentData.value.url && documentData.value.url !== null) {
    documentFile.value.localUrl = documentData.value.url
    documentFile.value.haveDocument = true
    documentFile.value.fileFolder = documentData.value.url

    getDocLocalInfo(documentData.value.url)
    if (documentData.value.timeTypeId === 2) {
      time.value.selfMinute = Math.floor(documentData.value.time / 60)
      time.value.selfSecond = Math.floor(documentData.value.time % 60)
    }
    else {
      time.value.contentMinute = Math.floor(documentData.value.time / 60)
      time.value.contentSecond = Math.floor(documentData.value.time % 60)
    }
  }
  else { documentData.value.timeTypeId = 1 }
}
async function downloadFile(idx: any) {
  await getDocLocalInfoFileDown(documentData.value.urlFileName).then(value => {
    MethodsUtil.dowloadSampleFile(`${SERVERFILE}${value}`,
      TYPE_REQUEST.GET, documentFile.value.fileName || ' local').then((data: any) => {
      unLoadComponent(idx)
      if (data.status === 200)
        return true

      else
        toast('WARNING', t('download-file-failed'))
    })
      .catch(() => {
        unLoadComponent(idx)
      })
    unLoadComponent(idx)
  })
}
function handleDeleteDoc(type: any, idx: any) {
  switch (type) {
    case 'local':
      documentFile.value = {
        alterPath: '',
        urlDownload: '',
        name: '',
        size: 0,
        processing: 0,
        fileName: '',
        fileType: null,
        fileExtension: '',
        filePath: '',
        fileOrigin: '',
        fileFolder: '',
        haveDocument: false,
        file: [] as any[],
        localDocFileName: null,
        localUrl: '',
      }
      documentData.value.urlFileName = ''
      break

    default:
      break
  }
  unLoadComponent(idx)
}

async function upFileServerAcceptDownload(file: any) {
  const model = {
    files: file,
    isSecure: true,
  }
  const data = await MethodsUtil.uploadFile(model)
  documentFile.value.fileFolder = data.fileFolder
  getDocLocalInfo(data.filePath, true)
  clearTimeout(uploadFile.value.timer)
}
function uploadDocLocal(data: any, file: any) {
  fileUpload.value[0].size = data.size
  fileUpload.value[0].name = data.name
  documentFile.value.fileFolder = data.fileFolder
  documentFile.value.urlDownload = data.filePath
  documentData.value.urlFileName = data.fileFolder

  if (documentData.value.name === null || documentData.value.name.length === 0)
    documentData.value.name = data.name
  documentData.value.acceptDownload = acceptDownload.value
  documentFile.value.haveDocument = true

  isLoadingFile.value = true

  if (acceptDownload.value) {
    uploadFile.value.timer = setTimeout(() => {
    // Delay 500ms để bắt sự kiện khi cổng hết dung lượng sẽ k upload lần 2
      if (acceptDownload.value && !uploadFile.value.errUploadFile)
        upFileServerAcceptDownload(file)
    }, 500)
  }
  else {
    isLoadingFile.value = false
    getDocLocalInfo(data.filePath, true)
  }
}

// cnd
const isShowModalProcessing = ref(false)
const uploadRequestsCdn = ref<any>([])
const filesDataCdn = ref(
  {
    name: '',
    icon: 'tabler:file',
    size: 0,
    processing: 50,
    fileName: '',
    fileType: null,
    fileExtension: '',
    filePath: '',
    fileOrigin: '',
    fileFolder: '',
  },
)

function cancelProcessing(index: any) {
  if (!window._.isEmpty(uploadRequestsCdn.value[index])) {
    uploadRequestsCdn.value[index].cancelTokenSource.cancel('Hủy cuộc gọi')
    uploadRequestsCdn.value[index].request.cancel() // Hủy cuộc gọi Axios
    uploadRequestsCdn.value.splice(index, 1)
  }
}
function handleCancle() {
  router.push({ name: 'course-edit', params: { tab: 'content', id: Number(route.params.id) } })
}

// lưu
function saveAndUpdate(idx: any, isUpdate: boolean) {
  if (!isUpdate)
    isUpdate = false

  documentData.value.time = Number(time.value.selfMinute) * 60 + Number(time.value.selfSecond)

  if (documentData.value.time === 0) {
    toast('WARNING', t('time-min-0'))
    unLoadComponent(idx)
    return
  }

  if (timeComplete.value && documentData.value.time < timeComplete.value) {
    toast('WARNING', t('content-time-less-than-success-time'))
    unLoadComponent(idx)
    return
  }
  myFormAddContentDoc.value.validate().then(async (success: any) => {
    if (success.valid) {
      documentData.value.courseId = Number(route.params.id)
      documentData.value.archiveTypeId = 6

      documentData.value.url = documentFile.value.fileFolder
      handleUpdateContent(idx, isUpdate)
    }
    else {
      unLoadComponent(idx)
    }
  })
}

getListThematicContent()
if (route.params && route.params.contentId) {
  const id = Number(route.params.contentId)
  contentId.value = id
  fetchContent(id).then(() => {
    getDetailDocContent()
    vSelectOwner.value.currentUserIds = documentData.value.ownerId
    getTeacherOwnerCourse()
  })
}
else {
  getTeacherOwnerCourse()
}

onUnmounted(() => {
  resetDataDoc()
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormAddContentDoc"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="documentData.name"
            name="name"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="LABEL.TITLE1"
              :placeholder="LABEL.TITLE1"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="documentData.themeticId"
            name="categoryTitleId"
          >
            <CmSelect
              :model-value="documentData.themeticId"
              :field="field"
              :errors="errors"
              :items="comboboxThemetic"
              item-value="key"
              custom-key="value"
              :text="LABEL.TITLE2"
              :placeholder="LABEL.TITLE2"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <CmSelect
            v-model="documentData.ownerId"
            :text="LABEL.TITLE3"
            :placeholder="LABEL.TITLE3"
            :items="vSelectOwner.listCombobox"
            is-infinity-scroll
            :total-record="vSelectOwner.totalRecord"
            item-value="id"
            custom-key="name"
            :append-to-body="false"
            @isIntersecting="isIntersecting"
          >
            <template #infinityItem>
              <SkUser
                :number="2"
              />
            </template>
          </CmSelect>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div class="mb-3 text-medium-sm">
            {{ t('setting') }}
          </div>
          <CmCheckBox
            v-model:model-value="documentData.isApprove"
            :label="LABEL.TITLE4"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div class="text-semibold-md color-text-900 mb-4 ">
            {{ t('duration-time') }}
          </div>
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <div>{{ t('duration-time') }}</div>
            </div>
            <div>
              <div class="d-flex">
                <Field
                  v-slot="{ field, errors }"
                  v-model="time.selfMinute"
                  name="selfMinute"
                  type="number"
                >
                  <div class="mr-3">
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          :field="field"
                          type="number"
                          :min="0"
                          :max="59"
                        />
                      </div>
                      <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                    </div>
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
                <Field
                  v-slot="{ field, errors }"
                  v-model="time.selfSecond"
                  name="selfSecond"
                >
                  <div class="mr-3">
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          :field="field"
                          type="number"
                          :min="0"
                          :max="59"
                        />
                      </div>
                      <span class="text-regular-md">{{ t('seconds').toLowerCase() }}</span>
                    </div>
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow class="mb-4">
        <VCol
          cols="12"
        >
          <CmCheckBox
            v-model:model-value="documentData.isCustomTime"
            :label="LABEL.TITLE5"
          />
        </VCol>
      </VRow>

      <div>
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <div class="mb-1">
              {{ t('choose-file-doc') }}*
            </div>
            <div class="d-flex">
              <Field
                v-model="documentFile.localDocFileName"
                name="url"
                type="text"
              >
                <CpInputFile
                  v-model="documentFile.file"
                  v-model:accept-download="acceptDownload"
                  class="w-100"
                  :disabled="isViewDetail"
                  :file-name="documentFile.localDocFileName"
                  :accept="Globals.documentExtention"
                  :is-btn-download="false"
                  is-request-file-install
                  :errors="errorsInputFile"
                  :is-secure="!acceptDownload"
                  @change="uploadDocLocal"
                />
              </Field>
            </div>
          </VCol>
        </VRow>
        <VRow v-if="documentFile.haveDocument">
          <VCol
            cols="12"
            class="d-flex"
          >
            <CmChip
              :color="acceptDownload ? 'primary' : 'error'"
            >
              <span>{{ acceptDownload ? t("Cho phép tải") : t("Không cho phép tải") }}</span>
            </CmChip>
          </VCol>
        </VRow>
        <VRow v-if="documentFile.haveDocument">
          <VCol
            v-if="isLoadingFile"
            cols="12"
            sm="6"
          >
            <div>
              <CmItemFileUpload
                :icon-status="false"
                :files="fileUpload"
              />
            </div>
          </VCol>
        </VRow>
        <VRow v-if="documentFile.haveDocument">
          <VCol
            id="video-preview"
            cols="12"
            sm="6"
            offset="3"
          >
            <CmPreviewFile
              width="100"
              :src="documentFile?.filePath"
              :file-folder="documentFile?.fileFolder"
              :is-loading-file="isLoadingFile"
            />
          </VCol>
        </VRow>
        <VRow v-if="!isLoadingFile && documentFile.haveDocument">
          <VCol
            cols="12"
            sm="6"
            offset="3"
          >
            <div class=" d-flex justify-center">
              <CmButton
                v-if="!isViewDetail && acceptDownload"
                class="mr-2"
                variant="outlined"
                is-load
                icon="tabler:download"
                :size-icon="18"
                @click="downloadFile"
              />
              <CmButton
                v-if="!isViewDetail && documentFile.urlDownload"
                is-load
                icon="tabler:trash"
                variant="outlined"
                color="error"
                :size-icon="18"
                @click="((idx: any) => handleDeleteDoc('local', idx))"
              />
            </div>
          </VCol>
        </VRow>
      </div>
      <div>
        <CpActionFooterEdit
          is-cancel
          is-save
          :is-save-and-update="!documentData.courseContentId || documentData.courseContentId === null"
          :title-cancel="t('come-back')"
          :title-save="t('save')"
          :title-save-and-update="t('save-and-update')"
          @on-save="(idx: any) => saveAndUpdate(idx, false)"
          @on-save-update="(idx: any) => saveAndUpdate(idx, true)"
          @on-cancel="handleCancle"
        />
      </div>
    </Form>
    <CpMdProcessing
      v-model:is-show-modal="isShowModalProcessing"
      :files="[filesDataCdn]"
      @cancel="cancelProcessing"
    />
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.embed-responsive {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}
.embed-responsive embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.message-progess{
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
</style>
