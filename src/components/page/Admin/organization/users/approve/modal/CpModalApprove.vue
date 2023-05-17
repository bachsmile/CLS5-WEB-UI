<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import { DialogType } from '@/constant/data/notification.json'
import { comboboxStore } from '@/stores/combobox'

const props = withDefaults(defineProps<Props>(), ({
  configRegister: () => ({
    groupId: null,
    id: null,
    organizationalStructureId: null,
    titleId: null,
    typeId: null,
    userTypeId: null,
  }),
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmCard = defineAsyncComponent(() => import('@/components/common/CmCard.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CpOrganizationSelect = defineAsyncComponent(() => import('@/components/page/gereral/CpOrganizationSelect.vue'))
interface Props {
  isDialogVisible: boolean
  configRegister: any
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const type = ref(1)
const LABEL = Object.freeze({
  TITLE: t('user-type'),
  TITLE1: t('group-management'),
  TITLE2: t('orgStruct'),
  TITLE3: t('title-position'),
})

/**
 * store
 */
const storeCombobox = comboboxStore()
const { userTypeCombobox, groupUserCombobox, titleUserCombobox } = storeToRefs(storeCombobox)

const { fetchTypeUsersCombobox, fetchGroupUserCombobox, fetchTitlesUsersCombobox } = storeCombobox
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const schema = yup.object({
  userTypeId: schemaOption.userTypeIdSingle,
})
let infoUser = reactive(props.configRegister)

const myFormApprove = ref()
const handleChangeSelect = () => {
  if (infoUser.organizationalStructureId)
    fetchTitlesUsersCombobox(infoUser.organizationalStructureId)
}
const onCancel = async () => {
  emit('update:isDialogVisible', false)
}
const resetDataForm = () => {
  infoUser = reactive({
    groupId: null,
    userTypeId: null,
    organizationalStructureId: null,
    titleId: null,
  })
}
const onConfirm = async () => {
  myFormApprove.value.validate().then(async (success: any) => {
    if (success.valid) {
      console.log(success)
      emit('confirm', window._.cloneDeep(infoUser))
      emit('update:isDialogVisible', false)
      resetDataForm()
    }
  })
}

watch(() => props.isDialogVisible, isShow => {
  if (isShow)
    resetDataForm()
})
if (window._.isEmpty(userTypeCombobox.value))
  fetchTypeUsersCombobox()
if (window._.isEmpty(groupUserCombobox.value))
  fetchGroupUserCombobox()
if (infoUser.organizationalStructureId)
  fetchTitlesUsersCombobox(infoUser.organizationalStructureId)
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isDialogVisible"
    persistent
    :height="700"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <template #title>
      <div class="d-flex justify-center mb-5">
        <div class="icon-noti-lg">
          <VIcon
            :icon="DialogType[type].icon"
            :class="[`color-${DialogType[type].color}`]"
            class="noti-zindex"
            :size="40"
          />
          <span
            class="ring1"
            :class="[`ring1-type-${type}`]"
          />
          <span
            class="ring2"
            :class="[`ring2-type-${type}`]"
          />
        </div>
      </div>
      <div class="d-flex justify-center text-semibold-lg text-title-noti mb-2">
        {{ t('are-you-sure') }}
      </div>
    </template>
    <template #sub-title>
      <div class="d-flex justify-center text-regular-sm text-title-sub-noti">
        {{ t('are-you-sure-approve') }}
      </div>
    </template>
    <div class="text-regular-sm">
      <p class="mb-2">
        {{ t('info-user') }}
      </p>
      <Form
        ref="myFormApprove"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="infoUser.userTypeId"
          name="userTypeId"
        >
          <div class="approve-select-type mb-4">
            <CmSelect
              :field="field"
              :errors="errors"
              :model-value="infoUser.userTypeId"
              :items="userTypeCombobox"
              :text="LABEL.TITLE"
              item-value="id"
              custom-key="userTypeName"
              :placeholder="LABEL.TITLE"
            />
          </div>
        </Field>
      </Form>

      <div class="approve-select-type mb-4">
        <CmSelect
          v-model="infoUser.groupId"
          :items="groupUserCombobox"
          :text="LABEL.TITLE1"
          item-value="id"
          custom-key="name"
          :placeholder="LABEL.TITLE1"
        />
      </div>
      <div class="approve-select-type mb-4">
        <CpOrganizationSelect
          v-model="infoUser.organizationalStructureId"
          :text="LABEL.TITLE2"
          :placeholder="LABEL.TITLE2"
          @update:model-value="handleChangeSelect"
        />
      </div>
      <div class="approve-select-type mb-4">
        <CmSelect
          v-model="infoUser.titleId"
          :items="titleUserCombobox"
          :text="LABEL.TITLE3"
          item-value="key"
          custom-key="value"
          :placeholder="LABEL.TITLE3"
        />
      </div>
    </div>
  </CmDialogs>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
</style>
