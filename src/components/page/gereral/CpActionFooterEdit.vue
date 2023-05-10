<script setup lang="ts">
interface Props {
  isSave?: any
}

const props = withDefaults(defineProps<Props>(), ({
  isSave: true,
}))

const emit = defineEmits<Emit>()
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const handleSaveUpdate = (event: any) => {
  emit('onSave', event, 'save-update')
}
const handleSaveAdd = (event: any) => {
  emit('onSave', event, 'save-add')
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
  (e: 'onSave', event: any, type: string): void
}

const onCancel = () => {
  emit('onCancel')
}

const handlerPreButton = (event: any) => {
  emit('onSave', event, 'save')
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
        {{ t('cancel-title') }}
      </CmButton>
    </div>
    <div>
      <CmButtonGroup
        v-if="props.isSave"
        is-load
        :list-item="action"
        :title="t('save-and-add')"
        @click-prepend="handlerPreButton($event)"
      >
        {{ t('save') }}
      </CmButtonGroup>
    </div>
  </div>
</template>

