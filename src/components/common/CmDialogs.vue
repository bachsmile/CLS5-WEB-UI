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
  persistent?: boolean // ngăn không cho tắt modal
  size?: typeof sizeDialog[] | string
  height?: number | string
  disabledOk?: boolean
  disabledCancel?: boolean
  appendToBody?: boolean
  isDivSpace?: boolean
  isOk?: boolean
}

interface Emit {
  (e: 'cancel', type?: string): void
  (e: 'confirm', type?: string): void
  (e: 'show'): void
  (e: 'hide'): void
}

const props = withDefaults(defineProps<Props>(), ({
  type: 0,
  variant: 'outlined',
  buttonOkName: 'ok-title',
  buttonCancleName: 'cancel-title',
  isHideFooter: false,
  persistent: false,
  size: 'lg',
  appendToBody: false,
  isDivSpace: true,
  isOk: true,
}))

const emit = defineEmits<Emit>()
const CmCard = defineAsyncComponent(() => import('@/components/common/CmCard.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

function onCancel() {
  emit('cancel')
}

function onConfirmation() {
  emit('confirm')
}

function onDialogShown(e: any) {
  // console.log('onDialogShown', e)
}
function onDialogHidden(e: any) {
  // console.log('onDialogHidden', e)
}

watch(() => props.isDialogVisible, val => {
  if (val)
    emit('show')
  else
    emit('hide')
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
    class="dialog-common ma-0"
  >
    <VDialog
      class="cm-dialogs"
      :content-class="`cm-dialogs ${appendToBody ? 'appendToBody' : ''}`"
      :model-value="props.isDialogVisible"
      :width="sizeModal"
      :height="height"
      scrollable
      :persistent="props.persistent"
      @update:model-value="onCancel"
      @before-enter="onDialogShown"
    >
      <CmCard
        :class="{ 'modal-custom-divspace': isDivSpace }"
        backgroud="bg-white"
      >
        <template #title>
          <VCardTitle>
            {{ title }}
            <slot name="title" />
          </VCardTitle>

          <VCardSubtitle>
            {{ subTitle }}
            <slot name="sub-title" />
          </VCardSubtitle>
          <VIcon
            class="btn-close-x"
            @click="onCancel"
          >
            mdi-close
          </VIcon>
        </template>
        <template
          #text
        >
          <slot />
        </template>
        <VDivider
          v-if="isDivSpace"
          class="mb-1"
        />
        <template
          v-if="!isHideFooter"
          #actions
        >
          <div class="d-flex justify-end my-3 w-100">
            <slot name="actions" />
            <CmButton
              variant="outlined"
              color="secondary"
              :disabled="disabledCancel"
              @click="onCancel"
            >
              {{ t(buttonCancleName) }}
            </CmButton>

            <CmButton
              v-if="isOk"
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

.modal-custom-divspace .v-card-item {
  border-block-end: 1px solid $color-line-default;
}
.cm-dialogs.appendToBody {
  .v-card {
    overflow: unset !important;
    .v-card-text {
      overflow: unset !important;
      overflow-y: unset !important;
      // max-height: 90vh;
    }

  }
}
.btn-close-x{
  position: absolute;
  top: 14px;
  right: 24px;
}
</style>
