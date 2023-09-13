<script setup lang="ts">
interface Props {
  border?: string | number | boolean
  color?: string
  density?: string
  disabled?: boolean
  elevation?: string | number
  exact?: boolean
  flat?: boolean
  height?: string | number
  padding?: string
  borderRadius?: string
  hover?: boolean
  hideAction?: boolean
  href?: string
  rounded?: string | number | boolean
  variant?: string
  shadow?: string
  backgroud?: string
}

const props = withDefaults(defineProps<Props>(), ({
  disabled: false,
  shadow: 'shadow-md',
  borderRadius: '8px',
  hideAction: false,
}))
</script>

<template>
  <VCard
    :border="props.border"
    :density="props.density"
    :disabled="props.disabled"
    :elevation="props.elevation"
    :exact="props.exact"
    :flat="props.flat"
    :height="props.height"
    :hover="props.hover"
    :href="props.href"
    :rounded="props.rounded"
    :variant="props.variant"
    :class="`${props.shadow} ${props.backgroud}`"
    :style="{
      padding,
      borderRadius,
    }"
  >
    <template #image>
      <slot name="image" />
    </template>
    <template #default>
      <slot />
    </template>
    <template #title>
      <slot name="title" />
    </template>
    <template #subtitle>
      <slot name="subtitle" />
    </template>
    <template #text>
      <slot name="text" />
    </template>
    <template
      v-if="!hideAction"
      #actions
    >
      <slot name="actions" />
    </template>
  </VCard>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;

.v-card-title {
  color: $color-gray-900;
  font-weight: $weight-md;
}
.v-card-img{
  border-radius: 8px;
  overflow: hidden;
  min-height: 10rem;
  img{
    height: 100%;
    object-fit: cover;
  }
}
</style>
