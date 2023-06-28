<script setup lang="ts">
import type { Header, Item } from 'vue3-easy-data-table'

const props = withDefaults(defineProps<Props>(), ({
  headers: () => ([]),
  items: () => ([]),
  rowClassName: '',
  customId: 'id',
}))
const CmAvatar = defineAsyncComponent(() => import('@/components/common/CmAvatar.vue'))
interface Props {
  headers: Header[]
  items?: Item[]
  rowClassName?: string
  customId?: string
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const headers = reactive([
  { text: 'Tổ chức' },
])
const items = reactive([
  {
    label: t('orgStruct'),
    icon: 'tabler:briefcase',
    colorClass: 'color-error',
    content: [
      { content: t('orgStruct') }, { content: 'orgStruct' },
    ],
  },
  {
    label: 'Nhóm người dùng',
    icon: 'tabler:users',
    colorClass: 'color-warning',
    content: [
      { content: 'Nhóm người dùng' }, { content: 'Nhóm người dùng' },
    ],
  },
  {
    label: 'Chức danh',
    icon: 'prime-check-circle',
    colorClass: 'color-success',
    content: [
      { content: 'Chức danh' }, { content: 'Chức danh' },
    ],
  },

])
</script>

<template>
  <div class="table-sub">
    <div>
      <VRow>
        <VCol
          v-for="(header, idHeader1) in headers"
          :key="idHeader1"
          class="pa-0"
        >
          <div
            class="th-header text-start"
          >
            {{ header.text || '' }}
          </div>
        </VCol>
      </VRow>
      <VRow
        v-for="(item, idItems) in items"
        :key="idItems"
        class="pa-0"
      >
        <VCol class="py-2">
          <div
            v-for="(content, id) in item.content"
            :key="id"
            class="d-flex align-center py-1"
          >
            <div>
              <CmAvatar
                v-if="item?.icon"
                class="mr-2"
                :size="32"
                :class="[item?.colorClass]"
                variant="tonal"
                :icon="item?.icon"
              >
                <VIcon :icon="item?.icon" />
              </CmAvatar>
            </div>
            <div>
              {{ content?.content }}
            </div>
          </div>
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
