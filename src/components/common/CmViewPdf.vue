<script setup lang="ts">
import ViewPdf from '@/components/common/view-pdf'
import ObserverLoadingPage from '@/components/common/view-pdf/ObserverLoadingPage.vue'
import DocumentController from '@/components/common/view-pdf/DocumentController.vue'

interface Props {
  src?: string
  serverCode?: any
  isSecure?: boolean
  isShowController?: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  src: '/DataFile/2023/10/10/kinhdoanh/6509/Resource/fol-sfv4-qBG4MHyPEw/origin.pdf',

  // src: '/DataFile/2023/10/17/kinhdoanh/6509/Resource/fol-sfv4-1qQIgG2ULA/origin.pdf',

  // src: '/DataFile/2023/10/17/kinhdoanh/6509/Resource/fol-sfv4-LKqxoxJU9z/origin.pdf',

  // src: '/DataFile/2023/10/13/kinhdoanh/6509/Resource/fol-sfv4-aaCXbTAvZC/origin.pdf',

  isSecure: true,
  isShowController: true,
}))
const SERVERFILE = window.SERVER_FILE || ''

const pdfSrc = computed(() => `${SERVERFILE}${props.src}`)
const isLoading = ref(true)
const isCheckViewPort = ref(false)
const totalPage = ref(0)
const listDisplayPage = ref<Array<number>>([])
const listPageRendered = ref<Array<number>>([])
const currentPage = ref(25)
const currentPageTempScale = ref(0)
const scale = ref<string | number>('page-width')
const widthPdf = ref(0)
const heightPdf = ref(0)
const documentLoadingTask = ref<Promise<any>>()
const pdfSource = ref(null)
const pdfRef = ref()
const rootPdf = ref()
const pdfContainerId = ref('pdf-container-id')

onMounted(() => {
  documentLoadingTask.value = ViewPdf.createLoadingTask(pdfSrc.value, getSpecialName() + getSpecialName())
  documentLoadingTask.value
    ?.then((pdfDocument: any) => {
      pdfSource.value = pdfDocument

      return pdfDocument.getPage(1)
        .then((pdfPage: any) => {
          return { pageInfo: pdfPage, numPages: pdfDocument.numPages }
        })
    })
    .then((data: any) => {
      const viewport = data?.pageInfo.getViewport({ scale: 1 })

      // console.log('Viewport', rootPdf.value.offsetWidth / viewport.width)
      // console.log('Viewport', rootPdf.value.parentElement.offsetHeight / viewport.height)
      // console.log('Viewport width:', rootPdf.value.offsetWidth, viewport.width)
      // console.log('Viewport height:', rootPdf.value.parentElement.offsetHeight, viewport.height)
      let scaleOrigin
      if (viewport.height > rootPdf.value.parentElement.offsetHeight) {
        scale.value = 'page-height'
        scaleOrigin = rootPdf.value.parentElement.offsetHeight / viewport.height
      }

      else {
        scale.value = 'page-width'
        scaleOrigin = (rootPdf.value.offsetWidth - 4) / viewport.width
      }

      const viewportNew = data?.pageInfo.getViewport({ scale: scaleOrigin })

      widthPdf.value = viewportNew.width
      heightPdf.value = viewportNew.height

      totalPage.value = data?.numPages
      isCheckViewPort.value = true

      nextTick(() => {
        rootPdf.value.onscroll = (e: any) => {
          scrollHandle(e)
        }
        if (currentPage.value)
          scrollToPage(currentPage.value)
      })
    })
    ?.catch(() => {
    // Thông báo lỗi
    })
})
function getSpecialName() {
  const arr = props.src.split('/')
  if (arr.length > 2)
    return arr[arr.length - 2]

  return props.src
}
function handleDocumentLoaded(e: any) {
  if (e?.pageNumber && !listPageRendered.value.includes(e.pageNumber)) {
    listPageRendered.value.push(e.pageNumber)
    setTimeout(() => {
      const pdfPageLoading = document.getElementById(`pdf-loading-${e.pageNumber}`)
      if (pdfPageLoading)
        pdfPageLoading?.remove()
    }, 900)
  }
  isLoading.value = false
}
function setToPage(val: number | string) {
  let number = 1
  if (Number.isInteger(val) && typeof val === 'number') {
    number = Math.min(Math.max(val, 1), totalPage.value)
  }
  else {
    switch (val) {
      case 'first':
        number = 1
        break
      case 'previous':
        number = Math.max(currentPage.value - 1, 1)
        break
      case 'next':
        number = Math.min(currentPage.value + 1, totalPage.value)
        break
      case 'last':
        number = totalPage.value
        break
      default:
        break
    }
  }
  scrollToPage(number)
}
function zoom(isZoom = true) {
  if (typeof scale.value === 'number') {
    currentPageTempScale.value = currentPage.value
    if (isZoom)
      scale.value += 0.15
    else
      scale.value -= 0.15
  }
}
function updateScale(val: any) {
  scale.value = val
}
function scrollToPage(pageNumber: number) {
  // currentPage.value = pageNumber
  const pdfPage = document.getElementById(`pdf-number-${pageNumber}`)
  pdfPage?.scrollIntoView()
}
function linkClicked(val: any) {
  scrollToPage(val.pageNumber)
}
function updateSize(val: any) {
  if (currentPageTempScale.value)
    rootPdf.value.scrollTop = currentPageTempScale.value * (val.height + 8) - 8 - val.height
  widthPdf.value = val.width
  heightPdf.value = val.height
}
function addShowPage(val: any) {
  listDisplayPage.value.push(val)
}

function scrollHandle(val: any) {
  console.log(val)
  const parentElement = rootPdf.value
  const listPageEl = pdfRef.value

  if (parentElement.scrollTop === 0) {
    currentPage.value = 1
    return
  }
  if (parentElement.scrollTop === parentElement.scrollHeight - parentElement.clientHeight)
    currentPage.value = totalPage.value

  const parentRect = parentElement.getBoundingClientRect()
  let maxHeight = 0
  let visiblePage = 1
  for (let i = 0; i < listPageEl.length; i += 1) {
    const childElement = listPageEl[i]
    const childRect = childElement.getBoundingClientRect()

    const visibleHeightChild = Math.min(childRect.bottom, parentRect.bottom) - Math.max(childRect.top, parentRect.top)
    if (visibleHeightChild > maxHeight) {
      const pageNumber = Number(childElement.getAttribute('pagenum'))
      if (pageNumber > visiblePage)
        visiblePage = pageNumber

      maxHeight = visibleHeightChild
    }
  }
  currentPage.value = visiblePage
}
</script>

<template>
  <div
    :id="pdfContainerId"
    ref="rootPdf"
    class="view-pdf-container"
  >
    <DocumentController
      v-if="isShowController"
      :total-page="totalPage"
      :current-page="currentPage"
      @zoomIn="zoom(true)"
      @zoomOut="zoom(false)"
      @setToPage="setToPage"
    />
    <div
      v-for="pageNum in totalPage"
      :id="`pdf-number-${pageNum}`"
      :key="pageNum"
      ref="pdfRef"
      :pagenum="pageNum"
      class="pdf-page-number mx-auto"
      :class="{ 'mt-auto': pageNum === 1, 'mb-auto': pageNum === totalPage, 'mt-2': pageNum !== 1 }"
      :style="`width: ${widthPdf}px; height: ${heightPdf}px; flex-shrink: 0;`"
    >
      <ViewPdf
        v-if="listDisplayPage.length && listDisplayPage.includes(pageNum)"
        :page="pageNum"
        :scale="scale"
        :src="documentLoadingTask"
        @pageRendered="handleDocumentLoaded"
        @update:scale="updateScale"
        @linkClicked="linkClicked"
        @updateSize="updateSize"
      />
      <ObserverLoadingPage
        v-if="isCheckViewPort"
        :id="`pdf-loading-${pageNum}`"
        :root-id="pdfContainerId"
        :page-number="pageNum"
        :width="widthPdf"
        :height="heightPdf"
        is-observer
        :class="{ hidden: listPageRendered.includes(pageNum) }"
        @showPage="addShowPage"
      />
    </div>
  </div>
</template>

<style lang="scss">
.layout-wrapper {
  width: 1000px;
  height: 500px;
  height: 100vh;
  margin-right: auto;
  margin-left: auto;
}
</style>

<style lang="scss" scoped>
.view-pdf-container {
  display: flex;
  width: inherit;
  height: inherit;
  flex-direction: column;
  margin: auto;
  background-color: #e0e0e0;
  overflow-y: auto;
  .document-control-pdf {
    opacity: 0;
    transition: all 0.3s;
  }
  &:hover {
    .document-control-pdf {
      opacity: 1;
    }
  }
  .pdf-page-number {
    position: relative;
    .observer-loading-page {
      position: absolute;
      top: 0;
      left: 0;
      &.hidden {
        opacity: 0;
        transition: opacity 0.8s;
      }
    }
  }
}
</style>
