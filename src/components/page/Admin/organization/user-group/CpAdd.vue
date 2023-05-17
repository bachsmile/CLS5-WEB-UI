<script setup lang="ts">
import CmTextArea from '@/components/common/CmTextArea.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import CmButton from '@/components/common/CmButton.vue'
import { validatorStore } from '@/stores/validatator'
import { load } from '@/stores/loadComponent'
import ApiGroupUser from '@/api/group-user/index'
import toast from '@/plugins/toast'

// Khởi tạo biến đa ngôn ngữ
const props = withDefaults(defineProps<Props>(), ({}))
const emit = defineEmits<Emit>()
const route = useRoute()
const storeValidate = validatorStore()
const storeButton = load()
const { unLoadComponent } = storeButton
const { schemaOption, Field, Form, useForm, yup } = storeValidate

interface dataDetail {
  code: string | null
  description: string
  id?: number
  key?: number
  name: string
  numberUser?: number
}
const { t } = window.i18n()

const schema = reactive({
  code: schemaOption.code,
  name: schemaOption.defaultString,
  description: schemaOption.defaultString,
})

const { handleSubmit, validate, errors, submitForm, resetForm } = useForm({
  validationSchema: schema,
})

interface Props {
  TITLE: any
  dataGeneral: any
}

interface Emit {
  (e: 'update:code', data: any): void
  (e: 'update:name', data: any): void
  (e: 'update:description', data: any): void
}

const dataInput = ref<dataDetail>({
  code: '',
  description: '',
  name: '',
})

const router = useRouter()

// thêm nhóm người dùng
const handleEdit = (idx: number, isUpdate: boolean) => {
  MethodsUtil.requestApiCustom(ApiGroupUser.AddGroup, TYPE_REQUEST.POST, dataInput.value).then((res: any) => {
    toast('SUCCESS', t('common.add-success'))
    if (isUpdate)
      router.push({ name: 'admin-organization-user-groups-edit', params: { id: res.data, tab: 'info' } })
    unLoadComponent(idx)
  }).catch(() => {
    toast('ERROR', t('error'))
    unLoadComponent(idx)
  })
}

// lấy dữ liệu
const getDataDetail = () => {
  MethodsUtil.requestApiCustom(ApiGroupUser.DetailGroup, TYPE_REQUEST.GET, { groupId: route.params.id }).then((res: any) => {
    dataInput.value = res.data
  })
}

if (route.params.id)
  getDataDetail()

const cancel = () => {
  router.push({ name: 'admin-organization-user-groups-list' })
}
</script>

<template>
  <VRow class="mb-6 mt-6">
    <VCol>
      <h3>{{ TITLE.titlePageAdd }}</h3>
    </VCol>
  </VRow>

  <Form
    ref="myForm"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VRow class="flex-wrap">
      <VCol
        lg="4"
        sm="12"
        cols="12"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.code"
          name="code"
          type="text"
          :rules="schema.code"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            text="Mã nhóm người dùng"
            placeholder="Mã nhóm người dùng"
            @update:model-value="emit('update:code', $event)"
          />
        </Field>
      </VCol>
      <VCol
        lg="4"
        cols="12"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.name"
          name="name"
          type="text"
          :rules="schema.name"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            text="Tên nhóm người dùng*"
            placeholder="Mã nhóm người dùng"
            @update:model-value="emit('update:name', $event)"
          />
        </Field>
      </VCol>
      <VCol
        sm="12"
        cols="12"
        class="pl-2 pr-2"
      >
        <CmTextArea
          v-model:model-value="dataInput.description"
          text="Mô tả"
        />
      </VCol>
    </VRow>
  </Form>
  <VRow>
    <VCol class="d-flex justify-end flex-wrap">
      <CmButton
        variant="outlined"
        color="dark"
        :title="TITLE.titleCancel"
        @click="cancel"
      />

      <CmButton
        :title="TITLE.titleButton"
        is-load
        class="ml-2"
        color="50-primary"
        @click="handleEdit($event, false)"
      />
      <CmButton
        v-if="!route.params.id"
        :title="TITLE.titleButtonAndUpdate"
        class="ml-2"
        is-load
        @click="handleEdit($event, true)"
      />
    </VCol>
  </VRow>
</template>
