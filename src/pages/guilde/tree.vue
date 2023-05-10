<script setup lang="ts">
import _ from 'lodash'
import ArraysUtil from '@/utils/ArrayUtil'

const CmTreeView = defineAsyncComponent(() => import('@/components/common/CmTreeView.vue'))

const modeBool = ref(true)
const { t } = window.i18n()

const config = reactive({
  roots: ['node-p1'],
  keyboardNavigation: false,
  dragAndDrop: false,
  checkboxes: true,
  editable: false,
  disabled: false,
  padding: 25,
  checkMode: 0,

})

const nodes = ref({})

const changeMode = () => {
  modeBool.value = !modeBool.value
  config.checkMode = modeBool.value ? 0 : 1
}

const getRoleFeature = async () => {
  await window.axios.get('/usertype/get-feature-permission-by-portal')
    .then((value: any) => {
      const result = ArraysUtil.formatTreeData(ArraysUtil.flatMapTree([value.data[0]], 'permissions'), config.roots, t)
      nodes.value = reactive(result)
      console.log(result)
    })
    .catch((error: any) => error)
}

getRoleFeature()
</script>

<template>
  <p>
    <label for="showCheckBoxes">Checkboxes</label>
    <input
      id="showCheckBoxes"
      v-model="config.checkboxes"
      type="checkbox"
    >

    <label for="padding"> | Padding</label>
    <input
      id="padding"
      v-model.number="config.padding"
      type="number"
    >

    <label for="editable"> | Editable</label>
    <input
      id="editable"
      v-model="config.editable"
      type="checkbox"
    >

    <label for="disabled"> | Disabled</label>
    <input
      id="disabled"
      v-model="config.disabled"
      type="checkbox"
    >

    <label for="keyboardNavigation"> | Keyboard Navigation</label>
    <input
      id="keyboardNavigation"
      v-model="config.keyboardNavigation"
      type="checkbox"
    >

    <label for="DragandDrop"> | DragandDrop</label>
    <input
      id="DragandDrop"
      v-model="config.dragAndDrop"
      type="checkbox"
    >

    <label for="checkMode"> | Checkmode auto bach</label>
    {{ modeBool }}
    <input
      id="checkMode"
      v-model="modeBool"
      type="checkbox"
      @input="changeMode"
    >
  </p>

  <CmTreeView
    :nodes="nodes"
    :config="config"
    is-org
  />
</template>

