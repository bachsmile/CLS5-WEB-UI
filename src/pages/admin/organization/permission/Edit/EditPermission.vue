<script lang="ts" setup>
import CpHeaderEditPermission from '@/components/page/Admin/organization/permission/Edit/CpHeaderEditPermission.vue'
import CpPermissionDefault from '@/components/page/Admin/organization/permission/Edit/CpPermissionDefault.vue'
import CmButton from '@/components/common/CmButton.vue'
import apiPermission from '@/api/permission/index'
import MethodsUtil from '@/utils/MethodsUtil'
import ArraysUtil from '@/utils/ArrayUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

import toast from '@/plugins/toast'
import { load } from '@/stores/loadComponent.js'

const { t } = window.i18n()
const TITLE_PAGE = Object.freeze({
  ADD: t('save'),
  CANCEL: t('come-back'),
  RESET: t('reset'),
})
const store = load()
const { unLoadComponent } = store
function config(idx: number) {
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
const router = useRouter()
interface Feature {
  featureId?: number
  permissionOrganizationalStructure?: number
  permissionValue?: number
}
interface DataInput {
  id?: number
  defaultRoleId: number | null
  listFeature: Feature[]
  userTypeName: string | null
}

const dataInput = ref<DataInput>({
  defaultRoleId: null,
  listFeature: [],
  userTypeName: null,
})

const route = useRoute()
const listFeaturePermission = ref<any[]>([])
const isShowPermission = ref<boolean>(false)
async function getDataDetail() {
  const { data } = await MethodsUtil.requestApiCustom(apiPermission.getDetailPermission, TYPE_REQUEST.GET, { id: route.params.id })
  dataInput.value = data
}

async function getListFeaturePermission() {
  const { data } = await MethodsUtil.requestApiCustom(apiPermission.featurePermissionByPortal, TYPE_REQUEST.GET)
  const listTree: any[] = []
  data.forEach((element: any[], index: number) => {
    const result: any = {}
    ArraysUtil.convertTreeViewOrg([element], result, dataInput.value.listFeature, {}, [`node-p${index + 1}`], t, 'permissions')
    listTree.push(result)
  })
  listFeaturePermission.value = listTree
  isShowPermission.value = true
}
const listRoleDefault = ref<any[]>([])
async function getRoleDefault() {
  const { data } = await MethodsUtil.requestApiCustom(apiPermission.comboboxRoleDefailt, TYPE_REQUEST.GET)
  data.forEach((element: any) => {
    element.text = t(element.defaultRoleName)
  })
  listRoleDefault.value = data
}
onMounted(async () => {
  if (route.params.id)
    await getDataDetail()

  await getListFeaturePermission()
  getRoleDefault()
})

// lấy permission và orgPermission
function getListFeature() {
  const listFeature: any[] = []
  listFeaturePermission.value.forEach((element: any, index: number) => {
    element[`node-p${index + 1}`].children.forEach((item: any, idx: number) => {
      if ((element[item].state.checked || element[item].state.indeterminate) && element[item].children && element[item].children.length) {
        const feature = {
          featureId: element[item].ids,
          permissionOrganizationalStructure: element[item].orgPermissionValue,
          permissionValue: element[item].permissionValue,
        }
        listFeature.push(feature)
      }
    })
  })
  return listFeature
}
const myForm = ref()
async function handleEditPer(idx: number) {
  myForm.value.validate.validate().then(async (success: any) => {
    if (success.valid) {
      dataInput.value.listFeature = getListFeature()
      let message = 'USR_AddSuccess'
      let typeErr: any = 'SUCCESS'
      let api = apiPermission.addPermission
      if (route.params.id) {
        message = 'USR_UpdateSuccess'
        api = apiPermission.updatePermission
      }
      await MethodsUtil.requestApiCustom(api, TYPE_REQUEST.POST, dataInput.value)
        .then((res: any) => {
          router.push({ name: 'admin-organization-permission-list' })
          unLoadComponent(idx)
        })
        .catch((err: any) => {
          unLoadComponent(idx)
          message = err.errors[0].message
          typeErr = 'ERROR'
        })
      toast(typeErr, t(message))
    }
    else {
      if (!myForm.value.isIntersecting)
        toast('ERROR', t('check-info'))

      unLoadComponent(idx)
    }
  })
}

function reset() {
  listFeaturePermission.value.forEach((element: any, index: number) => {
    element[`node-p${index + 1}`].children.forEach((item: any, idx: number) => {
      if ((element[item].state.checked || element[item].state.indeterminate) && element[item].children && element[item].children.length) {
        element[item].state.checked = false
        element[item].state.indeterminate = false
        element[item].orgPermissionValue = 0
      }
    })
  })
}
</script>

<template>
  <CpHeaderEditPermission
    ref="myForm"
    v-model:user-type-name="dataInput.userTypeName"
    v-model:default-role-id="dataInput.defaultRoleId"

    :list-role-default="listRoleDefault"
  />

  <VDivider class="my-6" />

  <CpPermissionDefault
    v-if="isShowPermission"
    :list-feature-permission="listFeaturePermission"
  />
  <div class="d-flex justify-end mt-6 button-edit-permission">
    <CmButton
      :title="TITLE_PAGE?.CANCEL"
      variant="outlined"
      color="dark"
      @click="() => { router.push({ name: 'admin-organization-permission-list' }) }"
    />
    <CmButton
      :title="TITLE_PAGE?.RESET"
      variant="text"
      class="ml-3"
      color="50-primary"
      @click="reset"
    />
    <CmButton
      :title="TITLE_PAGE?.ADD"
      class="ml-3"
      is-load
      @click="handleEditPer"
    />
  </div>
</template>
