<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { contentTypeManagerStore } from '@/stores/admin/course/type/contentContentTypeModify'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import UserService from '@/api/user/index'
import toast from '@/plugins/toast'
import { audioExtention } from '@/constant/Globals'
import ServerFileService from '@/api/server-file/index'
import { load } from '@/stores/loadComponent.js'
import CmAudio from '@/components/common/CmAudio.vue'

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
const storeContentTypeManager = contentTypeManagerStore()
const { contentData, timeComplete, contentId, isViewDetail } = storeToRefs(storeContentTypeManager)
const {
  handleUpdateContent, fetchContent, resetData,
} = storeContentTypeManager
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
  ...(contentData.value.timeTypeId === 2 ? schemaTime : {}),
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
const myFormAddContent = ref()
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
const timeType = ref([1, 2]) // thể loại thời lượng
const time = ref({ selfMinute: 0, selfSecond: 0, contentMinute: 0, contentSecond: 0 })
const timeDuration = ref<any>()
const acceptDownload = ref<any>(false)
const contentFile = ref({
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
  localFileName: null as any,
  localUrl: '',
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

// cập nhật dữ liệu chỉnh sửa
function getDetailDocContent() {
  if (contentData.value.url && contentData.value.url !== null) {
    acceptDownload.value = contentData.value?.acceptDownload
    contentFile.value.localUrl = contentData.value.url
    contentFile.value.haveDocument = true
    contentFile.value.fileFolder = contentData.value.url

    getDocLocalInfo(contentData.value.urlFileName)
    if (contentData.value.timeTypeId === 2) {
      time.value.selfMinute = Math.floor(contentData.value.time / 60)
      time.value.selfSecond = Math.floor(contentData.value.time % 60)
    }
    else {
      time.value.contentMinute = Math.floor(contentData.value.time / 60)
      time.value.contentSecond = Math.floor(contentData.value.time % 60)
    }
  }
  else { contentData.value.timeTypeId = 1 }
}
async function downloadFile(idx: any) {
  MethodsUtil.dowloadSampleFile(`${SERVERFILE}${contentData.value.url}`,
    TYPE_REQUEST.GET, contentFile.value.localFileName || ' local').then((data: any) => {
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
}
function handleDeleteContent(type: any, idx: any) {
  switch (type) {
    case 'local':
      contentFile.value = {
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
        localFileName: null,
        localUrl: '',
      }
      contentData.value.urlFileName = ''
      contentData.value.url = ''
      break

    default:
      break
  }
  unLoadComponent(idx)
}

function handleCancle() {
  router.push({ name: 'course-edit', params: { id: Number(route.params.id) }, query: { tab: 'content' } })
}

// lưu
function saveAndUpdate(idx: any, isUpdate: boolean) {
  if (!isUpdate)
    isUpdate = false
  contentData.value.timeVideoOrSound = Number(time.value.contentMinute) * 60 + Number(time.value.contentSecond)
  contentData.value.time = Number(time.value.selfMinute) * 60 + Number(time.value.selfSecond)
  if (contentData.value.timeTypeId === 1)
    contentData.value.time = Number(time.value.contentMinute) * 60 + Number(time.value.contentSecond)

  else
    contentData.value.time = Number(time.value.selfMinute) * 60 + Number(time.value.selfSecond)

  if (contentData.value.time === 0) {
    toast('WARNING', t('time-min-0'))
    unLoadComponent(idx)
    return
  }

  if (timeComplete.value && contentData.value.time < timeComplete.value) {
    toast('WARNING', t('content-time-less-than-success-time'))
    unLoadComponent(idx)
    return
  }
  myFormAddContent.value.validate().then(async (success: any) => {
    if (success.valid) {
      contentData.value.courseId = Number(route.params.id)
      contentData.value.archiveTypeId = 5
      handleUpdateContent(idx, isUpdate)
    }
    else {
      if (!contentData.value.url) {
        errorsInputFile.value = [t('please-choose-files')]
        toast('ERROR', t('please-choose-files'))
        unLoadComponent(idx)
        return
      }
      unLoadComponent(idx)
    }
  })
}

/** ** upload file*********************** */
async function getDocLocalInfo(folder: any, getFileSize?: any) {
  await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET).then((data: any) => {
    contentFile.value.localFileName = data.fileName
    contentFile.value = {
      ...contentFile.value,
      ...data,
    }

    if (data.isProcessing)
      isLoadingFile.value = false
  })
}

async function getInfor(folder: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
}
function getDuration(file: any) {
  const video = document.createElement('video')
  contentFile.value.file = [file]
  video.preload = 'metadata'
  video.src = URL.createObjectURL(file)

  video.onloadedmetadata = function () {
    window.URL.revokeObjectURL(video.src)
    const { duration } = video
    if (duration) {
      time.value.contentMinute = Math.floor(duration / 60)
      time.value.contentSecond = Math.floor(duration % 60)
    }
  }
}
async function uploadFileLocal(data: any, file: any) {
  isLoadingFile.value = true
  fileUpload.value[0].size = data.size
  fileUpload.value[0].name = data.name
  contentFile.value.localFileName = data.name
  if (data.filePath)
    errorsInputFile.value = []

  if (acceptDownload.value) {
    contentData.value.url = data.filePath
    contentData.value.urlFileName = data.fileFolder
  }
  else if (data?.fileFolder) {
    await getInfor(data?.fileFolder).then((value: any) => {
      if (value?.filePath) {
        contentData.value.url = value.filePath
        contentData.value.urlFileName = data.fileFolder
      }
    })
  }

  contentFile.value.fileFolder = data.fileFolder

  if (contentData.value.name === null || contentData.value.name.length === 0)
    contentData.value.name = data.name
  contentData.value.acceptDownload = acceptDownload.value
  contentFile.value.haveDocument = true

  isLoadingFile.value = false
}
function changeTimeType() {
  if (timeDuration.value) {
    time.value.contentMinute = Math.floor(timeDuration.value / 60)
    time.value.contentSecond = Math.floor(timeDuration.value % 60)
  }
}

/** ******************************** */
getListThematicContent()
if (route.params && route.params.contentId) {
  const id = Number(route.params.contentId)
  contentId.value = id
  fetchContent(id).then(() => {
    getDetailDocContent()
    vSelectOwner.value.currentUserIds = contentData.value.ownerId
    getTeacherOwnerCourse()
  })
}
else {
  getTeacherOwnerCourse()
}

onUnmounted(() => {
  resetData()
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormAddContent"
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
            v-model="contentData.name"
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
            v-model="contentData.themeticId"
            name="categoryTitleId"
          >
            <CmSelect
              :model-value="contentData.themeticId"
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
            v-model="contentData.ownerId"
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
            v-model:model-value="contentData.isApprove"
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
            <div>
              <div class="d-flex align-center mb-6">
                <div class="d-flex align-center mr-4">
                  <CmRadio
                    v-model="contentData.timeTypeId"
                    name="time"
                    :type="1"
                    :value="timeType[0]"
                    @update:model-value="changeTimeType"
                  />
                </div>
                <div class="d-flex align-center mr-4">
                  <div>{{ t('auto-setting-content') }}</div>
                </div>
                <div v-if="contentData.timeTypeId === 1">
                  <div class="d-flex">
                    <Field
                      v-slot="{ field, errors }"
                      v-model="time.contentMinute"
                      name="contentMinute"
                      type="number"
                    >
                      <div class="mr-3">
                        <div class="d-flex align-center">
                          <div class="mr-3 conditon-input">
                            <CmTextField
                              :field="field"
                              type="number"
                              :model-value="time.contentMinute"
                              disabled
                              :min="0"
                              :max="59"
                            />
                          </div>
                          <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                        </div>
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
                        </div>
                      </div>
                    </Field>
                    <Field
                      v-slot="{ field, errors }"
                      v-model="time.contentSecond"
                      name="contentSecond"
                      type="number"
                    >
                      <div class="mr-3">
                        <div class="d-flex align-center">
                          <div class="mr-3 conditon-input">
                            <CmTextField
                              :field="field"
                              disabled
                              :model-value="time.contentSecond"
                              type="number"
                              :min="0"
                              :max="59"
                            />
                          </div>
                          <span class="text-regular-md">{{ t('seconds').toLowerCase() }}</span>
                        </div>
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
                        </div>
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
              <div class="d-flex align-center">
                <div class="d-flex align-center mr-4">
                  <CmRadio
                    v-model="contentData.timeTypeId"
                    name="time"
                    :type="1"
                    :value="timeType[1]"
                  />
                </div>
                <div class="d-flex align-center mr-4">
                  <div>{{ t('auto-setting') }}</div>
                </div>
                <div v-if="contentData.timeTypeId === 2">
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
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
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
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
                        </div>
                      </div>
                    </Field>
                  </div>
                </div>
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
            v-model:model-value="contentData.isCustomTime"
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
              {{ t('choose-file-audio') }}*
            </div>
            <div class="d-flex">
              <Field
                v-model="contentFile.localFileName"
                name="url"
                type="text"
              >
                <CpInputFile
                  v-model="contentFile.file"
                  v-model:accept-download="acceptDownload"
                  class="w-100"
                  :disabled="isViewDetail"
                  :file-name="contentFile.localFileName"
                  :accept="audioExtention"
                  :is-btn-download="false"
                  is-request-file-install
                  :errors="errorsInputFile"
                  :is-secure="!acceptDownload"
                  @change="uploadFileLocal"
                  @onChangeFile="getDuration"
                />
              </Field>
            </div>
          </VCol>
        </VRow>
        <VRow v-if="contentFile.haveDocument">
          <VCol
            cols="12"
            class="d-flex"
          >
            <CmChip
              :color="acceptDownload ? 'primary' : 'error'"
            >
              <span class="text-medium-xs">{{ acceptDownload ? t("Cho phép tải") : t("Không cho phép tải") }}</span>
            </CmChip>
          </VCol>
        </VRow>
        <VRow v-if="contentFile.haveDocument">
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
        <VRow v-if="contentFile.haveDocument">
          <VCol
            id="video-preview"
            cols="12"
            sm="6"
          >
            <CmAudio
              v-model:time="timeDuration"
              width="100"
              :src="contentData?.url"
            />
          </VCol>
        </VRow>
        <VRow v-if="!isLoadingFile && contentFile.haveDocument">
          <VCol
            cols="12"
            sm="6"
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
                v-if="!isViewDetail"
                is-load
                icon="tabler:trash"
                variant="outlined"
                color="error"
                :size-icon="18"
                @click="((idx: any) => handleDeleteContent('local', idx))"
              />
            </div>
          </VCol>
        </VRow>
      </div>
      <div>
        <CpActionFooterEdit
          is-cancel
          is-save
          :is-save-and-update="!contentData.courseContentId || contentData.courseContentId === null"
          :title-cancel="t('come-back')"
          :title-save="t('save')"
          :title-save-and-update="t('save-and-update')"
          @on-save="(idx: any) => saveAndUpdate(idx, false)"
          @on-save-update="(idx: any) => saveAndUpdate(idx, true)"
          @on-cancel="handleCancle"
        />
      </div>
    </Form>
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
