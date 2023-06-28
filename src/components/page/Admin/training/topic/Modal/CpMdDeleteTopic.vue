<script lang="ts" setup>
import { _ } from '@/utils/LodashUtil'
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmSelectTree from '@/components/common/CmSelectTree.vue'
import ArrayUtil from '@/utils/ArrayUtil'

const props = withDefaults(defineProps<Props>(), {
  isShow: false,
  dataTree: [],
  customKey: 'id',
  placeholderSelectTopic: '',
})

const emit = defineEmits<Emit>()
interface Props {
  isShow: boolean
  title?: string
  topicName?: string
  description?: string
  dataTree?: any
  customKey?: string
  placeholderSelectTopic?: string
  topicParent?: string
  symbol?: string
}

interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'confirm', data: unknown): void
}
const { t } = window.i18n()
const dataTopic = ref<any[]>([])
watch(() => props.dataTree, val => {
  const data = _.cloneDeep(val)
  dataTopic.value = ArrayUtil.formatSelectTree(data, 'parentId', props.customKey)
}, { immediate: true, deep: true })

const topicIdNew = ref<number | null>(null)
function cancelModal() {
  topicIdNew.value = null
  emit('update:isShow', false)
}
function confirmModal() {
  // formEditTopic.value.validate().then((status: any) => {
  //   if (status.valid)
  emit('confirm', topicIdNew.value)

  // })
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="t('Delete-topic')"
    @cancel="cancelModal"
    @confirm="confirmModal"
  >
    <CmSelectTree
      v-model:model-value="topicIdNew"
      value-format="id"
      :options="dataTopic"
      :normalizer-custom-type="[props.customKey, 'name', 'children']"
      :placeholder="placeholderSelectTopic"
      :append-to-body="true"
    />
  </CmDialogs>
</template>
