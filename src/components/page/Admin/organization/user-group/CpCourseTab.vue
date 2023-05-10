<script lang="ts" setup>
import CpHeaderAction from './CpHeaderAction.vue'
import DateUtil from '@/utils/DateUtil'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'

import { useCourseGroupStore } from '@/stores/admin/group-user/cpCourse'

const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpMdAddCourse = defineAsyncComponent(() => import('./Modal/CpMdAddCourse.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

const { t } = window.i18n()

const TITLE = Object.freeze({
  BUTTON_EXCEL: t('export-excel'),
  TITLE_PAGE: t('Danh sách khóa học'),
  BUTTON_ADD: t('Add'),
  BUTTON_MOVE: t('Chuyển nhóm'),
  BUTTON_DELETE: t('Xóa khóa học'),
  MESSAGE_DELETE: t('courses.course.confirm-delete'),
})

// Danh sách người dùng
const headers = [
  { text: '', value: 'checkbox', with: 50 },
  { text: t('user-name'), value: 'name', type: 'custom' },
  { text: t('title'), value: 'titleName' },
  { text: '', value: 'actions', width: 150 },
]

// Cài đặt show custom info
const isShowInfo = {
  isShowEmail: false,
  isShowAvatar: false,
  isFullName: false,
  labelCode: 'code',
}

const store = useCourseGroupStore()
const { listUserInGroup, totalRecord, queryParams, dataCourse } = storeToRefs<any>(store)
const { deleteItem, getListCourse } = store

// Tìm kiếm người dùng
const handleSearch = (val: string) => {
  store.queryParams.search = val
  store.queryParams.pageNumber = 1
}
watch(queryParams.value, val => {
  getListCourse()
})

const isShow = ref(false)
const showModalAdd = () => {
  isShow.value = true
}

// Xử lý xóa khóa học
const isShowModalDelete = ref<boolean>(false)
const showModalConfirmDelete = (val: any) => {
  isShowModalDelete.value = true
  if (val)
    dataCourse.value.courseModel = [val.id]
}

const deleteCourse = (val: boolean) => {
  if (val)
    deleteItem()
}
</script>

<template>
  <CpHeaderAction
    :button-prepend="TITLE.BUTTON_EXCEL"
    :title-page="TITLE.TITLE_PAGE"
    :button-add="TITLE.BUTTON_ADD"
    :is-show-add-group="false"
    :is-show-move="false"
    @update:key-search="handleSearch"
    @click-add="showModalAdd"
    @click-delete="showModalConfirmDelete(null)"
  />
  <CmTable

    v-model:page-number="store.queryParams.pageNumber"
    v-model:selected="store.dataCourse.courseModel"
    :headers="headers"
    :items="listUserInGroup"
    :total-record="totalRecord"
  >
    <template #rowItem="{ col, context }">
      <div v-if="col === 'name'">
        <CpCustomInfo
          v-bind="isShowInfo"
          :context="context"
        />
      </div>
      <span v-if="col === 'topic'">
        <span>{{ DateUtil.formatDateToDDMM(context.registerDate) }}</span>
      </span>
    </template>
    <template #actions="{ data }">
      <div>
        <VIcon
          icon="fe:trash"
          :size="18"
          class="align-middle color-error ml-2"
          @click="showModalConfirmDelete(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ TITLE.BUTTON_DELETE }}
        </VTooltip>
      </div>
    </template>
  </CmTable>

  <CpMdAddCourse
    v-model:is-show="isShow"
    title="Danh sách khóa học"
  />
  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalDelete"
    :confirmation-msg="TITLE.MESSAGE_DELETE"
    :type="2"
    @confirm="deleteCourse"
  />
</template>

