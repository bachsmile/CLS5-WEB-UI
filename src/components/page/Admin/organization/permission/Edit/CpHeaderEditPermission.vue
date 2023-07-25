<script lang="ts" setup>
import CmTextField from '@/components/common/CmTextField.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), {

})
const emit = defineEmits<Emit>()
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate

const { submitForm } = useForm()
const { t } = window.i18n()
const schema = reactive({
  defaultRoleId: schemaOption.defaultSelectSingle,
})
interface Emit {
  (e: 'update:userTypeName', value: any): void
  (e: 'update:defaultRoleId', value: any): void
  (e: 'change', value: any): void
}
interface Props {
  listRoleDefault?: any[]
  defaultRoleId: number | null
  userTypeName: string | null
}
interface DataInput {
  id?: number
  userTypeName: string
  defaultRoleId: number | null
}

const dataInput = reactive<DataInput>({
  userTypeName: '',
  defaultRoleId: null,
})
const isIntersecting = ref<boolean>(false)
function onIntersect(val: boolean) {
  isIntersecting.value = val
}
watchEffect(() => {
  dataInput.userTypeName = props.userTypeName || ''
  dataInput.defaultRoleId = props.defaultRoleId
})
const formEdit = ref()
defineExpose({
  validate: formEdit,
  isIntersecting,
})
</script>

<template>
  <Form
    ref="formEdit"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VRow>
      <VCol
        cols="4"
      >
        <CmTextField
          :model-value="dataInput.userTypeName"
          :text="`${t('userTypeName')}*`"
          :placeholder="t('userTypeName')"
          @update:model-value="emit('update:userTypeName', $event)"
        />
      </VCol>
      <VCol
        v-intersect="onIntersect"
        cols="4"
      >
        <Field
          v-slot="{ field, errors }"
          v-model:model-value="dataInput.defaultRoleId"
          name="defaultRoleId"
        >
          <CmSelect
            :field="field"
            :errors="errors"
            :model-value="dataInput.defaultRoleId"
            :text="`${t('default-role')}*`"
            :items="props.listRoleDefault"
            custom-key="text"
            item-value="roleValue"
            :placeholder="t('default-role')"
            @update:model-value="emit('update:defaultRoleId', $event)"
          />
        </Field>
      </VCol>
    </VRow>
  </Form>
</template>
