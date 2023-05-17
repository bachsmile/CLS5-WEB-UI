<script lang="ts" setup>
import CmTextField from '@/components/common/CmTextField.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), {

})
const emit = defineEmits<Emit>()
const storeValidate = validatorStore()
const { t } = window.i18n()
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
const { schemaOption, Field, Form, useForm, yup } = storeValidate
interface DataInput {
  id?: number
  userTypeName: string
  defaultRoleId: number | null
}

const dataInput = reactive<DataInput>({
  userTypeName: '',
  defaultRoleId: null,
})
</script>

<template>
  <Form>
    <VRow>
      <VCol
        cols="4"
      >
        <CmTextField
          :model-value="userTypeName"
          :text="`${t('userTypeName')}*`"
          :placeholder="t('userTypeName')"
          @update:model-value="emit('update:userTypeName', $event)"
        />
      </VCol>
      <VCol
        cols="4"
      >
        <CmSelect
          :model-value="defaultRoleId"
          :text="`${t('default-role')}*`"
          :items="props.listRoleDefault"
          custom-key="text"
          item-value="roleValue"
          :placeholder="t('default-role')"
          @update:model-value="emit('update:defaultRoleId', $event)"
        />
      </VCol>
    </VRow>
  </Form>
</template>

