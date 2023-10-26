<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import CmSheet from '@/components/common/CmSheet.vue'
import StringUtil from '@/utils/StringUtil'
import CmIcon from '@/components/common/CmIcon.vue'
import CmSlider from '@/components/common/CmSlider.vue'
import DateUtil from '@/utils/DateUtil'
import CmTextField from '@/components/common/CmTextField.vue'
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  level: 0,
  isVisible: false,
  isPagination: false,
  isMediaVolume: false,
  isMediaPlay: false,
  isMedia: false,
  isMediaProgress: false,
  isShowContent: false,
  isPause: true,
  isVolume: true,
  disabledSlider: false,
  color: '',
  timeCurrent: 0,
  time: 0,
  volume: 0,
  lastPointer: 0,
  totalPage: 1,
})
const emit = defineEmits<Emit>()
const sheet = ref(false)
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface Props {
  progress?: number
  timeCurrent?: number
  time?: number
  volume?: number
  totalPage?: number
  title?: string
  disabled?: boolean
  expand?: boolean
  isPause?: boolean
  isVolume?: boolean
  isPagination?: boolean
  isMediaPlay?: boolean
  isMediaProgress?: boolean
  isMediaVolume?: boolean
  disabledSlider?: boolean
  lastPointer?: number
}
interface Emit {
  (e: 'goHome'): void
  (e: 'goBack'): void
  (e: 'openInfor'): void
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'update:isPause', value: any): void
  (e: 'update:isVolume', value: any): void
  (e: 'update:volume', value: any): void
  (e: 'update:timeCurrent', value: any): void
  (e: 'update:expand', value: any): void
  (e: 'seek', value: any): void
}
function play() {
  emit('update:isPause', false)
  emit('play')
}
function pause() {
  emit('update:isPause', true)
  emit('pause')
}
function handelVolume() {
  console.log(props.isVolume)

  emit('update:isVolume', !props.isVolume)
}
function handelExpand() {
  emit('update:expand', !props.expand)
}

// tiến  trình
const isDragging = ref(false)
const mediaProgress = ref(0)
const mediaSliderRef = ref()
function startSLiderContent(value: any) {
  isDragging.value = true
}
function endSLiderContent(value: any) {
  // console.log(value)
  isDragging.value = false
  console.log(props.disabledSlider)
  if (props.disabledSlider && mediaProgress.value > props.lastPointer) {
    console.log(mediaSliderRef.value?.slider)

    mediaSliderRef.value?.slider.setValue(props.lastPointer)
    toast('WARNING', t('no-rewind-content'))
  }
}
function valueChangeContent(value: any) {
  mediaProgress.value = value
  emit('seek', value)
}
function startSLider(value: any) {
  // console.log(value)
}
function endSLider(value: any) {
  // console.log(value)
}
function valueChange(value: any) {
  emit('update:volume', value)
}
</script>

<template>
  <div class="course-learning">
    <div class="header-learning">
      <div class="header-action">
        <div class="action-content">
          <CmButton
            class="d-flex mr-2 button-learning"
            size="36"
            @click="emit('goHome')"
          >
            <VIcon
              icon="ic:outline-home"
              size="20"
            />
          </CmButton>
          <CmButton
            variant="outlined"
            color="secondary"
            class="d-flex mr-2 button-learning"
            size="36"
            icon="material-symbols:arrow-back-rounded"
            :size-icon="20"
            @click="emit('goBack')"
          />
        </div>
        <div class="header-content">
          <div
            class="text-bold-lg text-truncate"
            :title="title"
          >
            {{ title }}
          </div>
          <div
            class="d-flex align-start"
            style="width: 50%"
          >
            <div class="mr-3">
              <VProgressLinear
                rounded-bar
                :model-value="progress"
                color="success"
                class="mt-6"
                rounded
                height="8"
                style="width: 17.375rem;"
              />
            </div>
            <div class="text-medium-sm d-flex text-nowrap">
              {{ StringUtil.decimalToFixed(Number(progress), 0) }} %
            </div>
          </div>
        </div>
      </div>
      <div class="header-sidebar">
        <div class="d-flex justify-end flex-center ">
          <slot name="action" />

          <div class="mr-3">
            <CmButton
              icon="tabler:info-circle"
              color="warning"
              :tooltip="t('info-content')"
              size="40"
              :size-icon="20"
              @click="emit('openInfor')"
            />
          </div>
          <div>
            <CmButton
              icon="tabler:chevron-left"
              variant="tonal"
              :title="t('previous-post')"
            />
          </div>
          <div class="ml-2">
            <CmButton
              icon="tabler:chevron-right"
              variant="tonal"
              :title="t('next-post')"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content-course">
        <div class="content-learning">
          <div style="height: 90%;">
            <slot
              name="content"
            />
          </div>
          <div class="control">
            <div class="control-box">
              <div
                v-if="isMediaProgress"
                class="control-progress"
              >
                <CmSlider
                  ref="mediaSliderRef"
                  :model-value="mediaProgress"
                  :last-pointer="lastPointer"
                  class="w-100"
                  color="white"
                  padding="0"
                  @drag-start="startSLiderContent"
                  @drag-end="endSLiderContent"
                  @change="valueChangeContent"
                />
              </div>
              <div class="control-left d-flex flex-center flex-nowrap">
                <div
                  v-if="isMediaPlay"
                  class="mr-4 cursor-pointer"
                >
                  <CmIcon
                    v-if="isPause"
                    icon="ic:outline-play-circle"
                    color="white"
                    :size="40"
                    @click="play"
                  />
                  <CmIcon
                    v-else
                    icon="ic:baseline-pause-circle-outline"
                    color="white"
                    :size="40"
                    @click="pause"
                  />
                </div>
                <div
                  v-if="isMediaPlay"
                  class="d-flex flex-nowrap align-center time-progress  "
                >
                  <div class="d-flex color-text-white">
                    {{ DateUtil.formatTimeSecondToCustom(timeCurrent) }} <span class="px-1">/</span>
                  </div>
                  <div class="color-text-white">
                    {{ DateUtil.formatTimeSecondToCustom(time) }}
                  </div>
                </div>
              </div>
              <div class="control-center flex-nowrap  flex-center">
                <div
                  v-if="isPagination"
                  class="control-pagination d-flex flex-center"
                >
                  <CmIcon
                    :tooltip="t('setting')"
                    :type="1"
                    color="white"
                    variant="flat"
                    icon="tabler:chevrons-left"
                    class="cursor-pointer mr-2"
                    :size="24"
                    @click="handelVolume"
                  />
                  <CmIcon
                    :tooltip="t('setting')"
                    :type="1"
                    color="white"
                    variant="flat"
                    icon="tabler:chevron-left"
                    class="cursor-pointer mr-2"
                    :size="24"
                    @click="handelVolume"
                  />
                  <div
                    class="d-flex flex-center mr-2"
                  >
                    <CmTextField
                      style="width:68px"
                      type="number"
                      class="mr-2"
                    />
                    <span class="text-nowrap">/ {{ totalPage }} {{ t('page') }}</span>
                  </div>
                  <CmIcon
                    :tooltip="t('setting')"
                    :type="1"
                    color="white"
                    variant="flat"
                    icon="tabler:chevron-right"
                    class="cursor-pointer mr-2"
                    :size="24"
                    @click="handelVolume"
                  />
                  <CmIcon
                    :tooltip="t('setting')"
                    :type="1"
                    color="white"
                    variant="flat"
                    icon="tabler:chevrons-right"
                    class="cursor-pointer"
                    :size="24"
                    @click="handelVolume"
                  />
                </div>
              </div>
              <div class="control-right  flex-center">
                <div
                  v-if="isMediaVolume"
                  class="d-flex control-audio ml-6"
                >
                  <CmIcon
                    :tooltip="t('setting')"
                    :type="1"
                    color="white"
                    variant="flat"
                    :icon="isVolume ? 'tabler:volume' : 'tabler:volume-off'"
                    class="cursor-pointer"
                    :size="24"
                    @click="handelVolume"
                  />
                  <CmSlider
                    :model-value="volume"
                    class="w-100  ml-3"
                    color="white"
                    @drag-start="startSLider"
                    @drag-end="endSLider"
                    @change="valueChange"
                  />
                </div>
                <CmIcon
                  :tooltip="t('setting')"
                  :type="1"
                  color="white"
                  variant="flat"
                  icon="material-symbols:settings-rounded"
                  :size="24"
                  class="ml-6 cursor-pointer"
                />
                <CmIcon
                  :tooltip="t('extend')"
                  :type="1"
                  color="white"
                  variant="flat"
                  icon="ion:md-expand"
                  :size="24"
                  class="ml-6 cursor-pointer"
                  @click="handelExpand"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sidebar">
        <slot name="sidebar" />
      </div>
    </div>
    <div
      class="sidebar-mobile"
    >
      <CmSheet
        v-model="sheet"
        inset
        size="30vh"
        origin="bottom"
      >
        <div>
          <slot name="sidebar" />
        </div>
      </CmSheet>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global" as *;

.course-learning {
  width: calc(100% - 64px);
  max-width: calc(var(--v-max-width-page) - 64px);
  height: calc(1024px - 64px) ;
  padding: 32px;
  border-radius: 8px;
  margin: 32px;
  background: rba(--v-them-surface);
  box-shadow: 0 2px 4px -2px rgba(16, 24, 40, 6%), 0 4px 8px -2px rgba(16, 24, 40, 10%);
  .button-learning {
    height: 36px !important;
    min-height: unset !important;
  }
  .header-learning {
    display: flex;
    .header-action {
      display: flex;
      width: 69%;
      padding-right: 32px;
      margin-bottom: 32px;
      .action-content {
        display: flex;
        margin-right: 24px;
      }

      .header-content {
        width: calc(100% - 112px);

        .v-progress-linear {
          margin-top: 8px !important;
        }
      }
    }
    .header-sidebar {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
  }
  .content {
    display: flex;
    width: 100%;
    height: calc(100% - 76px);;
    .content-course {
      display: flex;
      overflow: hidden;
      width: 68%;
      height: 100%;
      flex-direction: column;
      margin-right: 24px;
      .content-learning {
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;
        border: 1px solid $color-gray-300;
        border-radius: var(--v-border-radius-xs);
        background-color: $color-gray-200;
        .control{
          position: relative;
          bottom: 0;
          width: 100%;
          height: 10%;
          .control-box{
            position: relative;
            display: flex;
            justify-content: space-between;
            padding: 20px 24px;
            color: #ffff;
            width: inherit;
            height: 100%;
            background-color: $color-primary-700;
            .control-progress{
              position: absolute;
              top: 0;
              width: 100%;
              left: 0;
              padding: 0 6px;
              background: linear-gradient(90deg, rgba(255, 255, 255, 1) 7px, rgba(255, 255, 255, 0.6) 0);
            }
            .control-left{
              min-width: 30%;
              justify-content: start;
            }
            .control-center{
              min-width: 0%;
              justify-content: center;
            }
            .control-right{
              min-width: 30%;
              max-width: 70%;
              display: flex;
              align-items: center;
              justify-content: end;
              flex-wrap: nowrap;
              .control-audio{
                width: 116px;
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
              }
            }
          }
        }
      }
    }

    .sidebar {
      overflow: auto;
      width: 32%;
      height: 100%;
    }
  }

  .sidebar-mobile {
    display: none;
  }

  @media only screen and (width <= 1000px) {
    .header-action {
      margin-bottom: 32px;
      background-color: greenyellow;
    }

    .content {
      .content-course {
        width: 100%;
        padding-right: unset;
      }

      .sidebar {
        display: none;
      }
    }
    .sidebar-mobile {
      display: block;
    }
  }
}
</style>
