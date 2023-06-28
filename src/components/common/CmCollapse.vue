<script lang="ts" setup>
interface Props {
  isShow: boolean
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <VExpandTransition>
    <div v-show="props.isShow">
      <slot />
    </div>
  </VExpandTransition>
</template>
