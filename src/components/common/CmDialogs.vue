<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import type { sizeDialog } from '@/typescript/enums/enums'

/**
 * @size ['sm', 'lg', 'xl'] tương đương ['300','800','1200']
 *
 * */
interface Props {
  title?: string
  subTitle?: string
  isDialogVisible: boolean
  type?: number
  icon?: string
  variant?: string
  color?: string
  className?: string
  buttonOkName?: string
  buttonCancleName?: string
  isHideFooter?: boolean
  persistent?: boolean
  size?: typeof sizeDialog[] | string
  disabledOk?: boolean
  disabledCancel?: boolean
}

interface Emit {
  (e: 'cancel', type?: string): void
  (e: 'confirm', type?: string): void
  (e: 'show'): void
}

const props = withDefaults(defineProps<Props>(), ({
  type: 0,
  variant: 'outlined',
  buttonOkName: 'ok-title',
  buttonCancleName: 'cancel-title',
  isHideFooter: false,
  persistent: false,
  size: 'lg',
}))

const emit = defineEmits<Emit>()
const CmCard = defineAsyncComponent(() => import('@/components/common/CmCard.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const onCancel = () => {
  emit('cancel')
}

const onConfirmation = () => {
  emit('confirm')
}

const onDialogShown = (e: any) => {
  // console.log('onDialogShown', e)
}
const onDialogHidden = (e: any) => {
  // console.log('onDialogHidden', e)
}

watch(() => props.isDialogVisible, val => {
  if (val)
    emit('show')
})
const sizeModal = computed(() => {
  switch (props.size) {
    case 'sm':
      return '300'
    case 'lg':
      return '800'
    case 'xl':
      return '1200'
    default:
      break
  }
})
</script>

<template>
  <VRow
    justify="center"
    class="dialog-common"
  >
    <VDialog
      class="abc"
      content-class="cm-dialogs"
      :model-value="props.isDialogVisible"
      :width="sizeModal"
      scrollable
      :persistent="props.persistent"
      @update:model-value="onCancel"
      @before-enter="onDialogShown"
    >
      <CmCard backgroud="bg-white">
        <template #title>
          <VCardTitle>
            {{ title }}
            <slot name="title" />
          </VCardTitle>

          <VCardSubtitle>
            {{ subTitle }}
            <slot name="sub-title" />
          </VCardSubtitle>
        </template>
        <template
          #text
        >
          <slot />
        </template>
        <VDivider class="mb-1" />
        <template #actions>
          <div class="d-flex justify-end my-3 w-100">
            <CmButton
              variant="outlined"
              bg-color="bg-white"
              color="dark"
              :disabled="disabledCancel"
              text-color="color-dark"
              @click="onCancel"
            >
              {{ t(buttonCancleName) }}
            </CmButton>

            <CmButton
              variant="elevated"
              :disabled="disabledOk"
              :color="color"
              @click="onConfirmation"
            >
              {{ t(buttonOkName) }}
            </CmButton>
          </div>
        </template>
      </CmCard>
    </VDialog>
  </VRow>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.v-card-actions {
  padding-block: 12px;
  padding-inline: 24px;
}

.v-card-item {
  border-block-end: 1px solid $color-line-default;
}
.cm-dialogs {
  .v-card-text {
    // overflow: auto;
    // max-height: 90vh;
  }
}
</style>
