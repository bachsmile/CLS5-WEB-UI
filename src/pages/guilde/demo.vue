<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import login from '../login.vue'
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

const showToast = () => {
  console.log(button123.value)

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

const handleItem1 = value => {
  // console.log(value)
}

const handleItem2 = value => {
  // console.log(value)
}

const handleItem3 = (value: any) => {
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

const handleClick = (value: any) => {

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

const handlerPreButton = () => {
  debugger
}

const toast = useToast()

const button123 = ref(null)

const abcd = (val: any) => {
  //
}
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

  <VBtn @click="loadMultiplecomponents([1, 2, 3])">
    loading
  </VBtn>
  <CmButton
    ref="button123"
    is-load
    color="primary"
    @click="handleClick"
  >
    <template #append>
      1
    </template>
    hello
    <template #prepend>
      2
    </template>
  </CmButton>
  <CmButton
    title=""
    icon="activity"
    text="button "
    is-load
    color="success"
    @click="handleClick"
  />
  <CmButton
    text="button"
    is-load
    color="success"
    variant="outlined"
    @click="handleClick"
  >
    hello222
  </CmButton>
  <CmButton
    is-load
    text="button "
    variant="outlined"
    color="error"
    @click="handleClick"
  >
    hello123
  </CmButton>
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
</template>
