<script setup lang="ts">
import { ActionType } from '@/constant/data/actionType.json'
import { comboboxStore } from '@/stores/combobox'
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'
import ArrayUtil from '@/utils/ArrayUtil'

// interface
interface Props {
  isDialogVisible: boolean
}

const props = withDefaults(defineProps<Props>(), ({
  isDialogVisible: false,
}))

const store = comboboxStore()
const { country, districts, provinces, wards } = storeToRefs(store)
const { fetchCountry, fetchDistricts, fetchProvinces, fetchWards } = store
const storeProfileUserManager = profileUserManagerStore()
const { values } = storeToRefs(storeProfileUserManager)
const CpModalAddress = defineAsyncComponent(() => import('../Admin/organization/users/profile/modal/CpModalAddress.vue'))
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

const actionItemEdit = (dataAction: any, index: any) => {
  data.isShowModalAddress = true
}

const actionItemDelete = (dataAction: any, index: any, dataResend?: any) => {
  // console.log('actionItemDelete', dataAction, index)
}

const addressName = (address: any) => {
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

const fetchDataAddress = async (dataAddress: any) => {
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
const handlerAddress = async (address: any) => {
  await fetchDataAddress(address)
  await addressName(address)
}
fetchDataAddress(values.value)
</script>

<template>
  <div>
    <VRow v-if="data.address?.isShow">
      <VCol
        cols="10"
      >
        <div class="addressStyle text-bold-sm">
          {{ data?.address?.address }}
        </div>
        <div>
          <span v-if="data?.address.wardName">{{ data?.address.wardName }}, </span><span v-if="data?.address.districtName">{{ data?.address.districtName }}, </span><span v-if="data?.address.provinceName">{{ data?.address.provinceName }}, </span><span v-if="data?.address.countryName">{{ data?.address.countryName }}</span>
        </div>
      </VCol>
      <VCol
        cols="2"
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
      <span class="color-primary  align-center">{{ $t('common.add') }}</span>
    </BLink>

    <CpModalAddress
      v-model:isDialogVisible="data.isShowModalAddress"
      :data-edit="values"
      @update:address="handlerAddress"
    />
  </div>
</template>

