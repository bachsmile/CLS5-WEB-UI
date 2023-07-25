<script lang="ts" setup>
import CmAvatar from '@/components/common/CmAvatar.vue'
import CmBadge from '@/components/common/CmBadge.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CommonService from '@/api/common'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import { avatar } from '@/constant/Globals'
import type { typeVariant } from '@/typescript/enums/enums'

interface Props {
  src?: string
  color?: string
  variant?: typeof typeVariant[number]
  tooltip?: string
  isIconText?: boolean
  icon?: string
  iconText?: string
  isRounded?: string | number | boolean
  isAvatar?: boolean
  offsetX?: number
  offsetY?: number
  size?: number // kích thước theo cài đặt
  isSizeFull?: boolean // kích thước full cha
  isBadge?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), ({
  src: '',
  color: 'primary',
  variant: 'tonal',
  isIconText: false,
  isRounded: false,
  isAvatar: false,
  offsetX: avatar.offsetX,
  offsetY: avatar.offsetY,
  size: avatar.size,
  icon: '',
  isBadge: false,
}))

/** ** Khởi tạo prop emit */
const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
interface Emit {
  (e: 'update:src', idxBtn: number): void
}
const inputImage = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const serverfile = window.SERVER_FILE || ''
const isLoadingImg = ref(false)

function hanleClickAvatar() {
  inputImage.value?.click()
}

async function uploadFile(model: any) {
  isLoadingImg.value = true
  const formData = new FormData()

  formData.append('IsSecure', model.isSecure)

  formData.append('files', model.files)
  if (model.IsBackground)
    formData.append('IsBackground ', model.IsBackground)
  if (model.fileType)
    formData.append('FileType', model.fileType)
  const userData = JSON.parse(`${window.localStorage.getItem('userData')}`)
  if (userData)
    formData.append('UserId', userData.id)

  try {
    const res = await MethodsUtil.requestApiCustom(CommonService.SERVERFILE, TYPE_REQUEST.POST, formData).then((value: any) => value)
    if (res.filePath)
      toast('SUCCESS', t('common.upload-file-success'))

    isLoadingImg.value = false
    return res
  }
  catch (err: any) {
    if (err?.response?.data?.message)
      toast('ERROR', err.response.data.message)

    return err?.response?.data
  }
}

async function onFileSelected(e: any) {
  const tmpFiles = e.target.files || e.dataTransfer.files
  if (!tmpFiles.length)
    return
  const file = tmpFiles[0]

  const model = {
    files: file,
    isSecure: false,
  }

  isLoading.value = true

  const data = await uploadFile(model)
  if (data?.filePath)
    emit('update:src', data.filePath)
}

const urlImageFile = computed(() => {
  if (props.src)
    return props.src.startsWith('http') ? props.src : serverfile + props.src

  return null
})
</script>

<template>
  <VTooltip>
    <div v-html="tooltip" />
    <template #activator="propsValue">
      <CmBadge
        v-if="isBadge"
        v-bind="propsValue.props"
        :offset-x="offsetX"
        :offset-y="offsetY"
        icon="fe:edit"
        :color="color"
        :loading="isLoading"
        @click="hanleClickAvatar"
      >
        <CmAvatar
          :color="isLoadingImg ? 'white' : color"
          :src="urlImageFile"
          is-classic-border
          :size="size"
          :rounded="isRounded"
          :is-avatar="isAvatar"
          :variant="variant"
          :icon="icon"
          :class="{ 'w-100 h-100': isSizeFull }"
        >
          <span v-if="isIconText">{{ iconText }}</span>
        </CmAvatar>
      </CmBadge>
      <CmAvatar
        v-else
        :is-loading="isLoadingImg"
        :color="isLoadingImg ? 'white' : color"
        :src="urlImageFile"
        v-bind="propsValue.props"
        :variant="variant"
        is-classic-border
        :size="size"
        :rounded="isRounded"
        :is-avatar="isAvatar"
        :icon="icon"
        :is-text="isLoadingImg"
        :class="{ 'w-100 h-100': isSizeFull }"
        @click="hanleClickAvatar"
      >
        <span v-if="isIconText">{{ iconText }}</span>
      </CmAvatar>
      <VFileInput
        ref="inputImage"
        :disabled="disabled"
        class="d-none"
        label="Select a file"
        outlined
        dense
        hide-details
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
        @change="onFileSelected"
      />
    </template>
  </VTooltip>
</template>
