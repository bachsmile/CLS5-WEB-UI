<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'

const props = withDefaults(defineProps<Props>(), ({
  isDialogVisible: false,
  dataEdit: () => ({
    countryId: null,
    districtId: null,
    provinceId: null,
    wardId: null,
    address: null,
  }),
}))
const emit = defineEmits<Emit>()
const storeProfileUserManager = profileUserManagerStore()
const { values } = storeToRefs(storeProfileUserManager)
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

/** ** Khởi tạo store */
const store = comboboxStore()
const { country, districts, provinces, wards } = storeToRefs(store)
const { fetchCountry, fetchDistricts, fetchProvinces, fetchWards } = store
const storeValidate = validatorStore()
const { Field, Form } = storeValidate

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const dataInit = reactive<DataInit>({
  countries: [],
  districts: [],
  provinces: [],
  wards: [],
  address: null,
})

const myFormAddress = ref(null)

const DATA_LABEL = Object.freeze({
  TITLE: t('common.address'),
  COUNTRY: t('users.add-user.nation'),
  DISTRICT: t('users.add-user.district'),
  PROVINCEID: t('users.add-user.province-city'),
  WARDS: t('users.add-user.wards'),
  ADDRESS: t('users.add-user.street-name'),
})

/**
 *  method
 */
/** event dialog */
const onCancel = () => {
  emit('update:isDialogVisible', false)
}

const addAddress = () => {
  emit('update:address', values.value)
  emit('update:isDialogVisible', false)
}

const onConfirmation = () => {
  addAddress()
}

// interface
interface Props {
  isDialogVisible: boolean
  dataEdit: DataEdit
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:address', value: object): void
}
interface combobox {
  key: number
  value: string
}
interface DataInit {
  countries: combobox[]
  provinces: combobox[]
  districts: combobox[]
  wards: Array<any>
  address: any
}
interface DataEdit {
  countryId?: any
  provinceId?: any
  districtId?: any
  wardId?: any
  address?: any
  [name: string]: any
}

const handleChangeCountry = async (countryId: any) => {
  await fetchProvinces(countryId)
  dataInit.provinces = provinces.value
  dataInit.districts = []
  dataInit.wards = []
  values.value.provinceId = null
  values.value.districtId = null
  values.value.wardId = null
  values.value.address = null
}

const handleChangeProvinces = async (provinceId: any) => {
  await fetchDistricts(values.value.provinceId)

  dataInit.districts = districts.value
  dataInit.wards = []
  values.value.districtId = null
  values.value.wardId = null
  values.value.address = null
}

const handleChangeDistrict = async (districtId: any) => {
  await fetchWards(districtId)
  dataInit.wards = wards.value
  values.value.wardId = null
  values.value.address = null
}

onMounted(async () => {
  if (window._.isEmpty(country.value))
    await fetchCountry()
  if (window._.isEmpty(provinces.value))
    await fetchProvinces(values.value.countryId)
  if (window._.isEmpty(districts.value))
    await fetchDistricts(values.value.provinceId)
  if (window._.isEmpty(wards.value))
    await fetchWards(values.value.districtId)

  dataInit.countries = country.value
  dataInit.provinces = provinces.value
  dataInit.districts = districts.value
  dataInit.wards = wards.value
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isDialogVisible"
    :title="DATA_LABEL.TITLE"
    persistent
    @cancel="onCancel"
    @confirm="onConfirmation"
  >
    <!-- <template #text> -->
    <Form ref="myFormAddress">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Quốc gia -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.countryId"
              name="countryId"
            >
              <CmSelect
                :field="field"
                :model-value="values.countryId"
                :text="DATA_LABEL.COUNTRY"
                :placeholder="DATA_LABEL.COUNTRY"
                :items="dataInit.countries"
                item-value="key"
                custom-key="value"
                @update:modelValue="handleChangeCountry"
              />
            </Field>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Tỉnh thành phố -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.provinceId"
              name="provinceId"
            >
              <CmSelect
                :field="field"
                :model-value="values.provinceId"
                :text="DATA_LABEL.PROVINCEID"
                :placeholder="DATA_LABEL.PROVINCEID"
                :items="dataInit.provinces"
                item-value="key"
                custom-key="value"
                @update:modelValue="handleChangeProvinces"
              />
            </Field>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Quận huyện -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.districtId"
              name="districtId"
            >
              <CmSelect
                :field="field"
                :model-value="values.districtId"
                :text="DATA_LABEL.DISTRICT"
                :placeholder="DATA_LABEL.DISTRICT"
                :items="dataInit.districts"
                item-value="key"
                custom-key="value"
                @update:modelValue="handleChangeDistrict"
              />
            </Field>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Phường/xã -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.wardId"
              name="wardId"
            >
              <CmSelect
                :field="field"
                :model-value="values.wardId"
                :text="DATA_LABEL.WARDS"
                :placeholder="DATA_LABEL.WARDS"
                :items="dataInit.wards"
                item-value="key"
                custom-key="value"
              />
            </Field>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- tên đường -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.address"
              name="address"
            >
              <CmTextField
                :field="field"
                :text="DATA_LABEL.ADDRESS"
                :placeholder="DATA_LABEL.ADDRESS"
              />
            </Field>
          </div>
        </VCol>
      </VRow>
    </Form>
    <!-- </template> -->
  </CmDialogs>
</template>
