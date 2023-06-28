<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'
import MethodsUtil from '@/utils/MethodsUtil'
import UserService from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

const props = withDefaults(defineProps<Props>(), ({
  dataFilter: null,
}))
const emit = defineEmits<Emit>()
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmSelectTree = defineAsyncComponent(() => import('@/components/common/CmSelectTree.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const storeCombobox = comboboxStore()
const { topicCombobox } = storeToRefs(storeCombobox)
const { getComboboxTypeContent, getComboboxTopic } = storeCombobox

interface Props {
  dataFilter: any
}
const comboboxContent = ref([])
const comboboxAuthor = ref([])

const LABEL = Object.freeze({
  FILLTER1: t('choose-topic'),
  FILLTER2: t('content-type'),
  FILLTER3: t('filter-course'),
  FILLTER4: t('is-display-home'),
  FILLTER5: t('course-status'),
  FILLTER6: t('own-course'),
  FILLTER7: t('start-day'),
  FILLTER8: t('to-day'),
})

let formFilter = reactive({
  listTopic: [],
  authorId: null,
  topicId: null,
  archiveTypeId: 1,
  fromDate: '',
  toDate: '',
  pageSize: 10,
  pageNumber: 1,
  searchData: '',
  role: 1,
})
const vSelectOwner = ref<any>({
  listCombobox: [],
  totalRecord: 0,
  pageNumber: 1,
  pageSize: 30,
  search: '',
  excludeList: [],
  itemSelected: {} as any,
})

// method
async function isIntersecting() {
  vSelectOwner.value.pageNumber += 1
  getComboboxAuthorContent(true)
}
async function getComboboxAuthorContent(loadMore?: any) {
  // loadMore dùng khi infinity scroll
  const params = {
    pageSize: vSelectOwner.value.pageSize,
    pageNumber: vSelectOwner.value.pageNumber,
    keyword: vSelectOwner.value.search,
    excludeIds: vSelectOwner.value.excludeList,
  }
  await MethodsUtil.requestApiCustom(UserService.PostGetAuthorContent, TYPE_REQUEST.POST, params).then((value: any) => {
    if (value?.data?.pageLists.length) {
      vSelectOwner.value.totalRecord = value.data.totalRecord

      if (loadMore)
        vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.concat(value.data.pageLists)

      else
        vSelectOwner.value.listCombobox = value.data.pageLists
      vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.map((itemValue: any) => ({
        ...itemValue,
        name: `${itemValue.lastName} ${itemValue.firstName}`,
      }))
      if (vSelectOwner.value.itemSelected?.id && !loadMore) {
        const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item.id === vSelectOwner.value.itemSelected.id)
        if (indexOwner === -1) {
          vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value.itemSelected)
          vSelectOwner.value.excludeList = [vSelectOwner.value.itemSelected.id]
        }
      }
    }
    else {
      vSelectOwner.value.listCombobox = []
      vSelectOwner.value.totalRecord = 0
    }
  })
}
function change() {
  emit('update', formFilter)
}

onMounted(() => {
  if (topicCombobox.value)
    getComboboxTopic(2)
  getComboboxAuthorContent()
  getComboboxTypeContent().then((value: any) => {
    comboboxContent.value = value.data
  })
})

// created
onUnmounted(() => {
  topicCombobox.value = []
})
watch(() => props.dataFilter, val => {
  formFilter = {
    ...formFilter,
    ...val,
  }
}, { deep: true, immediate: true })
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelectTree
        v-model:model-value="formFilter.topicId"
        value-format="id"
        :text="LABEL.FILLTER1"
        :options="topicCombobox"
        :normalizer-custom-type="['id', 'name', 'children']"
        :placeholder="LABEL.FILLTER1"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.archiveTypeId"
        :items="comboboxContent"
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.authorId"
        :text="LABEL.FILLTER6"
        :placeholder="LABEL.FILLTER6"
        :items="vSelectOwner.listCombobox"
        is-infinity-scroll
        :total-record="vSelectOwner.totalRecord"
        item-value="id"
        custom-key="name"
        :append-to-body="false"
        @isIntersecting="isIntersecting"
        @update:model-value="change"
      >
        <template #infinityItem>
          <SkUser
            :number="2"
          />
        </template>
      </CmSelect>
    </VCol>
    <VCol
      cols="12"
      md="2"
      sm="4"
    >
      <CmDateTimePicker
        :model-value="formFilter.fromDate"
        :text="LABEL.FILLTER7"
        placeholder="dd/mm/yyyy"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="2"
      sm="4"
    >
      <CmDateTimePicker
        :model-value="formFilter.toDate"
        :text="LABEL.FILLTER8"
        placeholder="dd/mm/yyyy"
        @update:model-value="change"
      />
    </VCol>
  </VRow>
</template>
