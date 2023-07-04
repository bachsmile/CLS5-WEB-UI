<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Permission from '../admin/organization/permission/Permission.vue'
import treeSelect from './tree-select.vue'
import demotab from './demotab.vue'
import { load } from '@/stores/loadComponent'
import CmButton from '@/components/common/CmButton.vue'
import CmDateStage from '@/components/common/CmDateStage.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmCard from '@/components/common/CmCard.vue'
import CmDropDown from '@/components/common/CmDropDown.vue'
import CmButtonGroup from '@/components/common/CmButtonGroup.vue'
import CmSwitch from '@/components/common/CmSwitch.vue'
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
    title: 'win hello',
    icon: 'mdi-check-circle',
    component: demotab,
    isRendered: false,
  },
  {
    key: 'infor2',
    title: 'win hello',
    icon: 'mdi-check-circle',
    component: treeSelect,
    isRendered: false,
  },
  {
    key: 'infor3',
    title: 'win hello',
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

function handlerPreButton() {
}

const toast = useToast()

const button123 = ref(null)

function abcd(val: any) {
  console.log(val)
}

const date = ref(null)
watch(date, val => {
  console.log(val)
})
const fromDate = ref(null)
watch(fromDate, val => {
  console.log(val)
})
const toDate = ref(null)
watch(toDate, val => {
  console.log(val)
})
</script>

<template>
  <CmSwitch
    :list-item="action"
    color="dark"
  />
  <CmDropDown
    :list-item="action"
  />
  <CmButtonGroup
    :list-item="action"
    title="hello"
    @click-prepend="handlerPreButton"
  >
    hello win
  </CmButtonGroup>

  <VDivider />
  <CmButton
    variant="flat"
    color="primary"
  >
    primary
  </CmButton>
  <CmButton
    variant="outlined"
    color="primary"
  >
    primary
  </CmButton>
  <CmButton
    variant="tonal"
    color="primary"
  >
    primary
  </CmButton>
  <CmButton
    variant="flat"
    color="warning"
  >
    warning
  </CmButton>
  <CmButton
    variant="outlined"
    color="warning"
  >
    warning
  </CmButton>
  <CmButton
    variant="tonal"
    color="warning"
  >
    warning
  </CmButton>
  <CmButton
    variant="flat"
    color="secondary"
  >
    secondary
  </CmButton>
  <CmButton
    variant="outlined"
    color="secondary"
  >
    secondary
  </CmButton>
  <CmButton
    variant="tonal"
    color="secondary"
  >
    secondary
  </CmButton>
  <CmButton
    variant="flat"
    color="error"
  >
    error
  </CmButton>
  <CmButton
    variant="outlined"
    color="error"
  >
    error
  </CmButton>
  <CmButton
    variant="tonal"
    color="error"
  >
    error
  </CmButton>
  <CmButton
    variant="flat"
    color="success"
  >
    success
  </CmButton>
  <CmButton
    variant="outlined"
    color="success"
  >
    success
  </CmButton>
  <CmButton
    variant="tonal"
    color="success"
  >
    success
  </CmButton>
  <CmButton
    variant="flat"
    color="purple"
  >
    purple
  </CmButton>
  <CmButton
    variant="outlined"
    color="purple"
  >
    purple
  </CmButton>
  <CmButton
    variant="tonal"
    color="purple"
  >
    purple
  </CmButton>
  <CmButton
    variant="flat"
    color="orange"
  >
    orange
  </CmButton>
  <CmButton
    variant="outlined"
    color="orange"
  >
    orange
  </CmButton>
  <CmButton
    variant="tonal"
    color="orange"
  >
    orange
  </CmButton>

  <VDivider />
  <CmButton
    text="button "
    color="error"
    @click="showToast"
  >
    hello
  </CmButton>
  <CmCheckBox
    color="error"
    @click="showToast"
  />
  <CmCheckBox color="primary" />
  <CmCheckBox color="warning" />
  <CmCheckBox color="success" />
  <CmCheckBox
    color="gray"
    @click="showToast"
  />

  <CmDateStage />

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
      type="underline"
      abc="abc"
      @hello="abcd"
    />
  </div>
  <div style="width: 300px">
    <CmDateTimpicker
      v-model="date"
      v-model:from-date="fromDate"
      v-model:to-date="toDate"
      class="w-100"
      range
      multi-calendars
      @updated:model-value="abcd"
    />
  </div>
</template>
