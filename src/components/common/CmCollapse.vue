<script lang="ts" setup>
interface Props {
  isShow: boolean
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <VExpandTransition mode="out-in">
    <div
      v-show="props.isShow"
      class="w-100"
    >
      <slot />
    </div>
  </VExpandTransition>
</template>
