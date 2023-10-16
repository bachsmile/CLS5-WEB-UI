<script lang="ts" setup>
import CpItemConfiguration from './auto-test/CpItemConfiguration.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

const props = withDefaults(defineProps<Props>(), {

})
const { t } = window.i18n()
interface Props {
  items: Any[]
}

const listConfig = ref<Any[]>([

])

// item mặc định
const item = {
  topicId: 0,
  typeId: 0,
  levelId: 0,
  isGroup: null,
  quantity: 0,
  totalPoint: 0,
  selectedQuantity: 0,
}
const dataCombobox = ref<Any>({
  topic: [],
  level: [],
  group: [],
  type: [],
})
watch(() => props.items, val => {
  if (val?.length)
    listConfig.value = val
  else
    listConfig.value.push(item)
}, { immediate: true })

function getComboboxConfig(payload?: Any) {
  MethodsUtil.requestApiCustomV5(QuestionService.comboboxGroupConfigAutoTest, TYPE_REQUEST.GET, payload).then((result: Any) => {
    dataCombobox.value = result.data
  })
}
getComboboxConfig()

function addItem() {
  listConfig.value.push(item)
}
function replicationItem(value: Any) {
  const el = window._.cloneDeep(value)
  listConfig.value.push(el)
}
function deleteItem(idx: number) {
  listConfig.value.splice(idx, 1)
}
</script>

<template>
  <div class="d-flex align-center">
    <div>{{ t('number-exam-create') }}</div>
    <div>
      <CmTextField
        style="width: 50px;"
        class="mx-2"
      />
    </div>
    <div>
      {{ t('QUE_TestCode') }}
    </div>
  </div>

  <div class="d-flex align-center my-4">
    <CmCheckBox /> <label>{{ t('auto-approve') }}</label>
    <CmCheckBox class="ml-2" /> <label>{{ t('number-question') }}</label>
  </div>

  <div class="m">
    <CpItemConfiguration
      v-for="(item, index) in listConfig"
      :key="index"
      v-model:topicId="item.topicId"
      v-model:typeId="item.typeId"
      v-model:levelId="item.levelId"
      v-model:isGroup="item.isGroup"
      v-model:quantity="item.quantity"
      v-model:totalPoint="item.totalPoint"
      v-model:selectedQuantity="item.selectedQuantity"
      :content="item"
      :combobox-default="dataCombobox"
      @add="addItem"
      @replication="replicationItem(item)"
      @delete="deleteItem(index)"
    />
  </div>
</template>
