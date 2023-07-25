<script lang="ts" setup>
import Breadcrumb from '../Breadcrumb.vue'
import Login from '../login.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmTab from '@/components/common/CmTab.vue'

interface Emit {
  (e: 'hello'): void
}
interface Props {
  emit?: any
}
const props = withDefaults(defineProps<Props>(), ({}))

const abc = ref('hello')
const { emitEvent } = props.emit()
const listTab = [
  {
    key: 'enter1',
    title: 'bách hello',
    icon: 'mdi-check-circle',
    component: Login,
    isRendered: false,
  },
  {
    key: 'enter2',
    title: 'bách hello',
    icon: 'mdi-check-circle',
    component: Breadcrumb,
    isRendered: false,
  },
  {
    key: 'enter3',
    title: 'bách hello',
    icon: 'mdi-check-circle',
    isRendered: false,
  },
]
</script>

<template>
  <CmTab
    :list-tab="listTab"
    label="tab"
    type="underline"
    route-name="guilde-demo-tab-tab"
  />
  <CmButton
    title="win1"
    @click="emitEvent('hello', abc)"
  >
    hello
  </CmButton>
</template>
