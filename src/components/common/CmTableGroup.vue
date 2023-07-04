<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ClickRowArgument, Header, Item } from 'vue3-easy-data-table'
import CmPagination from './CmPagination.vue'
import Globals from '@/constant/Globals'
import SkTable from '@/components/page/gereral/skeleton/SkTable.vue'
import { tableStore } from '@/stores/table'
import MethodsUtil from '@/utils/MethodsUtil'
import ArrayUtil from '@/utils/ArrayUtil'
import CmDropDown from '@/components/common/CmDropDown.vue'

//* ***********prop */
const props = withDefaults(defineProps<Props>(), ({
  headers: () => ([]),
  items: () => ([]),
  isEditing: false,
  isExpand: false,
  rowClassName: '',
  pageSize: Globals.PAGINATION_PAGE_SIZE_DEFAULT,
  customId: 'id',
  totalRecord: 0,
  typePagination: 1,
  minHeight: 300,
  disiablePagination: false,
  returnObject: false,
}))

//* ***********emit */
const emit = defineEmits<Emit>()

const isLoading = ref<boolean>(true)

const CpTableSub = defineAsyncComponent(() => import('@/components/page/gereral/CpTableSub.vue'))
const storeTable = tableStore()
const { handleActionTable } = storeTable

//* ***********interface */

interface HeaderCustom extends Header {
  type?: string
  key?: boolean
  typeOrg?: number
  combobox?: any
  config?: any
  valueId?: any
  isDate?: boolean
  [e: string]: any
}
interface Props {
  headers: HeaderCustom[]
  items?: Item[]
  rowClassName?: string
  pageSize?: number
  customId?: string
  keyCheckParentRow: string
  valueCheckParentRow: any
  pageNumber?: number
  isExpand?: boolean
  totalRecord?: number
  typePagination?: number
  minHeight?: number
  returnObject?: boolean
  disiablePagination?: boolean
}
interface Emit {
  (e: 'handleClickRow', dataRow: object): void
  (e: 'selectedRows', dataRow: object): void
  (e: 'itemSelected', dataRow: object): void
  (e: 'checkedAll', checkedAll: boolean, data: object): void
  (e: 'changeCellvalue', value: string, field: string, key: number): void
  (e: 'update:selected', data: Item): void
}

//* ***********data */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
// $ref dataTable
const dataTable = ref()

// Chuyển đổi mảng items sang định dạng yêu cầu
const itemsData = ref<any>([])

const pageSize = ref(props.pageSize) // số lượng item trên 1 page
const currentPage = ref<number>(Globals.PAGINATION_CURRENT_PAGE) // item hiện tại
const selectedRows = ref<any>([])// Những row được checked

const serverfile = window.SERVER_FILE || ''

//* ***********computed */
const rowCanCheck = computed(() => {
  return props.items.filter(item => !item?.children?.length && item[props.keyCheckParentRow] !== props.valueCheckParentRow) || []

  // return props.items.filter(item => !item?.children?.length && item.contentArchiveTypeId !== 13) || []
})

// trạng thái checkbox selectAll

const selectedAll = computed(() => {
  return (selectedRows.value && selectedRows.value.length > 0 && selectedRows.value.length === rowCanCheck.value.length)
})

// trạng thái indeterminate all
const indeterminate = computed(() => {
  return (
    selectedRows.value
        && selectedRows.value.length > 0
        && selectedRows.value.length < rowCanCheck.value.length
  )
})

/* *********** method */
function checkActionShow(action: Array<any>) {
  return action?.filter((item: any) => item.isShow === true)?.length > 0
}

// click chọn tất cả hoặc bỏ tất cả
function checkedAll(value: any) {
  selectedRows.value = []
  selectedRows.value = !value ? rowCanCheck.value.map(item => item[props.customId]) : []

  rowCanCheck.value?.forEach(element => {
    if (!(element.isDisabled && element.isDisabled === true))
      element.isSelected = !value
  })
  emit('update:selected', selectedRows)
  emit('checkedAll', !value, selectedRows)
}

/* ***********event */
// sự kiện click vào hàng
function showRow(item: ClickRowArgument) {
  emit('handleClickRow', item)
}

// sự kiện click chọn item
function checkedItem(index: number, value: boolean | undefined) {
  // eslint-disable-next-line vue/no-mutating-props
  props.items[index].isSelected = !value
  const itemSelected = props.items.filter((x: Item) => x.isSelected === true)
  selectedRows.value = itemSelected.map((item: Item) => item[props.customId])

  if (props.returnObject)
    emit('update:selected', itemSelected)
  else
    emit('update:selected', selectedRows.value)
}

// Cập nhật table theo pagination
function updatePage(paginationNumber: number) {
  dataTable.value.updatePage(paginationNumber)
}

// Cập nhật số lượng item trên  table theo pagination
function updateRowsPerPageSelect(e: number) {
  dataTable.value.updateRowsPerPageActiveOption(e)
}

// thay đổi số lượng item trên trang
function pageSizeChange(page: number, size: number) {
  currentPage.value = page
  pageSize.value = size
  updatePage(page)
  updateRowsPerPageSelect(size)
}

// click mở colap
function toggleRowSelection(row: any, type: boolean | null = null) {
  let typeNew: any = null
  const indexParent = itemsData.value.findIndex((item: any) => item[props.customId] === row[props.customId]) // check vị trí item click đóng mở

  if (type === null) {
    itemsData.value[indexParent].isShow = itemsData.value[indexParent]?.isShow === undefined ? false : !itemsData.value[indexParent]?.isShow // khóa isShow biểu trị đạng thái toogle đóng mở
    typeNew = itemsData.value[indexParent]?.isShow
  }
  else {
    itemsData.value[indexParent].isShow = itemsData.value[indexParent]?.isShow === undefined ? false : type
    typeNew = type
  }

  row?.children?.forEach((child: any) => {
    const index = itemsData.value.findIndex((item: any) => item[props.customId] === child[props.customId])

    itemsData.value[index].isHide = !typeNew
    if (itemsData.value[index]?.children)
      toggleRowSelection(itemsData.value[index], typeNew)
  })
}

const bodyRowClassName = computed(() => {
  return (item: any, rowNumber: any) => {
    if (item.isHide)
      return 'is-hide'

    return ''
  }
})
function iconEvents(e: any, status: boolean) {
  e.isShow = status
}
watch(() => props.items, (val: Item[]) => {
  isLoading.value = true

  itemsData.value = val
  itemsData.value?.forEach((element: any, index: any) => {
    element.originIndex = index
    element.isSelected = !!element.isSelected
    selectedRows.value = []
    if (element.isSelected)
      selectedRows.value.push([props.customId])
  })
}, { immediate: true })
onUpdated(() => {
  nextTick(() => {
    console.timeEnd('update')

    isLoading.value = false
  })
})
onMounted(() => {
  // isLoading.value = true
  nextTick(() => {
    console.timeEnd('mout')

    isLoading.value = false
  })
})

console.time('mout')
console.time('update')
</script>

<template>
  <SkTable v-show="isLoading" />
  <div
    v-show="!isLoading"
    class="table-box"
  >
    <EasyDataTable
      id="dataTableGroup"
      ref="dataTable"
      :headers="headers"
      :items="items"
      :rows-per-page="!disiablePagination ? pageSize : 100000"
      :table-min-height="minHeight"
      :item-key="props.customId"
      alternating
      table-class-name="customize-table"
      theme-color="#1849a9"
      fixed-expand
      hide-footer
      :body-row-class-name="bodyRowClassName"
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
            color="primary"
            :indeterminate="indeterminate"
            :label="header.text"
            :class="{ indeterminate }"
            ripple
            @change="checkedAll(selectedAll)"
          />
        </div>
      </template>

      <template #header-select />

      <template #empty-message>
        <div class="d-flex justify-center">
          <div>
            <VImg
              :width="300"
              aspect-ratio="16/9"
              cover
              :src="`${serverfile}/badge/eventDefault.png`"
            />
          </div>
        </div>
      </template>

      <template
        v-if="isExpand"
        #expand
      >
        <div>
          <CpTableSub />
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
          :data-col="itemsHeader"
        />
        <div
          v-if="itemsHeader.value === 'checkbox'"
          class="player-wrapper"
        >
          <VCheckbox
            v-if="!context?.children?.length && (context[keyCheckParentRow] !== valueCheckParentRow)"
            v-model="selectedRows"
            multiple
            :value="context[props.customId]"
            @input="checkedItem(context.originIndex, context.isSelected)"
          />
        </div>
        <div v-else-if="itemsHeader?.type === 'custom'" />

        <div
          v-else-if="itemsHeader.value === 'actions'"
          class="player-wrapper d-flex justify-end"
        >
          <template
            v-for="(actionItem, idKey) in context?.actions "
          >
            <!--
              <div
              v-if="checkActionShow(context?.actions) && actionItem.isShow
              || !checkActionShow(context?.actions) && (context?.actions.length <= 3 || idKey < (Globals.MAX_ITEM_ACTION - 1))"
              :key="idKey"
              class="px-2 "
              >
              </div>
            -->

            <div
              v-if="(context?.actions.length <= 3 || idKey < (Globals.MAX_ITEM_ACTION - 1))"
              :key="idKey"
              class="px-2 "
              @mouseover="iconEvents(actionItem, true)"
              @mouseleave="iconEvents(actionItem, false)"
            >
              <VIcon
                v-if="MethodsUtil.checkActionType(actionItem).icon"
                :icon="MethodsUtil.checkActionType(actionItem).icon"
                :size="18"
                class="align-middle"
                :class="MethodsUtil.checkActionType(actionItem)?.color"
                @click="handleActionTable(MethodsUtil.checlActionKey(actionItem, context))"
              />
              <VTooltip
                v-if="actionItem?.isShow"
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
                is-action
                :list-item="ArrayUtil.sliceArray(context?.actions, Globals.MAX_ITEM_ACTION - 1)"
                :data="context"
                custom-key="name"
                :type="1"
              >
                <slot
                  name="actionDrop"
                  :col="itemsHeader.value"
                  :context="context"
                  :data-col="itemsHeader"
                />
              </CmDropDown>
            </div>
          </div>

          <slot
            name="actions"
            :data="context"
          />
        </div>
        <div
          v-else
          :style="{ paddingLeft: `${(context.level) * 50}px` }"
        >
          <div class="d-flex">
            <div class="mr-4">
              <VIcon
                v-if="itemsHeader.key && context?.children?.length "
                class="cusor-pointer"
                :icon="context.isShow || context.isShow === undefined ? 'tabler:chevron-down' : 'tabler:chevron-up'"
                size="18"
                @click="toggleRowSelection(context)"
              />
            </div>
            <div class="cm-table-group-text-line">
              {{ t(context[itemsHeader.value]) }}
            </div>
          </div>
        </div>
      </template>
    </EasyDataTable>
    <div
      v-if="!disiablePagination"
      class="customize-footer"
    >
      <CmPagination
        :type="typePagination"
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

.cm-table-group-text-line {
  min-inline-size: 100px;
}

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

.hide-expand .expand-icon {
  visibility: hidden !important;
}

.hide-expand .can-expand {
  pointer-events: none;
}
</style>

<style lang="scss">
.is-hide {
  display: none;
}
.vue3-easy-data-table__body {
  tr td:last-child {
    background: rgb(var(--v-theme-surface));
    position: sticky !important;
    right: 0 ;
  }
  tr th:last-child {
    position: sticky;
    right: 0;
  }
}
</style>
