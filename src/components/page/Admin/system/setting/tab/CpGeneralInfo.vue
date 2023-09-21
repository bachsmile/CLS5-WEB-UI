<script lang="ts" setup>
import CmTextFieldVue from '@/components/common/CmTextField.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import UserService from '@/api/user'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import toast from '@/plugins/toast'

const { t } = window.i18n()
const CmImgUpload = defineAsyncComponent(() => import('@/components/common/CmImgUpload.vue'))
const TITLE = Object.freeze({
  FIELD1: t('KW_Portal_Name'),
  FIELD2: t('phone-number'),
  FIELD3: t('Email'),
  FIELD4: t('address'),
  FIELD5: t('logo'),
  FIELD6: t('pageIcon'),
})

interface DataInput {
  address: string
  courseImage: string
  email: string
  icon: string
  isAuthentication: boolean
  logo: string
  phoneNumber: string
  portalId: number | null
  portalName: string
  portalTitle: string
  redirectUrl: string
}
const dataInput = ref<DataInput>({
  address: '',
  courseImage: '',
  email: '',
  icon: '',
  isAuthentication: false,
  logo: '',
  phoneNumber: '',
  portalId: null,
  portalName: '',
  portalTitle: '',
  redirectUrl: '',
})

function getSettingInfo() {
  MethodsUtil.requestApiCustom(UserService.GetInfoPortal, TYPE_REQUEST.GET).then((res: Any) => {
    dataInput.value = res.data
  })
}

onMounted(() => {
  getSettingInfo()
})

async function updateSettingGeneral(unloadButton: any) {
  await MethodsUtil.requestApiCustom(UserService.PostUpdateInfoPortal, TYPE_REQUEST.POST, dataInput.value).then((result: Any) => {
    toast('SUCCESS', t('USR_UpdateSuccess'))
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors))
  })
  unloadButton()
}
</script>

<template>
  <div class="mt-2">
    <VRow>
      <VCol
        lg="4"
        cols="12"
      >
        <CmTextFieldVue
          v-model="dataInput.portalTitle"
          :text="`${TITLE.FIELD1}*`"
          :placeholder="TITLE.FIELD1"
        />
      </VCol>
      <VCol
        lg="4"
        cols="12"
      >
        <CmTextFieldVue
          v-model="dataInput.phoneNumber"
          :text="TITLE.FIELD2"
          :placeholder="TITLE.FIELD2"
        />
      </VCol>
      <VCol
        lg="4"
        cols="12"
      >
        <CmTextFieldVue
          v-model="dataInput.email"
          :text="TITLE.FIELD3"
          :placeholder="TITLE.FIELD3"
        />
      </VCol>
      <VCol
        lg="4"
        cols="12"
      >
        <CmTextFieldVue
          v-model="dataInput.address"
          :text="TITLE.FIELD4"
          :placeholder="TITLE.FIELD4"
        />
      </VCol>
      <VCol cols="12">
        <VRow>
          <VCol
            cols="12"
            sm="6"
            lg="2"
          >
            <div class="text-medium-sm color-dark">
              {{ TITLE.FIELD5 }}
            </div>
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="4"
          >
            <div class="input-avatar">
              <CmImgUpload
                v-model:src="dataInput.logo"
                color="primary"
                is-size-full
                :is-rounded="true"
                :is-icon-text="false"
                icon="tabler:square-rounded-plus-filled"
              />
            </div>
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="2"
          >
            <div class="text-medium-sm color-dark">
              {{ TITLE.FIELD6 }}
            </div>
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="4"
          >
            <div class="input-icon">
              <CmImgUpload
                v-model:src="dataInput.icon"
                color="primary"
                is-size-full
                :is-rounded="true"
                :is-icon-text="false"
                icon="tabler:square-rounded-plus-filled"
              />
            </div>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
    <div
      class="mt-4"
    >
      <CpActionFooterEdit
        is-cancel
        is-save
        @on-save="(idx, unloadButton) => updateSettingGeneral(unloadButton)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.input-avatar{
  width: 18.875rem;
  height: 12.5rem;
}
.input-icon{
  width: 12.5rem;
  height: 12.5rem;
}
</style>
