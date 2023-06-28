<script lang="ts" setup>
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
interface Emit {
  (e: 'update:keySearch', key: string): void
}

interface Props {
  keySearch?: string
}
const timer = ref<any>(null)

const handleSearch = window._.debounce((val: any) => {
  emit('update:keySearch', val)
}, 500)

/**
 * dùng component search cẩn thận khi dùng v-model hoặc dùng event update:keySearch
 * Nếu dùng cả 2 dẫn đến double emit
 * */
</script>

<template>
  <CmTextField
    style="width: 100%"
    class="header-action-field"
    placeholder="Tìm kiếm"
    prepend-inner-icon="tabler-search"
    @update:model-value="handleSearch"
  />
</template>
