<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { contentTypeManagerStore } from '@/stores/admin/course/type/contentContentTypeModify'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import UserService from '@/api/user/index'
import toast from '@/plugins/toast'
import { load } from '@/stores/loadComponent.js'
import { ContentType } from '@/constant/data/contentCourseType.json'

const CmInputEditor = defineAsyncComponent(() => import('@/components/common/inputEditor/CmInputEditor.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmItemFileUpload = defineAsyncComponent(() => import('@/components/common/CmItemFileUpload.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/** ********************************************Thông tin chung******************************************************************** */
/** store */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const route = useRoute()
const router = useRouter()
const storeContentTypeManager = contentTypeManagerStore()
const { contentData, timeComplete, contentId, isViewDetail } = storeToRefs(storeContentTypeManager)
const {
  handleUpdateContent, fetchContent, resetData, $reset,
} = storeContentTypeManager
const store = load()
const { unLoadComponent } = store

// end store
/** state */
const LABEL = Object.freeze({
  TITLE1: `${t('KW_Lesson_Name')}*`,
  TITLE2: t('thematics'),
  TITLE3: t('Teacher'),
  TITLE4: t('auto-approve'),
  TITLE5: t('get-study-time-by-duration'),
  TITLE6: t('setting-speed-video'),
  TITLE7: t('permistion-fringed'),
})

const schemaInit = reactive({
  name: schemaOption.defaultString,
})
const schemaTime = reactive({
  selfMinute: schemaOption.defaultNumberTime,
  selfSecond: schemaOption.defaultNumberTime,
})
const schema = computed(() => ({
  ...schemaInit,
  ...(contentData.value.timeTypeId === 2 ? schemaTime : {}),
}))

// get list teacher
const vSelectOwner = ref<any>({
  listCombobox: [],
  totalRecord: 0,
  pageNumber: 1,
  pageSize: 30,
  search: '',
  excludeList: [],
  currentUserIds: [],
  itemSelected: {} as any,
})
async function isIntersecting() {
  vSelectOwner.value.pageNumber += 1
  getTeacherOwnerCourse(true)
}

async function getTeacherOwnerCourse(loadMore?: any) {
  // loadMore dùng khi infinity scroll
  const params = {
    pageSize: vSelectOwner.value.pageSize,
    pageNumber: vSelectOwner.value.pageNumber,
    keyword: vSelectOwner.value.search,
    excludeIds: vSelectOwner.value.excludeList,
    currentUserIds: vSelectOwner.value.currentUserIds,
  }
  await MethodsUtil.requestApiCustom(UserService.PostGetTeacher, TYPE_REQUEST.POST, params).then((value: any) => {
    if (value?.data?.pageLists.length) {
      vSelectOwner.value.totalRecord = value.data.totalRecord

      if (loadMore)
        vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.concat(value.data.pageLists)

      else
        vSelectOwner.value.listCombobox = value.data.pageLists
      vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.map((itemValue: any) => ({
        ...itemValue,
        name: `${itemValue.lastName} ${itemValue.firstName}`,
      }))
      if (vSelectOwner.value.itemSelected?.id && !loadMore) {
        const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item.id === vSelectOwner.value.itemSelected.id)
        if (indexOwner === -1) {
          vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value.itemSelected)
          vSelectOwner.value.excludeList = [vSelectOwner.value.itemSelected.id]
        }
      }
    }
    else {
      vSelectOwner.value.listCombobox = []
      vSelectOwner.value.totalRecord = 0
    }
  })
}

// get list chuyên đề
const comboboxThemetic = ref([])
async function getListThematicContent() {
  const params = {
    courseId: Number(route.params.id),
  }

  await MethodsUtil.requestApiCustom(CourseService.GetListThematicContent, TYPE_REQUEST.GET, params).then((value: any) => {
    comboboxThemetic.value = value.data
  })
}

/** ****upload file */
const myFormAddContent = ref()

const isLoadingFile = ref(true)
const time = ref({ selfMinute: 5, selfSecond: 0, contentMinute: 0, contentSecond: 0 })

/** method */

// lưu
function saveAndUpdate(idx: any, isUpdate: boolean) {
  if (!isUpdate)
    isUpdate = false
  contentData.value.timeVideoOrSound = Number(time.value.contentMinute) * 60 + Number(time.value.contentSecond)
  contentData.value.time = Number(time.value.selfMinute) * 60 + Number(time.value.selfSecond)

  if (contentData.value.time === 0) {
    toast('WARNING', t('time-min-0'))
    unLoadComponent(idx)
    return
  }

  if (timeComplete.value && contentData.value.time < timeComplete.value) {
    toast('WARNING', t('content-time-less-than-success-time'))
    unLoadComponent(idx)
    return
  }
  myFormAddContent.value.validate().then(async (success: any) => {
    if (success.valid) {
      contentData.value.courseId = Number(route.params.id)
      contentData.value.archiveTypeId = MethodsUtil.checkType(`${route.params.type}`, ContentType, 'name')?.value
      handleUpdateContent(idx, isUpdate)
    }
    else {
      unLoadComponent(idx)
    }
  })
}

// cập nhật dữ liệu chỉnh sửa
async function getDetailDocContent() {
  if (contentData.value.url && contentData.value.url !== null) {
    if (contentData.value.time) {
      time.value.selfMinute = Math.floor(contentData.value.time / 60)
      time.value.selfSecond = Math.floor(contentData.value.time % 60)
    }
    isLoadingFile.value = false
  }
  else { time.value.selfMinute = 5 }
}

function handleCancle() {
  router.push({ name: 'course-edit', params: { id: Number(route.params.id) }, query: { tab: 'content' } })
}

/** ******************Thực thi created************** */
getListThematicContent()
if (route.params && route.params.contentId) {
  const id = Number(route.params.contentId)
  contentId.value = id
  fetchContent(id).then(() => {
    getDetailDocContent()
    vSelectOwner.value.currentUserIds = contentData.value.ownerId
    getTeacherOwnerCourse()
  })
}
else {
  getTeacherOwnerCourse()
}

onUnmounted(() => {
  resetData()
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormAddContent"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="contentData.name"
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
          <Field
            v-slot="{ field, errors }"
            v-model="contentData.themeticId"
            name="categoryTitleId"
          >
            <CmSelect
              :model-value="contentData.themeticId"
              :field="field"
              :errors="errors"
              :items="comboboxThemetic"
              item-value="key"
              custom-key="value"
              :text="LABEL.TITLE2"
              :placeholder="LABEL.TITLE2"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <CmSelect
            v-model="contentData.ownerId"
            :text="LABEL.TITLE3"
            :placeholder="LABEL.TITLE3"
            :items="vSelectOwner.listCombobox"
            is-infinity-scroll
            :total-record="vSelectOwner.totalRecord"
            item-value="id"
            custom-key="name"
            :append-to-body="false"
            @isIntersecting="isIntersecting"
          >
            <template #infinityItem>
              <SkUser
                :number="2"
              />
            </template>
          </CmSelect>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div class="mb-3 text-medium-sm">
            {{ t('setting') }}
          </div>
          <CmCheckBox
            v-model:model-value="contentData.isApprove"
            :label="LABEL.TITLE4"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div class="text-semibold-md color-text-900 mb-4 ">
            {{ t('duration-time') }}
          </div>
          <div class="d-flex align-center">
            <div>
              <div class="d-flex align-center">
                <div class="d-flex align-center mr-4">
                  <div>{{ t('duration-time') }}</div>
                </div>
                <div>
                  <div class="d-flex">
                    <Field
                      v-slot="{ field, errors }"
                      v-model="time.selfMinute"
                      name="selfMinute"
                      type="number"
                    >
                      <div class="mr-3">
                        <div class="d-flex align-center">
                          <div class="mr-3 conditon-input">
                            <CmTextField
                              :field="field"
                              type="number"
                              :min="0"
                              :max="59"
                            />
                          </div>
                          <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                        </div>
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
                        </div>
                      </div>
                    </Field>
                    <Field
                      v-slot="{ field, errors }"
                      v-model="time.selfSecond"
                      name="selfSecond"
                    >
                      <div class="mr-3">
                        <div class="d-flex align-center">
                          <div class="mr-3 conditon-input">
                            <CmTextField
                              :field="field"
                              type="number"
                              :min="0"
                              :max="59"
                            />
                          </div>
                          <span class="text-regular-md">{{ t('seconds').toLowerCase() }}</span>
                        </div>
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
                        </div>
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <CmCheckBox
            v-model:model-value="contentData.isCustomTime"
            :label="LABEL.TITLE5"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div>
            <CmInputEditor
              v-model="contentData.description"
              :text="t('content')"
            />
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <CpActionFooterEdit
            is-cancel
            is-save
            :is-save-and-update="!contentData.courseContentId || contentData.courseContentId === null"
            :title-cancel="t('come-back')"
            :title-save="t('save')"
            :title-save-and-update="t('save-and-update')"
            @on-save="(idx: any) => saveAndUpdate(idx, false)"
            @on-save-update="(idx: any) => saveAndUpdate(idx, true)"
            @on-cancel="handleCancle"
          />
        </VCol>
      </VRow>
    </Form>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.embed-responsive {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}
.embed-responsive embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.message-progess{
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
</style>
