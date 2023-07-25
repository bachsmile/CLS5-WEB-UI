<script setup lang="ts">
import CmTextArea from '@/components/common/CmTextArea.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import CmButton from '@/components/common/CmButton.vue'
import { validatorStore } from '@/stores/validatator'
import { load } from '@/stores/loadComponent'
import ApiGroupUser from '@/api/user'
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
const myForm = ref()

// thêm nhóm người dùng
function handleEdit(idx: number, isUpdate: boolean) {
  myForm.value.validate().then((status: any) => {
    if (status.valid) {
      if (route.params.id)
        editGroupUser(idx)
      else
        addGroupUser(idx, isUpdate)
    }
    else {
      unLoadComponent(idx)
    }
  })
}

function addGroupUser(idx: number, isUpdate: boolean) {
  const payload = {
    ...dataInput.value,
  }
  MethodsUtil.requestApiCustom(ApiGroupUser.AddGroup, TYPE_REQUEST.POST, payload).then((res: any) => {
    toast('SUCCESS', t('common.add-success'))
    if (isUpdate)
      router.push({ name: 'admin-organization-user-groups-edit', params: { id: res.data } })
    else
      cancel()
    unLoadComponent(idx)
  }).catch(() => {
    unLoadComponent(idx)
    toast('ERROR', t('error'))
  })
}
function editGroupUser(idx: number) {
  const payload = {
    ...dataInput.value,
    id: route.params.id ? route.params.id : null,
  }
  MethodsUtil.requestApiCustom(ApiGroupUser.PostUpdateInforGroupUser, TYPE_REQUEST.POST, payload).then((res: any) => {
    toast('SUCCESS', t('common.add-success'))
    cancel()
    unLoadComponent(idx)
  }).catch(() => {
    unLoadComponent(idx)
    toast('ERROR', t('error'))
  })
}

// lấy dữ liệu
function getDataDetail() {
  MethodsUtil.requestApiCustom(ApiGroupUser.DetailGroup, TYPE_REQUEST.GET, { groupId: route.params.id }).then((res: any) => {
    dataInput.value = res.data
  })
}

if (route.params.id)
  getDataDetail()

function cancel() {
  router.push({ name: 'admin-organization-user-groups-list' })
}
</script>

<template>
  <VRow class="mb-5 mt-4">
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
    <VCol class="d-flex justify-end flex-wrap mt-4">
      <CmButton
        variant="outlined"
        color="secondary"
        :title="TITLE.titleCancel"
        @click="cancel"
      />

      <CmButton
        :title="TITLE.titleButton"
        is-load
        class="ml-2"
        color="primary"
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
