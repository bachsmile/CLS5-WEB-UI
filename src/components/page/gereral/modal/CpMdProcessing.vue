<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  files: () => ([
    { name: 'Real-Time', icon: 'tabler:file', size: 0, processing: 0 },
  ]),
})

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmIconNoti = defineAsyncComponent(() => import('@/components/common/CmIconNoti.vue'))

interface item {
  name?: string
  icon?: string
  size?: number
  processing?: number
}
interface Props {
  isShowModal: boolean
  files: item[]
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
  (e: 'cancel', value: any): void
}

async function onCancel() {
  emit('update:isShowModal', false)
}
async function cancel(index: any) {
  emit('cancel', index)
}
async function onConfirm() {
  nextTick(() => {
    emit('update:isShowModal', false)
  })
}
</script>

<template>
  <div>
    <CmDialogs
      :title="t('title-files-upload')"
      :is-dialog-visible="isShowModal"
      :button-cancle-name="t('hide')"
      :is-ok="false"
      close-on-back
      persistent
      :is-div-space="false"
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <div>
        <VList>
          <VListItem
            v-for="(item, i) in files"
            :key="i"
            class="box-process-file"
            :value="item"
          >
            <template
              #prepend
            >
              <div class="d-flex align-start">
                <CmIconNoti
                  :icon="item.icon"
                  :type="3"
                />
              </div>
            </template>
            <template #append>
              <VBtn
                v-if="item.processing === 100"
                color="primary"
                icon="tabler:circle-check-filled"
                variant="text"
              />
              <VBtn
                v-else
                color="infor"
                icon="tabler:trash"
                variant="text"
                @click="cancel(i)"
              />
            </template>
            <VListItemTitle>
              <div class="ml-3 text-medium-sm">
                {{ item.name }}
              </div>
              <div class="ml-3 mb-2 text-regular-sm ">
                {{ MethodsUtil.formatCapacity(item.size) }}
              </div>
              <div class="ml-3 text-regular-sm ">
                <VProgressLinear
                  :model-value="item.processing"
                  color="primary"
                  rounded
                />
              </div>
            </VListItemTitle>
          </VListItem>
        </VList>
      </div>
    </CmDialogs>
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
</style>
