<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import { DialogType } from '@/constant/data/notification.json'

interface Props {
  keyModal?: string
  confirmationMsg: string
  confirmationMsgSubTitle?: string
  isDialogVisible: boolean
  type: number
  minWidth?: number
  maxWidth?: number
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
  (e: 'confirm', value: boolean, key?: string): void
}

const props = withDefaults(defineProps<Props>(), ({
  type: 0,
  variant: 'outlined',
  buttonOkName: 'ok-title',
  buttonCancleName: 'cancel-title',
  isHideFooter: false,
  minWidth: 300,
  maxWidth: 300,
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
  emit('confirm', true, props?.keyModal)
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
    :min-width="minWidth"
    :max-width="maxWidth"
    :model-value="props.isDialogVisible"
    close-on-back
    @update:model-value="updateModelValue"
  >
    <VCard class="text-center pa-6">
      <VCardText class="noti-content">
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
        class="align-center justify-center gap-2 noti-content"
      >
        <CmButton
          variant="outlined"
          bg-color="bg-white"
          color="dark"
          text-color="color-dark"
          class="w-50"
          @click="onCancel"
        >
          {{ t(buttonCancleName) }}
        </CmButton>

        <CmButton
          variant="elevated"
          class="w-50"
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
.v-dialog {
  .v-card{
    border-radius: 12px !important;
  }
}
.text-title-noti {
  color: $color-gray-900;
}

.text-title-sub-noti {
  color: $color-gray-500;
}
</style>
