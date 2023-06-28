<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'

const props = withDefaults(defineProps<Props>(), ({}))

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
const route = useRoute()
const router = useRouter()

interface Props {
  emit?: any
}
const { emitEvent } = props.emit()

/**
 * store
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const storeOrgStruct = orgStructManagerStore()
const { organization, myFormAddInforOrg, vSelectOwner, isEdit, isView } = storeToRefs(storeOrgStruct)
const { getComboboxOwnerInf, resetForm, backOrg, handleSaveOrg, handleSaveUpdateOrg } = storeOrgStruct

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
const excludeId = ref()

/**
 * method
 */
async function changeOrg() {
//
}

function handleOrg() {
  //
}

function isIntersecting() {
  vSelectOwner.value.pageNumber += 1
  getComboboxOwnerInf(true)
}

if (route.params.id)
  excludeId.value = Number(route.params.id)
onUnmounted(() => {
  resetForm()
})
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
                :disabled="isView"
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
              :disabled="isView"
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
                :exclude-id="excludeId"
                :disabled="isView"
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
              :disabled="isView"
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
          :disabled="isView"
        />
      </VSheet>

      <div
        width="100%"
        class="user-infor no-background py-5"
      >
        <CpActionFooterEdit
          :is-save="!isView"
          :is-save-and-update="!isView"
          :title-cancel="t('come-back')"
          :title-save="t('save')"
          :title-save-and-update="t('save-and-update')"
          @onCancel="backOrg"
          @onSave="handleSaveOrg"
          @onSaveUpdate="handleSaveUpdateOrg"
        />
      </div>
    </Form>
  </div>
</template>

<style scoped lang="scss">
@use "/src/styles/style-global" as *;
</style>
