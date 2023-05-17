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
const handleSaveUpdate = (event: any) => {
  emit('onSaveGroup', event, 'save-update')
}
const handleSaveAdd = (event: any) => {
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
  (e: 'onSave'): void
  (e: 'onSaveUpdate'): void
  (e: 'onSaveGroup', event: any, type: string): void
}

const onCancel = () => {
  emit('onCancel')
}

const handlerPreButton = (event: any) => {
  emit('onSaveGroup', event, 'save')
}
</script>

<template>
  <div class="d-flex justify-end">
    <div class="mr-3">
      <CmButton
        variant="outlined"
        bg-color="bg-white"
        color="dark"
        text-color="color-dark"
        @click="onCancel"
      >
        {{ t(titleCancel) }}
      </CmButton>
    </div>
    <div
      v-if="props.isSave"
      class="mr-3"
    >
      <CmButton
        color="primary"
        @click="emit('onSave')"
      >
        {{ t(titleSave) }}
      </CmButton>
    </div>
    <div
      v-if="props.isSaveAndUpdate"
      class="mr-3"
    >
      <CmButton
        color="primary"
        @click="emit('onSaveUpdate')"
      >
        {{ t(titleSaveAndUpdate) }}
      </CmButton>
    </div>
    <div>
      <CmButtonGroup
        v-if="props.isSaveGroup"
        is-load
        :list-item="action"
        :title="titleSaveGroup"
        @click-prepend="handlerPreButton($event)"
      >
        {{ t(titleSaveGroup) }}
      </CmButtonGroup>
    </div>
  </div>
</template>

