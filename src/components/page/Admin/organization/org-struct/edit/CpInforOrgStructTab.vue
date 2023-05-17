<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'
import { orgStructManagerStore } from '@/stores/admin/org-struct/OrgStruct'

/**
 * component
 */
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CpOrganizationSelect = defineAsyncComponent(() => import('@/components/page/gereral/CpOrganizationSelect.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CmTextArea = defineAsyncComponent(() => import('@/components/common/CmTextArea.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * store
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const storeCombobox = comboboxStore()
const { ownerCombobox } = storeToRefs(storeCombobox)
const { getComboboxOwner } = storeCombobox
const storeOrgStruct = orgStructManagerStore()
const { organization, myFormAddInforOrg, vSelectOwner } = storeToRefs(storeOrgStruct)

/**
 * validate
 */

const schema = yup.object({
  name: schemaOption.defaultString,
})

const LABEL = Object.freeze({
  TITLE: t('name-structure'),
  TITLE1: t('org-code'),
  TITLE2: t('organizational-parent'),
  TITLE3: t('organizational-owner'),
})

const isShowButton = ref(true)

/**
 * method
 */
const changeOrg = async () => {
//
}
const backOrg = () => {
  //
}
const handleOrg = () => {
  //
}
const getComboboxOwnerInf = async (loadMore?: any) => {
  // loadMore dùng khi infinity scroll
  await getComboboxOwner(vSelectOwner.value).then((value: any) => {
    console.log(ownerCombobox.value)
    console.log(vSelectOwner.value)
    if (ownerCombobox.value.data?.length) {
      vSelectOwner.value.totalRecord = ownerCombobox.value.totalRecord
      if (loadMore)
        vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.concat(ownerCombobox.value.data)

      else
        vSelectOwner.value.listCombobox = ownerCombobox.value?.data

      if (vSelectOwner.value.itemSelected?.id && !loadMore) {
        const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item?.id === vSelectOwner.value.itemSelected.id)
        if (indexOwner === -1) {
          vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value?.itemSelected)
          vSelectOwner.value.excludeList = [vSelectOwner.value?.itemSelected.id]
        }
      }
    }

    else {
      vSelectOwner.value.listCombobox = []
      vSelectOwner.value.totalRecord = 0
    }
  })
}
const isIntersecting = () => {
  vSelectOwner.value.pageNumber += 1
  getComboboxOwnerInf(true)
}
const handleSaveOrg = async () => {
  console.log(myFormAddInforOrg)

  myFormAddInforOrg.value.validate().then(async (success: any) => {
    if (success.valid)
      console.log(organization.value.id === organization.value.parentId)
  })
}
getComboboxOwnerInf()
</script>

<template>
  <div>
    <Form
      ref="myFormAddInforOrg"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VSheet
        width="100%"
        class="mx-auto no-background"
      >
        <VRow class="my-3">
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-slot="{ field, errors }"
              v-model="organization.name"
              name="name"
              type="text"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="LABEL.TITLE"
                :placeholder="LABEL.TITLE"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <CmTextField
              v-model="organization.code"
              :text="LABEL.TITLE1"
              :placeholder="LABEL.TITLE1"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field name="orgStruct">
              <CpOrganizationSelect
                v-model="organization.parentId"
                :text="LABEL.TITLE2"
                :placeholder="LABEL.TITLE2"
                @update:modelValue="changeOrg"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <CmSelect
              v-model="organization.ownerId"
              :text="LABEL.TITLE3"
              :placeholder="LABEL.TITLE3"
              :items="vSelectOwner.listCombobox"
              is-infinity-scroll
              :total-record="vSelectOwner.totalRecord"
              item-value="id"
              custom-key="name"
              :append-to-body="false"
              @isIntersecting="isIntersecting"
            >
              <template #infinityItem>
                <SkUser
                  :number="2"
                />
              </template>
            </CmSelect>
          </VCol>
        </VRow>
        <CmTextArea
          v-model:model-value="organization.description"
          :text="t('description')"
        />
      </VSheet>

      <div
        width="100%"
        class="user-infor no-background py-5"
      >
        <CpActionFooterEdit
          :is-save="isShowButton"
          is-save-and-update
          :title-cancel="t('come-back')"
          :title-save="t('save')"
          :title-save-and-update="t('save-and-update')"
          @onCancel="backOrg"
          @onSave="handleSaveOrg"
        />
      </div>
    </Form>
  </div>
</template>

<style scoped lang="scss">
@use "/src/styles/style-global" as *;
</style>

