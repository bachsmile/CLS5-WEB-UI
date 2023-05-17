<script setup lang="ts">
import type { ClickRowArgument, Header, Item } from 'vue3-easy-data-table'
import CmAccodion from '@/components/common/CmAccodion.vue'

interface Props {
  headers: Header[]
  items?: Item[]
  rowClassName?: string
  customId?: string
}

const props = withDefaults(defineProps<Props>(), ({
  headers: () => ([]),
  items: () => ([]),
  rowClassName: '',
  customId: 'id',
}))

const tableCol1 = {
  headers: reactive([
    { text: 'Thông tin chi tiết', value: 'text' },
    { text: '123', value: 'value' },
  ]),
  items: reactive([
    {
      id: 0,
      text: 'CCCD/Hộ chiếu',
      value: '01234567890',
    },
    {
      id: 1,
      text: 'Lần đăng nhập gần nhất',
      value: '03-02-2023',
    },
    {
      id: 2,
      text: 'KPI học tập',
      value: '1026.19h/150h - 684.13%',
    },
    { id: 3, text: 'Tổng thời gian học/KPI học(%)', value: '0%' },
    { id: 4, text: 'Tổng thời gian học', value: '12h 24m 5s' },
    { id: 5, text: 'Số chứng chỉ', value: '3' },
  ]),
}

const showRow = (item: ClickRowArgument) => {
  // console.log(item)
}
</script>

<template>
  <div class="table-sub">
    <div>
      <VRow>
        <VCol
          v-for="(header1, idHeader1) in tableCol1.headers"
          :key="idHeader1"
          class="pa-0"
        >
          <div
            class="th-header text-start"
          >
            {{ header1.text || '' }}
          </div>
        </VCol>
      </VRow>
      <VRow
        v-for="(items1, idItems1) in tableCol1.items"
        :key="idItems1"
        class="pa-0"
      >
        <VCol class="tr-row">
          {{ items1.text }}
        </VCol>
        <VCol class="tr-row">
          {{ items1.value }}
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/variables/common/table.cm" as *;
@use "@/styles/style-global.scss" as *;
.table-sub{
  // margin: -20px;
  .th-header{
    padding: $sm $xl-2;
    height: 50px;
    border-bottom:$border-input;;
    margin-bottom: $sm ;
  }
  .tr-row{
    padding: $xl-2;
  }

}
</style>
