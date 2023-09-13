<script lang="ts" setup>
import CpItemConfiguration from './auto-test/CpItemConfiguration.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import type { Any } from '@/typescript/interface'

const { t } = window.i18n()
const items = ref<Any[]>([
  {
    topicId: 0,
    questionType: 0,
    numberQuestion: 0,
  },
])
</script>

<template>
  <div class="d-flex align-center">
    <div>{{ t('number-exam-create') }}</div>
    <div>
      <CmTextField
        style="width: 50px;"
        class="mx-2"
      />
    </div>
    <div>
      {{ t('QUE_TestCode') }}
    </div>
  </div>

  <div class="d-flex align-center my-4">
    <CmCheckBox /> <label>{{ t('auto-approve') }}</label>
  </div>

  <div class="m">
    <CpItemConfiguration
      v-for="(item, index) in items"
      :key="index"
      :content="item"
    />
  </div>
</template>
