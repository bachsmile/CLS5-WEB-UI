<script lang="ts" setup>
import CpOrganizationSelect from '@/components/page/gereral/CpOrganizationSelect.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import CpSearch from '@/components/page/gereral/CpSearch.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'

interface Props {
  keyword: string
  titles: string[] | null
  excludeIds: number[] | null
  categoryTitleId: number[] | null
  groupId: number[] | null
  organizationalStructureId: number[] | null
  isCourse: boolean
  isTraining: boolean
  listGroupUser?: any[]
  listCategoryTitle?: any[]
  listTitle?: any[]
}
// Khởi tạo biến đa ngôn ngữ
const props = withDefaults(defineProps<Props>(), ({})) ;const emit = defineEmits<Emit>() ;const { t } = window.i18n()const LABEL = Object.freeze({
  TITLE_MODAL: 'Danh sách nhóm người dùng',
  FILLTER1: t('orgStruct'),
  FILLTER2: 'Nhóm người dùng',
  FILLTER3: 'Danh mục chức danh',
  FILLTER4: 'Vị trí chức danh',
})

interface Emit {
  (e: 'update:organizationalStructureId', data: any): void
  (e: 'update:keyword', data: any): void
  (e: 'update:titles', data: any): void
  (e: 'update:excludeIds', data: any): void
  (e: 'update:categoryTitleId', data: any): void
  (e: 'update:groupId', data: any): void
  (e: 'update:isCourse', data: any): void
  (e: 'update:isTraining', data: any): void
  (e: 'update:pageNumber', data: any): void
}

const isShowFilter = ref<boolean>(false)
</script>

<template>
  <div class="mb-6">
    <div class="my-6">
      <h3>{{ LABEL.TITLE_MODAL }}</h3>
    </div>
    <div>
      <VRow>
        <VCol>
          <span>Tự động gán người dùng vào nội dung</span>
          <VRow class="ma-1">
            <CmCheckBox
              :model-value="isCourse"
              class="mr-2"
              @update:model-value="($event) => {
                emit('update:isCourse', $event)
              }"
            >
              Khóa học
            </CmCheckBox>
            <CmCheckBox
              class="mr-2"
              :model-value="isTraining"
              @update:model-value="($event) => {
                emit('update:isTraining', $event)
              }"
            >
              Lộ trình
            </CmCheckBox>
          </VRow>
        </VCol>
      </VRow>
    </div>
    <VRow class="flex-wrap">
      <VCol
        cols="6"
      >
        <CpOrganizationSelect
          :model-value="organizationalStructureId"
          multiple
          :text="LABEL.FILLTER1"
          :placeholder="LABEL.FILLTER1"
          @update:modelValue="($event) => {
            emit('update:organizationalStructureId', $event)
            emit('update:pageNumber', 1)
          }"
        />
      </VCol>
      <VCol
        cols="6"
      >
        <CmSelect
          :model-value="groupId"
          :items="listGroupUser"
          multiple
          item-value="id"
          custom-key="name"
          :text="LABEL.FILLTER2"
          :placeholder="LABEL.FILLTER2"
          @update:model-value="($event) => {
            emit('update:groupId', $event)
            emit('update:pageNumber', 1)
          }"
        />
      </VCol>
      <VCol
        cols="6"
      >
        <CmSelect
          :model-value="categoryTitleId"
          :items="props.listCategoryTitle"
          multiple
          item-value="key"
          custom-key="value"
          :text="LABEL.FILLTER3"
          :placeholder="LABEL.FILLTER3"
          @update:model-value="($event) => {
            emit('update:categoryTitleId', $event)
            emit('update:pageNumber', 1)
          }"
        />
      </VCol>
      <VCol
        cols="6"
      >
        <CmSelect
          :model-value="titles"
          :items="listTitle"
          multiple
          item-value="key"
          custom-key="value"
          :text="LABEL.FILLTER4"
          :placeholder="LABEL.FILLTER4"
          @update:model-value="($event) => {
            emit('update:titles', $event)
            emit('update:pageNumber', 1)
          }"
        />
      </VCol>
    </VRow>
    <VRow class="justify-end ma-4 mr-0">
      <div>
        <CpSearch
          :key-search="keyword"
          @update:key-search="($event) => {
            emit('update:keyword', $event)
            emit('update:pageNumber', 1)
          }"
        />
        <!--
          <CmButton
          class="ml-3"
          variant="outlined"
          bg-color="bg-white"
          color="color-dark-300"
          text-color="color-dark"
          @click="handleClickBtn('fillter')"
          >
          {{ isShowFilter ? t('hide-filter') : t('show-filter') }}
          </CmButton>
        -->
      </div>
    </VRow>
  </div>
</template>

