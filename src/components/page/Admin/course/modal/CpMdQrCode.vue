<script setup lang="ts">
import { imageQr } from '@/constant/ImageBase64'
import DateUtil from '@/utils/DateUtil'
import StringUtil from '@/utils/StringUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  isView: false,
})
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CpMdQrCodeZoom = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdQrCodeZoom.vue'))
const CpMdQrCodeSettime = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdQrCodeSettime.vue'))
interface Props {
  isShowModal: boolean
  disabled?: boolean
  isView?: boolean
  content?: any
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
  (e: 'update', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const LABEL = Object.freeze({
  TITLE: t('feedback-management'),
})
const dataQr = ref({
  qrCode: `data:image/png;base64,${imageQr}`,
  startDateTime: '',
  endDateTime: '',
  dateRollCall: '',
  teacherName: '',
  name: '',
  id: 0,
})
async function onCancel() {
  emit('update:isShowModal', false)
}
const isShowMdQrCodeSettime = ref(false)
const isShowMdQrCodeZoom = ref(false)
const isQrActive = ref(false)
const isHaveQrActive = ref(false)
function handleZoomQR() {
  isShowMdQrCodeZoom.value = true
}
async function getDataQr() {
  const params = {
    id: props.content?.courseContentId,
    rollCallId: route.params.idAttendance,
  }
  await window.requestApiCustom(CourseService.GetQrCode, TYPE_REQUEST.GET, params).then((response: any) => {
    emit('update', response?.data)
    const timeOld = new Date(new Date(response?.data.dateRollCall).getFullYear(), new Date(response?.data.dateRollCall).getMonth(), new Date(response?.data.dateRollCall).getDate()).toDateString()
    const timeNew = new Date(new Date(props.content.dateRollCall).getFullYear(), new Date(props.content.dateRollCall).getMonth(), new Date(props.content.dateRollCall).getDate()).toDateString()

    if (response?.data.qrCode === null) {
      dataQr.value = response?.data
      dataQr.value.qrCode = `data:image/png;base64,${imageQr}`
      isQrActive.value = false
    }
    else if (timeOld !== timeNew) {
      if (route.params.idAttendance)
        toast('ERROR', t('noti-error-rollCall-date'))

      isQrActive.value = false
    }
    else {
      isQrActive.value = true
      dataQr.value = response?.data
      dataQr.value.qrCode = `data:image/png;base64,${response?.data?.qrCode}`
    }
  })
    .catch((error: any) => {
      if (error?.response?.data?.errors?.length > 0)
        toast('ERROR', t(window.getErrorsMessage(error?.response?.data?.errors, t)))
    })
}
function show() {
  if (route.params.idAttendance && !isHaveQrActive.value) {
    getDataQr()
  }
  else if (!route.params.idAttendance) {
    const timeOld = new Date(new Date(dataQr?.value.dateRollCall).getFullYear(), new Date(dataQr?.value.dateRollCall).getMonth(), new Date(dataQr?.value.dateRollCall).getDate()).toDateString()
    const timeNew = new Date(new Date(props.content.dateRollCall).getFullYear(), new Date(props.content.dateRollCall).getMonth(), new Date(props.content.dateRollCall).getDate()).toDateString()
    if (timeOld !== timeNew) {
      isQrActive.value = false
      dataQr.value.id = 0
      emit('update', dataQr.value)
    }
    else { isQrActive.value = !!isHaveQrActive.value }
  }
  else { isQrActive.value = !!isHaveQrActive.value }
}
function handleCreateQrSettime() {
  isShowMdQrCodeSettime.value = true
}
async function handleCreateQr(dateTime: any) {
  const params = {
    courseContentId: props.content?.courseContentId,
    startDateTime: dateTime.startDateTime,
    endDateTime: dateTime.endDateTime,
    dateRollCall: props.content?.dateRollCall,
  }
  await window.requestApiCustom(CourseService.PostCreateQr, TYPE_REQUEST.POST, params).then((response: any) => {
    emit('update', response?.data)
    isShowMdQrCodeSettime.value = false
    if (response?.data.qrCode === null) {
      dataQr.value = response?.data
      dataQr.value.qrCode = `data:image/png;base64,${imageQr}`
      isQrActive.value = false
    }
    else {
      isQrActive.value = true
      isHaveQrActive.value = true
      dataQr.value = response?.data
      dataQr.value.qrCode = `data:image/png;base64,${response?.data?.qrCode}`
      toast('SUCCESS', t('noti-success-qr'))
    }
  })
    .catch((error: any) => {
      if (error?.response?.data?.errors?.length > 0)
        toast('ERROR', t(window.getErrorsMessage(error?.response?.data?.errors, t)))
    })
}
function downloadQr() {
  // Tạo tên tệp
  const filename = 'QR.png'

  // Tải xuống ảnh
  downloadImage(dataQr.value.qrCode, filename)
}
function downloadImage(dataURL: any, filename: any) {
  // Tạo một thẻ a để tải xuống
  const link = document.createElement('a')
  link.href = dataURL
  link.download = filename

  // Tự động bấm vào liên kết để tải xuống
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
onMounted(() => {
  getDataQr()
})
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="isShowModal"
      close-on-back
      is-theme-custom
      :is-ok="false"
      :is-div-space="false"
      @cancel="onCancel"
      @show="show"
    >
      <template #isTheme>
        <VRow class="box-card">
          <VCol
            class="box-card-left"
            cols="6"
          >
            <div class="box-img">
              <img
                src="/logo.png"
                alt="Logo"
              >
            </div>
            <div
              class="box-title"
              :title="dataQr.name || content.name"
            >
              {{ dataQr.name || content.name }}
            </div>
            <div
              class="box-list"
            >
              <div
                class="box-item"
              >
                <div
                  class="box-item-icon"
                  :title="t('date-start')"
                >
                  <VIcon icon="line-md:sun-rising-loop" />
                </div>
                <div class="d-flex box-content align-center justify-space-between">
                  <div class="text-semibold-md">
                    {{ t('date-start') }}:
                  </div>
                  <div v-if="dataQr.startDateTime === '0001-01-01T00:00:00' || !dataQr.startDateTime">
                    -
                  </div>
                  <div v-else>
                    {{ DateUtil.formatTimeToHHmm(dataQr.startDateTime) }} {{ DateUtil.formatDateToDDMM(dataQr.startDateTime) }}
                  </div>
                </div>
              </div>
              <div
                class="box-item"
              >
                <div
                  class="box-item-icon"
                  :title="t('expired-date')"
                >
                  <VIcon icon="line-md:sunny-outline-to-moon-loop-transition" />
                </div>
                <div class="d-flex box-content align-center justify-space-between">
                  <div class="text-semibold-md">
                    {{ t('expired-date') }}:
                  </div>
                  <div v-if="dataQr.endDateTime === '0001-01-01T00:00:00' || !dataQr.endDateTime">
                    -
                  </div>
                  <div v-else>
                    {{ DateUtil.formatTimeToHHmm(dataQr.endDateTime) }} {{ DateUtil.formatDateToDDMM(dataQr.endDateTime) }}
                  </div>
                </div>
              </div>
              <div class="box-item">
                <div
                  class="box-item-icon"
                  :title="t('date-attendance')"
                >
                  <VIcon icon="ion:shield-checkmark" />
                </div>
                <div class="d-flex box-content align-center justify-space-between">
                  <div class="text-semibold-md">
                    {{ t('date-attendance') }}:
                  </div>
                  <div v-if="dataQr.dateRollCall === '0001-01-01T00:00:00' || !dataQr.dateRollCall">
                    -
                  </div>
                  <div v-else>
                    {{ DateUtil.formatTimeToHHmm(dataQr.dateRollCall) }} {{ DateUtil.formatDateToDDMM(dataQr.dateRollCall) }}
                  </div>
                </div>
              </div>
              <div class="box-item">
                <div
                  class="box-item-icon"
                  :title="t('teacher')"
                >
                  <VIcon icon="material-symbols:account-circle" />
                </div>
                <div class="d-flex box-content align-center justify-space-between">
                  <div class="text-semibold-md">
                    {{ t('teacher') }}:
                  </div>
                  <div>
                    {{ dataQr.teacherName || StringUtil.formatFullName(content.firstName, content.lastName) }}
                  </div>
                </div>
              </div>
            </div>
          </VCol>
          <VCol
            class="box-card-right"
            cols="12"
            sm="6"
          >
            <div class="box-right-text-header">
              QR
            </div>
            <div class="box-qr">
              <img
                :src="dataQr.qrCode"
                alt="QR"
                class="img-qr"
              >
              <div
                v-if="!isQrActive"
                class="qr-create"
              >
                <VBtn
                  class="qr-btn"
                  :disabled="disabled"
                  variant="elevated"
                  color="secondary"
                  @click="handleCreateQrSettime"
                >
                  {{ disabled ? t('no-qr') : t('create-qr') }}
                </VBtn>
              </div>
            </div>
            <div
              v-if="isQrActive"
              class="box-action"
            >
              <div class="d-flex">
                <div
                  class="box-icon mr-2"
                >
                  <VIcon
                    class="cursor-pointer"
                    icon="line-md:download-outline-loop"
                    @click="downloadQr"
                  />
                </div>
                <div
                  v-if="!isView"
                  class="box-icon mr-2"
                >
                  <VIcon
                    class="cursor-pointer"
                    icon="tabler:refresh"
                    @click="handleCreateQrSettime"
                  />
                </div>
                <div
                  class="box-icon cursor-pointer"
                  @click="handleZoomQR"
                >
                  <VIcon icon="ic:twotone-zoom-out-map" />
                </div>
              </div>
            </div>
          </VCol>
        </VRow>
      </template>
    </CmDialogs>
    <CpMdQrCodeZoom
      v-model:isShowModal="isShowMdQrCodeZoom"
      :qr-code="dataQr.qrCode"
    />
    <CpMdQrCodeSettime
      v-model:isShowModal="isShowMdQrCodeSettime"
      :content="content"
      @confirm="handleCreateQr"
    />
  </div>
</template>

<style lang="scss">
.box-card{
  border: 10px #fff solid;
  overflow: hidden;
  .box-content{
    width: 85%;
  }
  .box-card-left{
    background-color: #DADDE4;

    .box-title{
      margin-top: 16px;
      text-align: center;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Số hàng tối đa muốn hiển thị */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-inline: 10px;
    }
    .box-item{
      display: flex;
      padding: 12px 0;
    }
    .box-item-icon{
      width: 32px;
      height: 32px;
      background: rgba(var(--v-color-text-primary));
      font-size: 14px;
      border-radius: 50%;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }
    .box-list{
      padding: 24px;
    }
    .box-img{
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 16px;
      img{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 5px solid rgba(var(--v-color-text-primary));
        animation-name: boxShadowOver;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
      @keyframes boxShadowOver {
        0% { box-shadow: 0px 0px 0px 0px #f6f6f6;}
        50% { box-shadow: 0px 0px 11px 0px rgba(var(--v-color-text-primary));}
        100% { box-shadow: 0px 0px 11px 0px #f6f6f6;}
      }

    }

  }
  .box-card-right{
    position: relative;
    background-color: rgb(var(--v-primary-900));
    // background-color: #fff;
    .box-right-text-header{
      color: rgba(var(--v-color-text-primary));
      font-size: 2.5rem;
      text-align: center;
      color: #fff;
    }
    .box-qr{
      width: 17.5rem;
      height: 17.5rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      img{
        border-radius: 16px;
        width: 100%;
        height: 100%;
      }
    }
    .box-action{
      position: absolute;
      bottom: 1.5rem;
      left: 50%;
      transform: translate(-50%, 0);
      .box-icon{
        background-color: #fff;
        width: 48px;
        padding: 8px 12px;
        height: auto;
        border-radius: 8px;
      }
    }
  }
}
.qr-btn {
  width: 100%;
  height: 100% !important;
  font-size: 20px;
  border-radius: 16px;
}
.qr-create {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 0.9;
  border-radius: 16px;
}
@media only screen and (max-width: 600px) {
  .box-card-left {
   display: none;
  }
  .box-card{
    height: 450px;
  }
}
</style>
