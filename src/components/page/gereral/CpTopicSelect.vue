<script lang="ts" setup>
import CpMdEditTopic from '../Admin/training/topic/Modal/CpMdEditTopic.vue'
import { comboboxStore } from '@/stores/combobox'
import CmButton from '@/components/common/CmButton.vue'
import type { typeToast } from '@/typescript/interface'
import SharedService from '@/api/shared'
import MethodsUtil from '@/utils/MethodsUtil'
import toast from '@/plugins/toast'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmSelectTree from '@/components/common/CmSelectTree.vue'

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  isShowAdd: true,
})

const emit = defineEmits<Emit>()

const { t } = window.i18n()

const storeCombobox = comboboxStore()
const { getComboboxTopic } = storeCombobox
const { topicCombobox } = storeToRefs(storeCombobox)

const TITLE = reactive({
  ADD: t('Add-new'),
  ADD_FROM_FILE: t('add-from-file'),
  EXPORT_EXCEL: t('export-excel'),
  TOPIC_NAME: t('topicName'),
  TOPIC_PARENT: t('topic-parent'),
  PLACEHOLDER_PARENT_TOPIC: t('Select-topic'),
  DESCRIPTRION: t('description'),
  TITLE_MODAL: t('add-topic'),
  TITLE_MODAL_EDIT: t('add-topic'),
  SYSMBOL: t('symbol'),
  TITLE_MODAL_DELETE: t('Delete-topic'),
})
interface Props {
  isShowAdd?: boolean
  text?: string
  placeholder?: string
  modelValue?: any[] | any
  type: number
  multiple?: boolean
  disabled?: boolean
  field?: any
  errors?: any
}
interface Emit {
  (e: 'update:modelValue', data: any): void
}

const topicIds = props.multiple ? ref<any[]>([]) : ref<any>(null)
watch(() => props.modelValue, (val: any[] | any) => {
  if (!window._.isEmpty(val) && window._.isEmpty(topicCombobox.value)) {
    getComboboxTopic(props.type)
    topicIds.value = val
  }
}, { immediate: true })

function change() {
  if (topicIds.value === undefined) {
    emit('update:modelValue', props.multiple ? [] : null)
    return
  }
  emit('update:modelValue', topicIds.value)
}
onMounted(() => {
  if (props.type && !window._.isEmpty(props.modelValue))
    getComboboxTopic(props.type)
})

const isShowModalEdit = ref(false)
interface DataInput {
  id?: number | null
  parentId?: number | null
  description: string
  icon: string
  typeId: number
  name: string
}
const dataInput = ref<DataInput>({
  id: null,
  parentId: null,
  description: '',
  icon: '',
  typeId: props.type,
  name: '',
})
function showModalEdit() {
  isShowModalEdit.value = true
}
function open() {
  if (props.type && window._.isEmpty(topicCombobox.value))
    getComboboxTopic(props.type)
}
async function confirm(val: DataInput) {
  let mes = t('add-success')
  let status: typeToast = 'SUCCESS'
  const payload = {
    ...val,
    parentId: val.parentId || undefined,
  }
  MethodsUtil.requestApiCustom(SharedService.PostCreateTopic, TYPE_REQUEST.POST, payload).then(() => {
    getComboboxTopic(props.type)
    isShowModalEdit.value = false
    toast(status, mes)
  })
    .catch((error: any) => {
      status = 'ERROR'
      mes = t(error.response.data.errors[0].message)
      toast(status, mes)
    })
}
</script>

<template>
  <div
    v-if="text"
    class="text-medium-sm mt-1"
  >
    <label class="text-medium-sm color-dark">{{ t(text) }}</label>
  </div>
  <div class="d-flex vTextField cm-input-field">
    <CmSelectTree
      v-model:model-value="topicIds"
      :disabled="disabled"
      :multiple="multiple"
      value-format="id"
      :field="field"
      :errors="errors"
      :options="topicCombobox"
      :normalizer-custom-type="['id', 'name', 'children']"
      :placeholder="placeholder"
      @update:model-value="change"
      @open="open"
    />
    <CmButton
      v-if="!disabled && isShowAdd"
      class="ml-2 mt-1"
      size="40"
      :color="errors?.length > 0 ? 'error' : 'primary'"
      variant="tonal"
      @click="showModalEdit"
    >
      <VIcon
        size="24"
        icon="material-symbols:add-rounded"
      />
    </CmButton>
  </div>
  <CpMdEditTopic
    v-model:is-show="isShowModalEdit"
    :data-tree="topicCombobox"
    :topic-name="TITLE.TOPIC_NAME"
    :topic-parent="TITLE.TOPIC_PARENT"
    :data="dataInput"
    :placeholder-select-topic="TITLE.PLACEHOLDER_PARENT_TOPIC"
    :description="TITLE.DESCRIPTRION"
    :title="TITLE.TITLE_MODAL"
    :symbol="TITLE.SYSMBOL"
    @confirm="confirm"
  />
</template>
