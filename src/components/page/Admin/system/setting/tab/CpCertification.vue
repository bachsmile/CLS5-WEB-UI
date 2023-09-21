<script lang="ts" setup>
import type { Any } from '@/typescript/interface'
import CmTable from '@/components/common/CmTable.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import SharedService from '@/api/shared'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Params } from '@/typescript/interface/params'
import CmImg from '@/components/common/CmImg.vue'
import toast from '@/plugins/toast'

const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

const { t } = window.i18n()
const serverfile = window.SERVER_FILE
const headers: any[] = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('certification-name'), value: 'templateName' },
  { text: t('click-to-view'), value: 'questionType', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
]
const items = ref<Any[]>()
const totalRecord = ref(0)
const selected = ref<any[]>([])

interface QueryParam extends Params {
  keyword: string
}
const queryParam = ref<QueryParam>({
  keyword: '',
  pageSize: 10,
  pageNumber: 1,
})
function getListCertification() {
  MethodsUtil.requestApiCustom(SharedService.GetListCertificationId, TYPE_REQUEST.GET, queryParam.value).then((result: Any) => {
    if (result?.data) {
      const listCertificationTemplateId = result.data.pageLists.map((i: Any) => i.templateId)
      totalRecord.value = result.data.totalRecord
      MethodsUtil.requestApiCustom(SharedService.GetListCertificationById, TYPE_REQUEST.GET, { listCertificationTemplateId }).then((res: Any) => {
        result.data.pageLists.forEach((item: Any) => {
          const certificateInfo = res.data.find((el: Any) => el.id === item.templateId)
          if (certificateInfo)
            item.templateUrl = JSON.parse(certificateInfo.content).background
        })
        items.value = result.data.pageLists
      })
    }
  })
}

function handleAction(val: string) {
  switch (val) {
    case 'handlerCustomButton':
      setDefaultCertification()
      break

    default:
      break
  }
}

function setDefaultCertification() {
  MethodsUtil.requestApiCustom(SharedService.PatchSetDefaultCertification, TYPE_REQUEST.PATCH, {}).then((result: Any) => {
    getListCertification()
    toast('SUCCESS', t('add-success'))
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}

onMounted(() => {
  getListCertification()
})

const isShowModalConfirmDelete = ref(false)
function showModalDelete() {
  isShowModalConfirmDelete.value = true
}
function handleDelete() {
  MethodsUtil.requestApiCustom(SharedService.PostDeleteCertification, TYPE_REQUEST.POST, { listId: selected.value }).then(() => {
    getListCertification()
    toast('SUCCESS', t('USR_DeleteSuccess'))
    selected.value = []
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
watch(queryParam.value, val => {
  getListCertification()
})
</script>

<template>
  <div>
    <CpActionHeaderPage
      is-custom-btn
      is-custom-add-btn
      :title-custom="t('add-default')"
      :title-custom-add="t('Add-new')"
      @click="handleAction"
    />
  </div>
  <div>
    <CpHeaderAction
      v-model:keyword="queryParam.keyword"
      v-model:page-size="queryParam.pageSize"
      v-model:page-number="queryParam.pageNumber"
      :is-fillter="false"
      is-delete
      :disabled-delete="selected.length === 0"
      @delete-multiple="showModalDelete"
    />
  </div>
  <CmTable
    v-model:selected="selected"
    v-model:page-size="queryParam.pageSize"
    v-model:page-number="queryParam.pageNumber"
    :headers="headers"
    :items="items"
    custom-id="templateId"
    :total-record="totalRecord"
  >
    <template #rowItem="{ col, context }">
      <div v-if="col === 'questionType'">
        <div class="preview-img-container">
          <CmImg :src="serverfile + context.templateUrl" />
        </div>
      </div>
    </template>
  </CmTable>

  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalConfirmDelete"
    :type="2"
    :confirmation-msg="t('confirm-delete-certification')"
    @confirm="handleDelete"
  />
</template>

<style lang="scss">
.preview-img-container {
  width: 90px;
  height: 60px;
  background: #797E84;
  border-radius: 6px;
  overflow: hidden;
  .v-img__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .v-responsive {
    @extend .preview-img-container
  }
}
</style>
