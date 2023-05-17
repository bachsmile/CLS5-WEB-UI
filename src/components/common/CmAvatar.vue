<script lang="ts" setup>
import Globals from '@/constant/Globals'
import type { typeVariant } from '@/typescript/enums/enums'

interface Props {
  color?: string
  variant?: typeof typeVariant[number]
  rounded?: string | number | boolean
  src?: any
  size?: number
  className?: string
  isClassicBorder?: boolean
  data?: string
  icon?: string
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  color: '',
  variant: Globals.VARIANT_DEFAULT,
  size: Globals.SIZE_AVATAR_DEFAULT,
  isClassicBorder: false,
}))

const prefixColor = computed(() => {
  if (props.variant === 'outlined')
    return `color-${props.color}`

  return `btn-${props.color}`
})

const getAvatarName = (data: any) => {
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
    :class="[className, isClassicBorder ? 'border-avatar' : '']"
    :color="prefixColor"
    :variant="variant"
    :rounded="rounded"
    :size="size"
  >
    <slot v-if="icon" />
    <VImg
      v-else-if="src"
      :src="src"
    />
    <span
      v-else
      :style="{ fontSize: `${size / 2}px` }"
    >{{ getAvatarName(data) }}</span>
  </VAvatar>
</template>

<style lang="scss">
@use "@/styles/variables/global" as *;

.border-avatar {
  border: 4px solid $color-white;
  box-shadow: $box-shadow-lg;
}
</style>
