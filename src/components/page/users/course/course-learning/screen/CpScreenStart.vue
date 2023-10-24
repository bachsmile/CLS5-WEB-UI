<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import CmChip from '@/components/common/CmChip.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusTypeMyCourse } from '@/constant/data/status.json'
import { DialogType } from '@/constant/data/notification.json'
import type { Content } from '@/typescript/interface'
import DateUtil from '@/utils/DateUtil'

const props = withDefaults(defineProps<Props>(), ({
  isCondition: false,
  isDescBox: false,
  isRendered: false,
  status: 0,
  name: '',
  description: 'Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học',
  listCondition: () => (['Điều kiện điều kiện điều kiện 1', 'Điều kiện điều kiện điều kiện 2']),
  contentData: () => ({
    content: '',
    contentArchiveTypeId: 11,
    courseContentId: 14047,
    courseContentName: 'bài 1',
    endDate: null,
    id: 50070,
    isAfterTime: true,
    isAnswerTheQuestion: true,
    isComplete: false,
    isRewind: false,
    minuteOfLearn: 0,
    noticeTimeAttendance: 0,
    startDate: null,
    statusName: 'CourseService.LearnerStudying',
    timeLearned: 0,
    urlFile: null,
    essayContent: null,
    urlFileEssay: null,
    completeRatio: 0,
    urlFileName: '',
    acceptDownload: false,
    time: 300,
    statusId: 1,
    isSpeed: false,
    comment: null,
  }),
}))

const emit = defineEmits<Emit>()

interface Props {
  isCondition?: boolean
  isDescBox?: boolean
  isRendered?: boolean
  listCondition?: string[]
  status?: number
  name?: string
  description?: string
  contentData?: Content
}

interface Emit {
  (e: 'click', value?: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const showHideIntr = ref(true)
function showMore() {
  showHideIntr.value = !showHideIntr.value
}

function startContent() {
  console.log('startContent')
  emit('click', false)
}
function checkTypeBtnSubmit() {
  return {
    title: t('start-exam'),
    action: startContent,
  }
}
function checkTypeContentTitle() {
  if (props.isCondition) {
    return `<div class="text-bold-xl text-center">
              Nội dung có điều kiện
            </div>`
  }
  if (props.contentData.isComplete) {
    return `<div class="text-bold-xl text-center">
              Bấm nút để hoàn thành
            </div>`
  }
  if (props.contentData.contentArchiveTypeId === 16) {
    return `<div class="text-bold-xl text-center">
              Nội dung học offline
            </div>`
  }
  if (props.contentData.isAnswerTheQuestion && props.contentData.contentArchiveTypeId === 10) {
    return `<div class="text-bold-xl text-center">
              Vượt qua bài kiểm tra
            </div>`
  }
  if (props.contentData.isAnswerTheQuestion && props.contentData.contentArchiveTypeId === 11) {
    return `<div class="text-bold-xl text-center">
              Vượt qua bài khảo sát
            </div>`
  }
  if (props.contentData.isAnswerTheQuestion) {
    return `<div class="text-bold-xl text-center">
               Trả lời câu hỏi
            </div>`
  }

  if (props.contentData.isAfterTime) {
    return `<div class="text-bold-xl text-center">
               Học <span class="color-success text-bold-xl">${DateUtil.formatTimeSecondToCustom(props.contentData.minuteOfLearn)} phút</span> để hoàn thành
            </div>`
  }
  return ''
}
function checkTypeDialog(type: number) {
  return DialogType[type]
}
</script>

<template>
  <div class="box-content">
    <div
      v-if="isCondition"
      class="flex-center w-100 my-6"
    >
      <div class="icon-noti">
        <VIcon
          :icon="checkTypeDialog(1).icon"
          color="white"
          class="noti-zindex"
          :size="checkTypeDialog(1).size"
        />
        <span
          class="ring1 bg-warning-500"
        />
        <span
          class="ring2 bg-warning-600"
        />
      </div>
    </div>
    <div v-html="checkTypeContentTitle()" />
    <div
      v-if="isCondition"
    >
      <div class="text-regular-md text-center color-text-500">
        {{ t('conditions-completion-setup') }}
      </div>
      <div
        v-if="listCondition?.length"
        class="flex-center mt-6"
      >
        <ul>
          <li
            v-for="(itemCond, idx) in listCondition"
            :key="idx"
          >
            {{ itemCond }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <div
        class="text-regular-md text-center color-text-500"
      >
        {{ t('conditions-completion') }}
      </div>
      <div class="text-regular-md text-center">
        <CmChip
          :color="MethodsUtil.checkType(status, StatusTypeMyCourse, 'id')?.color"
        >
          <VIcon
            v-if="MethodsUtil.checkType(status, StatusTypeMyCourse, 'id')?.icon"
            start
            :icon="MethodsUtil.checkType(status, StatusTypeMyCourse, 'id')?.icon"
            size="12"
          />
          <span>{{ t(MethodsUtil.checkType(status, StatusTypeMyCourse, 'id').name) }}</span>
        </CmChip>
      </div>
      <div class="my-6 flex-center">
        <CmButton
          :disabled="!isRendered"
          :color="!isRendered ? 'warning' : 'primary'"
          :title="!isRendered ? t('loading-content') : checkTypeBtnSubmit().title"
          @click="checkTypeBtnSubmit().action"
        />
      </div>
      <div
        v-if="name"
        class="text-bold-xl color-primary text-center"
      >
        {{ name }}
      </div>
      <div
        v-if="isDescBox"
        class="flex-center"
      >
        <div class="mc-desc">
          <slot name="descBox" />
        </div>
      </div>
      <div
        v-if="description"
        class="mc-about flex-center"
        :class="{ 'text-over-hide': showHideIntr }"
        v-html="description"
      />
      <div
        v-if="description"
        class="flex-center"
      >
        <CmButton
          v-if="showHideIntr"
          id="showMoreButton"
          variant="text"
          color="primary"
          @click="showMore"
        >
          <div class="d-flex flex-noWrap">
            <div>
              {{ t('more') }}
            </div>
            <VIcon icon="tabler:chevron-down" />
          </div>
        </CmButton>
        <CmButton
          v-if="!showHideIntr"
          variant="text"
          color="primary"
          @click="showMore"
        >
          <div class="d-flex flex-noWrap">
            <div>
              {{ t('hide-content') }}
            </div>
            <VIcon icon="tabler:chevron-up" />
          </div>
        </CmButton>
      </div>
    </div>
  </div>
</template>
