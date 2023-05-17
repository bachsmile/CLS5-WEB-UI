<script setup lang="ts">
import ArraysUtil from '@/utils/ArrayUtil'
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringJwt from '@/utils/Jwt'
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'

const SkTree = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkTree.vue'))
const CmTreeView = defineAsyncComponent(() => import('@/components/common/CmTreeView.vue'))

/**
 * lib
 */
const { t } = window.i18n()
const route = useRoute()
const router = useRouter()

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
  checkboxes: false,
  editable: false,
  disabled: false,
  padding: 25,
})
const nodes = ref({})
const render = ref(0)
const isLoading = ref(true)
const getListOrgStruct = async () => {
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
const updateValueOrg = (value: any) => {
  values.value.listOrganizationalStructureId = value
}
const handleAction = (value: any, dataResend: any) => {
  switch (value?.id) {
    case 16:
      console.log(value)
      console.log(dataResend)

      router.push({ name: 'admin-organization-org-struct-add', params: { parentId: dataResend.ids } })
      break

    default:
      break
  }
}
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
getListOrgStruct()
</script>

<template>
  <SkTree v-if="isLoading" />
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
