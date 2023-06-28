<script setup lang="ts">
import axios from 'axios'
import moment from 'moment'
import { validatorStore } from '@/stores/validatator'
import { contentTypeManagerStore } from '@/stores/admin/course/type/contentVideoTypeModify'
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
const CmVideoJs = defineAsyncComponent(() => import('@/components/common/CmVideoJs.vue'))
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
const storeContentVideoTypeModifyManager = contentTypeManagerStore()
const { videoData, timeComplete, contentId, isViewDetail } = storeToRefs(storeContentVideoTypeModifyManager)
const {
  handleUpdateContent, fetchContent, resetDataVideo,
} = storeContentVideoTypeModifyManager
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
  ...(videoData.value.timeTypeId === 2 ? schemaTime : {}),
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
const myFormAddContentVideo = ref()
const urlEncode = ref()
const serverCode = ref()
const errorsInputFile = ref<any>([])
const sizeFile = ref(0)
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
const myFormAddTime = ref()
const time = ref({ selfMinute: 0, selfSecond: 0, contentMinute: 0, contentSecond: 0 })
const timeType = ref([1, 2]) // thể loại thời lượng
const videoType = ref('youtube') // thể loại video upload
const acceptDownload = ref<any>(false)

// Video youtube variable
const youtube = reactive({
  youtubeOrginUrl: 'https://www.youtube.com/',
  youtubePrefix: 'https://www.youtube.com/watch?v=',
  haveVideoYoutube: false,
  youtubeUrl: null as any,
  iframeUrl: null as any,
})

// Video local variable
const localFile = ref({
  localUrl: '',
  urlEncode: null,
  haveVideoLocal: false,
  localVideoFileName: null,
  file: [] as any[],
})

// video cdn
const cdn = reactive({
  haveVideoCdn: false,
  cdnUrl: '',
})
const intervalLoadingLocalFile = ref<any>()
const fileUpload = ref([{ name: 'Real-Time', icon: 'tabler:file', size: 0, processing: 95 }])
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const isLoadingVideo = ref(true)

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

// lấy id youtube
function getYoutubeId(url: string) {
  let videoId = url.split('v=')[1]
  const ampersandPosition = videoId.indexOf('&')
  if (ampersandPosition !== -1)
    videoId = videoId.substring(0, ampersandPosition)

  return videoId
}

// lấy thời gian youtube
async function getYoutubeDuration(id: any) {
  await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails&key=AIzaSyBa5drRTp_wRhS7n4PpdAzXkJJeLCcGCh4`)
    .then((value: any) => {
      const { duration } = value?.data.items[0].contentDetails
      const timeDuration: any = moment.duration(duration)

      time.value.contentMinute = timeDuration._data.minutes + timeDuration._data.hours * 60 + timeDuration._data.days * 24 * 60 // months + years

      time.value.contentSecond = timeDuration._data.seconds
    })
}

// thêm video youtube
function addVideoYoutube() {
  const strs = youtube.youtubeUrl?.split(youtube.youtubePrefix)
  if (strs.length < 2) {
    toast('ERROR', t('not-youtube-format'))
    youtube.haveVideoYoutube = false
  }
  else {
    const youtubeId = getYoutubeId(youtube.youtubeUrl)
    youtube.iframeUrl = `https://www.youtube.com/embed/${youtubeId}`
    youtube.haveVideoYoutube = true
    videoData.value.acceptDownload = false
    if (videoData.value.name === null || videoData.value.name.length === 0)
      videoData.value.name = youtubeId

    getYoutubeDuration(youtubeId)
  }
}

// thời gian media
async function getDurationContent() {
  if (videoType.value === 'youtube') {
    const youtubeId = (youtube.youtubeUrl)
    await getYoutubeDuration(youtubeId)
  }
  else if (videoType.value === 'local') {
    const videoPreview = document.querySelector('#video-preview')

    const videoTag = videoPreview?.getElementsByTagName('video') || []
    if (videoTag[0] && videoTag[0]?.duration) {
      const { duration } = videoTag[0]
      time.value.contentMinute = Math.floor(Math.ceil(duration) / 60)
      time.value.contentSecond = Math.floor(Math.ceil(duration) % 60)
    }
  }
  else if (videoType.value === 'cdn') {
    await getCdnVideoTime()
  }
}
function getDuration(file: any) {
  const video = document.createElement('video')
  localFile.value.file = [file]
  video.preload = 'metadata'
  video.src = URL.createObjectURL(file)

  video.onloadedmetadata = function () {
    window.URL.revokeObjectURL(video.src)
    const { duration } = video
    if (duration) {
      time.value.contentMinute = Math.floor(Math.ceil(duration) / 60)
      time.value.contentSecond = Math.floor(Math.ceil(duration) % 60)
    }
  }
}
async function getVideoLocalInfo(folder: any, getFileSize?: any) {
  const data = await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
  localFile.value.localVideoFileName = data.fileName
  videoData.value.urlFileName = data.fileName
  if (acceptDownload.value && data.filePath) {
    // video cho phép tải( không mã hóa)
    localFile.value.localUrl = data.filePath
  }
  if (data.isProcessing && !getFileSize) {
    if (data?.serverCode && data?.serverCode !== serverCode.value)
      serverCode.value = data.serverCode
    clearTimeout(intervalLoadingLocalFile.value)
    intervalLoadingLocalFile.value = null
    isLoadingVideo.value = false
  }
}

// cập nhật dữ liệu chỉnh sửa
function getDetailVideoContent() {
  if (videoData.value.url && videoData.value.url !== null) {
    if (videoData.value.urlCdn) {
      videoType.value = 'cdn'
      cdn.cdnUrl = videoData.value.url
      isLoadingVideo.value = false
      getCdnFileInfo(cdn.cdnUrl)
    }
    else if (videoData.value.url.includes(youtube.youtubeOrginUrl) === true) {
      videoType.value = 'youtube'
      youtube.youtubeUrl = videoData.value.url
      youtube.haveVideoYoutube = true
      const youtubeId = getYoutubeId(youtube.youtubeUrl)
      youtube.iframeUrl = `https://www.youtube.com/embed/${youtubeId}`
    }
    else {
      videoType.value = 'local'
      localFile.value.localUrl = videoData.value.url
      localFile.value.haveVideoLocal = true
      getVideoLocalInfo(videoData.value.acceptDownload ? videoData.value.urlFileName : videoData.value.url)
    }
    if (videoData.value.timeTypeId === 2) {
      time.value.selfMinute = Math.floor(videoData.value.time / 60)
      time.value.selfSecond = Math.floor(videoData.value.time % 60)
    }
    else {
      time.value.contentMinute = Math.floor(videoData.value.time / 60)
      time.value.contentSecond = Math.floor(videoData.value.time % 60)
    }
  }
  else { videoData.value.timeTypeId = 1 }
}
async function downloadFile(idx: any) {
  MethodsUtil.dowloadSampleFile(`${SERVERFILE}${localFile.value.localUrl}`,
    TYPE_REQUEST.GET, localFile.value.localVideoFileName || 'video local').then((data: any) => {
    unLoadComponent(idx)
    if (data.status === 200) {
      //
    }
    else {
      toast('WARNING', t('download-file-failed'))
    }
  })
    .catch(() => {
      unLoadComponent(idx)
    })
}
function handleDeleteVideo(type: any, idx: any) {
  switch (type) {
    case 'local':
      localFile.value = {
        localUrl: '',
        urlEncode: null,
        haveVideoLocal: false,
        localVideoFileName: null,
        file: [] as any[],
      }
      videoData.value.urlFileName = ''
      break

    default:
      break
  }
  unLoadComponent(idx)
}
function uploadVideoLocal(data: any) {
  fileUpload.value[0].size = data.size
  fileUpload.value[0].name = data.name
  urlEncode.value = data.filePath
  if (!acceptDownload.value)
    localFile.value.localUrl = data.filePath
  if (videoData.value.name === null || videoData.value.name.length === 0)
    videoData.value.name = data.name
  videoData.value.acceptDownload = acceptDownload.value
  localFile.value.haveVideoLocal = true
  isLoadingVideo.value = true
  getVideoLocalInfo(data.filePath, true)
  intervalLoadingLocalFile.value = setInterval(() => {
    getVideoLocalInfo(data.filePath)
  }, 4000)
}

// cnd
const isShowModalProcessing = ref(false)
const isLoadingVideoCnd = ref(false)
const intervalLoadingCndFile = ref()
const serverCodeCdn = ref()
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
async function getCdnFileInfo(cdnUrlLink: any) {
  await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${cdnUrlLink}`, TYPE_REQUEST.GET)
    .then((data: any) => {
      cdn.haveVideoCdn = true
      if (data?.isProcessing) {
        if (data?.serverCode && data?.serverCode !== serverCodeCdn.value)
          serverCodeCdn.value = data.serverCode

        isLoadingVideoCnd.value = false
        clearTimeout(intervalLoadingCndFile.value)
        intervalLoadingCndFile.value = null
      }
    })
}
async function getCdnVideoTime() {
  const params = {
    cdn: 'https://cdnprod.masterkorean.vn/',
    url: videoData.value.urlCdn,
    secretKey: 'maiwoodei6oophieloh1thak9ahphuch',
  }

  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetCdnVideoTime}`, TYPE_REQUEST.GET, params).then((data: any) => {
    if (data && data.duration) {
      time.value.contentMinute = Math.floor(Math.ceil(data.duration) / 60)
      time.value.contentSecond = Math.floor(Math.ceil(data.duration) % 60)
      return true
    }
    return false
  })
}
async function uploadCdnVideo(idx: any) {
  const isHaveTime = await getCdnVideoTime()

  const params = {
    isBackground: true,
    fileType: 'Video',
    isSecure: true,
    cdn: 'https://cdnprod.masterkorean.vn/',
    url: videoData.value.urlCdn,
    secretKey: 'maiwoodei6oophieloh1thak9ahphuch',
  }

  filesDataCdn.value.name = videoData.value.urlCdn
  isShowModalProcessing.value = true
  await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.UploadFileCnd}`, TYPE_REQUEST.POST, params).then((data: any) => {
    setTimeout(() => {
      isShowModalProcessing.value = false
    }, 1000)
    unLoadComponent(idx)
    if (data) {
      isLoadingVideoCnd.value = true
      cdn.haveVideoCdn = true
      cdn.cdnUrl = data.fileFolder
      videoData.value.timeTypeId = isHaveTime ? 1 : 2
      intervalLoadingCndFile.value = setInterval(() => {
        getCdnFileInfo(cdn.cdnUrl)
      }, 4000)
    }
  })
    .catch(() => {
      isShowModalProcessing.value = false
      unLoadComponent(idx)
    })
}
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
  videoData.value.timeVideoOrSound = Number(time.value.contentMinute) * 60 + Number(time.value.contentSecond)
  if (videoData.value.timeTypeId === 1)
    videoData.value.time = Number(time.value.contentMinute) * 60 + Number(time.value.contentSecond)

  else
    videoData.value.time = Number(time.value.selfMinute) * 60 + Number(time.value.selfSecond)

  if (videoData.value.time === 0) {
    toast('WARNING', t('time-min-0'))
    unLoadComponent(idx)
    return
  }

  if (timeComplete.value && videoData.value.time < timeComplete.value) {
    toast('WARNING', t('content-time-less-than-success-time'))
    unLoadComponent(idx)
    return
  }
  myFormAddContentVideo.value.validate().then(async (success: any) => {
    if (success.valid) {
      videoData.value.courseId = Number(route.params.id)
      videoData.value.archiveTypeId = 4
      if (videoType.value === 'youtube') {
        videoData.value.url = youtube.youtubeUrl
        videoData.value.urlCdn = ''
        videoData.value.isRewind = false
      }
      else if (videoType.value === 'local') {
        videoData.value.url = localFile.value.localUrl
        if (acceptDownload.value)
          videoData.value.urlFileName = localFile.value.urlEncode

        videoData.value.urlCdn = ''
      }
      else { videoData.value.url = cdn.cdnUrl }

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
    getDetailVideoContent()
    vSelectOwner.value.currentUserIds = videoData.value.ownerId
    getTeacherOwnerCourse()
  })
}
else {
  getTeacherOwnerCourse()
}

onUnmounted(() => {
  resetDataVideo()
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormAddContentVideo"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow class="mb-4">
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="videoData.name"
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
        >
          <Field
            v-slot="{ field, errors }"
            v-model="videoData.themeticId"
            name="categoryTitleId"
          >
            <CmSelect
              :model-value="videoData.themeticId"
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
          sm="4"
        >
          <CmSelect
            v-model="videoData.ownerId"
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
      <VRow class="mb-4">
        <VCol
          cols="12"
        >
          <div class="mb-4 text-medium-sm">
            {{ t('setting') }}
          </div>
          <CmCheckBox
            v-model:model-value="videoData.isApprove"
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
          <div class="d-flex align-center mb-6">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="videoData.timeTypeId"
                name="time"
                :type="1"
                :value="timeType[0]"
                @update:model-value="getDurationContent"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('auto-setting-content') }}</div>
            </div>
            <div v-if="videoData.timeTypeId === 1">
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
                    <div class="styleError text-errors">
                      {{ errors[0] }}
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
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="videoData.timeTypeId"
                name="time"
                :type="1"
                :value="timeType[1]"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('auto-setting') }}</div>
            </div>
            <div v-if="videoData.timeTypeId === 2">
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
            v-model:model-value="videoData.isCustomTime"
            :label="LABEL.TITLE5"
          />
        </VCol>
      </VRow>
      <div class="mb-4">
        <div class="text-semibold-md color-text-900 mb-4 ">
          {{ t("choose-video-content") }}
        </div>
        <div class="d-flex align-center mb-6">
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="videoType"
                :type="1"
                name="video-type"
                value="youtube"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('use-video-youtobe') }}</div>
            </div>
          </div>
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="videoType"
                :type="1"
                name="video-type"
                value="local"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('use-video-local') }}</div>
            </div>
          </div>
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="videoType"
                :type="1"
                name="video-type"
                value="cdn"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('use-video-cdn') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="videoType === 'youtube'">
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <div class="mb-1">
              {{ t('address-youtube') }}*
            </div>
            <div class="d-flex">
              <Field
                v-slot="{ field, errors }"
                v-model="youtube.youtubeUrl"
                name="url"
                type="text"
              >
                <CmTextField
                  :field="field"
                  :errors="errors"
                  :disabled="isViewDetail"
                  :placeholder="t('enter-link')"
                  class="mr-3 w-100"
                />
              </Field>
              <CmButton
                v-if="isViewDetail !== true"
                :disabled="!youtube.youtubeUrl || youtube.youtubeUrl?.length === 0"
                @click="addVideoYoutube"
              >
                {{ t("search") }}
              </CmButton>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
          >
            <CmCheckBox
              v-model:model-value="videoData.isSpeed"
              :label="LABEL.TITLE6"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <div
              v-if="youtube.haveVideoYoutube"
              class="embed-responsive"
            >
              <embed
                :src="youtube.iframeUrl"
              >
            </div>
          </VCol>
        </VRow>
      </div>
      <div v-if="videoType === 'local'">
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <div class="mb-1">
              {{ t('choose-file-video') }}*
            </div>
            <div class="d-flex">
              <Field
                v-model="localFile.localVideoFileName"
                name="url"
                type="text"
              >
                <CpInputFile
                  v-model="localFile.file"
                  v-model:accept-download="acceptDownload"
                  class="w-100"
                  :disabled="isViewDetail"
                  :file-name="videoData.urlFileName"
                  :accept="acceptDownload ? '.mp4' : Globals.videoExtention"
                  :is-btn-download="false"
                  is-request-file-install
                  :is-background="true"
                  :errors="errorsInputFile"
                  :is-secure="!acceptDownload"
                  @change="uploadVideoLocal"
                  @onChangeFile="getDuration"
                />
              </Field>
            </div>
          </VCol>
        </VRow>
        <VRow v-if="localFile.haveVideoLocal">
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
        <VRow>
          <VCol
            cols="12"
            class="d-flex"
          >
            <CmCheckBox
              v-model:model-value="videoData.isRewind"
              class="mr-6"
              :label="LABEL.TITLE7"
            />
            <CmCheckBox
              v-model:model-value="videoData.isSpeed"
              :label="LABEL.TITLE6"
            />
          </VCol>
        </VRow>

        <VRow v-if="localFile.haveVideoLocal">
          <VCol
            v-if="isLoadingVideo"
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
        <VRow v-if="localFile.haveVideoLocal">
          <VCol
            v-if="!isLoadingVideo"
            id="video-preview"
            cols="12"
            sm="6"
          >
            <CmVideoJs
              v-if="!acceptDownload && localFile.localUrl"
              :is-secure="!acceptDownload"
              :src="localFile.localUrl"
              :server-code="serverCode"
            />
            <div
              v-else
              class="embed-responsive"
            >
              <embed
                :src="`${SERVERFILE}${localFile.localUrl}`"
              >
            </div>
          </VCol>
        </VRow>
        <VRow v-if="!isLoadingVideo && localFile.haveVideoLocal">
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
                v-if="!isViewDetail && localFile.localUrl"
                is-load
                icon="tabler:trash"
                variant="outlined"
                color="error"
                :size-icon="18"
                @click="((idx: any) => handleDeleteVideo('local', idx))"
              />
            </div>
          </VCol>
        </VRow>
      </div>
      <div v-if="videoType === 'cdn'">
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <div class="mb-1">
              {{ t('choose-file-cdn') }}*
            </div>
            <div class="d-flex">
              <Field
                v-slot="{ field, errors }"
                v-model="videoData.urlCdn"
                name="url"
                type="text"
              >
                <CmTextField
                  :field="field"
                  :errors="errors"
                  :disabled="isViewDetail"
                  :placeholder="t('choose-file-cdn')"
                  class="mr-3 w-100"
                />
              </Field>
              <CmButton
                v-if="!isViewDetail"
                is-load
                :disabled="!videoData.urlCdn "
                @click="
                  uploadCdnVideo"
              >
                {{ t("search") }}
              </CmButton>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
            class="d-flex"
          >
            <CmCheckBox
              v-model:model-value="videoData.isRewind"
              class="mr-6"
              :label="LABEL.TITLE7"
            />
            <CmCheckBox
              v-model:model-value="videoData.isSpeed"
              :label="LABEL.TITLE6"
            />
          </VCol>
        </VRow>

        <VRow v-if="cdn.cdnUrl">
          <VCol
            v-if="isLoadingVideoCnd"
            cols="12"
            sm="6"
          >
            <div>
              <CmItemFileUpload
                :icon-status="false"
                :files="[filesDataCdn]"
              />
            </div>
          </VCol>
        </VRow>
        <VRow v-if="cdn.cdnUrl">
          <VCol
            v-if="!isLoadingVideoCnd"
            cols="12"
            sm="6"
          >
            <CmVideoJs
              v-if="cdn.cdnUrl"
              :src="cdn.cdnUrl"
              :server-code="serverCodeCdn"
            />
          </VCol>
        </VRow>
      </div>
      <div>
        <CpActionFooterEdit
          is-cancel
          is-save
          :is-save-and-update="!videoData.courseContentId || videoData.courseContentId === null"
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
