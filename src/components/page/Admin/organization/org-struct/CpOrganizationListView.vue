<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'
import SkTree from '@/components/page/gereral/skeleton/SkTree.vue'

const emit = defineEmits<Emit>()
const CmTreeView = defineAsyncComponent(() => import('@/components/common/CmTreeView.vue'))

/**
 * lib
 */
const { t } = window.i18n()
const route = useRoute()
const router = useRouter()
interface Emit {
  (e: 'deleteNode', data: any): void
}

/**
 * store
 */
const storeOrgStruct = orgStructManagerStore()
const { nodes, render, config, isView } = storeToRefs(storeOrgStruct)
const { getListOrgStruct } = storeOrgStruct

/** *end store */

const isLoading = ref(true)

function updateValueOrg(value: any) {
  //
}
function removeNode(node: any) {
  const nodeChildrenIds = MethodsUtil.getAllChildrenOfTreeNodeIds(node, nodes.value)

  nodeChildrenIds.push(node.ids)
  const deleteData = {
    deletedId: node.ids,
    excludeListOrg: nodeChildrenIds,
  }
  emit('deleteNode', deleteData)
}

function handleAction(value: any, dataResend: any) {
  switch (value?.id) {
    case 1:
      isView.value = false
      router.push({ name: 'admin-organization-org-struct-edit', params: { tab: 'infor', id: dataResend.ids } })
      break
    case 2:
      removeNode(dataResend)
      break
    case 4:
      isView.value = true
      router.push({ name: 'admin-organization-org-struct-edit', params: { tab: 'infor', id: dataResend.ids } })
      break
    case 16:
      isView.value = false
      router.push({ name: 'admin-organization-org-struct-add-parent', params: { tab: 'infor', parentId: dataResend.ids } })
      break

    default:
      break
  }
}
onUpdated(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 200)
})

watch(render, val => {
  isLoading.value = true
})
isView.value = true
getListOrgStruct()
render.value++
</script>

<template>
  <SkTree v-show="isLoading" />
  <div
    v-show="!isLoading"
    class="page-containter-box"
  >
    <CmTreeView
      :key="render"
      :nodes="nodes"
      :config="config"
      custom-id="ids"
      :is-org="false"
      :return-object="false"
      :type-flat-child="true"
      is-action
      @update:model-value="updateValueOrg"
      @handleAction="handleAction"
    />
  </div>
</template>
