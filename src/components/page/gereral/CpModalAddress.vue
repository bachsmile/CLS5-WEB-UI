<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'

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

const myFormAddress = ref(null)

const DATA_LABEL = Object.freeze({
  TITLE: t('address'),
  COUNTRY: t('nation'),
  DISTRICT: t('district'),
  PROVINCEID: t('province-city'),
  WARDS: t('wards'),
  ADDRESS: t('street-name'),
})

/**
 *  method
 */
/** event dialog */
function onCancel() {
  emit('update:isDialogVisible', false)
}
const dataAddress = ref<DataEdit>({
  countryId: null,
  provinceId: null,
  districtId: null,
  wardId: null,
  address: null,
})
watch(() => props.dataEdit, (val: any) => {
  dataAddress.value = val
})
function addAddress() {
  emit('update:address', dataAddress.value)
  emit('update:isDialogVisible', false)
}

function onConfirmation() {
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
}
interface DataEdit {
  countryId?: any
  provinceId?: any
  districtId?: any
  wardId?: any
  address?: any
  [name: string]: any
}

async function handleChangeCountry(countryId: any) {
  await fetchProvinces(dataAddress.value.countryId)

  // provinces.value = provinces.value
  districts.value = []
  wards.value = []
  dataAddress.value.provinceId = null
  dataAddress.value.districtId = null
  dataAddress.value.wardId = null
  dataAddress.value.address = null
}

async function handleChangeProvinces(provinceId: any) {
  await fetchDistricts(dataAddress.value.provinceId)
  wards.value = []
  dataAddress.value.districtId = null
  dataAddress.value.wardId = null
  dataAddress.value.address = null
}

async function handleChangeDistrict(districtId: any) {
  await fetchWards(districtId)
  dataAddress.value.wardId = null
  dataAddress.value.address = null
}

onMounted(async () => {
  if (window._.isEmpty(country.value))
    await fetchCountry()
  if (window._.isEmpty(provinces.value))
    await fetchProvinces(dataAddress.value.countryId)
  if (window._.isEmpty(districts.value))
    await fetchDistricts(dataAddress.value.provinceId)
  if (window._.isEmpty(wards.value))
    await fetchWards(dataAddress.value.districtId)
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
            <CmSelect
              v-model="dataAddress.countryId"
              :text="DATA_LABEL.COUNTRY"
              :placeholder="DATA_LABEL.COUNTRY"
              :items="country"
              item-value="key"
              custom-key="value"
              @update:modelValue="handleChangeCountry"
            />
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Tỉnh thành phố -->
          <div>
            <CmSelect
              v-model="dataAddress.provinceId"
              :text="DATA_LABEL.PROVINCEID"
              :placeholder="DATA_LABEL.PROVINCEID"
              :items="provinces"
              item-value="key"
              custom-key="value"
              @update:modelValue="handleChangeProvinces"
            />
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Quận huyện -->
          <div>
            <CmSelect
              v-model="dataAddress.districtId"
              :text="DATA_LABEL.DISTRICT"
              :placeholder="DATA_LABEL.DISTRICT"
              :items="districts"
              item-value="key"
              custom-key="value"
              @update:modelValue="handleChangeDistrict"
            />
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Phường/xã -->
          <div>
            <CmSelect
              v-model="dataAddress.wardId"
              :text="DATA_LABEL.WARDS"
              :placeholder="DATA_LABEL.WARDS"
              :items="wards"
              item-value="key"
              custom-key="value"
            />
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- tên đường -->
          <div>
            <CmTextField
              v-model="dataAddress.address"
              :text="DATA_LABEL.ADDRESS"
              :placeholder="DATA_LABEL.ADDRESS"
            />
          </div>
        </VCol>
      </VRow>
    </Form>
    <!-- </template> -->
  </CmDialogs>
</template>
