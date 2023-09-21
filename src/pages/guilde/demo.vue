<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Permission from '../admin/organization/permission/Permission.vue'
import treeSelect from './tree-select.vue'
import demotab from './demotab.vue'
import { load } from '@/stores/loadComponent'
import CmCard from '@/components/common/CmCard.vue'
import CmTab from '@/components/common/CmTab.vue'
import CmDateTimpicker from '@/components/common/CmDateTimepicker.vue'

function showToast() {
  // console.log(button123.value.unLoadButton())
  button123?.value.unLoadButton()

  toast('win hello', {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: false,
    icon: true,
    rtl: true,
  })
}

function handleItem1(value) {
  // console.log(value)
}

function handleItem2(value) {
  // console.log(value)
}

function handleItem3(value: any) {
  // console.log(value)
}

const listTab = [
  {
    key: 'infor1',
    title: 'win hello 1',
    icon: 'mdi-check-circle',
    component: treeSelect,
    isRendered: false,
  },
  {
    key: 'infor2',
    title: 'win hello 2',
    icon: 'mdi-check-circle',
    component: demotab,
    isRendered: false,
  },
  {
    key: 'infor3',
    title: 'win hello 3',
    icon: 'mdi-check-circle',
    component: Permission,
    isRendered: false,
  },
]

const action = [{
  title: 'Xem chi tiết',
  icon: 'eye',
  action: handleItem1,
  prependItem: {
    value: true,
  },
},
{
  title: 'Tải file',
  icon: 'download',
  action: handleItem2,
  prependItem: {
    value: true,
    action: () => {
      //

    },
  },
},
{
  title: 'Tải file',
  icon: 'download',
  action: handleItem2,
  prependItem: {
    value: true,
    action: () => {
      //
    },
  },
},
{
  title: 'Chỉnh sửa',
  icon: 'edit',
  action: showToast,
  prependItem: {
    value: true,
  },
}]

function handleClick(value: any) {

  // console.log(action)
}

// action.value =
watch(action, () => {
  // console.log(action)
}, { deep: true })

const store = load()

const { countComponent } = storeToRefs(store)
const { loadMultiplecomponents, unLoadComponent } = store

const router = useRouter()

const toast = useToast()

const button123 = ref(null)

function abcd(val: any) {
  // console.log(val)
}

const date = ref(null)
watch(date, val => {
  // console.log(val)
})
const fromDate = ref(null)
watch(fromDate, val => {
  // console.log(val)
})
const toDate = ref(null)
watch(toDate, val => {
  // console.log(val)
})
</script>

<template>
  <CmCard backgroud="bg-primary-50">
    <template #title>
      <VImg
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        height="200px"
        cover
      />
      <VCardTitle>
        Top western road trips
      </VCardTitle>
      <VCardSubtitle>
        1,000 miles of wonder
      </VCardSubtitle>
    </template>
    <template #text>
      hello hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello
    </template>
    <VDivider class="mx-4 mb-1" />

    <VCardTitle>Tonight's availability</VCardTitle>

    <div class="px-4">
      <VChipGroup>
        <VChip>5:30PM</VChip>

        <VChip>7:30PM</VChip>

        <VChip>8:00PM</VChip>

        <VChip>9:00PM</VChip>
      </VChipGroup>
    </div>
  </CmCard>
  <div
    class="d-flex justify-content-center"
    style="margin-top: 20px; "
  >
    <CmTab
      :list-tab="listTab"
      type="button"
      abc="abc"
      route-name="guilde-demo-tab"
      @hello="abcd"
    />
  </div>
  <div style="width: 300px">
    <CmDateTimpicker
      v-model="date"
      v-model:from-date="fromDate"
      v-model:to-date="toDate"
      class="w-100"
      @updated:model-value="abcd"
    />
  </div>
</template>
