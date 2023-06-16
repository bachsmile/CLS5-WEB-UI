<script setup lang="ts">
import { courseInforManagerStore } from '@/stores/admin/course/infor'
import { validatorStore } from '@/stores/validatator'
import Globals from '@/constant/Globals'
import CmTag from '@/components/common/CmTag.vue'
import CmInputEditor from '@/components/common/CmInputEditor.vue'
import { comboboxStore } from '@/stores/combobox'
import constant from '@/constant/constant'

const CmSelectTree = defineAsyncComponent(() => import('@/components/common/CmSelectTree.vue'))
const CmImgUpload = defineAsyncComponent(() => import('@/components/common/CmImgUpload.vue'))
const CmVideoUpload = defineAsyncComponent(() => import('@/components/common/CmVideoUpload.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CpAddTeacherCourse = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/CpAddTeacherCourse.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()

/**
 * Store
 */
const storeCourseInforManager = courseInforManagerStore()
const { courseData } = storeToRefs(storeCourseInforManager)

const { addInforCourse } = storeCourseInforManager
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const storeCombobox = comboboxStore()
const { topicCombobox, formOfStudyCombobox } = storeToRefs(storeCombobox)
const { getComboboxTopic, getComboboxFormStudy } = storeCombobox

/** state */
const LABEL = Object.freeze({
  TITLE1: `${t('Course_Name')}*`,
  TITLE2: t('course-code'),
  TITLE3: `${t('topic')}*`,
  TITLE3_PHD: t('choose-topic'),
  TITLE4: t('training-type'),
  TITLE4_PHD: t('choose-formId'),
  TITLE5: t('number-credit'),
})

const sizeAvatar = Globals.avatar.size
const isShowButton = ref(true)
const isLoadingVideo = ref()
const myFormAddCourse = ref()
const schema = yup.object({
  name: schemaOption.defaultString,
  topicCourseId: schemaOption.defaultSelectSingle,
})
function onCancel() {
  router.push({ name: 'course-list' })
}
async function handleSave(isUpdate: boolean) {
  myFormAddCourse.value.validate().then(async (success: any) => {
    console.log(success)
    if (success.valid)
      await addInforCourse(isUpdate)
  })
}
function handleSaveUpdate(isUpdate: boolean) {
  myFormAddCourse.value.validate().then(async (success: any) => {
    console.log(success)
    console.log(success)
  })
}
if (topicCombobox.value)
  getComboboxTopic(2)
if (formOfStudyCombobox.value)
  getComboboxFormStudy()
</script>

<template>
  <div>
    <div class="course-infor mt-6">
      <VRow class="mb-3">
        <VCol
          cols="12"
          md="6"
        >
          <VRow class="d-flex">
            <VCol
              cols="12"
              md="3"
              class="text-medium-sm color-dark"
            >
              {{ t('image-course') }}
            </VCol>
            <VCol
              cols="12"
              md="9"
              class="d-flex justify-center"
            >
              <div class="input-avatar">
                <CmImgUpload
                  v-model:src="courseData.thumbnail"
                  is-size-full
                  :is-rounded="true"
                  :is-icon-text="false"
                  icon="tabler:camera"
                  :tooltip="t('system-management.100x100')"
                />
              </div>
            </VCol>
          </VRow>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VRow class="d-flex">
            <VCol
              cols="12"
              md="3"
              class="text-medium-sm color-dark"
            >
              {{ t('image-course') }}
            </VCol>
            <VCol
              cols="12"
              md="9"
              class="d-flex justify-center"
            >
              <div class="input-avatar">
                <CmVideoUpload
                  v-model="courseData.videoUrl"
                  is-size-full
                  icon="tabler:video"
                  :is-rounded="true"
                  @update:processing="isLoadingVideo"
                />
              </div>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
      <Form
        ref="myFormAddCourse"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <VRow class="mb-4">
          <VCol
            cols="12"
            md="4"
            sm="6"
          >
            <Field
              v-slot="{ field, errors }"
              v-model="courseData.name"
              name="name"
              type="text"
            >
              <CmTextField
                :field="field"
                :errors="errors"
                :text="LABEL.TITLE1"
                :placeholder="LABEL.TITLE1"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
            sm="6"
          >
            <CmTextField
              v-model="courseData.code"
              :text="LABEL.TITLE2"
              :placeholder="LABEL.TITLE2"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
            sm="6"
          >
            <Field
              v-slot="{ field, errors }"
              v-model:model-value="courseData.topicCourseId"
              name="topicCourseId"
            >
              <CmSelectTree
                v-model:model-value="courseData.topicCourseId"
                :field="field"
                :errors="errors"
                :is-error="errors.length > 0"
                value-format="id"
                close-on-select
                :text="LABEL.TITLE3"
                :options="topicCombobox"
                :normalizer-custom-type="['id', 'name', 'children']"
                :placeholder="LABEL.TITLE3"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <Field
              v-slot="{ field, errors }"
              v-model="courseData.formOfStudy"
              name="categoryTitleId"
            >
              <CmSelect
                :model-value="courseData.formOfStudy"
                :field="field"
                :errors="errors"
                :items="formOfStudyCombobox"
                item-value="key"
                custom-key="value"
                :text="LABEL.TITLE4"
                :placeholder="LABEL.TITLE4_PHD"
              />
            </Field>
          </VCol>
          <VCol
            cols="12"
            md="4"
            sm="6"
          >
            <CmTextField
              v-model="courseData.credit"
              type="number"
              :min="constant.MIN_NUMBER"
              :max="constant.MAX_NUMBER"
              :text="LABEL.TITLE5"
              :placeholder="LABEL.TITLE5"
            />
            <div
              v-if="Number(courseData.credit) > 100"
              class="color-error error-label"
            >
              {{ t('not-than-100-credit') }}
            </div>
          </VCol>
        </VRow>
      </Form>
      <VRow>
        <VCol>
          <CmTag />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmInputEditor
            v-model="courseData.about"
            :text="t('introduce-course')"
          />
        </VCol>
      </VRow>
    </div>
    <div class="mb-6">
      <CpAddTeacherCourse />
    </div>
    <div>
      <CpActionFooterEdit
        is-cancel
        is-save
        :is-save-and-update="isShowButton"
        :title-cancel="t('come-back')"
        :title-save="t('save')"
        :title-save-and-update="t('save-and-update')"
        @onCancel="onCancel"
        @onSave="handleSave(true)"
        @onSaveUpdate="handleSaveUpdate(false)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.course-infor{
  .input-avatar{
    width: 18.875rem;
    height: 12.5rem;
  }
}
</style>