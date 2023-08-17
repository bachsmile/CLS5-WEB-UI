<script lang="ts" setup>
import { _ } from '@/utils/LodashUtil'
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmSelectTree from '@/components/common/CmSelectTree.vue'
import ArrayUtil from '@/utils/ArrayUtil'
import listIcon from '@/constant/data/icon.json'
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), {
  isShow: false,
  title: '',
  topicName: '',
  description: '',
  dataTree: [],
  customKey: 'id',
  placeholderSelectTopic: '',
  topicParent: '',
  symbol: '',
})

const emit = defineEmits<Emit>()

const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmTextArea = defineAsyncComponent(() => import('@/components/common/CmTextArea.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

interface Props {
  isShow: boolean
  title: string
  topicName: string
  description: string
  dataTree: any
  customKey: string
  placeholderSelectTopic: string
  topicParent: string
  symbol: string
  data: DataInput
}
interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'confirm', data: unknown): void
}

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
  typeId: 2,
  name: '',
})

// validate
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = reactive({
  name: schemaOption.requiredString(),
})
const formEditTopic = ref()

// Lấy dữ liệu từ component cha
const closeOnBackdrop = ref<boolean>(false)
const dataTopic = ref<any[]>([])
watch(() => props.dataTree, val => {
  const data = _.cloneDeep(val)
  dataTopic.value = ArrayUtil.formatSelectTree(data, 'parentId', props.customKey)
}, { immediate: true })
watch(() => props.data, val => {
  dataInput.value = val
}, { immediate: true })

function cancelModal() {
  dataInput.value = {
    id: null,
    parentId: null,
    description: '',
    icon: '',
    typeId: 2,
    name: '',
  }
  emit('update:isShow', false)
}
function confirmModal() {
  formEditTopic.value.validate().then((status: any) => {
    if (status.valid)
      emit('confirm', dataInput.value)
  })
}
function resetData() {
  dataInput.value = {
    id: null,
    parentId: null,
    description: '',
    icon: '',
    typeId: 2,
    name: '',
  }
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    :persistent="closeOnBackdrop"
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
  >
    <Form
      ref="formEditTopic"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol>
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.name"
            name="name"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :model-value="dataInput.name"
              :text="`${topicName}*`"
              :placeholder="topicName"
            />
          </Field>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmSelect
            v-model:persistent="closeOnBackdrop"
            v-model:model-value="dataInput.icon"
            :text="`${props.symbol}`"
            :placeholder="symbol"
            :items="listIcon"
            item-value="name"
          >
            <template #option="{ data }">
              <VIcon
                size="24"
                :icon="data.name"
              />
              {{ data.key }}
            </template>
            <template #selected-option="{ data }">
              <VIcon
                size="24"
                :icon="data.name"
              />
              {{ data.key }}
            </template>
          </CmSelect>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <span class="color-dark">{{ topicParent }}</span>
          <CmSelectTree
            v-model:model-value="dataInput.parentId"
            value-format="id"
            :options="dataTopic"
            :normalizer-custom-type="[props.customKey, 'name', 'children']"
            :placeholder="placeholderSelectTopic"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmTextArea
            v-model:model-value="dataInput.description"
            :text="description"
            :placeholder="description"
          />
        </VCol>
      </VRow>
    </Form>
  </CmDialogs>
</template>
