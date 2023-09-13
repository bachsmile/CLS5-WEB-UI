<script lang="ts" setup>
import type { Item } from 'vue3-easy-data-table'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmTable from '@/components/common/CmTable.vue'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import { tableStore } from '@/stores/table'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'

const props = withDefaults(defineProps<Props>(), {
  listQuestion: () => ([]),
})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)
interface Props {
  listQuestion: Any[]
}
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('survey-content'), value: 'contentBasic' },
  { text: '', value: 'actions', width: 150 },
]
const items = ref<Item[]>([])
watch(() => props.listQuestion, val => {
  items.value = val
  updateItem()
}, { immediate: true })

watch(items, val => {
  emit('update:listQuestion', val)
})
interface Emit {
  (e: 'update:listQuestion', listQuestion: Any[]): void
}
function getActionMove(idx: number, total: number) {
  const arrayActions: any[] = [
    MethodsUtil.checkActionType({ id: 4 }),
    MethodsUtil.checkActionType({ id: 2 }),
  ]
  if (idx !== 1)
    arrayActions.push(MethodsUtil.checkActionType({ id: 20 }))
  if (idx !== total)
    arrayActions.push(MethodsUtil.checkActionType({ id: 21 }))
  return arrayActions
}
callBackAction.value = actionItem
async function actionItem([{ id }, content]: [Any, Any]) {
  switch (id) {
    case 20:
      moveUpItem(content.originIndex)
      break
    case 21:
      moveDownItem(content.originIndex)
      break
    case 2:
      deleteItem(content.originIndex)
      break
    default:
      break
  }
}

function moveUpItem(idx: number) {
  const currentItem = items.value[idx]
  items.value.splice(idx, 1)
  items.value.splice(idx - 1, 0, currentItem)
  updateItem()
}
function moveDownItem(idx: number) {
  const currentItem = items.value[idx]
  items.value.splice(idx, 1)
  items.value.splice(idx + 1, 0, currentItem)
  updateItem()
}
function updateItem() {
  items.value.forEach((item: Any, index: number) => {
    item.originIndex = index
    item.position = index + 1
    item.isSelected = false
    item.actions = [
      ...getActionMove(index + 1, items.value.length),
    ]
  })
}
const selected = ref<any[]>([])
const isShowModalDelete = ref(false)
function deleteItem(idx: number) {
  selected.value = [idx]
  isShowModalDelete.value = true
}
function confirmDelete() {
  selected.value.forEach((idx: number) => {
    items.value.splice(idx, 1)
  })
  updateItem()
  selected.value = []
}
</script>

<template>
  <div>
    <CpHeaderAction
      is-delete
      :is-fillter="false"
      :disabled-delete="selected.length === 0"
      @delete-multiple="() => {
        isShowModalDelete = true
      }"
    />
  </div>
  <div class="mt-2">
    <CmTable
      v-model:selected="selected"
      :headers="headers"
      :items="items"
      custom-id="originIndex"
    />
  </div>

  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalDelete"
    :confirmation-msg="t('delete-survey-test')"
    :type="2"
    @confirm="confirmDelete"
  />
</template>
