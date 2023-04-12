<script setup lang="ts">
import { Field, Form, useField, useForm } from 'vee-validate'
import MethodsUtil from '@/utils/MethodsUtil'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { formatDateYears } from '@/utils/FilterUtil'
import ArrayUtil from '@/utils/ArrayUtil'
import { ActionType } from '@/constant/data/actionType.json'

interface profile {
  birthDay: string | null
  listEducationUser: Array<any>
  listExperienceUser: Array<any>
}
interface Props {
  profile: profile
}

const props = withDefaults(defineProps<Props>(), ({
  profile: () => ({
    birthDay: null,
    listEducationUser: [],
    listExperienceUser: [],
  }),
}))

const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CpModalEducation = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/modal/CpModalEducation.vue'))
const CpModalExperence = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/modal/CpModalExperence.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

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

const dataProfile = reactive<any>(props.profile)

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
const fetchModalEducation = () => {
  data.educationData.isEdit = false
  modal.isShowModalEducation = true
}

const removeEducation = (index: any) => {
  console.log(index)

  dataProfile.listEducationUser.splice(index, 1)
}

// reset education modal
const resetEducationModal = () => {
  data.educationData.degreeId = null
  data.educationData.description = null
  data.educationData.graduationYear = null
  data.educationData.schoolId = null
  data.educationData.isEdit = false
}

const updateEducation = (dataEdit: any, index: any) => {
  console.log(dataEdit)
  data.educationData.degreeId = dataEdit.degreeId
  data.educationData.description = dataEdit.description
  data.educationData.graduationYear = dataEdit.graduationYear
  data.educationData.schoolId = dataEdit.schoolId
  data.educationData.isEdit = true
  data.educationData.index = index
}

// Kinh nghiệm
const addExperiences = () => {
  data.experienceData.isEdit = false
  modal.isShowModalExperence = true
}

// delete experience item
const removeExperience = index => {
  dataProfile.listExperienceUser.splice(index, 1)
}

// reset education modal
const resetExperenceModal = () => {
  data.experienceData.dateStart = null
  data.experienceData.dateFinish = null
  data.experienceData.description = null
  data.experienceData.isWork = false
  data.experienceData.position = null
  data.experienceData.companyName = null
}

/**
 * modal
 */
const actionItemEdit = (dataAction: any, index: any, dataResend?: any) => {
  console.log('edit', dataAction, index, dataResend)
  switch (dataResend) {
    case 'EDUCATION':
      updateEducation(dataAction[1], index)
      console.log('educationData', data.educationData)
      modal.isShowModalEducation = true
      break

    default:
      break
  }
}

const actionItemDelete = (dataAction: any, index: any, dataResend?: any) => {
  switch (dataResend) {
    case 'EDUCATION':
      console.log('actionItemDelete', dataAction, index)
      removeEducation(index)

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
const updateDialogVisible = (event: any, type?: any) => {
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
const handleUpdataProfile = (education: any, edit: boolean) => {
  console.log('education', education)
  console.log('edit', edit)
  console.log('dataProfile', dataProfile.listEducationUser.length)
  console.log('dataProfile', dataProfile.listEducationUser)

  if (edit) { dataProfile.listEducationUser[education?.index] = education }
  else {
    if (!dataProfile.listEducationUser || dataProfile.listEducationUser === null)
      dataProfile.listEducationUser = []
    dataProfile.listEducationUser[dataProfile.listEducationUser.length] = education
  }
  updateDialogVisible(false, 'EDUCATION')
}

const updateExperences = (experences: any, edit: boolean) => {
  console.log('education', experences)
  console.log('edit', edit)
  console.log('dataProfile', dataProfile.listEducationUser.length)
  console.log('dataProfile', dataProfile.listEducationUser)

  if (edit) { dataProfile.listEducationUser[experences?.index] = experences }
  else {
    if (!dataProfile.listEducationUser || dataProfile.listEducationUser === null)
      dataProfile.listEducationUser = []
    dataProfile.listEducationUser[dataProfile.listEducationUser.length] = experences
  }
  updateDialogVisible(false, 'EDUCATION')
}

/** ******************** */
</script>

<template>
  <Form class="my-5">
    <VSheet
      width="100%"
      class="user-infor mx-auto no-background"
    >
      <VRow>
        <VCol
          md="4"
          cols="12"
          class="mb-1"
        >
          <!-- input birth-day -->
          <Field name="birthDay">
            <label class="text-label-default">{{ t("common.birth-day") }}</label>
            <CmDateTimePicker
              v-model="dataProfile.birthDay"
              placeholder="dd-mm-yyyy"
            />
          </Field>
        </VCol>
        <VCol
          md="4"
          cols="12"
          class="mb-1"
        >
          <!-- input birth-day -->
          <Field
            v-slot="{ field }"
            v-model="dataProfile.passport"
            name="passport"
            type="passport"
          >
            <CmTextField
              :field="field"
              :text="`${t('users.add-user.enter-passport')}`"
              :placeholder="t('users.add-user.enter-passport')"
            />
          </Field>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          md="4"
          cols="12"
          class="mb-1"
        >
          <!-- giáo dục -->
          <div>
            <label class="text-label-default ">{{ $t("users.add-user.education") }}</label>
          </div>
          <br>
          <div
            v-if="dataProfile.listEducationUser && dataProfile.listEducationUser.length > 0"
            class="style-education"
          >
            <div
              v-for="(item, index) in dataProfile.listEducationUser"
              :key="index"
              class="border-item"
            >
              <VRow class="mb-3">
                <VCol
                  cols="10"
                >
                  <div class="text-name-school text-bold-sm mb-2">
                    {{ item.schoolName }} <span v-if="item?.graduationYear">({{ $t("common.years") }} {{ formatDateYears(item.graduationYear) }})</span>
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
            class="d-flex align-center"
            @click="fetchModalEducation"
          >
            <VIcon
              icon="tabler:plus"
              size="16"
              class="color-primary mr-2"
            />
            <span class="color-primary  align-center">{{ $t('common.add') }}</span>
          </BLink>
        </VCol>
        <VCol
          md="4"
          cols="12"
          class="mb-1"
        >
          <!-- Kinh nghiệm -->
          <div>
            <label class="text-label-default ">{{ t("users.add-user.experience") }}</label>
          </div>
          <br>
          <div
            v-if="profile.listExperienceUser && profile.listExperienceUser.length > 0"
            class="style-experience"
          >
            <div
              v-for="(item, index) in dataProfile.listEducationUser"
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
                      ({{ $t("common.years") }} {{ formatDateYears(item.dateStart) }} - {{ $t("common.years") }} {{ formatDateYears(item.dateFinish) }})
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
            class="d-flex align-center"
            @click="addExperiences"
          >
            <VIcon
              icon="tabler:plus"
              size="16"
              class="color-primary mr-2"
            />
            <span class="color-primary  align-center">{{ $t('common.add') }}</span>
          </BLink>
        </VCol>
      </VRow>
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
    @update:profile="updateExperences"
  />
</template>

<style scoped lang="scss">
@use "/src/styles/style-global" as *;
.text-name-school{
  color: $color-gray-900
}
.text-description{
  color: $color-gray-500
}
</style>
