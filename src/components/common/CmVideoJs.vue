<script setup lang="ts">
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import '@videojs/http-streaming'

interface Props {
  options?: any
  src?: string
  isSecure?: boolean
  serverCode?: string
}

const props = withDefaults(defineProps<Props>(), ({
  isSecure: true,
}))
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const videoPlayer = ref()
const player = ref<any>(null)
const urlFile = computed(() => (props.serverCode ? `${SERVERFILE}/${props.serverCode}/preview?folderVideo=${props.src}` : `${SERVERFILE}/sfv4/preview?folderVideo=${props.src}`))

onMounted(() => {
  // player.value = videojs(videoPlayer.value)

  const videoElement = videoPlayer.value
  const options = {
    html5: {
      vhs: {
        overrideNative: true, // Bật sử dụng @videojs/http-streaming
      },
    },
  }
  player.value = videojs(videoElement, options, () => {
    if (props.isSecure) {
      player.value.tech().vhs.xhr.beforeRequest = (optionsItem: any) => {
        const fileName = optionsItem.uri.replace(/^.*[\\\/]/, '')
        optionsItem.headers = optionsItem.headers || {}
        optionsItem.headers.Role = fileName
        optionsItem.headers.Accepts = props.src
        optionsItem.headers.Authorization = `Bearer ${window.localStorage.getItem('accessToken')}`
        return optionsItem
      }
    }
    else {
      player.value.play()
    }
  })
})
</script>

<template>
  <div class="w-100 h-100">
    <video
      id="my_video"
      ref="videoPlayer"
      class="video-js vjs-default-skin"
      controls
      preload="auto"
      data-setup="{}"
    >
      <source
        :src="isSecure === true ? urlFile : `${SERVERFILE}${src}`"
        type="application/x-mpegURL"
      >
    </video>
  </div>
</template>

<style lang="css" scoped>
.video-js {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}
</style>
