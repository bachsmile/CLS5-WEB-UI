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
  data?: any
  icon?: string
  text?: string
  isAvatar?: boolean
  isText?: boolean
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  color: 'primary',
  variant: Globals.VARIANT_DEFAULT,
  size: Globals.SIZE_AVATAR_DEFAULT,
  isClassicBorder: false,
  isAvatar: false,
  isText: false,
  text: '',
  icon: 'tabler:camera',
}))

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
    :class="[className, isClassicBorder ? 'border-avatar' : '', prefixColor]"
    :variant="variant"
    :rounded="rounded"
    :size="size"
  >
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
    <slot v-else>
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
  border-radius: 8px;
}
.v-avatar--rounded{
  border-radius: 8px !important;
}
</style>
