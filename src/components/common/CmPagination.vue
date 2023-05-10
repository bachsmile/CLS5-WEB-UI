<script setup lang="ts">
import Globals from '@/constant/Globals'

// Cấu trúc props
interface Props {
  totalItems?: number // tổng số lượng items
  showPageSelect?: boolean // Flag select số lượng items trang
  isLargeSize?: boolean // Flag hiện thị lựa chọn số lượng trang lớn
  pageSize?: number // Số lượng item hiện thị
  customSelect?: Array<number> // Flag custom option số lượng items trên trang
  currentPage?: number // Trang hiện tại
}

// Giá trị mặc định props
const props = withDefaults(defineProps<Props>(), ({
  totalItems: 0,
  showPageSelect: true,
  isLargeSize: false,
  pageSize: Globals.PAGINATION_PAGE_SIZE_DEFAULT,
  customSelect: undefined,
  currentPage: Globals.PAGINATION_CURRENT_PAGE,
}))

// Khai báo biến Emit
const emit = defineEmits<Emit>()

// Cấu trúc Emit
interface Emit {
  (e: 'handlePageClick', pageSize: number): void
  (e: 'pageClick', currentPape: number, pageSize: number): void
}

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const pageSizeCurrent = ref(props.pageSize) // Khởi tạo biến kích thước page hiện tại
const selectedPage = ref(props.currentPage) // Khởi tạo biến kích page đang chọn

// Hiện pagination khi có items
const showPagination = computed(() => {
  return props.totalItems > 0
})

// Tổng số phân trang
const totalItemsLength = computed(() => {
  return Math.ceil(props.totalItems / pageSizeCurrent.value)
})

// Xử lý chuyển trang
const handlePageClick = (page: number) => {
  emit('handlePageClick', page)
  emit('pageClick', page, pageSizeCurrent.value)
}

// Xử lý chuyển kích thước items trang
const handlePageSizeChange = (pageSize: number) => {
  emit('pageClick', 1, pageSize)
}

// watch
watch([() => props.currentPage], ([newValue]) => {
  selectedPage.value = newValue // cập nhật khi thay đổi prop current
})
</script>

<template>
  <div
    v-if="showPagination"
    class="pagination-container"
  >
    <div class="d-flex pagination-flex flex-wrap ">
      <div
        v-if="showPageSelect === true"
        class="d-flex align-center mb-2 mt-1 pagination-select"
      >
        <span class="text-nowrap text-regular-sm ">
          {{ t('show') }}
        </span>
        <VSelect
          v-model="pageSizeCurrent"
          :items="customSelect ? customSelect : isLargeSize ? Globals.PAGINATION_PAGE_SIZE_LARGE_OPTION : Globals.PAGINATION_PAGE_SIZE_DEFAULT_OPTION"
          item-title="state"
          item-value="abbr"
          label="Select"
          class="mx-1 text-medium-sm select-size"
          persistent-hint
          return-object
          single-line
          @update:modelValue="handlePageSizeChange"
        />
        <span class="text-nowrap text-regular-sm ">{{ `${t('of')} ${totalItems} ${t('item')}` }}</span>
      </div>
      <div class="page-number  mb-2">
        <VPagination
          v-model="selectedPage"
          :length="totalItemsLength"
          :total-visible="Globals.PAGINATION_TOTAL_VISIABLE"
          rounded="circle"
          @update:modelValue="handlePageClick"
        >
          <template #next="{ disabled, onClick }">
            <button
              :disabled="disabled"
              class="btn-pagination"
              @click="onClick"
            >
              <span class="mr-1 text-btn">{{ t('table-btn-next') }}</span>
              <VIcon
                icon="tabler:arrow-right"
                size="20"
                class="color-icon-default"
              />
            </button>
          </template>
          <template #prev="{ disabled, onClick }">
            <button
              :disabled="disabled"
              class="btn-pagination"
              @click="onClick"
            >
              <VIcon
                icon="tabler:arrow-left"
                size="20"
                class="color-icon-default mr-1"
              />
              <span class="text-medium-sm text-btn">{{ t('table-btn-prev') }}</span>
            </button>
          </template>
        </VPagination>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/variables/common/pagination.cm" as *;
@use "@/styles/variables/common/table.cm" as *;
@use "@/styles/font-size";
@use "@/styles/variables/global" as *;

.color-icon-default {
  color: $color-icon-default !important;
}

.pagination-flex {
  justify-content: space-between;
}

@media (max-width: 587px) {
  .pagination-flex {
    justify-content: center;
  }
}

.pagination-container {
  padding: #{$table-footer-padding};
  background-color: #{$table-footer-background-color};
  block-size: #{$table-footer-height};
  border-block-end: #{$table-border};
  border-end-end-radius: #{$table-border-radius-size};
  border-end-start-radius: #{$table-border-radius-size};
  border-inline-end: #{$table-border};
  border-inline-start: #{$table-border};

  .pagination-select {
    .select-size {
      inline-size: #{$table-rows-per-page-selector-width};
    }
  }

  .btn-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $pagination-btn-padding;
    border: $pagination-border;
    border-radius: $pagination-btn-border-radius;
    background: $pagination-btn-bg;
    box-shadow: $pagination-btn-box-shadow;

    .text-btn {
      color: $table-footer-font-color;
      font-size: #{$table-footer-font-size};
    }
  }
}
</style>
