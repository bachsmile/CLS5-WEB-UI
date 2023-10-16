<script lang="ts" setup>
import CmSelectVue from '@/components/common/CmSelect.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import type { Any } from '@/typescript/interface'
import CmButton from '@/components/common/CmButton.vue'

const props = withDefaults(defineProps<Props>(), {
  isShowAdd: true,
  isShowReplication: true,
  isShowDelete: true,
  isNumberQuestion: true,
  idx: null,
})
const emit = defineEmits<Emit>()
const { t } = window.i18n()

interface Props {
  idx?: number | null
  content?: Any
  isShowAdd?: boolean
  isShowReplication?: boolean
  isShowDelete?: boolean
  isNumberQuestion?: boolean
  topicId?: number
  typeId?: number
  levelId?: number
  IsGroup?: number
  totalPoint?: number
  quantity?: number
  selectedQuantity?: number
  isEdited?: boolean
  comboboxDefault?: Any
}

const combobox = ref<Any>({})
watch(() => props.comboboxDefault, val => {
  if (val)
    combobox.value = window._.cloneDeep(val)
}, { immediate: true })
interface Emit {
  (e: 'add', idx: number | null): void
  (e: 'replication', idx: number | null): void
  (e: 'delete', idx: number | null): void
  (e: 'update:isEdited', value: boolean): void
  (e: string, value: any): void
}

function updateData(name: string, value: any) {
  emit(`update:${name}`, value)
  emit('update:isEdited', true)
}
</script>

<template>
  <div
    class="page-container-box mt-n1"
    style="background-color: white;"
  >
    <VRow>
      <VCol
        cols="12"
        lg="6"
      >
        <CmSelectVue
          :text="t('topic')"
          :model-value="topicId"
          @update:model-value="updateData('topicId', $event)"
        />
        <CmSelectVue
          :text="t('question-type')"
          :model-value="typeId"
          @update:model-value="updateData('typeId', $event)"
        />
      </VCol>
      <VCol
        cols="12"
        lg="3"
      >
        <CmSelectVue
          :text="t('question-format')"
          :model-value="IsGroup"
          @update:model-value="updateData('IsGroup', $event)"
        />
        <CmSelectVue
          :text="t('level')"
          :model-value="levelId"
          @update:model-value="updateData('levelId', $event)"
        />
      </VCol>
      <VCol
        cols="12"
        lg="3"
      >
        <CmTextField
          :text="t('number-question')"
          :model-value="quantity"
          @update:model-value="updateData('quantity', $event)"
        />
        <VRow>
          <VCol>
            <CmTextField

              :text="t('total-point')"
              :model-value="totalPoint"
              @update:model-value="updateData('totalPoint', $event)"
            />
          </VCol>
          <VCol
            v-if="isNumberQuestion"
          >
            <CmTextField
              :data-old="selectedQuantity"
              :text="t('number-question')"
              :model-value="selectedQuantity"
              @update:model-value="updateData('selectedQuantity', $event)"
            />
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>
  <div class="actions-items d-flex align-center my-3">
    <CmButton
      v-if="props.isShowAdd"
      variant="text"
      icon="material-symbols:add"
      :title="t('add-test-survey')"
      @click="emit('add', idx)"
    />
    <CmButton
      v-if="props.isShowReplication"
      variant="text"
      icon="material-symbols:content-paste-rounded"
      color="success"
      :title="t('replication')"
      @click="emit('replication', idx)"
    />
    <CmButton
      v-if="props.isShowDelete"
      variant="text"
      icon="fe:trash"
      color="error"
      :title="t('QuestionService.ActionDelete')"
      @click="emit('delete', idx)"
    />
  </div>
</template>
