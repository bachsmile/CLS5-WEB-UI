<script setup lang="ts">
import type { Header, Item } from 'vue3-easy-data-table'
import CmTable from '@/components/common/CmTable.vue'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'

const props = withDefaults(defineProps<Props>(), ({
  headers: _ => [],
  items: _ => [],
  totalRecord: _ => 0,
  listId: _ => [],
  dataDetail: null,
  tootlipEdit: '',
  tootlipDelete: '',
  tootlipReport: '',
  pageNumber: 0,
}))

const emit = defineEmits<Emit>()

interface Props {
  headers: Header[]
  items: Item[]
  totalRecord: number
  pageNumber?: number
  listId: any[]
  dataDetail: Item | null
  tootlipEdit: string
  tootlipDelete: string
  tootlipReport: string
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

function getDetail(val: any) {
  emit('update:dataDetail', val)
}

function deleteItem(val: any) {
  emit('update:dataDelete', [val.id])
}

function selectedRows(e: any) {
  emit('update:listId', e)
}

function selectedAll(e: any) {
  const listId = props.items.map((e: any) => e.id)

  emit('update:listId', listId)
}

function handlePageClick(e: any) {
  emit('update:pageNumber', e)
}
</script>

<template>
  <CmTable
    :headers="headers"
    :items="items"
    :total-record="totalRecord"
    @update:selected="selectedRows"
    @checked-all="selectedAll"
    @handlePageClick="handlePageClick"
  >
    <template #rowItem="{ col, context }">
      <span v-if="col === 'name'">
        <CpCustomInfo
          :context="context"
          label-code="code"
          :is-full-name="false"
          :is-show-email="false"
          :is-show-avatar="false"
        />
      </span>
    </template>
    <template
      #actions="{ data }"
    >
      <div
        v-if="props.isShowReport"
        class="px-2"
      >
        <VIcon
          disabled="true"
          icon="tabler:chart-pie-2"
          :size="18"
          class="align-middle color-success"
          @click="getDetail(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ props.tootlipReport }}
        </VTooltip>
      </div>
      <div
        v-if="props.isShowEdit"
        class="px-2 "
      >
        <VIcon
          icon="fe:edit"
          :size="18"
          class="align-middle color-primary"
          @click="getDetail(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ props.tootlipEdit }}
        </VTooltip>
      </div>
      <div
        v-if="props.isShowDelete"
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
          {{ props.tootlipDelete }}
        </VTooltip>
      </div>
      <slot
        name="actions"
        :data="data"
      />
    </template>
  </CmTable>
</template>
