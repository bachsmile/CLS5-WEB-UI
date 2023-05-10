<script lang="ts" setup>
import CpHeaderEditPermission from '@/components/page/Admin/organization/permission/Edit/CpHeaderEditPermission.vue'
import CpPermissionDefault from '@/components/page/Admin/organization/permission/Edit/CpPermissionDefault.vue'
import CmButton from '@/components/common/CmButton.vue'
import apiPermission from '@/api/permission/index'
import MethodsUtil from '@/utils/MethodsUtil'
import ArraysUtil from '@/utils/ArrayUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

const { t } = window.i18n()
const TITLE_PAGE = Object.freeze({
  ADD: t('Add-new'),
  CANCEL: t('come-back'),
  RESET: t('reset'),
})
const config = (idx: number) => {
  return {
    roots: [`node-${idx + 1}`],
    keyboardNavigation: false,
    dragAndDrop: false,
    checkboxes: true,
    editable: false,
    disabled: false,
    padding: 25,
    checkMode: 0,
  }
}
const listFeaturePermission = ref<any[]>([])
const getListFeaturePermission = async () => {
  const { data } = await MethodsUtil.requestApiCustom(apiPermission.featurePermissionByPortal, TYPE_REQUEST.GET)
  const listTree: any[] = []
  data.forEach((element: any[], index: number) => {
    const tree = ArraysUtil.formatTreeData(ArraysUtil.flatMapTree([element], 'permissions'), [`node-${index + 1}`], t)
    listTree.push(tree)
  })
  listFeaturePermission.value = listTree
}
getListFeaturePermission()
</script>

<template>
  <CpHeaderEditPermission />

  <VDivider class="my-6" />

  <CpPermissionDefault :list-feature-permission="listFeaturePermission" />
  <div class="d-flex justify-end mt-6 button-edit-permission">
    <CmButton
      :title="TITLE_PAGE?.CANCEL"
      variant="outlined"
      color="dark"
    />
    <CmButton
      :title="TITLE_PAGE?.RESET"
      variant="text"
      class="ml-3"
      color="50-primary"
    />
    <CmButton
      :title="TITLE_PAGE?.ADD"
      class="ml-3"
    />
  </div>
</template>

