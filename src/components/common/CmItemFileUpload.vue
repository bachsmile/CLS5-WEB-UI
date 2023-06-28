<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  iconStatus: true,
  files: () => ([
    { name: 'Real-Time', icon: 'tabler:file', size: 0, processing: 0 },
  ]),
})
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'cancel', value: any): void
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
  files: item[]
}
const CmIconNoti = defineAsyncComponent(() => import('@/components/common/CmIconNoti.vue'))
async function cancel(index: any) {
  emit('cancel', index)
}
</script>

<template>
  <div>
    <VList class="box-items">
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
        <template
          v-if="iconStatus"
          #append
        >
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
            {{ item.size ? MethodsUtil.formatCapacity(item.size) : t("undefined") }}
          </div>
          <div class="ml-3 text-regular-sm ">
            <VProgressLinear
              :model-value="item.processing"
              striped
              color="primary"
              rounded
            />
          </div>
        </VListItemTitle>
      </VListItem>
    </VList>
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
.box-items{
  padding: unset;
  border-radius: 8px;
}
</style>
