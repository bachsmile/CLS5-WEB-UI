<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ClickRowArgument, Header, Item } from 'vue3-easy-data-table'
import CmPagination from './CmPagination.vue'
import svgChecked from '@/assets/images/svg/checkbox-tick.svg?raw'
import svgIndeterminate from '@/assets/images/svg/indeterminate.svg?raw'
import Globals from '@/constant/Globals'

interface groupOptions {
  allowEmptySelect?: boolean
  collapsable?: boolean
  enabled?: boolean
}
interface Props {
  groupOptions?: groupOptions
  headers: Header[]
  items?: Item[]
  rowClassName?: string
  pageSize?: number
}
interface Emit {
  (e: 'handleClickRow', dataRow: object): void
  (e: 'selectedRows', dataRow: object): void
  (e: 'itemSelected', dataRow: object): void
  (e: 'checkedAll', checkedAll: boolean, data: object): void
}

const props = withDefaults(defineProps<Props>(), ({
  headers: () => ([]),
  items: () => ([]),
  groupOptions: () => ({
    allowEmptySelect: false,
    collapsable: false,
    enabled: false,
  }),
  rowClassName: '',
  pageSize: Globals.PAGINATION_PAGE_SIZE_DEFAULT,
}))

const emit = defineEmits<Emit>()

// $ref dataTable
const dataTable = ref()

const selectedRows = ref<any>([])

const selectedAll = computed(() => {
  if (props?.groupOptions?.enabled === true) {
    let count = 0
    props.items?.forEach(element => {
      if (element.children)
        count += element?.children?.length

      else
        count += 1
    })

    return (
      selectedRows.value
          && selectedRows.value?.length > 0
          && selectedRows.value?.length === count
    )
  }

  return (selectedRows.value && selectedRows.value.length > 0 && selectedRows.value.length === props.items.length)
})

const indeterminate = computed(() => {
  if (props.groupOptions.enabled === true) {
    let count = 0
    props.items?.forEach(element => {
      if (element.children)
        count += element?.children?.length

      else
        count += 1
    })

    return (
      selectedRows.value
          && selectedRows.value.length > 0
          && selectedRows.value.length < count
    )
  }

  return (
    selectedRows.value
        && selectedRows.value.length > 0
        && selectedRows.value.length < props.items.length
  )
})

/** method */
const checkedAll = (value: any) => {
  selectedRows.value = []
  if (props.groupOptions.enabled === true) {
    if (!value) {
      props.items?.forEach(element => {
        if (element.children) {
          element.children?.forEach((child: any) => {
            child.isSelected = true
            selectedRows.value.push(child.customId)
          })
        }
        else {
          selectedRows.value.push(element.customId)
        }
      })
    }
    else {
      selectedRows.value = []
    }
  }
  else {
    selectedRows.value = !value ? props.items.map(item => item.customId) : []
  }

  emit('checkedAll', !value, selectedRows)
}

// event
const showRow = (item: ClickRowArgument) => {
  emit('handleClickRow', item)
}

const checkedItem = (item: any) => {
  emit('itemSelected', item)
  emit('selectedRows', selectedRows)
}

const pageSize = ref(props.pageSize)
const currentPage = ref<number>(Globals.PAGINATION_CURRENT_PAGE)

const updatePage = (paginationNumber: number) => {
  dataTable.value.updatePage(paginationNumber)
}

const updateRowsPerPageSelect = (e: number) => {
  dataTable.value.updateRowsPerPageActiveOption(e)
}

const pageSizeChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  updatePage(page)
  updateRowsPerPageSelect(size)
}
</script>

<template>
  <div class="table-box">
    <EasyDataTable
      ref="dataTable"
      alternating
      table-class-name="customize-table"
      :headers="headers"
      :items="items"
      :rows-per-page="pageSize"
      theme-color="#1849a9"
      item-key="customId"
      fixed-expand
      hide-footer
      :body-row-class-name="rowClassName"
      @click-row="showRow"
    >
      <template
        #header-checkbox="header"
      >
        <div
          class="customize-header"
        >
          <VCheckbox
            v-model="selectedAll"
            :indeterminate="indeterminate"
            :label="header.text"
            :class="{ indeterminate }"
            :true-icon="() => {
              return h('div', { innerHTML: svgChecked })
            }"
            :indeterminate-icon="() => {
              return h('div', { innerHTML: svgIndeterminate })
            }"
            ripple
            @change="checkedAll(selectedAll)"
          />
        </div>
      </template>

      <template #item-checkbox="context">
        <div class="player-wrapper">
          <VCheckbox
            v-if="!context?.children?.length"
            v-model="selectedRows"
            multiple
            :value="context.customId"
            :true-icon="() => {
              return h('div', { innerHTML: svgChecked })
            }"
            @change="checkedItem(context)"
          />
        </div>
      </template>
    </EasyDataTable>
    <div class="customize-footer">
      <CmPagination
        :total-items="items.length"
        :current-page="currentPage"
        @pageClick="pageSizeChange"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/variables/common/table.cm" as *;
@use "@/styles/variables/config/color" as *;

// *****************************emplement**********************************************************//
.customize-table {
  /** css custom */
  // ph???n table
  --easy-table-border: #{$table-border};   // m??u vi???n table
  // ph???n header
  --easy-table-header-font-size: #{$table-header-font-size};  // k??ch th?????c ch??? header
  --easy-table-header-height: #{$table-header-height};     // chi???u cao header
  --easy-table-header-font-color: #{$table-header-font-color};  // m??u ch??? header
  --easy-table-header-background-color: #{$table-header-background-color};  // m??u n???n header
  --easy-table-header-item-padding: #{$table-header-item-padding};  // padding header

  // ph???n body table
  --easy-table-row-border: #{$table-row-border}; // m??u c??c row c???a ph???n body
  --easy-table-body-even-row-font-color: #{$table-body-even-row-font-color};  // m??u ch??? c??c h??ng ch???n ph???n body
  --easy-table-body-even-row-background-color: #{$table-body-even-row-background-color}; // m??u n???n c??c h??ng ch???n ph???n body
  --easy-table-body-row-font-color: #{$table-body-row-font-color};  // m??u ch??? c??c h??ng l??? ph???n body
  --easy-table-body-row-background-color: #{$table-body-row-background-color};  // m??u n???n c??c h??ng l??? ph???n body
  --easy-table-body-row-height: #{$table-body-row-height};// chi???u cao c??c h??ng ph???n body
  --easy-table-body-row-font-size: #{$table-body-row-font-size};  // k??ch th?????c ch??? ph???n body
  --easy-table-body-row-hover-font-color: #{$table-body-row-hover-font-color}; // m??u ch??? khi hover v??o c??c row ph???n body
  --easy-table-body-row-hover-background-color: #{$table-body-row-hover-background-color}; // m??u n???n khi hover v??o c??c row ph???n body
  --easy-table-body-item-padding: #{$table-body-item-padding}; // padding c??c row ph???n body

  // Ph???n footer table
  --easy-table-footer-background-color: #{$table-footer-background-color}; // m??u n???n ph???n footer
  --easy-table-footer-font-color: #{$table-footer-font-color};  // m??u ch??? ph???n footer
  --easy-table-footer-font-size: #{$table-footer-font-size};  // k??ch th?????c ch??? ph???n footer
  --easy-table-footer-padding: #{$table-footer-padding};  // padding ph???n footer
  --easy-table-footer-height: #{$table-footer-height}; // chi???u cao ph???n footer
  --easy-table-rows-per-page-selector-width: #{$table-rows-per-page-selector-width}; // chi???u d??i ph???n select s??? l?????ng ph???n t??? tr??n trang
  --easy-table-rows-per-page-selector-option-padding: #{$table-rows-per-page-selector-option-padding}; // padding option trong select s??? l?????ng ph???n t???
  --easy-table-rows-per-page-selector-z-index: #{$table-rows-per-page-selector-z-index}; // z-inder ph???n option b??n trong select s??? l?????ng ph???n t???
  // scroll
  --easy-table-scrollbar-track-color: #{$table-scrollbar-track-color}; // m??u track c???a thanh scroll ngang table footer
  --easy-table-scrollbar-color: #{$table-scrollbar-color};
  --easy-table-scrollbar-thumb-color: #{$table-scrollbar-thumb-color}; // m??u thanh scroll
  --easy-table-scrollbar-corner-color: #{$table-scrollbar-corner-color};

  // loading
  --easy-table-loading-mask-background-color: #2d3a4f;

  overflow: hidden;
  border-start-end-radius: #{$table-border-radius-size};

  /** end css custom */

  border-start-start-radius: #{$table-border-radius-size};

  // box-shadow: #{$table-box-shadow};

  // override class
  th:first-child {
    border-radius: #{$table-border-radius-size 0 0};
  }

  th:last-child {
    border-radius: #{0 $table-border-radius-size 0 0};
  }

  .vue3-easy-data-table__main {
    background-color: unset;

    .header-text {
      font-weight: $table-header-font-weight;
    }
  }

  .vue3-easy-data-table__footer {
    border-radius: #{ 0 0 $table-border-radius-size $table-border-radius-size};
  }

  .indeterminate {
    color: #{$color-checkbox-indeterminate} !important;
    opacity: 1 !important;
  }
}

.hide-expand .expand-icon {
  visibility: hidden !important;
}

.hide-expand .can-expand {
  pointer-events: none;
}
</style>

