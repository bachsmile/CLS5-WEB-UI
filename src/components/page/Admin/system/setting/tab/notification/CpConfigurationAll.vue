<script lang="ts" setup>
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CmDropDown from '@/components/common/CmDropDown.vue'

const actionUpdate = []
</script>

<template>
  <VRow>
    <VCol cols="9">
      <div class="mt-6">
        <span class="text-medium-sm">Loại thông báo</span>
        <VRow class="mt-4">
          <VCol
            lg="3"
            cols="6"
          >
            <CmCheckBox label="Gửi email" />
          </VCol>
          <VCol
            lg="3"
            cols="6"
          >
            <CmCheckBox label="Thông báo hệ thống" />
          </VCol>
          <VCol
            lg="3"
            cols="6"
          >
            <CmCheckBox label="Thông báo app mobile" />
          </VCol>
        </VRow>
      </div>
    </VCol>
    <VCol cols="3">
      <div class="d-flex align-center w-100 h-100">
        <CmButton
          variant="tonal"
          title="Mặc định"
        />
      </div>
    </VCol>
  </VRow>
  <div class="d-flex">
    <div class="w-75">
      <CmTextField text="Nội dung thông báo" />
    </div>
    <div
      class="w-25 d-flex align-end ml-2"
      style="height: inherit;"
    >
      <CmDropDown
        title="Update"
        color="primary"
        class="mb-1"
        :list-item="actionUpdate"
        :type="2"
        icon="tabler:chevron-down"
      />
    </div>
  </div>
</template>
