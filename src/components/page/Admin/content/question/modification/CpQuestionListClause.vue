<script setup lang="ts">
import CmTable from '@/components/common/CmTable.vue'
import { QuestionType } from '@/constant/data/questionType.json'
import CmButton from '@/components/common/CmButton.vue'
import CmRadio from '@/components/common/CmRadio.vue'

const props = withDefaults(defineProps<Props>(), ({
  items: () => ([]),
  selectedCurrent: 0,
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'addQuestion'): void
  (e: 'update:selectedCurrent', value: any): void
}
interface Props {
  items: Array<any>[]
  selectedCurrent: any
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const headers = [
  // { text: '', value: 'checkbox', width: 50 },
  { text: '', value: 'check', type: 'custom', width: 50 },
  { text: t('question'), value: 'name', type: 'custom' },
  { text: t('question-type'), value: 'type', type: 'custom' },
  { text: '', value: 'actions', width: 50 },
]
function handleAddQuestion() {
  emit('addQuestion')
}
function handleChangeSelect(value: any) {
  emit('update:selectedCurrent', value)
}
</script>

<template>
  <div>
    <CmTable
      :headers="headers"
      :items="items"
      is-action-footer
      disiable-pagination
      custom-id="originIndex"
      is-local-table
    >
      <template #action-footer>
        <div>
          <CmButton
            variant="text"
            @click="handleAddQuestion"
          >
            <VIcon icon="tabler:plus" />
            {{ t('add-question') }}
          </CmButton>
        </div>
      </template>
      <template #rowItem="{ col, context }">
        <div v-if="col === 'check'">
          <CmRadio
            :model-value="selectedCurrent"
            name="clauseTF"
            :value="context.originIndex"
            @update:model-value="handleChangeSelect"
          />
        </div>
        <div
          v-if="col === 'name'"
          v-html="context.basic"
        />
        <div v-if="col === 'type'">
          <div>{{ t((QuestionType as any)[context?.typeId.toString()]) }}</div>
        </div>
      </template>
    </CmTable>
  </div>
</template>
