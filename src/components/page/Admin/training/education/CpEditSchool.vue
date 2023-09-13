<script lang="ts" setup>
import CmTextField from '@/components/common/CmTextField.vue'
import { validatorStore } from '@/stores/validatator'
import CmSelect from '@/components/common/CmSelect.vue'
import CpAddress from '@/components/page/gereral/CpAddress.vue'
import { load } from '@/stores/loadComponent'
import CmButton from '@/components/common/CmButton.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import UserService from '@/api/user'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { comboboxStore } from '@/stores/combobox'
import toast from '@/plugins/toast'
import type { Any } from '@/typescript/interface'

const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))
const storeCombobox = comboboxStore()
const {
  getComboboxTypeSchool,
} = storeCombobox
const { typeSchoolCombobox } = storeToRefs(storeCombobox)
if (!typeSchoolCombobox.value.length)
  getComboboxTypeSchool()

const storeValidate = validatorStore()

const { schemaOption, Field, Form, useForm, yup, ruleMessage } = storeValidate
const { submitForm } = useForm()
const { t } = window.i18n()
const schema = reactive({
  name: schemaOption.requiredString(),
  email: yup.string().email(ruleMessage.email),
  typeSchool: schemaOption.statusIdSingle,
  phoneNumber: schemaOption.phoneNumber,
})
const route = useRoute()

const TITLE = Object.freeze({
  TITLE_PAGE: t('add-school'),
  TITLE_ADDRESS: t('address'),
})
interface DataInput {
  schoolTypeId: number | null
  id?: number | null
  countryId: number | null
  districtId: number | null
  provinceId: number | null
  schoolName: string | null
  email: string | null
  address: string | null
  phoneNumber: number | null
  wardId: number | null
  [key: string]: any
}

const router = useRouter()
const myEditSchool = ref()
const dataInput = ref<DataInput>({
  schoolTypeId: null,
  schoolName: null,
  phoneNumber: null,
  address: null,
  countryId: null,
  districtId: null,
  provinceId: null,
  email: '',
  wardId: null,
})

const storeLoadButton = load()
const { unLoadComponent } = storeLoadButton

function cancel() {
  router.push({ name: 'manager-education' })
}
function confirm(idx: number) {
  myEditSchool.value.validate().then((status: any) => {
    if (status.valid) {
      if (route.params.id)
        editSchool()
      else
        addSchool()
    }
  })
  unLoadComponent(idx)
}

function addSchool() {
  MethodsUtil.requestApiCustom(UserService.PostCreateSchool, TYPE_REQUEST.POST, dataInput.value).then(() => {
    toast('SUCCESS', t('add-success'))
    router.push({ name: 'manager-education' })
  }).catch((err: Any) => {
    toast('ERROR', t(err.response.data.errors[0].message))
  })
}

function editSchool() {
  MethodsUtil.requestApiCustom(UserService.PostUpdateSchool, TYPE_REQUEST.POST, dataInput.value).then(() => {
    toast('SUCCESS', t('update-success'))
    router.push({ name: 'manager-education' })
  }).catch((err: Any) => {
    toast('ERROR', t(err.response.data.errors[0].message))
  })
}
async function getDataDetail() {
  const { data } = await MethodsUtil.requestApiCustom(UserService.GetDetailSchool, TYPE_REQUEST.GET, { id: route.params.id })
  dataInput.value = data
}
if (route.params.id)
  getDataDetail()
</script>

<template>
  <div class="mt-3">
    <h3>{{ TITLE.TITLE_PAGE }}</h3>
    <Form
      ref="myEditSchool"
      :validation-schema="schema"
      class="mt-3"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          lg="6"
          cols="12"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.schoolName"
            name="name"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :model-value="dataInput.schoolName"
              :text="`${t('school-name')}(*)`"
              :placeholder="t('school-name')"
            />
          </Field>
        </VCol>
        <VCol
          lg="6"
          cols="12"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.schoolTypeId"
            name="typeSchool"
            type="text"
          >
            <CmSelect
              :field="field"
              :errors="errors"
              :items="typeSchoolCombobox"
              item-value="key"
              custom-key="text"
              :model-value="dataInput.schoolTypeId"
              :text="`${t('school-type')}(*)`"
              :placeholder="t('school-type')"
            />
          </Field>
        </VCol>
        <VCol
          lg="6"
          cols="12"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.email"
            name="email"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="t('Email')"
              :placeholder="t('Email')"
            />
          </Field>
        </VCol>
        <VCol
          lg="6"
          cols="12"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.phoneNumber"
            name="phoneNumber"
            type="number"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="t('phone-number')"
              :placeholder="t('phone-number')"
            />
          </Field>
        </VCol>
      </VRow>
    </Form>
    <VRow class="w-100">
      <VCol
        cols="10"
      >
        <span>{{ TITLE.TITLE_ADDRESS }}</span>
        <CpAddress
          v-model:address="dataInput.address"
          v-model:province-id="dataInput.provinceId"
          v-model:country-id="dataInput.countryId"
          v-model:ward-id="dataInput.wardId"
          v-model:districtId="dataInput.districtId"
        />
      </VCol>
    </VRow>

    <div class="w-100 d-flex justify-end mt-3">
      <CmButton
        color="secondary"
        variant="outlined"
        :title="t('goBack')"
        @click="cancel"
      />
      <CmButton
        is-load
        color="primary"
        class-name="ml-3"
        :title="t('save')"
        @click="confirm"
      />
    </div>
  </div>
</template>
