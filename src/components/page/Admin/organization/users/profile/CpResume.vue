<script setup lang="ts">
import { formatDateYears } from '@/utils/FilterUtil'
import { ActionType } from '@/constant/data/actionType.json'
import { validatorStore } from '@/stores/validatator'
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'

const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CpModalEducation = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/modal/CpModalEducation.vue'))
const CpModalExperence = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/modal/CpModalExperence.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CpAddressEdit = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpAddressEdit.vue'))
const CpJobInformation = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpJobInformation.vue'))

// store
const storeValidate = validatorStore()
const { Field, Form } = storeValidate
const storeProfileUserManager = profileUserManagerStore()
const { values } = storeToRefs(storeProfileUserManager)
const valuesComponent = ref(computed(() => values.value))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const data = reactive({
  selected: [],
  nameSchools: [],
  degrees: null as object | null,
  educationData: {
    degreeId: null,
    degreeName: null,
    description: null,
    graduationYear: null,
    schoolId: null,
    schoolName: null,
    isEdit: false,
    index: 0,
  },
  modalEducation: 'modalEducation',
  dateDefault: '',
  experienceData: {
    companyName: null,
    dateFinish: null,
    dateStart: null,
    description: null,
    isWork: false,
    position: null,
    isEdit: false,
    index: 0,
  },
  modalExperences: 'modalExperences',
})

/**
 *
 * Lấy dữ liệu setup
 */

const modal = reactive({
  isShowModalEducation: false,
  isShowModalExperence: false,
})

/**
 * action item
 */
const KEY = Object.freeze({
  EDUCATION: 'EDUCATION',
  EXPERENCE: 'EXPERENCE',
})

// Giáo duc
// fetch data modal education
function fetchModalEducation() {
  data.educationData.isEdit = false
  modal.isShowModalEducation = true
}

function removeEducation(index: any) {
  valuesComponent.value?.listEducationUser.splice(index, 1)
}

// reset education modal
function resetEducationModal() {
  data.educationData.degreeId = null
  data.educationData.description = null
  data.educationData.graduationYear = null
  data.educationData.schoolId = null
  data.educationData.isEdit = false
}

function updateEducation(dataEdit: any, index: any) {
  data.educationData.degreeId = dataEdit.degreeId
  data.educationData.description = dataEdit.description
  data.educationData.graduationYear = dataEdit.graduationYear
  data.educationData.schoolId = dataEdit.schoolId
  data.educationData.isEdit = true
  data.educationData.index = index
}

// Kinh nghiệm
function addExperiences() {
  data.experienceData.isEdit = false
  modal.isShowModalExperence = true
}

// delete experience item
function removeExperience(index: any) {
  valuesComponent.value.listExperienceUser.splice(index, 1)
}

// reset education modal
function resetExperenceModal() {
  data.experienceData.dateStart = null
  data.experienceData.dateFinish = null
  data.experienceData.description = null
  data.experienceData.isWork = false
  data.experienceData.position = null
  data.experienceData.companyName = null
}

function updateExperences(dataEdit: any, index: any) {
  data.experienceData.companyName = dataEdit.companyName
  data.experienceData.dateFinish = dataEdit.dateFinish
  data.experienceData.dateStart = dataEdit.dateStart
  data.experienceData.description = dataEdit.description
  data.experienceData.isWork = dataEdit.isWork
  data.experienceData.position = dataEdit.position
  data.experienceData.isEdit = true
  data.experienceData.index = index
}

/**
 * modal
 */
function actionItemEdit(dataAction: any, index: any, dataResend?: any) {
  switch (dataResend) {
    case 'EDUCATION':
      updateEducation(dataAction[1], index)
      modal.isShowModalEducation = true
      break
    case 'EXPERENCE':
      updateExperences(dataAction[1], index)
      modal.isShowModalExperence = true
      break

    default:
      break
  }
}

function actionItemDelete(dataAction: any, index: any, dataResend?: any) {
  switch (dataResend) {
    case 'EDUCATION':
      removeEducation(index)

      break
    case 'EXPERENCE':
      removeExperience(index)

      break

    default:
      break
  }
}

const action = [
  {
    title: 'Chỉnh sửa',
    icon: ActionType[0].icon,
    action: actionItemEdit,
  },
  {
    title: 'Xóa',
    icon: ActionType[1].icon,
    action: actionItemDelete,
  },
]

// cập nhật trạng thái dialog
function updateDialogVisible(event: any, type?: any) {
  switch (type) {
    case 'EDUCATION':
      modal.isShowModalEducation = event
      resetEducationModal()
      break
    case 'EXPERENCE':
      modal.isShowModalExperence = event
      resetExperenceModal()
      break

    default:
      break
  }
}

/**
 *
 * update profile
 */
function handleUpdataProfile(education: any, edit: boolean) {
  if (edit) {
    valuesComponent.value.listEducationUser[education?.index] = education
  }
  else {
    if (!valuesComponent.value?.listEducationUser || valuesComponent.value?.listEducationUser === null)
      valuesComponent.value.listEducationUser = []
    valuesComponent.value.listEducationUser[valuesComponent.value.listEducationUser.length] = education
  }
  updateDialogVisible(false, 'EDUCATION')
}

function handleUpdateExperences(experences: any, edit: boolean) {
  if (edit) {
    valuesComponent.value.listExperienceUser[experences?.index] = experences
  }
  else {
    if (!valuesComponent.value.listExperienceUser || valuesComponent.value.listExperienceUser === null)
      valuesComponent.value.listExperienceUser = []
    valuesComponent.value.listExperienceUser[valuesComponent.value.listExperienceUser.length] = experences
  }
  updateDialogVisible(false, 'EXPERENCE')
}

/** ******************** */
</script>

<template>
  <Form
    class="my-5"
  >
    <VSheet
      width="100%"
      class="user-infor mx-auto no-background"
    >
      <VRow class="mb-2">
        <VCol
          md="4"
          cols="12"
          class="mb-1"
        >
          <VRow>
            <VCol
              cols="12"
              class="mb-1"
            >
              <!-- input birth-day -->
              <Field name="birthDay">
                <div class="mb-1">
                  <label class="text-label-default">{{ t("birth-day") }}</label>
                </div>
                <CmDateTimePicker
                  v-if="valuesComponent"
                  v-model="valuesComponent.birthDay"
                  placeholder="dd-mm-yyyy"
                />
              </Field>
            </VCol>
            <VCol
              cols="12"
              class="mb-1"
            >
              <!-- giáo dục -->
              <div class="mb-3">
                <label class="text-label-default ">{{ $t("education") }}</label>
              </div>
              <div
                v-if="valuesComponent?.listEducationUser && valuesComponent?.listEducationUser.length > 0"
                class="style-education"
              >
                <div
                  v-for="(item, index) in valuesComponent?.listEducationUser"
                  :key="index"
                  class="border-item"
                >
                  <VRow class="mb-3">
                    <VCol
                      cols="10"
                    >
                      <div class="text-name-school text-bold-sm mb-2">
                        {{ item.schoolName }} <span v-if="item?.graduationYear">({{ $t("years") }} {{ formatDateYears(item.graduationYear) }})</span>
                      </div>
                      <CmChip class="mb-2">
                        <div> {{ item.degreeName }}</div>
                      </CmChip>
                      <div
                        v-if="item?.description"
                        class="text-description text-regular-sm b-2"
                      >
                        {{ item.description }}
                      </div>
                    </VCol>

                    <VCol
                      cols="2"
                    >
                      <CmDropDown
                        :list-item="action"
                        :data-resend="KEY.EDUCATION"
                        :data="item"
                        custom-key="title"
                        :type="1"
                        :index="index"
                      />
                    </VCol>
                  </VRow>
                  <VDivider class="mb-4" />
                </div>
              </div>
              <BLink
                class="d-flex align-center cursor-pointer"
                @click="fetchModalEducation"
              >
                <VIcon
                  icon="tabler:plus"
                  size="16"
                  class="color-primary mr-2"
                />
                <span class="color-primary  align-center">{{ $t('Add-new') }}</span>
              </BLink>
            </VCol>
          </VRow>
        </VCol>
        <VCol
          md="4"
          cols="12"
          class="mb-1"
        >
          <VRow>
            <VCol
              cols="12"
              class="mb-1"
            >
              <!-- input passport -->
              <Field
                v-slot="{ field }"
                v-model="valuesComponent.passport"
                name="passport"
                type="passport"
              >
                <CmTextField
                  :field="field"
                  :text="`${t('enter-passport')}`"
                  :placeholder="t('enter-passport')"
                />
              </Field>
            </VCol>
            <VCol
              cols="12"
              class="mb-1"
            >
              <!-- Kinh nghiệm -->
              <div class="mb-3">
                <label class="text-label-default ">{{ t("experience") }}</label>
              </div>
              <div
                v-if="valuesComponent.listExperienceUser && valuesComponent.listExperienceUser.length > 0"
                class="style-experience"
              >
                <div
                  v-for="(item, index) in valuesComponent.listExperienceUser"
                  :key="index"
                  class="border-item"
                >
                  <VRow class="mb-3">
                    <VCol
                      cols="10"
                    >
                      <div class="text-name-school text-bold-sm mb-2">
                        {{ item.companyName }}
                        <span>
                          ({{ $t("years") }} {{ formatDateYears(item.dateStart) }} - {{ $t("years") }} {{ formatDateYears(item.dateFinish) }})
                        </span>
                      </div>
                      <CmChip class="mb-2">
                        <div> {{ item.position }}</div>
                      </CmChip>
                      <div
                        v-if="item?.description"
                        class="text-description text-regular-sm b-2"
                      >
                        {{ item.description }}
                      </div>
                    </VCol>

                    <VCol
                      cols="2"
                    >
                      <CmDropDown
                        :list-item="action"
                        :data-resend="KEY.EXPERENCE"
                        :data="item"
                        custom-key="title"
                        :type="1"
                        :index="index"
                      />
                    </VCol>
                  </VRow>
                  <VDivider class="mb-4" />
                </div>
              </div>
              <BLink
                class="d-flex align-center cursor-pointer"
                @click="addExperiences"
              >
                <VIcon
                  icon="tabler:plus"
                  size="16"
                  class="color-primary mr-2"
                />
                <span class="color-primary  align-center">{{ $t('Add-new') }}</span>
              </BLink>
            </VCol>
          </VRow>
        </VCol>
        <VCol
          md="4"
          cols="12"
          class="mb-1"
        >
          <VRow>
            <VCol
              cols="12"
              class="mb-1"
            >
              <!-- address -->
              <div class="mb-3">
                <label class="text-label-default ">{{ t("address") }}</label>
              </div>
              <CpAddressEdit />
            </VCol>
          </VRow>
        </VCol>
      </VRow>
      <CpJobInformation />
    </VSheet>
  </Form>
  <CpModalEducation
    :is-dialog-visible="modal.isShowModalEducation"
    :name-schools="data.nameSchools"
    :education-data="data.educationData"
    @update:is-dialog-visible="updateDialogVisible"
    @update:profile="handleUpdataProfile"
  />
  <CpModalExperence
    :is-dialog-visible="modal.isShowModalExperence"
    :experience-data="data.experienceData"
    @update:is-dialog-visible="updateDialogVisible"
    @update:profile="handleUpdateExperences"
  />
</template>

<style scoped lang="scss">
@use "/src/styles/style-global" as *;
.text-description{
  color: $color-gray-500
}
</style>
