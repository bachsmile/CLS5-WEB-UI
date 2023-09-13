<script setup lang="ts">
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import { validatorStore } from '@/stores/validatator'
import CmButton from '@/components/common/CmButton.vue'

interface Props {
  data: any
  ansId: any
  name: any
  point: any
  isView: boolean
  disabledDel?: boolean
  placeholder?: string
  isMatch?: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  isView: false,
  disabledDel: false,
  isMatch: false,
  data: () => ({
    name: '',
    position: 0,
    point: null,
  }),

}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:name', value: any): void
  (e: 'update:point', value: any): void
  (e: 'delete', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const schema = computed(() => ({
  name: schemaOption.defaultStringArea,
  ...(props.isMatch ? { point: schemaOption.defaultNumber100Yub } : {}),
}))
const answerData = ref()

function handleChangeContent(val: any) {
  emit('update:name', val)
}
function handleChangePoint(val: any) {
  emit('update:point', val)
}

const myFormAnsItem = ref()
const isSubmit = computed(() => {
  return myFormAnsItem.value.validate
})

watch(() => props.data, (val: any) => {
  answerData.value = val
}, { deep: true, immediate: true })
watch(() => props.name, (val: any) => {
  answerData.value.name = val
}, { deep: true })
defineExpose({
  isSubmit,
})
</script>

<template>
  <Form
    ref="myFormAnsItem"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VRow class="anslevelMatrix">
      <VCol
        :cols="isMatch ? 9 : 11"
      >
        <Field
          v-slot="{ field, errors }"
          :model-value="name"
          name="name"
          type="string"
        >
          <CmInputEditor
            :field="field"
            :errors="errors"
            :disabled="isView"
            rlt="end"
            is-menu-simple
            min-height="44px"
            :placeholder="placeholder"
            width="100%"
            :model-value="name"
            @update:modelValue="handleChangeContent"
          />
        </Field>
      </VCol>
      <VCol
        v-if="isMatch"
        cols="2"
      >
        <Field
          v-slot="{ field, errors }"
          :model-value="point"
          name="point"
          type="number"
        >
          <CmInputEditor
            :field="field"
            :errors="errors"
            :is-errors="false"
            :disabled="isView"
            rlt="end"
            is-menu-simple
            min-height="44px"
            placeholder="point"
            class="mln-2"
            width="100%"
            :model-value="point"
            @update:modelValue="handleChangePoint"
          />
        </Field>
      </VCol>
      <VCol
        cols="1"
        class="d-flex action-item mxn-2"
      >
        <CmButton
          :disabled="disabledDel"
          color="infor"
          icon="tabler:trash"
          variant="text"
          :size-icon="20"
          @click="emit('delete', data)"
        />
      </VCol>
    </VRow>
  </Form>
</template>

<style lang="scss" scoped>
.anslevelMatrix{
  .action-item{
    cursor: pointer;
  }
}
</style>
