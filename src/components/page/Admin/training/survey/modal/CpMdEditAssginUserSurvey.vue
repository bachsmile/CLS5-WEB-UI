<script lang="ts" setup>
import CpFilterAssignUserSurvey from '../edit/survey-topic/CpFilterAssignUserSurvey.vue'
import CmDialogs from '@/components/common/CmDialogs.vue'
import type { Any } from '@/typescript/interface'
import CmTable from '@/components/common/CmTable.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'

// Khởi tạo
const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',

}))

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'ok', value: any): void
  (e: 'edit', value: any): void
  (e: 'update:isShow', value: any): void
}
interface Props {
  isShow: boolean
  title: string
  dataDetail: Any
}

function cancelModal() {
  emit('update:isShow', false)
}

const dataInput = ref<Any>({})
function confirmModal() {
  if (dataInput.value.id)
    emit('edit', dataInput.value)
  else
    emit('ok', dataInput.value)
  emit('update:isShow', false)
}
function resetData() {
  dataInput.value = {
    id: '',
    name: '',
    description: '',
  }
}
const isShowFilter = ref(true)
const { t } = window.i18n()
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-candidates'), value: 'name' },
  { text: t('email'), value: 'email' },
]
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    :sub-title="title"
    @cancel="cancelModal"
    @confirm="confirmModal"
    @hide="resetData"
  >
    <CmCollapse :is-show="isShowFilter">
      <CpFilterAssignUserSurvey />
    </CmCollapse>
    <CpHeaderAction v-model:show-filter="isShowFilter" />
    <div>
      <CmTable
        :headers="headers"
        return-object
      />
    </div>
  </CmDialogs>
</template>
