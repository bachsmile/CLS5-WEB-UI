<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import { DialogType } from '@/constant/data/notification.json'

interface Props {
  confirmationMsg: string
  confirmationMsgSubTitle?: string
  isDialogVisible: boolean
  type: number
  icon?: string
  variant?: string
  color?: string
  className?: string
  buttonOkName?: string
  buttonCancleName?: string
  isHideFooter?: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), ({
  type: 0,
  variant: 'outlined',
  buttonOkName: 'ok-title',
  buttonCancleName: 'cancel-title',
  isHideFooter: false,
}))

const emit = defineEmits<Emit>()

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const prefixColor = computed(() => {
  if (props.variant === 'outlined')
    return 'color'

  return 'btn'
})

const checkTypeDialog = (type: number) => {
  return DialogType[type]
}

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  emit('confirm', true)
  updateModelValue(false)
}

const onCancel = () => {
  emit('confirm', false)
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <!-- 👉 Confirm Dialog -->
  <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    close-on-back
    @update:model-value="updateModelValue"
  >
    <VCard class="text-center px-10 py-6">
      <VCardText class="noti-content mb-2">
        <div class="d-flex justify-center mb-5">
          <div class="icon-noti">
            <VIcon
              :icon="icon || checkTypeDialog(type).icon"
              :variant="variant"
              :class="[`${prefixColor}-${color || checkTypeDialog(type).color}`, className]"
              class="noti-zindex"
              :size="checkTypeDialog(type).size"
            />
            <span
              class="ring1"
              :class="[`ring1-type-${type}`]"
            />
            <span
              class="ring2"
              :class="[`ring2-type-${type}`]"
            />
          </div>
        </div>

        <div class="text-semibold-lg text-title-noti mb-2">
          {{ props.confirmationMsg }}
        </div>
        <div class="text-regular-sm text-title-sub-noti">
          {{ props.confirmationMsgSubTitle }}
          <slot name="sub-title" />
        </div>
      </VCardText>

      <VCardActions
        v-if="!isHideFooter"
        class="align-center justify-center gap-2"
      >
        <CmButton
          variant="outlined"
          bg-color="bg-white"
          color="dark"
          text-color="color-dark"
          @click="onCancel"
        >
          {{ t(buttonCancleName) }}
        </CmButton>

        <CmButton
          variant="elevated"
          :color="color || checkTypeDialog(type).color"
          @click="onConfirmation"
        >
          {{ t(buttonOkName) }}
        </CmButton>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.text-title-noti {
  color: $color-gray-900;
}

.text-title-sub-noti {
  color: $color-gray-500;
}

.icon-noti {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 50px;
  inline-size: 50px;

  .ring1 {
    position: absolute;
    z-index: 5;
    border-radius: 50%;
    block-size: 32px;
    inline-size: 32px;
  }

  .ring2 {
    position: absolute;
    z-index: 0;
    border-radius: 50%;
    block-size: 52px;
    inline-size: 52px;
  }

  .ring1-type-0 {
    background-color: $color-success-100;
  }

  .ring2-type-0 {
    background-color: $color-success-50;
  }

  .ring1-type-1 {
    background-color: $color-warning-100;
  }

  .ring2-type-1 {
    background-color: $color-warning-50;
  }

  .ring1-type-2 {
    background-color: $color-error-100;
  }

  .ring2-type-2 {
    background-color: $color-error-50;
  }

  .ring1-type-3 {
    background-color: $color-primary-100;
  }

  .ring2-type-3 {
    background-color: $color-primary-50;
  }

  .noti-zindex {
    z-index: 10;
  }
}
</style>
