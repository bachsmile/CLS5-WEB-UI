<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'
import { load } from '@/stores/loadComponent'
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'

const emit = defineEmits<Emit>()

/**
 * interface
 */

interface Emit {
  (e: 'tabAction', position: number, status: any): void
}

const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CpTitleTable = defineAsyncComponent(() => import('./CpTitleTable.vue'))
const CmRadioGroup = defineAsyncComponent(() => import('@/components/common/CmRadioGroup.vue'))
const CpUserProfileAvatarEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpUserProfileAvatarEdit.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const storeCombobox = comboboxStore()
const { Field, Form } = storeValidate
const { userTypeCombobox, statusesCombobox } = storeToRefs(storeCombobox)
const { fetchTypeUsersCombobox, fetchStatusUsersCombobox } = storeCombobox
const storeProfileUserManager = profileUserManagerStore()
const { idUpdate, myFormUserInfor, titleTable, values, schema } = storeToRefs(storeProfileUserManager)
const { updateListOrg, submitForm, updateSchema, resetFormInfor } = storeProfileUserManager
const route = useRoute()

// interface
// params main

// data
const LABEL = Object.freeze({
  TEXT_USER_TYPE: `${t('user-role')}*`,
  PLACEHOLDER_USER_TYPE: t('user-role'),
  TEXT_STATUS: `${t('status-name')}*`,
  PLACEHOLDER_STATUS: t('status-name'),
})
const formUserInfor = ref()
const valuesComponent = ref(computed(() => values.value))

// method
const handleFormValue = (value: any) => {
  //
}

/**
 *
 * Lấy dữ liệu compobox
 */
const optionGender = reactive([
  { label: 'nam', value: false },
  { label: 'nữ', value: true },
])

if (window._.isEmpty(statusesCombobox.value))
  fetchStatusUsersCombobox()
if (window._.isEmpty(userTypeCombobox.value))
  fetchTypeUsersCombobox()

const isOwner = computed(() => {
  // const token = useJwt.getToken()
  // if (!token)
  //   return true
  // const permission = parseJwt(token)
  // if (Number(permission?.OwnerId) === Number(this.$route.params.id))
  //   return true

  return false
})
if (Number(route.params.id) >= 0)
  titleTable.value?.checkGetListOrgStruct()
onMounted(() => {
  myFormUserInfor.value = formUserInfor.value
})

window.hideAllPageLoading()
</script>

<template>
  <div>
    <Form
      ref="formUserInfor"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VSheet
        width="100%"
        class="user-infor mx-auto no-background"
      >
        <VRow class="my-3">
          <VCol
            cols="12"
            md="2"
          >
            <CpUserProfileAvatarEdit
              v-if="valuesComponent"
              v-model:src="valuesComponent.avatar"
              :tooltip="t('system-management.100x100')"
            />
          </VCol>
          <VCol
            cols="12"
            md="10"
            class="d-flex align-center"
          >
            <CmRadioGroup
              v-if="valuesComponent"
              v-model="valuesComponent.gender"
              :label="t('gender')"
              :option="optionGender"
            />
          </VCol>
        </VRow>
        <VRow class="mb-5">
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.lastName"
              name="lastName"
              type="text"
              :rules="schema.lastName"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="`${t('surname')}*`"
                :placeholder="t('enter-surname')"
                @change="handleFormValue"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.firstName"
              name="firstName"
              type="text"
              :rules="schema.firstName"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="`${t('name')}*`"
                :placeholder="t('enter-last-name')"
                @change="handleFormValue"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.email"
              name="email"
              type="text"
              :rules="schema.email"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="`${t('email')}*`"
                :placeholder="t('enter-email')"
                @change="handleFormValue"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.userName"
              name="userName"
              type="text"
              :rules="schema.userName"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="`${t('sign-name')}*`"
                :placeholder="t('enter-sign-name')"
                @change="handleFormValue"
              />
            </Field>
          </VCol>

          <VCol
            v-if="!idUpdate"
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.password"
              name="password"
              type="password"
              :rules="schema.password"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                type="password"
                :text="`${t('password')}*`"
                :placeholder="t('enter-password')"
                @change="handleFormValue"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.userCode"
              name="userCode"
              type="text"
              :rules="schema.userCode"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="`${t('employee-code')}*`"
                :placeholder="$t('enter-employee-code')"
                @change="handleFormValue"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.phoneNumber"
              name="phoneNumber"
              type="number"
              :rules="schema.phoneNumber"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="`${t('phone-number')}`"
                :placeholder="$t('phone-number')"
                type="number"
                @change="handleFormValue"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.userTypeId"
              name="userTypeIdSingle"
              :rules="schema.userTypeIdSingle"
            >
              <CmSelect
                :field="field"
                :model-value="valuesComponent.userTypeId"
                :text="LABEL.TEXT_USER_TYPE"
                :placeholder="LABEL.PLACEHOLDER_USER_TYPE"
                :items="userTypeCombobox"
                :errors="errors"
                :disabled="isOwner"
                item-value="id"
                custom-key="userTypeName"
                @update:model-value="handleFormValue"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.statusId"
              name="statusIdSingle"
              :rules="schema.statusIdSingle"
            >
              <CmSelect
                :field="field"
                :model-value="valuesComponent.statusId"
                :text="LABEL.TEXT_STATUS"
                :placeholder="LABEL.PLACEHOLDER_STATUS"
                :items="statusesCombobox"
                :errors="errors"
                item-value="key"
                custom-key="value"
                @update:model-value="handleFormValue"
              />
            </Field>
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.kpiLearn"
              name="kpiLearn"
              type="number"
              :rules="schema.kpiLearn"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="`${t('kpi-learning')}`"
                :placeholder="$t('kpi-learning')"
                type="number"
                @change="handleFormValue"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-if="valuesComponent"
              v-slot="{ field, errors }"
              v-model="valuesComponent.kpiTeach"
              name="kpiTeach"
              type="number"
              :rules="schema.kpiTeach"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="`${t('kpi-teaching')}`"
                :placeholder="$t('kpi-teaching')"
                type="number"
                @change="handleFormValue"
              />
            </Field>
          </VCol>
        </VRow>

        <VDivider class="mb-5" />
      </VSheet>
      <VSheet
        width="100%"
        class="user-infor mx-auto no-background"
      >
        <CpTitleTable
          ref="titleTable"
          :user-id="route.params.id"
          @updateListOrg="updateListOrg"
        />
      </VSheet>
    </Form>
  </div>
</template>

<style scoped lang="scss">
@use "/src/styles/style-global" as *;
</style>
