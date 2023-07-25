<script lang="ts" setup>
import { SIZE_AVATAR_DEFAULT, VARIANT_DEFAULT } from '@/constant/Globals'
import type { typeVariant } from '@/typescript/enums/enums'

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  color: 'primary',
  variant: VARIANT_DEFAULT,
  size: SIZE_AVATAR_DEFAULT,
  isClassicBorder: false,
  isAvatar: false,
  isText: false,
  isLoading: false,
  text: '',
  icon: 'tabler:camera',
}))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface Props {
  color?: string
  variant?: typeof typeVariant[number]
  rounded?: string | number | boolean
  src?: any
  size?: number
  className?: string
  isClassicBorder?: boolean
  data?: any
  icon?: string
  text?: string
  isAvatar?: boolean
  isText?: boolean
  isLoading?: boolean
}
const fileUpload = ref([{ name: 'Real-Time', icon: 'tabler:file', size: 0, processing: 95 }])

const prefixColor = computed(() => {
  if (['outlined', 'tonal'].includes(props.variant))
    return `color-${props.color}`

  return `btn-${props.color}`
})

function getAvatarName(data: any) {
  if (data) {
    if (data?.firstName && data.lastName) {
      let firstName = 'F'
      if (data?.firstName.length > 0)
        firstName = data.firstName[0].toUpperCase()

      let lastName = 'L'
      if (data?.lastName.length > 0)
        lastName = data.lastName[0].toUpperCase()

      return `${firstName}${lastName}`
    }
    if (data?.name != null) {
      const strs = data?.name.split(' ')
      if (strs.length > 1) {
        const firstname = strs[0]
        const lastName = strs[1]

        return firstname[0]?.toUpperCase() + lastName[0]?.toUpperCase()
      }
    }
    if (data?.userName && data?.userName != null) {
      const strs = data.userName.split(' ')
      if (strs.length > 1) {
        const firstname = strs[0]
        const lastName = strs[1]

        return firstname[0].toUpperCase() + lastName[0].toUpperCase()
      }
    }
  }
  return 'FN'
}
</script>

<template>
  <VAvatar
    class="cursor-pointer"
    :color="color"
    :class="[className, isClassicBorder ? 'border-avatar' : '', prefixColor]"
    :variant="variant"
    :rounded="rounded"
    :size="size"
  >
    <span
      v-if="isLoading"
      class="w-75 "
    >
      <div
        class="mb-5 text-uploading text-medium-sm "
      >
        {{ t('uploading') }}
      </div>
      <VProgressLinear
        :model-value="fileUpload[0].processing"
        color="primary"
        rounded
        height="8"
      />
    </span>
    <VImg
      v-if="src"
      :src="src"
    />
    <span
      v-else-if="isAvatar"
      :style="{ fontSize: `${size / 3}px` }"
    >{{ getAvatarName(data) }}</span>
    <span
      v-else-if="isText"
    >
      {{ text }}

    </span>

    <slot v-else-if="!isLoading">
      <VIcon
        v-if="icon"
        :icon="icon"
        :size="size / 5"
      />
    </slot>
  </VAvatar>
</template>

<style lang="scss">
@use "@/styles/variables/global" as *;

.border-avatar {
  border: 4px solid $color-white;
  box-shadow: $box-shadow-lg;
}
.text-uploading{
  color:  rgb(var(--v-primary-700)) !important;
}
</style>
