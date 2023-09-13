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
  justify?: string
  isHideFooter?: boolean
  persistent?: boolean // ngăn không cho tắt modal
  size?: typeof sizeDialog[] | string
  height?: number | string
  disabledOk?: boolean
  disabledCancel?: boolean
  appendToBody?: boolean
  isDivSpace?: boolean
  isOk?: boolean
  isCancle?: boolean
  isThemeCustom?: boolean
}

interface Emit {
  (e: 'cancel', type?: string): void
  (e: 'confirm', idx?: any, data?: any): void
  (e: 'show'): void
  (e: 'hide'): void
}

const props = withDefaults(defineProps<Props>(), ({
  type: 0,
  variant: 'outlined',
  buttonOkName: 'ok-title',
  justify: 'end',
  buttonCancleName: 'cancel-title',
  isHideFooter: false,
  persistent: false,
  size: 'lg',
  appendToBody: false,
  isDivSpace: true,
  isOk: true,
  isCancle: true,
}))

const emit = defineEmits<Emit>()
const CmCard = defineAsyncComponent(() => import('@/components/common/CmCard.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

function onCancel() {
  emit('cancel')
}
const buttonOk = ref()
function onConfirmation(idx: any) {
  emit('confirm', idx, buttonOk.value.unLoadButton)
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
      return '500'
    case 'md':
      return '700'
    case 'lg':
      return '800'
    case 'xl':
      return '1162px'
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
      <div v-if="isThemeCustom">
        <slot name="isTheme" />
        <VIcon
          class="btn-close-x"
          @click="onCancel"
        >
          mdi-close
        </VIcon>
      </div>
      <CmCard
        v-else
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
          v-if="!isHideFooter"
          class="mb-1"
        />
        <template
          v-if="!isHideFooter"
          #actions
        >
          <div
            class="d-flex  w-100"
            :class="`justify-${justify}`"
          >
            <slot name="actions" />
            <CmButton
              v-if="isCancle"
              variant="outlined"
              color="secondary"
              :disabled="disabledCancel"
              @click="onCancel"
            >
              {{ t(buttonCancleName) }}
            </CmButton>

            <CmButton
              v-if="isOk"
              ref="buttonOk"
              variant="elevated"
              :disabled="disabledOk"
              :color="color"
              is-load
              @click="(idx: any) => onConfirmation(idx)"
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
  padding-top: 12px;
  padding-bottom: 24px;
  padding-inline: 16px !important;
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
