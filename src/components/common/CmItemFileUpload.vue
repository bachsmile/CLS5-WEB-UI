<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import CmButton from './CmButton.vue'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  iconStatus: true,
  type: 0, // 0: progress, 1:success, 2:error
  files: () => ([
    { name: 'Real-Time', icon: 'tabler:file', size: 0, processing: 0 },
  ]),
})
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'cancel', value: any): void
  (e: 'downloadFile', value?: any): void
  (e: 'refesh', value?: any): void
}

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface item {
  name?: string
  icon?: string
  size?: number
  processing?: number
  [name: string]: any
}
interface Props {
  isShowModal: boolean
  iconStatus?: boolean
  type: number
  files: item[]
}
const CmIconNoti = defineAsyncComponent(() => import('@/components/common/CmIconNoti.vue'))
const listFile = ref(props.files)
const config = ref({
  suppressScrollX: true,
})
async function cancel(index: any) {
  emit('cancel', index)
}
async function dowloadItems(item: any) {
  emit('downloadFile', item)
}
async function refesh(item: any) {
  emit('refesh', item)
}

watch(() => props.files, val => {
  listFile.value = val
}, { deep: true })
</script>

<template>
  <div class="upload-file">
    <PerfectScrollbar :options="config">
      <VList class="box-items">
        <VListItem
          v-for="(item, i) in listFile"
          :key="i"
          class="box-process-file"
          :class="{ 'mb-4': i < listFile.length - 1, 'error': item.type === 2 }"
          :value="item"
        >
          <template
            #prepend
          >
            <div class="d-flex align-start">
              <CmIconNoti
                :icon="item.icon"
                :type="2"
              />
              <VTooltip
                v-if="item?.type"
                activator="parent"
                location="right"
              >
                <div v-html="t(item?.type)" />
              </VTooltip>
            </div>
          </template>
          <template
            v-if="iconStatus"
            #append
          >
            <CmButton
              v-if="item.statusDownload === 1"
              color="infor"
              icon="tabler:download"
              is-rounded
              :size-icon="20"
              variant="text"
              @click="dowloadItems(item)"
            />
            <CmButton
              v-else-if="item.statusDownload === 2 "
              color="primary"
              is-rounded
              icon="line-md:uploading-loop"
              :size-icon="20"
              variant="text"
            />
            <CmButton
              v-else-if="item.statusDownload === 3"
              color="success"
              icon="tabler:circle-check-filled"
              is-rounded
              :size-icon="20"
              variant="text"
            />
            <CmButton
              v-else-if="item.statusDownload === 4"
              color="error"
              icon="material-symbols:file-download-off"
              :size-icon="20"
              variant="text"
            />
            <CmButton
              v-if="item.type === 2"
              color="error"
              icon="tabler:x"
              :size-icon="20"
              variant="text"
            />
            <CmButton
              v-if="item.type === 0"
              color="infor"
              icon="tabler:trash"
              variant="text"
              @click="cancel(i)"
            />
          </template>
          <VListItemTitle>
            <div
              class="ml-3 text-title text-medium-sm text-ellipsis"
              :title="item.name"
            >
              {{ item.name }}
            </div>
            <div class="text-title-sub ml-3 mb-2 text-regular-sm ">
              {{ item.size ? MethodsUtil.formatCapacity(item.size) : t("undefined") }}
            </div>
            <div
              v-if="item.type === 0"
              class="ml-3 text-regular-sm"
            >
              <VProgressLinear
                :model-value="item.processing"
                striped
                color="primary"
                rounded
              />
            </div>
            <div
              v-if="item.type === 2"
              class="text-title ml-3 text-medium-sm"
              @click.stop="refesh(item)"
            >
              Thử lại
            </div>
          </VListItemTitle>
        </VListItem>
      </VList>
    </PerfectScrollbar>
  </div>
</template>

<style lang="scss">
.box-process-file{
  width: 100%;
  height: auto;
  border: 1px solid #2E90FA;
  border-radius: 8px;
  padding: 16px !important;
}
.box-process-file.error{
  width: 100%;
  height: auto;
  border: 1px solid rgb(var(--v-error-300));
  border-radius: 8px;
  padding: 16px !important;
  .text-title{
    color: rgb(var(--v-error-700))
  }
  .text-title-sub{
    color: rgb(var(--v-error-600))
  }
}
.box-items{
  padding: unset;
  border-radius: 8px;
  // max-height: 546px;
  // overflow: auto;
  padding: 8px 12px;
}
.upload-file .ps {
  max-height: 400px;
}
</style>
