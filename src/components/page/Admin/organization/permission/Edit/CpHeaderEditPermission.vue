<script lang="ts" setup>
import CmTextField from '@/components/common/CmTextField.vue'
import { validatorStore } from '@/stores/validatator'

const emit = defineEmits<Emit>()
const storeValidate = validatorStore()
const { t } = window.i18n()
interface Emit {
  (e: 'update:userTypeName', value: any): void
  (e: 'update:defaultRoleId', value: any): void
  (e: 'change', value: any): void
}
const { schemaOption, Field, Form, useForm, yup } = storeValidate
interface DataInput {
  id?: number
  userTypeName: string
  defaultRoleId: number
  listFeature: Feature[]
}
interface Feature {
  featureId?: number
  permissionOrganizationalStructure?: number
  permissionValue?: number
}
const dataInput = reactive<DataInput>({
  userTypeName: '',
  defaultRoleId: 0,
  listFeature: [],
})
</script>

<template>
  <Form>
    <VRow>
      <VCol
        cols="4"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.userTypeName"
          name="name"
          type="text"
          :rules="schemaOption.defaultString"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            :text="`${t('userTypeName')}*`"
            :placeholder="t('userTypeName')"
            @update:model-value="emit('update:userTypeName', $event)"
          />
        </Field>
      </VCol>
      <VCol
        cols="4"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.userTypeName"
          name="name"
          type="text"
          :rules="schemaOption.defaultString"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            :text="`${t('default-role')}*`"
            :placeholder="t('default-role')"
            @update:model-value="emit('update:defaultRoleId', $event)"
          />
        </Field>
      </VCol>
    </VRow>
  </Form>
</template>

