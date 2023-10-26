<!-- eslint-disable @typescript-eslint/no-this-alias -->
<script>
import * as pdf from 'pdfjs-dist/build/pdf'

import { toRaw } from 'vue'

import {
  DefaultAnnotationLayerFactory,
  DefaultTextLayerFactory,
  EventBus,
  PDFFindController,
  PDFLinkService,
  PDFPageView,
} from 'pdfjs-dist/web/pdf_viewer'

const PdfjsWorker = import('pdfjs-dist/build/pdf.worker.entry')

pdf.GlobalWorkerOptions.workerSrc = PdfjsWorker

function isPDFDocumentLoadingTask(obj) {
  return typeof (obj) === 'object' && obj !== null && obj.__PDFDocumentLoadingTask === true
}
export function createLoadingTask(src, password) {
  let source
  if (typeof (src) === 'string') {
    source = {
      url: src,
      password,
    }
  }
  else if (typeof (src) === 'object' && src !== null) {
    source = Object.assign({}, src)
  }
  else { throw new TypeError('invalid src type') }

  const loadingTask = pdf.getDocument(source).promise

  loadingTask.__PDFDocumentLoadingTask = true // since PDFDocumentLoadingTask is not public

  return loadingTask
}

export default {
  name: 'ViewPdf',
  createLoadingTask,
  props: {
    src: {
      type: [String, Object, Promise],
      default: '',
    },
    page: {
      type: Number,
      default: 1,
    },
    rotate: {
      type: Number,
      default: 0,
    },
    scale: {
      type: [Number, String],
      default: 'page-width',
    },
    resize: {
      type: Boolean,
      default: false,
    },
    annotation: {
      type: Boolean,
      default: true,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['pageRendered', 'loading', 'linkClicked', 'error', 'update:scale', 'updateSize', 'numPages'],
  data() {
    return {
      internalSrc: this.src,
      pdf: null,
      pdfViewer: null,
      loading: true,
    }
  },
  watch: {
    pdf(val) {
      const pdfInfo = val.pdfInfo || val._pdfInfo
      this.$emit('numPages', pdfInfo.numPages)
    },
    page(val) {
      const self = this
      this.pdf.getPage(val).then(pdfPage => {
        const pdfViewer = toRaw(self.pdfViewer)
        pdfViewer.setPdfPage(pdfPage)
        pdfViewer.draw()
      })
    },
    scale(val) {
      this.drawScaled(val, true)
    },
    rotate(newRotate) {
      if (this.pdfViewer) {
        const pdfViewer = toRaw(this.pdfViewer)

        this.pdfViewer.update(this.scale, newRotate)

        // pdfViewer.update({
        //   scale: this.scale,
        //   rotation: newRotate,
        // })
        pdfViewer.draw()
      }
    },
  },
  mounted() {
    const self = this
    if (!isPDFDocumentLoadingTask(self.internalSrc)) {
      self.internalSrc = createLoadingTask(self.internalSrc)
      self.$emit('loading', true)
    }

    const container = this.$refs.container
    const eventBus = new EventBus()
    eventBus.on('pagerendered', e => {
      self.$emit('pageRendered', e)
    })

    // (Optionally) enable hyperlinks within PDF files.
    self.pdfLinkService = new PDFLinkService({
      eventBus,
      externalLinkTarget: 2,
    })

    // (Optionally) enable find controller.
    self.pdfFindController = new PDFFindController({
      eventBus,
      linkService: self.pdfLinkService,
    })

    let annotationLayer,
      textLayer

    if (self.annotation)
      annotationLayer = new DefaultAnnotationLayerFactory()

    if (self.text)
      textLayer = new DefaultTextLayerFactory()

    self.internalSrc
      .then(pdfDocument => {
        // Document loaded, retrieving the page.
        self.pdf = pdfDocument
        return pdfDocument.getPage(self.page)
      }).then(pdfPage => {
        // Creating the page view with default parameters.
        self.pdfViewer = new PDFPageView({
          container,
          id: self.page,
          scale: 1,
          defaultViewport: pdfPage.getViewport({
            scale: 1,
          }),
          eventBus,
          textLayerFactory: textLayer,
          annotationLayerFactory: annotationLayer,
        })

        // Associates the actual page with the view, and drawing it
        self.pdfViewer.setPdfPage(pdfPage)

        // Set up a scrollPageIntoView function for our links
        const viewer = {
          scrollPageIntoView(params) {
            // Send an event when clicking internal links so we can handle loading/scrolling to the correct page
            self.$emit('linkClicked', params)
          },
        }
        self.pdfLinkService.setDocument(self.pdf)
        self.pdfLinkService.setViewer(viewer)
        self.pdfFindController.setDocument(self.pdf)
        self.drawScaled(self.scale)

        self.loading = false
        self.$emit('loading', false)
      }).catch(err => {
        self.$emit('error', err)
        self.loading = false
        self.$emit('loading', false)
      })
  },
  beforeUnmount() {
    const self = this
    if (self.pdfViewer) {
      self.pdfViewer.destroy()
      self.pdfViewer = null
    }
  },
  methods: {
    calculateScale(width = -1, height = -1) {
      this.pdfViewer.update(1, this.rotate)

      // this.pdfViewer.update({
      //   scale: 1,
      //   rotation: this.rotate,
      // }) // Reset scaling to 1 so that "this.pdfViewer.viewport.width" gives proper width;
      if (width === -1 && height === -1)
        width = this.$refs.container.offsetWidth
      return width / this.pdfViewer.viewport.width
    },
    calculateScaleHeight() {
      this.pdfViewer.update(1, this.rotate)

      // this.pdfViewer.update({
      //   scale: 1,
      //   rotation: this.rotate,
      // }) // Reset scaling to 1 so that "this.pdfViewer.viewport.width" gives proper width;
      const height = this.$refs.container.offsetHeight
      const parentel = this.$refs.container.parentElement.parentElement
      return parentel.offsetHeight / height
    },
    drawScaled(newScale, isChange) {
      if (this.pdfViewer) {
        if (newScale === 'page-width') {
          newScale = this.calculateScale()
          this.$emit('update:scale', newScale)
        }
        else if (newScale === 'page-height') {
          newScale = this.calculateScaleHeight()
          this.$emit('update:scale', newScale)
        }

        this.pdfViewer.update(newScale, this.rotate)

        // this.pdfViewer.update({
        //   scale: newScale,
        //   rotation: this.rotate,
        // })

        // The SimpleLinkService from the DefaultAnnotationLayerFactory doesn't do anything with links so override with our LinkService after it is created
        if (this.annotation) {
          this.pdfViewer.annotationLayer = this.pdfViewer.annotationLayerFactory.createAnnotationLayerBuilder(this.pdfViewer.div, this.pdfViewer.pdfPage)
          this.pdfViewer.annotationLayer.linkService = this.pdfLinkService
        }

        const pdfViewer = toRaw(this.pdfViewer)

        pdfViewer.draw()
        if (isChange) {
          this.$nextTick(() => {
            this.$emit('updateSize', pdfViewer.viewport)
          })
        }

        // The findController needs the text layer to have been created in the Draw() function, so link it in now
        if (this.text)
          this.pdfViewer.textLayer.findController = this.pdfFindController

        this.loading = false
        this.$emit('loading', false)
      }
    },
  },
}
</script>

<template>
  <slot
    v-if="loading"
    name="loading"
  />
  <div
    ref="container"
  />
</template>

<style src="pdfjs-dist/web/pdf_viewer.css"></style>
