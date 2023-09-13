<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  isDelete: false,
  isBack: false,
  disabledBack: false,
  isApprove: false,
  isSendApprove: false,
  isFillter: true,
  isAdd: false,
  disabledDelete: false,
  disabledApprove: false,
  disabledFillter: false,
})

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'click', type: string): void
  (e: 'deleteMultiple'): void
  (e: 'addHandler'): void
  (e: 'back'): void
  (e: 'update:keyword', type: any): void
  (e: 'update:pageNumber', type: any): void
  (e: 'update:pageSize', type: any): void
  (e: 'update:showFilter', type: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const CmButton = defineAsyncComponent(
  () => import('@/components/common/CmButton.vue'),
)
const CmTextField = defineAsyncComponent(
  () => import('@/components/common/CmTextField.vue'),
)

/*
  isDelete: Hiện thị button delete
  disabledDelete:  Disable button delete
*/
interface Props {
  addButtonName?: string
  isDelete?: boolean
  isBack?: boolean
  isApprove?: boolean
  isSendApprove?: boolean
  isFillter?: boolean
  isAdd?: boolean
  disabledDelete?: boolean
  disabledApprove?: boolean
  disabledAdd?: boolean
  disabledBack?: boolean
  disabledFillter?: boolean
  disabledSendApprove?: boolean
  keyword?: string
  showFilter?: boolean
}

const isShowFilter = ref(props.showFilter)

function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      emit('update:showFilter', isShowFilter.value)
      break
    case 'delete':
      emit('deleteMultiple')
      break
    case 'addHandler':
      emit('addHandler')
      break
    case 'back':
      emit('back')
      break

    default:
      break
  }
  emit('click', type)
}
const keySearch = ref(props.keyword)
const handleSearch = window._.debounce((value: any) => {
  keySearch.value = value
  emit('update:keyword', value)
  emit('update:pageNumber', 1)
  emit('update:pageSize', 10)
}, 500)
watch(() => props.keyword, (val: string) => {
  keySearch.value = val
})
</script>

<template>
  <VRow class="mb-3 d-flex justify-space-between">
    <VCol
      cols="12"
      md="3"
      sm="4"
    >
      <div class="d-flex flex-wrap">
        <CmButton
          v-if="isDelete"
          size="40"
          color="error"
          class="mr-3"
          :disabled="disabledDelete"
          @click="handleClickBtn('delete')"
        >
          <VIcon icon="tabler:trash" />
        </CmButton>
        <CmButton
          v-if="isBack"
          :disabled="disabledBack"
          size="40"
          color="error"
          class="mr-3"
          @click="handleClickBtn('back')"
        >
          <VIcon icon="tabler:corner-down-left" />
        </CmButton>
        <CmButton
          v-if="isSendApprove"
          :disabled="disabledSendApprove"
          size="40"
          color="primary"
          @click="handleClickBtn('send-approve')"
        >
          <VIcon icon="tabler:send" />
        </CmButton>
        <CmButton
          v-if="isApprove"
          :disabled="disabledApprove"
          size="40"
          color="success"
          @click="handleClickBtn('approve')"
        >
          <VIcon icon="mdi-checkbox-marked-circle-outline" />
        </CmButton>
        <slot name="actionLeft" />
      </div>
    </VCol>
    <VSpacer />
    <VCol
      cols="12"
      md="7"
      sm="8"
    >
      <div class="d-flex justify-end align-center ">
        <CmButton
          v-if="isAdd"
          class="ml-3"
          :disabled="disabledAdd"
          color="primary"
          @click="handleClickBtn('addHandler')"
        >
          {{ addButtonName }}
        </CmButton>
        <CmTextField
          v-model="keySearch"
          class="header-action-field ml-3"
          placeholder="Tìm kiếm"
          prepend-inner-icon="tabler-search"
          @update:model-value="handleSearch"
        />
        <slot name="actionRight" />
        <CmButton
          v-if="isFillter"
          class="ml-3"
          :disabled="disabledFillter"
          bg-color="bg-white"
          color="white"
          text-color="color-dark"
          :size-icon="20"
          icon="ic:round-filter-list"
          :title="isShowFilter ? t('hide-filter') : t('show-filter')"
          @click="handleClickBtn('fillter')"
        />
        <slot name="actionEnd" />
      </div>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
@use "@/styles/variables/common/input.cm" as *;

.header-action {
  &-field {
    inline-size: $input-min-width;
    max-inline-size: $input-min-width;

    // min-inline-size: $input-min-width;
  }
}
</style>
