<script lang="ts" setup>
import CmSelectVue from '@/components/common/CmSelect.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import type { Any } from '@/typescript/interface'
import CmButton from '@/components/common/CmButton.vue'

const props = withDefaults(defineProps<Props>(), {
  isShowAdd: true,
  isShowReplication: true,
  isShowDelete: true,
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
}
interface Emit {
  (e: 'add', idx: number | null): void
  (e: 'replication', idx: number | null): void
  (e: 'delete', idx: number | null): void
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
        <CmSelectVue :text="t('topic')" />
      </VCol>
      <VCol
        cols="12"
        lg="4"
      >
        <CmSelectVue :text="t('question-type')" />
      </VCol>
      <VCol
        cols="12"
        lg="2"
      >
        <CmTextField :text="t('number-question')" />
      </VCol>
    </VRow>
  </div>
  <div class="actions-items d-flex align-center mt-1">
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
