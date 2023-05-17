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
  hover?: boolean
  href?: string
  rounded?: string | number | boolean
  variant?: string
  shadow?: string
  backgroud?: string
}

const props = withDefaults(defineProps<Props>(), ({
  disabled: false,
  shadow: 'shadow-md',
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
    <template #actions>
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
</style>
