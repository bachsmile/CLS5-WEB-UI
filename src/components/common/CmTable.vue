<script setup lang="ts">
import type { ClickRowArgument, Header, Item } from 'vue3-easy-data-table'
import Globals from '@/constant/Globals'
import ArrayUtil from '@/utils/ArrayUtil'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), ({
  headers: () => ([]),
  items: () => ([]),
  groupOptions: () => ({
    allowEmptySelect: false,
    collapsable: false,
    enabled: false,
  }),
  isEditing: false,
  isExpand: false,
  returnObject: false,
  isImportFile: false,
  rowClassName: '',
  pageSize: Globals.PAGINATION_PAGE_SIZE_DEFAULT,
  customId: 'id',
  totalRecord: 0,
  minHeight: 100,
  customKeyError: 'errors',
}))
const emit = defineEmits<Emit>()
const SkTable = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkTable.vue'))
const isLoading = ref(true)
const CmPagination = defineAsyncComponent(() => import('./CmPagination.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CpOrganizationSelect = defineAsyncComponent(() => import('@/components/page/gereral/CpOrganizationSelect.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
interface HeaderCustom extends Header {
  type?: string
  typeOrg?: number
  combobox?: any
  config?: any
  valueId?: any
}
interface groupOptions {
  allowEmptySelect?: boolean
  collapsable?: boolean
  enabled?: boolean
}
interface Props {
  groupOptions?: groupOptions
  headers: HeaderCustom[]
  items?: Item[]
  rowClassName?: string
  pageSize?: number
  isEditing?: boolean
  customId?: string
  isExpand?: boolean
  returnObject?: boolean
  isImportFile?: boolean
  totalRecord?: number
  minHeight?: number
  isActionFooter?: boolean
  pageNumber?: number
  selected?: Item[]
  customKeyError?: string
}
interface Emit {
  (e: 'handleClickRow', dataRow: object, index: number): void
  (e: 'selectedRows', dataRow: object): void
  (e: 'itemSelected', dataRow: object): void
  (e: 'checkedAll', checkedAll: boolean, data: object): void
  (e: 'changeCellvalue', value: string, field: string, key: number, keyCustomValue?: any, keyCustomIdValue?: any): void
  (e: 'handlePageClick', page: number, size: number): void
  (e: 'update:pageNumber', page: number): void
  (e: 'update:size', size: number): void
  (e: 'update:selected', data: Item): void

}

// $ref dataTable
const dataTable = ref()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
// Checkbox table
const selectedRows = ref<Item[]>([])
const selectedAll = computed(() => {
  return (selectedRows.value.length && selectedRows.value.length === props.items.length)
})
const indeterminate = computed(() => {
  return (
    selectedRows.value
        && selectedRows.value.length > 0
        && selectedRows.value.length < props.items.length
  )
})
const keyid = computed(() => {
  return props?.isImportFile ? 'key' : props.customId
})
const checkActionShow = (action: Array<any>) => {
  return action?.filter((item: any) => item.isShow === true)?.length > 0
}
watch(() => props.items, (val: Item[]) => {
  isLoading.value = true
  props.items.forEach((element, index) => {
    element.originIndex = index
    element.isSelected = !!element.isSelected
    selectedRows.value = []
    if (element.isSelected)
      selectedRows.value.push([keyid.value])
  })
}, { immediate: true })
const pageSize = ref(props.pageSize) // số lượng item trên 1 page

/** method */
// cập nhật selectedRows
// const updateSelectedRows = () => {
//   selectedRows.value = []
//   props.items?.forEach((item: any) => {
//     if (item.isSelected)
//       selectedRows.value.push(item[keyid.value])
//   })
// }

// click chọn tất cả hoặc bỏ tất cả
const checkedAll = (value: any) => {
  if (!value) {
    props.items?.forEach(element => {
      if (!(element?.isDisabled && element?.isDisabled === true))
        // eslint-disable-next-line sonarjs/no-gratuitous-expressions
        element.isSelected = !value
    })
    selectedRows.value = props.items?.map((item: Item) => item[keyid.value])
  }
  else {
    selectedRows.value = []
    props.items?.forEach(element => {
      if (!(element?.isDisabled && element?.isDisabled === true))
        element.isSelected = !value
    })
  }
  const data = props.returnObject ? props.items : selectedRows.value
  emit('update:selected', data)
  emit('checkedAll', !value, selectedRows)
  emit('update:selected', selectedRows.value)
}

/** event */
// sự kiện click vào hàng
const showRow = (item: ClickRowArgument) => {
  const index = props.items.findIndex((row: any) => row.key === item.key)
  emit('handleClickRow', item, index)
}

// sự kiện click chọn item
const checkedItem = (index: number, value: boolean | undefined) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.items[index].isSelected = !value
  const itemSelected = props.items.filter((x: Item) => x.isSelected === true)
  selectedRows.value = itemSelected.map((item: Item) => item[keyid.value])
  if (props.returnObject)
    emit('update:selected', itemSelected)
  else
    emit('update:selected', selectedRows.value)
}

// Cập nhật table theo pagination
const updatePage = (paginationNumber: number) => {
  dataTable.value?.updatePage(paginationNumber)
}

// Cập nhật số lượng item trên  table theo pagination
const updateRowsPerPageSelect = (e: number) => {
  dataTable.value?.updateRowsPerPageActiveOption(e)
}

// thay đổi số lượng item trên trang
const pageSizeChange = (page: number, size: number) => {
  pageSize.value = size
  emit('update:pageNumber', page)
  emit('update:size', size)
  emit('handlePageClick', page, size)

  updateRowsPerPageSelect(size)

  // phân trang local
  // updatePage(page)
}

// kiểm tra cột lỗi
const isErrorcell = (field: string, data: any) => {
  return data[props.customKeyError]?.filter((x: any) => x.location.toLowerCase() === field.toLowerCase()).length > 0
}

// thay đổi dữ liệu trên bảng
const changeCellvalue = (event: any, field: string, key: number, keyCustomValue?: any, keyCustomIdValue?: any) => {
  emit('changeCellvalue', event, field, key, keyCustomValue, keyCustomIdValue)
}
defineExpose({
  checkedAll,
  selectedRows: selectedRows.value,
  items: props.items,
})
onUpdated(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

// watch
// watch(() => props.items, value => {
//   updateSelectedRows()
// }, { deep: true, immediate: true })
</script>

<template>
  <SkTable v-if="isLoading" />
  <div
    v-show="!isLoading"
    class="table-box"
  >
    <EasyDataTable
      ref="dataTable"
      alternating
      table-class-name="customize-table"
      :headers="headers"
      :items="items"
      :rows-per-page="pageSize"
      theme-color="#1849a9"
      :table-min-height="minHeight"
      :item-key="keyid"
      click-row-to-expand
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
            ripple
            :class="{ indeterminate }"
            @change="checkedAll(selectedAll)"
          />
        </div>
      </template>

      <template #header-select />
      <template
        v-if="isExpand"
        #expand
      >
        <div>
          <slot name="tableSub" />
        </div>
      </template>
      <!--
        header => nội dung cột
        context  => nội dung hàng
      -->
      <template
        v-for="(itemsHeader, id) in headers"
        #[`item-${itemsHeader.value}`]="context"
        :key="id"
      >
        <slot
          name="rowItem"
          :col="itemsHeader.value"
          :context="context"
        />
        <span
          v-if="itemsHeader.value === 'select' && context?.isSuccess === false"
        >
          <VIcon
            icon="tabler:alert-triangle"
            size="18"
            class="color-error"
          />
          <VTooltip
            activator="parent"
            location="bottom"
          >
            <div v-html="context?.messageErr" />
          </VTooltip>
        </span>

        <div
          v-else-if="itemsHeader.value === 'checkbox'"
          class="player-wrapper"
        >
          <VCheckbox
            v-if="!context?.children?.length"
            v-model="selectedRows"
            multiple
            :value="context[keyid]"
            @input="checkedItem(context.originIndex, context.isSelected)"
          />
        </div>
        <div
          v-else-if="itemsHeader.value === 'actions'"
          class="player-wrapper d-flex justify-end"
        >
          <template
            v-for="(actionItem, idKey) in context?.actions "
          >
            <div
              v-if="checkActionShow(context?.actions) && actionItem.isShow
                || !checkActionShow(context?.actions) && (context?.actions.length <= 3 || idKey < (Globals.MAX_ITEM_ACTION - 1))"
              :key="idKey"
              class="px-2 "
            >
              <VIcon
                v-if="actionItem?.icon"
                :icon="actionItem?.icon"
                :size="actionItem?.size || 18"
                class="align-middle"
                :class="actionItem?.color"
                @click="actionItem?.action ? actionItem?.action(MethodsUtil.checlActionKey(actionItem, context)) : ''"
              />
              <VTooltip
                activator="parent"
                location="top"
              >
                {{ t(actionItem?.name) }}
              </VTooltip>
            </div>
          </template>
          <div
            v-if="context?.actions?.length > Globals.MAX_ITEM_ACTION"
          >
            <div class="action-more px-2">
              <CmDropDown
                :list-item="ArrayUtil.sliceArray(context?.actions, Globals.MAX_ITEM_ACTION - 1)"
                :data="context"
                custom-key="name"
                :type="1"
              />
            </div>
          </div>

          <slot
            name="actions"
            :data="context"
          />
        </div>
        <div v-else-if="itemsHeader?.type === 'menu'" />
        <div v-else-if="itemsHeader?.type === 'custom'" />
        <div v-else-if="isErrorcell(itemsHeader.value, context) && isEditing && itemsHeader?.type === 'combobox'">
          <CmSelect
            v-model="context[itemsHeader.value]"
            :max-item="Globals.MAX_ITEM_SELECT_MULT"
            :items="itemsHeader?.combobox.type === 'function'
              ? itemsHeader?.combobox?.data(context[itemsHeader?.combobox.params])
              : itemsHeader?.combobox?.data"
            :custom-key="itemsHeader?.combobox?.key"
            :item-value="itemsHeader?.combobox?.value"
            :multiple="itemsHeader?.combobox?.multiple"
            @update:modelValue="changeCellvalue($event, itemsHeader.value, context?.key)"
          />
        </div>
        <div v-else-if="isErrorcell(itemsHeader.value, context) && isEditing && itemsHeader?.type === 'dateTime'">
          <CmDateTimePicker
            v-model="context[itemsHeader.value]"
            placeholder="dd/mm/yyyy"
            :config="itemsHeader?.config"
            @update:modelValue="changeCellvalue($event, itemsHeader.value, context?.key)"
          />
        </div>
        <div v-else-if="isErrorcell(itemsHeader.value, context) && isEditing && itemsHeader?.type === 'organization'">
          <CpOrganizationSelect
            v-model="context[itemsHeader.value]"
            :max-height="100"
            :placeholder="t('organizational')"
            :type-org="itemsHeader?.typeOrg || 0"
            @update:modelValue="changeCellvalue($event, 'organizational', context?.key, itemsHeader.value, itemsHeader.valueId)"
          />
        </div>
        <VTextField
          v-else-if="isErrorcell(itemsHeader.value, context) && isEditing"
          v-model="context[itemsHeader.value]"
          class="input-edit-cell"
          type="text"
          @update:modelValue="changeCellvalue($event, itemsHeader.value, context.key)"
        />

        <span
          v-else
          :class="{
            'color-error': isErrorcell(itemsHeader.value, context),
          }"
        >
          {{ context[itemsHeader.value] }}
        </span>
      </template>
    </EasyDataTable>
    <div
      v-if="isActionFooter"
      class="footer-action-container"
    >
      <slot name="action-footer" />
    </div>
    <div class="customize-footer">
      <CmPagination
        :total-items="totalRecord || items.length"
        :current-page="props.pageNumber"
        @pageClick="pageSizeChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/variables/common/table.cm" as *;
@use "@/styles/style-global.scss" as *;

// *****************************emplement**********************************************************//
.customize-table {
  /** css custom */
  // phần table
  --easy-table-border: #{$table-border};   // màu viền table
  // phần header
  --easy-table-header-font-size: #{$table-header-font-size};  // kích thước chữ header
  --easy-table-header-height: #{$table-header-height};     // chiều cao header
  --easy-table-header-font-color: #{$table-header-font-color};  // màu chữ header
  --easy-table-header-background-color: #{$table-header-background-color};  // màu nền header
  --easy-table-header-item-padding: #{$table-header-item-padding};  // padding header

  // phần body table
  --easy-table-row-border: #{$table-row-border}; // màu các row của phần body
  --easy-table-body-even-row-font-color: #{$table-body-even-row-font-color};  // màu chữ các hàng chẵn phần body
  --easy-table-body-even-row-background-color: #{$table-body-even-row-background-color}; // màu nền các hàng chẵn phần body
  --easy-table-body-row-font-color: #{$table-body-row-font-color};  // màu chữ các hàng lẻ phần body
  --easy-table-body-row-background-color: #{$table-body-row-background-color};  // màu nền các hàng lẻ phần body
  --easy-table-body-row-height: #{$table-body-row-height};// chiều cao các hàng phần body
  --easy-table-body-row-font-size: #{$table-body-row-font-size};  // kích thước chữ phần body
  --easy-table-body-row-hover-font-color: #{$table-body-row-hover-font-color}; // màu chữ khi hover vào các row phần body
  --easy-table-body-row-hover-background-color: #{$table-body-row-hover-background-color}; // màu nền khi hover vào các row phần body
  --easy-table-body-item-padding: #{$table-body-item-padding}; // padding các row phần body

  // Phần footer table
  --easy-table-footer-background-color: #{$table-footer-background-color}; // màu nền phần footer
  --easy-table-footer-font-color: #{$table-footer-font-color};  // màu chữ phần footer
  --easy-table-footer-font-size: #{$table-footer-font-size};  // kích thước chữ phần footer
  --easy-table-footer-padding: #{$table-footer-padding};  // padding phần footer
  --easy-table-footer-height: #{$table-footer-height}; // chiều cao phần footer
  --easy-table-rows-per-page-selector-width: #{$table-rows-per-page-selector-width}; // chiều dài phần select số lượng phần tử trên trang
  --easy-table-rows-per-page-selector-option-padding: #{$table-rows-per-page-selector-option-padding}; // padding option trong select số lượng phần tử
  --easy-table-rows-per-page-selector-z-index: #{$table-rows-per-page-selector-z-index}; // z-inder phần option bên trong select số lượng phần tử
  // scroll
  --easy-table-scrollbar-track-color: #{$table-scrollbar-track-color}; // màu track của thanh scroll ngang table footer
  --easy-table-scrollbar-color: #{$table-scrollbar-color};
  --easy-table-scrollbar-thumb-color: #{$table-scrollbar-thumb-color}; // màu thanh scroll
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

.footer-action-container {
  padding: #{$table-footer-padding};
  background-color: #{$table-footer-background-color};
  border-inline-end: #{$table-border};
  border-inline-start: #{$table-border};
}

.hide-expand .expand-icon {
  visibility: hidden !important;
}

.hide-expand .can-expand {
  pointer-events: none;
}
</style>

<style lang="scss">
.vue3-easy-data-table{

  .can-expand{
    position: relative !important;
    width: 0px !important;
    padding: 0 !important;
    .expand-icon{
      display: none !important;
    }
  }
  th.can-expand.shadow{
    width: 0px !important;
    padding: 0 !important;
  }
  th.shadow::after,
  td.can-expand.shadow::after{
    width: 0px !important;
  }

  .vue3-easy-data-table__body tr{
    cursor: pointer;
  }
}
</style>
