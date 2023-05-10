<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({
  isDelete: false,
  disabledDelete: false,
  isBack: false,
  disabledBack: false,
  isApprove: false,
  disabledApprove: false,
  isFillter: true,
  isAdd: false,
  disabledFillter: false,
}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'click', type: string): void
  (e: 'deleteMultiple'): void
  (e: 'addHandler'): void
  (e: 'search', type: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

/*
  isDelete: Hiện thị button delete
  disabledDelete:  Disable button delete
*/
interface Props {
  isDelete?: boolean
  disabledDelete?: boolean
  isBack?: boolean
  disabledBack?: boolean
  isApprove?: boolean
  disabledApprove?: boolean
  isFillter?: boolean
  isAdd?: boolean
  addButtonName?: string
  disabledFillter?: boolean
}

const isShowFilter = ref(props.isFillter)

const handleClickBtn = (type: string) => {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'delete':
      emit('deleteMultiple')
      break
    case 'addHandler':
      emit('addHandler')
      break

    default:
      break
  }

  emit('click', type)
}

const handleSearch = (value: any) => {
  emit('search', value)
}
</script>

<template>
  <VRow class="mb-3 d-flex justify-space-between">
    <VCol
      cols="12"
      md="3"
      sm="4"
    >
      <div>
        <CmButton
          v-if="isDelete"
          size="40"
          color="error"
          class="mr-3"
          :disabled="disabledDelete"
          @click="handleClickBtn('delete')"
        >
          <VIcon
            icon="tabler:trash"
          />
        </CmButton>
        <CmButton
          v-if="isBack"
          :disabled="disabledBack"
          size="40"
          color="error"
          class="mr-3"
          @click="handleClickBtn('back')"
        >
          <VIcon
            icon="tabler:corner-down-left"
          />
        </CmButton>
        <CmButton
          v-if="isApprove"
          :disabled="disabledApprove"
          size="40"
          color="success"
          @click="handleClickBtn('approve')"
        >
          <VIcon
            icon="mdi-checkbox-marked-circle-outline"
          />
        </CmButton>
      </div>
    </VCol>
    <VSpacer />
    <VCol
      cols="12"
      md="7"
      sm="8"
    >
      <VRow>
        <VCol class="d-flex justify-end pr-0">
          <CmButton
            v-if="isAdd"
            class="ml-3"
            color="primary"
            @click="handleClickBtn('addHandler')"
          >
            {{ addButtonName }}
          </CmButton>
          <CmTextField
            label="Tìm kiếm"
            class="header-action-field ml-3"
            placeholder="Tìm kiếm"
            prepend-inner-icon="tabler-search"
            @update:model-value="handleSearch"
          />
          <CmButton
            v-if="isFillter"
            class="ml-3"
            :disabled="disabledFillter"
            variant="outlined"
            bg-color="bg-white"
            color="color-dark-300"
            text-color="color-dark"
            @click="handleClickBtn('fillter')"
          >
            {{ isShowFilter ? t('hide-filter') : t('show-filter') }}
          </CmButton>
        </VCol>
      </VRow>
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
