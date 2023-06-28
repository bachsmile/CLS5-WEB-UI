<script setup lang="ts">
import ArraysUtil from '@/utils/ArrayUtil'
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringJwt from '@/utils/Jwt'
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'

const CmTreeView = defineAsyncComponent(() => import('@/components/common/CmTreeView.vue'))
const { t } = window.i18n()

/**
 * store
 */
const storeProfileUserManager = profileUserManagerStore()
const { values } = storeToRefs(storeProfileUserManager)

/** *end store */
const config = reactive({
  roots: [] as any[],
  keyboardNavigation: false,
  dragAndDrop: false,
  checkboxes: true,
  editable: false,
  disabled: false,
  padding: 25,
})
const nodes = ref({})
const render = ref(0)
async function getListOrgStruct() {
  const params = {
    role: StringJwt.getRole(),
  }
  await MethodsUtil.requestApiCustom(ApiUser.GetOrganizationalStructure, TYPE_REQUEST.GET, params).then((value: any) => {
    // cấu hình dạng cây cho cơ cấu tổ chức
    for (let i = 0; i < value.data.length; i++) {
      value.data[i] = {
        ...value.data[i],
        state: {
          checked: values.value?.listOrganizationalStructureId.includes(value.data[i].id),
        },
      }
    }

    const result = ArraysUtil.formatTreeData(ArraysUtil.unFlatMapTree(ArraysUtil.formatSelectTree(value.data, 'parentId', 'id')), config.roots, t, 'children')
    nodes.value = reactive(result)

    // Cấu hình node roots cho vue tree
    const filteredKeys = Object.keys(result).filter(key => result[key].parentId === 0)
    config.roots = filteredKeys
    render.value++
  })
}
function updateValueOrg(value: any) {
  values.value.listOrganizationalStructureId = value
}
getListOrgStruct()
</script>

<template>
  <div class="page-containter-box">
    <CmTreeView
      :key="render"
      :nodes="nodes"
      :config="config"
      custom-id="ids"
      :is-org="false"
      :return-object="false"
      :type-flat-child="true"
      @update:model-value="updateValueOrg"
    />
  </div>
</template>
