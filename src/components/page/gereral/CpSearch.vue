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
const search = ref()
const handleSearch = window._.debounce((val: any) => {
  search.value = val
  emit('update:keySearch', val)
}, 500)
</script>

<template>
  <CmTextField
    v-model="search"
    style="width: 100%"
    class="header-action-field"
    placeholder="Tìm kiếm"
    prepend-inner-icon="tabler-search"
    @update:model-value="handleSearch"
  />
</template>
