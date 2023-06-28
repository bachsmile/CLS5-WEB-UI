<script setup lang="ts">
import { ActionType } from '@/constant/data/actionType.json'
import { comboboxStore } from '@/stores/combobox'
import ArrayUtil from '@/utils/ArrayUtil'

// interface
interface Props {
  isDialogVisible: boolean
  address: string | null
  countryId: number | null
  provinceId: number | null
  wardId: number | null
  districtId: number | null
}
const props = withDefaults(defineProps<Props>(), ({
  isDialogVisible: false,
}))
const emit = defineEmits<Emit>()

interface Emit {
  (e: 'update:address', data: number): void
  (e: 'update:countryId', data: number): void
  (e: 'update:districtId', data: number): void
  (e: 'update:provinceId', data: number): void
  (e: 'update:wardId', data: number): void
}
const store = comboboxStore()
const { country, districts, provinces, wards } = storeToRefs(store)
const { fetchCountry, fetchDistricts, fetchProvinces, fetchWards } = store
const CpModalAddress = defineAsyncComponent(() => import('./CpModalAddress.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * data
 */
interface combobox {
  key: number
  value: string
}
interface Data {
  countries: combobox[]
  districts: combobox[]
  provinces: combobox[]
  wards: Array<any>
  address: any
  isShowModalAddress: boolean
  addressString: string
}

const data = reactive<Data>({
  countries: [],
  districts: [],
  provinces: [],
  wards: [],

  address: reactive({
    countryName: '',
    districtName: '',
    provinceName: '',
    address: '',
    wardName: '',
    isShow: false,
  }),
  addressString: '',
  isShowModalAddress: false,
})

function actionItemEdit(dataAction: any, index: any) {
  data.isShowModalAddress = true
}

function actionItemDelete(dataAction: any, index: any, dataResend?: any) {
  // console.log('actionItemDelete', dataAction, index)
}

function addressName(address: any) {
  const countries = country.value.filter((x: any) => x.key === address.countryId)
  if (countries.length > 0) {
    data.address.isShow = true
    data.address.countryName = countries[0].value
  }
  const province = districts.value.filter(x => x.key === address.provinceId)
  if (province.length > 0) {
    data.address.isShow = true
    data.address.provinceName = province[0].value
  }
  const district = provinces.value.filter(x => x.key === address.districtId)
  if (district.length > 0) {
    data.address.isShow = true
    data.address.districtName = district[0]?.value
  }
  const ward = wards.value.filter(x => x.key === address.wardId)
  if (ward.length > 0) {
    data.address.isShow = true
    data.address.wardName = ward[0].value
  }
  data.address.address = address.address || ''
}

const action = [
  {
    title: t('common.action-table.update'),
    icon: ActionType[0].icon,
    action: actionItemEdit,
  },
  {
    title: t('common.delete'),
    icon: ActionType[1].icon,
    action: actionItemDelete,
  },
]

async function fetchDataAddress(dataAddress: any) {
  if (dataAddress.countryId && ArrayUtil.isEmptyArray(country.value)) {
    await fetchCountry()
    if (dataAddress.provinceId && ArrayUtil.isEmptyArray(provinces.value)) {
      await fetchProvinces(dataAddress.countryId)
      if (dataAddress.districtId && ArrayUtil.isEmptyArray(districts.value)) {
        await fetchDistricts(dataAddress.provinceId)
        if (dataAddress.wardId && ArrayUtil.isEmptyArray(wards.value))
          await fetchWards(dataAddress.districtId)
      }
    }
  }
  addressName(dataAddress)
}
async function handlerAddress(address: any) {
  emit('update:address', address.address)
  emit('update:countryId', address.countryId)
  emit('update:provinceId', address.provinceId)
  emit('update:wardId', address.wardId)
  await fetchDataAddress(address)
  await addressName(address)
}
watchEffect(async val => {
  data.address.countryId = props.countryId
  data.address.provinceId = props.provinceId
  data.address.wardId = props.wardId
  data.address.districtId = props.districtId
  data.address.address = props.address
  data.address.isShow = (data.address.countryId || data.address.provinceId || data.address.wardId || data.address.districtId || data.address.address)
  await fetchDataAddress(data.address)
})
</script>

<template>
  <div>
    <VRow
      v-if="data.address?.isShow"
      class="justify-start"
    >
      <VCol
        cols="3"
      >
        <div class="addressStyle text-bold-sm">
          {{ data?.address?.address }}
        </div>
        <div>
          <span v-if="data?.address.wardName">{{ data?.address.wardName }}, </span><span v-if="data?.address.districtName">{{ data?.address.districtName }}, </span><span v-if="data?.address.provinceName">{{ data?.address.provinceName }}, </span><span v-if="data?.address.countryName">{{ data?.address.countryName }}</span>
        </div>
      </VCol>
      <VCol
        cols="3"
      >
        <CmDropDown
          :list-item="action"
          custom-key="title"
          :type="1"
        />
      </VCol>
    </VRow>
    <BLink
      v-else
      class="cursor-pointer"
      @click="data.isShowModalAddress = true"
    >
      <VIcon
        icon="tabler:plus"
        size="16"
        class="color-primary mr-2"
      />
      <span class="color-primary  align-center">{{ $t('Add-new') }}</span>
    </BLink>

    <CpModalAddress
      v-model:isDialogVisible="data.isShowModalAddress"
      :data-edit="data.address"
      @update:address="handlerAddress"
    />
  </div>
</template>
