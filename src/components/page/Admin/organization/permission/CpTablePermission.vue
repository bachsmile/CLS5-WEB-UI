<script lang="ts" setup>
import type { Header, Item } from 'vue3-easy-data-table'

// Khởi tạo biến đa ngôn ngữ

const props = withDefaults(defineProps<Props>(), ({
  headers: _ => [],
  items: _ => [],
  totalRecord: _ => 0,
  listId: _ => [],

  pageNumber: 0,
})) // Khởi tạo biến đa ngôn ngữ

const emit = defineEmits<Emit>()
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

interface Props {
  headers: Header[]
  items: Item[]
  totalRecord: number
  pageNumber?: number
  listId: any[]
  isShowEdit?: boolean
  isShowDelete?: boolean
  isShowReport?: boolean
}
interface Emit {
  (e: 'update:dataDetail', data: any): void
  (e: 'update:listId', data: any): void
  (e: 'update:dataDelete', data: any): void
  (e: 'update:pageNumber', data: any): void
}
const getDetail = (val: any) => {
  emit('update:dataDetail', val)
}

const deleteItem = (val: any) => {
  emit('update:dataDelete', val.id)
}

const selectedRows = (e: any) => {
  emit('update:listId', e)
}

const selectedAll = () => {
  const listId = props.items.map((e: Item) => e.id)
  emit('update:listId', listId)
}

const handlePageClick = (e: any) => {
  emit('update:pageNumber', e)
}
</script>

<template>
  <CmTable
    :headers="headers"
    :items="items"
    :total-record="totalRecord"
    is-disabled-move="false"
    @update:selected="selectedRows"
    @checked-all="selectedAll"
    @update:page-number="handlePageClick"
  >
    <template #rowItem="{ col, context }">
      <div v-if="col === 'administrator'">
        <VIcon
          :icon="(context?.roleValue & 1) === 1 ? 'ic:round-check' : 'ph:x-bold'"
          :class="[(context?.roleValue & 1) === 1 ? 'text-primary' : 'text-error']"
          size="24"
        />
      </div>
      <div v-if="col === 'teacher'">
        <VIcon
          :icon="(context?.roleValue & 2) === 2 ? 'ic:round-check' : 'ph:x-bold'"
          :class="[(context?.roleValue & 2) === 2 ? 'text-primary' : 'text-error']"
          size="24"
        />
      </div>
      <div v-if="col === 'learner'">
        <VIcon
          :icon="(context?.roleValue & 4) === 4 ? 'ic:round-check' : 'ph:x-bold'"
          :class="[(context?.roleValue & 4) === 4 ? 'text-primary' : 'text-error']"
          size="24"
        />
      </div>
    </template>

    <template
      #actions="{ data }"
    >
      <div
        class="px-2 "
      >
        <VIcon
          icon="mdi-pencil"
          :size="18"
          class="align-middle text-primary"
          @click="getDetail(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          Chỉnh sửa
        </VTooltip>
      </div>
      <div
        class="px-2 "
      >
        <VIcon
          icon="fe:trash"
          :size="18"
          class="align-middle color-error"
          @click="deleteItem(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          Xóa
        </VTooltip>
      </div>
      <slot
        name="actions"
        :data="data"
      />
    </template>
  </CmTable>
</template>

