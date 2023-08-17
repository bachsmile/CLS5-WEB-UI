<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import CmDropDown from '@/components/common/CmDropDown.vue'

interface Props {
  disabled?: boolean
  disabledDel?: boolean
  type: any // 1: list 2: button
}
const props = withDefaults(defineProps<Props>(), ({
  type: 1,
  disabledDel: false,
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'upload', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const actionVerty = ref([
  {
    title: t('image'),
    type: 'image',
    icon: 'tabler:photo',
    action: actionTypeUpload,
  },
  {
    title: t('audio'),
    type: 'audio',
    icon: 'tabler:volume',
    action: actionTypeUpload,
  },
  {
    title: t('video-local'),
    type: 'video-local',
    icon: 'solar:video-frame-play-vertical-linear',
    action: actionTypeUpload,
  },
  {
    title: t('video-youtube'),
    type: 'video-youtube',
    icon: 'icon-park-solid:youtobe',
    action: actionTypeUpload,
  },
  {
    title: t('ActionDelete'),
    type: 'delete',
    icon: 'fe:trash',
    disabled: props.disabledDel,
    action: actionTypeUpload,
  },
])
const actionHoz = ref([
  {
    title: t('image'),
    type: 'image',
    icon: 'tabler:photo',
    action: actionTypeUpload,
  },
  {
    title: t('audio'),
    type: 'audio',
    icon: 'tabler:volume',
    action: actionTypeUpload,
  },
  {
    title: t('file'),
    type: 'file',
    icon: 'tabler:file',
    action: actionTypeUpload,
  },

])
const actionVideo = ref([
  {
    title: t('video-local'),
    type: 'video-local',
    icon: 'solar:video-frame-play-vertical-linear',
    action: actionTypeUpload,
  },
  {
    title: t('video-youtube'),
    type: 'video-youtube',
    icon: 'icon-park-solid:youtobe',
    action: actionTypeUpload,
  },
])
function actionTypeUpload(val: any) {
  emit('upload', val)
}
watch(() => props.disabledDel, (val: any) => {
  actionVerty.value[4].disabled = val
}, { deep: true })
</script>

<template>
  <div v-if="type === 1">
    <div class="d-flex justify-center mt-6">
      <CmButton
        v-for="(item, id) in actionHoz"
        :key="id"
        :icon="item.icon"
        :size-icon="20"
        variant="tonal"
        class="mr-3"
        @click="item?.action([item])"
      />
      <CmDropDown
        is-data-resend
        :disabled="disabled"
        :list-item="actionVideo"
        icon="icon-park-solid:youtobe"
        variant="tonal"
        :type="2"
      />
    </div>
  </div>
  <div v-else>
    <CmDropDown
      :disabled="disabled"
      :list-item="actionVerty"
      custom-key="title"
      :type="1"
    />
  </div>
</template>
