<script setup lang="ts">
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), ({
  topicId: null,
  isGroup: false,
  isEdit: false,
  isView: false,
  isObligatory: false,
  levelId: null,
}))
const emit = defineEmits<Emit>()
interface Props {
  topicId?: any
  isGroup?: any
  levelId?: any
  isEdit?: boolean
  isView?: boolean
  isShuffle?: boolean
  isObligatory?: boolean
}
interface Emit {
  (e: 'update:topicId', value: any): void
  (e: 'update:isGroup', value: any): void
  (e: 'update:isAutoApprove', value: any): void
  (e: 'update:isObligatory', value: any): void
  (e: 'update:levelId', value: any): void
  (e: 'update:isShuffle', value: any): void
  (e: 'update:data', value: any): void

}
const { t } = window.i18n()
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const schema = yup.object({
  topicId: schemaOption.defaultSelectSingle,
})
const myFormSettingQs = ref()
const isSubmit = computed(() => {
  return myFormSettingQs.value.validate
})

const questionTypes = [
  {
    value: t('QuestionService.QuestionSingleChoice'),
    key: 1,
  },
  {
    value: t('QuestionService.QuestionMultipleChoice'),
    key: 2,
  },
  {
    value: t('QuestionService.QuestionUnderlined'),
    key: 3,
  },
  {
    value: t('QuestionService.QuestionChooseTrueFalse'),
    key: 4,
  },
  {
    value: t('QuestionService.QuestionClauseTrueFalse'),
    key: 5,
  },
  {
    value: t('QuestionService.QuestionFillInTheGap'),
    key: 6,
  },
  {
    value: t('QuestionService.QuestionFillInTheGap2'),
    key: 7,
  },
  {
    value: t('QuestionService.QuestionPairing'),
    key: 8,
  },
  {
    value: t('QuestionService.QuestionEssay'),
    key: 9,
  },
]
const dataInput = ref<any>({
  topicId: null,
  questionTypeId: null,
  isGroup: false,
  isShuffle: false,
})
const optionTypeQuestion = ref([
  {
    label: t('single-question'),
    value: false,
  },
  {
    label: t('cluster-question'),
    value: true,
  },
])
const questionlevel = ref<Any>([])
const isAutoApprove = ref()

// cấp độ câu hỏi
function getComboboxQuestionLevel() {
  if (window._.isEmpty(questionlevel.value)) {
    MethodsUtil.requestApiCustom(QuestionService.GetComboboxQuestionLevel, TYPE_REQUEST.GET).then(({ data }: { data: Any[] }) => {
      questionlevel.value = data
    })
  }
}
function changeValue(key: string, value: any) {
  dataInput.value[key] = value
  emit('update:data', dataInput.value)

  switch (key) {
    case 'topicId':
      emit('update:topicId', value)
      break
    case 'isGroup':
      emit('update:isGroup', value)
      break
    case 'isAutoApprove':
      emit('update:isAutoApprove', value)
      break
    case 'isObligatory':
      emit('update:isObligatory', value)
      break
    case 'levelId':
      emit('update:levelId', value)
      break
    case 'isShuffle':
      emit('update:isShuffle', value)
      break

    default:
      break
  }
}

onMounted(() => {
  if (props.isEdit)
    getComboboxQuestionLevel()

  isAutoApprove.value = MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true
  emit('update:isAutoApprove', isAutoApprove.value)
})

defineExpose({
  isSubmit,
})
</script>

<template>
  <Form
    ref="myFormSettingQs"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VRow>
      <VCol
        cols="12"
        md="6"
        sm="6"
      >
        <Field
          v-slot="{ field, errors }"
          :model-value="topicId"
          name="topicId"
          type="number"
        >
          <CpTopicSelect
            :field="field"
            :errors="errors"
            :disabled="isView"
            :model-value="topicId"
            :type="4"
            :text="`${t('topic')}*`"
            :placeholder="t('topic')"
            @update:model-value="($value) => changeValue('topicId', $value)"
          />
        </Field>
      </VCol>
      <VCol
        cols="12"
        md="6"
        sm="6"
        class="d-flex setting-default relative "
      >
        <div class="mr-6">
          <CmCheckBox
            :disabled="isView"
            :label="t('requrie-anwser')"
            :model-value="isObligatory"
            @update:model-value="($value) => changeValue('isObligatory', $value)"
          />
        </div>
        <div>
          <CmCheckBox
            :disabled="isView"
            :label="t('auto-send-approve')"
            :model-value="isAutoApprove"
            @update:model-value="($value) => changeValue('isAutoApprove', $value)"
          />
        </div>
      </VCol>
    </VRow>
  </Form>
</template>

<style lang="scss" scoped>
.setting-default{
  padding-top: 50px !important;
}
</style>
