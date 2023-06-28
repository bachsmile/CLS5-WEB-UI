<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import ApiUser from '@/api/user/index'

const props = withDefaults(defineProps<Props>(), ({
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CpOrganizationSelect = defineAsyncComponent(() => import('@/components/page/gereral/CpOrganizationSelect.vue'))
interface Props {
  isDialogVisible: boolean
  deleteOrgStructData: any
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data: any): void
  (e: 'deleteSuccess'): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const LABEL = Object.freeze({
  TITLE: t('orgstruct-delete-title'),
  TITLE1: t('move-child-to'),
})

/**
 * store
 */

const selectedId = ref<any>(null)

async function onCancel() {
  emit('update:isDialogVisible', false)
}
async function onConfirm() {
  let params: any = {
    id: props.deleteOrgStructData.deletedId,
  }
  if (selectedId.value) {
    params = {
      id: props.deleteOrgStructData.deletedId,
      idNew: selectedId.value,
    }
  }
  await MethodsUtil.requestApiCustom(ApiUser.DeleteOrgStruct, TYPE_REQUEST.DELETE, params).then(() => {
    toast('SUCCESS', t('success-delete'))
    emit('update:isDialogVisible', false)
    emit('deleteSuccess')
  })
    .catch((error: any) => {
      toast('ERROR', t(error.response.data.message))
    })
}
watch(() => props.isDialogVisible, isShow => {
  if (isShow)
    selectedId.value = null
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isDialogVisible"
    :title="LABEL.TITLE"
    close-on-back
    :height="300"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <CpOrganizationSelect
      v-model="selectedId"
      :max-height="100"
      :exclude-id="deleteOrgStructData?.excludeListOrg"
      :placeholder="LABEL.TITLE1"
    />
  </CmDialogs>
</template>
