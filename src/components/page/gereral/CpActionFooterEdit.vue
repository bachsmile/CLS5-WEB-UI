<script setup lang="ts">
interface Props {
  isSave?: boolean
  isCancel?: boolean
  isSaveGroup?: boolean
  isSaveAndUpdate?: boolean
  titleSave?: string
  titleCancel?: string
  titleSaveGroup?: string
  titleSaveAndUpdate?: string
}

const props = withDefaults(defineProps<Props>(), ({
  isSave: false,
  isSaveGroup: false,
  isSaveAndUpdate: false,
  titleCancel: 'cancel-title',
}))

const emit = defineEmits<Emit>()
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
function handleSaveUpdate(event: any) {
  emit('onSaveGroup', event, 'save-update')
}
function handleSaveAdd(event: any) {
  emit('onSaveGroup', event, 'save-add')
}
const action = [
  {
    title: t('save-and-update'),
    icon: 'save',

    action: handleSaveUpdate,
    prependItem: {
      value: true,
    },
  },
  {
    title: t('save-and-add'),
    icon: 'save',

    action: handleSaveAdd,
    prependItem: {
      value: true,
    },
  },
]

interface Emit {
  (e: 'onCancel'): void
  (e: 'onSave', idx: any, unload: any): void
  (e: 'onSaveUpdate', idx: any, unload: any): void
  (e: 'onSaveGroup', event: any, type: string): void
}

function onCancel() {
  emit('onCancel')
}

function handlerPreButton(event: any) {
  emit('onSaveGroup', event, 'save')
}
</script>

<template>
  <div class="d-flex justify-end">
    <div>
      <CmButton
        bg-color="bg-white"
        color="white"
        text-color="color-dark"
        @click="onCancel"
      >
        {{ t(titleCancel || '') }}
      </CmButton>
    </div>
    <div
      v-if="props.isSave"
      class="ml-3"
    >
      <CmButton
        color="primary"
        is-load
        @click="(idx: any, unload: any) => emit('onSave', idx, unload)"
      >
        {{ t(titleSave || '') }}
      </CmButton>
    </div>
    <div
      v-if="props.isSaveAndUpdate"
      class="ml-3"
    >
      <CmButton
        is-load
        color="primary"
        @click="(idx: any, unload: any) => emit('onSaveUpdate', idx, unload)"
      >
        {{ t(titleSaveAndUpdate || '') }}
      </CmButton>
    </div>
    <div
      v-if="props.isSaveGroup"
      class="ml-3"
    >
      <CmButtonGroup
        is-load
        :list-item="action"
        :title="titleSaveGroup"
        @click-prepend="handlerPreButton($event)"
      >
        {{ t(titleSaveGroup || '') }}
      </CmButtonGroup>
    </div>
  </div>
</template>
