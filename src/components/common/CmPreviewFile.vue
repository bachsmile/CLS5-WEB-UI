<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'

interface Props {
  src?: string
  password?: string
  fileFolder?: string
  serverCode?: any
  width?: number | string
}
const props = withDefaults(defineProps<Props>(), ({
  src: '',
  width: 50,
}))
const options = ref({
  httpHeaders: {
    Accepts: null,
    Authorization: `Bearer ${localStorage?.accessToken}`,
    Role: 'origin.pdf',
  },
  password: props.password ?? `${props.fileFolder}${props.fileFolder}`,
})
const SERVERFILE = window.SERVER_FILE || ''

const isLoading = ref(true)
const page = ref<any>(1)
const pageCount = ref(1)
const rotation = ref(0)
const pdfSource = computed(() => `${SERVERFILE}${props.src}`)
const showAllPages = ref(false)
const pdfRef = ref()
const numberInput = ref<any>(1)

function handlePasswordRequest(callback: any) {
  callback(options.value.password)
}
function handleDocumentRender() {
  isLoading.value = false
  pageCount.value = pdfRef.value.pageCount
}
function rotationPage() {
  if (rotation.value === 270)
    rotation.value = 0

  else
    rotation.value += 90
}
function changePage(val: any) {
  if (Number(val.target.value) > 0) {
    page.value = Number(val.target.value)
  }
  else {
    numberInput.value = 1
    page.value = 1
  }
}

watch(showAllPages, val => {
  page.value = showAllPages.value ? null : 1
})
watch(() => props.password, val => {
  // console.log(pdfRef.value)
}, { deep: true, immediate: true })
</script>

<template>
  <div>
    <div
      id="app"
      :style="`width: ${width}%;`"
    >
      <div class="app-header ">
        <template v-if="isLoading">
          Loading...
        </template>

        <template v-else>
          <div class="d-flex justify-space-between">
            <div class="d-flex">
              <div class="d-flex">
                <div v-if="showAllPages">
                  {{ pageCount }} page(s)
                </div>

                <span v-else>
                  <button
                    :disabled="page <= 1"
                    @click="page--"
                  >❮</button>
                  <span>
                    <input
                      :id="page"
                      v-model="numberInput"
                      type="number"
                      class="input-page"
                      :min="1"
                      :max="pageCount"
                      @change="changePage"
                    >
                  </span>
                  /
                  <span>
                    <input
                      v-model="pageCount"
                      disabled
                      :min="1"
                      :max="pageCount"
                      class="input-page"
                    >
                  </span>
                  <button
                    :disabled="page >= pageCount"
                    @click="page++"
                  >❯</button>
                </span>
              </div>
              <div class="mx-5">
                <VIcon
                  icon="ic:baseline-screen-rotation"
                  @click="rotationPage"
                />
              </div>
            </div>
            <div>
              <label class="right">
                <input
                  v-model="showAllPages"
                  type="checkbox"
                >

                Hiện thị tất cả trang
              </label>
            </div>
          </div>
        </template>
      </div>

      <div class="app-content">
        <VuePdfEmbed
          ref="pdfRef"
          :source="pdfSource"
          :page="page"
          :rotation="rotation"
          @password-requested="handlePasswordRequest"
          @rendered="handleDocumentRender"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background-color: #ccc;
}

.vue-pdf-embed > div {
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

.app-header {
  padding: 16px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  background-color: #555;
  color: #ddd;
}

.app-content {
  padding: 12px 16px 0px 16px;
}

.right {
  float: right;
}
.input-page{
  width: 40px;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 5px;
  margin-inline: 5px ;
  text-align: center;
}
</style>
