<script lang="ts" setup>
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'

import CmSelect from '@/components/common/CmSelect.vue'
import { useStoreAddCourse } from '@/stores/admin/group-user/modalEditGroupUser'
import CpSearch from '@/components/page/gereral/CpSearch.vue'
import { comboboxStore } from '@/stores/combobox'

// Khởi tạo
const props = withDefaults(defineProps<Props>(), ({}))
const emit = defineEmits<Emit>()
const { t } = window.i18n()
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))

interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'update:dataCourse', data: any): void
}
interface Props {
  isShow: boolean
  title: string
}

// Ẩn modal cập nhật lên v-model
const hidden = (val: any) => {
  emit('update:isShow', false)
}

// Lấy dữ liệu bảng
const headers = [
  { text: '', value: 'checkbox' },
  { text: t('common.course-name'), value: 'name', type: 'custom' },
  { text: t('common.topic'), value: 'email' },
]
const store = useStoreAddCourse()
const { listCourse, totalRecord, queryParams } = storeToRefs(store)
const { fetchData, handleAddCourse, getUsersByStruce } = store
if (!listCourse.value.length)
  fetchData()

watch(queryParams.value, () => {
  fetchData()
})

// filter Dữ liệu
const filter = () => {
  store.queryParams.pageNumber = 1
}

// Combobox chủ đề
const combobox = comboboxStore()
const { listTopicCourseCombobox } = storeToRefs(combobox)
const { getlistTopicCourseCombobox } = combobox
getlistTopicCourseCombobox()

const confirm = async () => {
  const status = await handleAddCourse()
  emit('update:isShow', status)
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isShow"
    :title="title"
    size="xl"
    @cancel="hidden"
    @confirm="confirm"
    @show="getUsersByStruce"
  >
    <div class="d-flex justify-start">
      <CmSelect
        v-model:model-value="queryParams.topicCourseId"
        style="width: 400px;"
        :items="listTopicCourseCombobox"
        custom-key="value"
        item-value="key"
        @update:model-value="filter"
      />
    </div>
    <div class="d-flex justify-end my-6 ">
      <CpSearch
        v-model:key-search="queryParams.keyword"
        @update:key-search="filter"
      />
    </div>
    <CmTable
      v-model:page-number="store.queryParams.pageNumber"
      v-model:selected="store.dataCourse.courseModel"
      :headers="headers"
      :total-record="totalRecord"
      :items="listCourse"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'name'">
          <CpCustomInfo
            v-if="context"
            :context="context"
            :is-show-email="false"
            :is-full-name="false"
          />
        </div>
      </template>
    </CmTable>
  </CmDialogs>
</template>

