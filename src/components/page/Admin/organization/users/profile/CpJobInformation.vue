<script setup lang="ts">
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

// component
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmTextArea = defineAsyncComponent(() => import('@/components/common/CmTextArea.vue'))

// store
const storeProfileUserManager = profileUserManagerStore()
const storeCombobox = comboboxStore()
const storeValidate = validatorStore()
const { Field, Form } = storeValidate
const { values } = storeToRefs(storeProfileUserManager)
const { userLevels } = storeToRefs(storeCombobox)
const { fetchUserLevels } = storeCombobox

// data
const LABEL = Object.freeze({
  TEXT_LEVEL: t('level'),
  PLACEHOLDER_LEVEL: t('level'),
})

// method
if (window._.isEmpty(userLevels.value))
  fetchUserLevels()
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol
        cols="12"
        md="4"
        class="mb-1"
      >
        <!-- Nơi công tác -->

        <Field
          v-if="values"
          v-slot="{ field, errors }"
          v-model="values.workplace"
          name="workplace"
        >
          <CmTextField
            :field="field"
            :model-value="values.workplace"
            :errors="errors"
            :text="t('workplace')"
            :placeholder="t('enter-workplace')"
          />
        </Field>
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="mb-1"
      >
        <!-- Trình độ -->

        <Field
          v-slot="{ field }"
          v-model="values.levelId"
          name="levelId"
        >
          <CmSelect
            :field="field"
            :model-value="values.levelId"
            :text="LABEL.TEXT_LEVEL"
            :placeholder="LABEL.PLACEHOLDER_LEVEL"
            :items="userLevels"
            item-value="key"
            custom-key="value"
          />
        </Field>
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="mb-1"
      >
        <!-- Ngày nhận việc -->
        <Field
          v-slot="{ field }"
          v-model="values.employmentDate"
          name="employmentDate"
        >
          <div class="mb-1">
            <label class="text-label-default ">{{ t('years') }}</label>
          </div>
          <CmDateTimePicker
            v-model="values.employmentDate"
            :field="field"
            placeholder="dd-mm-yyyy"
          />
        </Field>
      </VCol>
    </VRow>
    <CmTextArea
      v-model:model-value="values.story"
      :text="t('story')"
    />
  </div>
</template>
