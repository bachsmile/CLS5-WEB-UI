<script setup lang="ts">
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import { validatorStore } from '@/stores/validatator'
import CmButton from '@/components/common/CmButton.vue'

interface Props {
  data: any
  ansId: any
  isTrue: any
  isView: boolean
  isShuffleLeft?: boolean
  isShuffleRight?: boolean
  position?: number
  contentLeft?: string
  contentRight?: string
  disabledDel?: boolean
  placeholder?: string
}
const props = withDefaults(defineProps<Props>(), ({
  isTrue: null,
  isShuffleLeft: false,
  isShuffleRight: false,
  isView: false,
  contentLeft: '',
  contentRight: '',
  position: 0,
  disabledDel: false,
  data: () => ({
    left: null,
    right: {
      content: '',
      isTrue: false,
      position: null,
      isShuffle: false,
      urlFile: null,
    },
  }),

}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:isTrue', value: any): void
  (e: 'update:content', type: boolean, position: number, value: any): void /// true là phải false là trái
  (e: 'update:isShuffleLeft', value: any): void
  (e: 'update:isShuffleRight', value: any): void
  (e: 'update:positionLeft', value: any): void
  (e: 'update:positionRight', value: any): void
  (e: 'delete', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const schema = computed(() => ({
  contentRight: schemaOption.defaultStringArea,
  ...(props?.data?.left ? ({ contentLeft: schemaOption.defaultStringArea }) : {}),
}))

const answerData = ref(props.data)
const listMenu = ref({
  left: [
    {
      title: 'shuffled-question',
      icon: 'tabler:arrows-cross',
      actived: false,
    },
  ],
  right: [
    {
      title: 'shuffled-question',
      icon: 'tabler:arrows-cross',
      actived: false,
    },
  ],
})

function actionItemDelete() {
  emit('delete', props.data)
}
function changeValue(val: any) {
  answerData.value.isTrue = val === answerData.value.position

  emit('update:isTrue', val)
}
function eventToolShuffle(type: boolean, val: any) {
  listMenu.value[type ? 'right' : 'left'][0].actived = !listMenu.value[type ? 'right' : 'left'][0].actived

  if (type)
    emit('update:isShuffleRight', listMenu.value?.right[0].actived)
  else
    emit('update:isShuffleLeft', listMenu.value?.left[0].actived)
}
function handleChangeContent(type: boolean, val: any) {
  emit('update:content', type, props.position, val)
}

const getIndex = computed(() => `${String.fromCharCode(65 + props.position - 1)}.`)

const myFormAnsItem = ref()
const isSubmit = computed(() => {
  return myFormAnsItem.value.validate
})
defineExpose({
  isSubmit,
})
watch(() => props.position, val => {
  emit('update:positionRight', val)
}, { deep: true, immediate: true })
watch(() => props.isShuffleLeft, val => {
  listMenu.value.left[0].actived = val
}, { deep: true, immediate: true })
watch(() => props.isShuffleRight, val => {
  listMenu.value.right[0].actived = val
}, { deep: true, immediate: true })
</script>

<template>
  <Form
    ref="myFormAnsItem"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VRow>
      <VCol
        cols="6"
        class="d-flex align-center"
      >
        <Field
          v-slot="{ field, errors }"
          :model-value="contentLeft"
          name="contentLeft"
          type="string"
        >
          <span class="px-3">
            {{ getIndex }}
          </span>
          <CmInputEditor
            v-if="data.left"
            class="w-100"
            :field="field"
            :errors="errors"
            :disabled="isView"
            :list-menu="listMenu.left"
            rlt="end"
            is-menu-simple
            min-height="50px"
            width="100%"
            :placeholder="placeholder"
            :model-value="contentLeft"
            @update:event="($event) => eventToolShuffle(false, $event)"
            @update:modelValue="($value: any) => handleChangeContent(false, $value)"
          />
        </Field>
      </VCol>
      <VCol
        cols="6"
        class="d-flex align-center"
      >
        <Field
          v-slot="{ field, errors }"
          :model-value="contentRight"
          name="contentRight"
          type="string"
        >
          <CmInputEditor
            class="w-100"
            :field="field"
            :errors="errors"
            :disabled="isView"
            :list-menu="listMenu.right"
            rlt="end"
            is-menu-simple
            min-height="50px"
            width="100%"
            :placeholder="placeholder"
            :model-value="contentRight"
            @update:event="($event) => eventToolShuffle(true, $event)"
            @update:modelValue="($value: any) => handleChangeContent(true, $value)"
          />
        </Field>
        <CmButton
          :disabled="disabledDel"
          color="infor"
          is-rounded
          icon="fe:trash"
          class="pa-2 ml-3"
          :size-icon="20"
          variant="text"
          @click="actionItemDelete"
        />
      </VCol>
    </VRow>
  </Form>
</template>
