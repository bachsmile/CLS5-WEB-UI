<script setup lang="ts">
import DateUtil from '@/utils/DateUtil'
import CmSlider from '@/components/common/CmSlider.vue'

interface Props {
  src?: any
  fileFolder?: string
  serverCode?: any
  width?: number | string
  progress: number
  timeCurrent: number
  time: number

}
const props = withDefaults(defineProps<Props>(), ({
  src: '',
  width: 50,
  progress: 0,
  timeCurrent: 0,
  time: 0,
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'end', value: any): void
  (e: 'pause', value: any): void
  (e: 'play', value: any): void
  (e: 'update:timeCurrent', value: any): void
  (e: 'update:time', value: any): void
  (e: 'update:progressValue', value: any): void
  (e: 'update:end', value: any): void
  (e: 'update:pause', value: any): void

}
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const progressValue = ref(props.progress)
const timeCurrent = ref(props.progress)
const time = ref(props.progress)
const audioPlayer = ref()
const isPause = ref(true)

/** method */
function playAudio() {
  audioPlayer.value.play()
}
function pauseAudio() {
  audioPlayer.value.pause()
}
function updateProgress(value?: any) {
  progressValue.value = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100
  timeCurrent.value = audioPlayer.value.currentTime
  time.value = audioPlayer.value.duration
  emit('update:timeCurrent', timeCurrent.value)
  emit('update:time', audioPlayer.value.duration)
  emit('update:progressValue', progressValue.value)
}
function ended(value: any) {
  isPause.value = true
  emit('end', value)
}
function pause(value: any) {
  isPause.value = true
  emit('pause', value)
  emit('update:pause', value)
}
function play(value: any) {
  isPause.value = false
  emit('play', value)
  emit('update:pause', value)
}

// slider profress
function startSLider(value: any) {
  // console.log(value)
}
function endSLider(value: any) {
  // console.log(value)
}
function valueChange(value: any) {
  timeCurrent.value = (value / 100) * time.value
  audioPlayer.value.currentTime = timeCurrent.value
}

function durationchange(e: any) {
  updateProgress()
}
</script>

<template>
  <div :style="{ width }">
    <audio
      id="audio-controls"
      ref="audioPlayer"
      class="d-none"
      controls
      :src="SERVERFILE + src"
      @timeupdate="updateProgress"
      @ended="ended"
      @pause="pause"
      @play="play"
      @durationchange="durationchange"
    />
    <!-- :src="SERVERFILE + src" -->
    <div class="setting-control d-flex flex-nowrap align-center">
      <VIcon
        v-if="isPause"
        icon="ic:outline-play-circle"
        color="primary"
        size="42"
        @click="playAudio"
      />
      <VIcon
        v-else
        icon="ic:baseline-pause-circle-outline"
        color="primary"
        size="42"
        @click="pauseAudio"
      />
      <div class="w-100 pl-3 pr-5 ">
        <CmSlider
          v-model="progressValue"
          @drag-start="startSLider"
          @drag-end="endSLider"
          @change="valueChange"
        />
      </div>
      <div class="d-flex flex-nowrap align-center time-progress">
        <div>{{ DateUtil.formatTimeSecondToCustom(timeCurrent) }}</div>
        <div class="px-1">
          <span> / </span>
        </div>
        <div>{{ DateUtil.formatTimeSecondToCustom(time) }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.setting-control{
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid  #D0D5DD;
  background:  #F2F4F7;
}
.time-progress{
  color:  rgb(var(--v-primary-600));
}
</style>
