<script setup lang="ts">
import { contentTypeManagerStore } from '@/stores/admin/course/type/contentVideoTypeModify'
import { validatorStore } from '@/stores/validatator'
import toast from '@/plugins/toast'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusTypeCourse } from '@/constant/data/status.json'
import StringUtil from '@/utils/StringUtil'
import StringJwt from '@/utils/Jwt'
import ArraysUtil from '@/utils/ArrayUtil'
import { load } from '@/stores/loadComponent.js'

const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))

/** LIB */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

/** store */
const store = load()
const { unLoadComponent } = store
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const storeContentVideoTypeModifyManager = contentTypeManagerStore()
const { videoData, conditionAttend, courseData } = storeToRefs(storeContentVideoTypeModifyManager)

/** state */
const isStartTime = ref(false)
const isEndTime = ref(false)
const myFormAddConditionVideo = ref()

const schema = reactive({
  ...(isStartTime.value ? { isStartTime: schemaOption.defaultString } : {}),
  ...(isEndTime.value ? { isStartTime: schemaOption.defaultString } : {}),
})

const LABEL = Object.freeze({
  TITLE1: t('setting-time'),
  LABEL1: 'Thời gian bắt đầu',
  LABEL2: 'Thời gian kết thúc',
})

/** method */
function handleCancle() {
  router.push({ name: 'course-edit', params: { tab: 'content', id: Number(route.params.id) } })
}
function getErrorsMessage(errorsMess: Array<any>) {
  let str = ''
  errorsMess.forEach(element => {
    str += `${t(element.message, element.params)}`
    str += '. '
  })

  return str
}

/** điều kiện hoàn thành */
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('content'), value: 'name' },
  { text: t('author'), value: 'author', type: 'custom' },
  { text: t('status-name'), value: 'statusName', type: 'custom' },
])
const dataTable = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const paramsContent = ref({
  id: Number(route?.params?.id) || null,
  search: null as any,
  role: StringJwt.getRole(),
})

const items = ref<any>()
function selectedRows(e: any) {
  dataTable.selectedRowsIds = e
}

/** *****Lấy danh sách nội dung */
async function getListContentCourse() {
  let dataRow
  const value = await MethodsUtil.requestApiCustom(CourseService.GetListContentCourse, TYPE_REQUEST.GET, paramsContent.value)
  if (value.data) {
    dataRow = ArraysUtil.unFlatMapTree(value.data)

    for (let i = 0; i < dataRow.length; i += 1) {
      const element = dataRow[i]
      if (element.children === null)
        element.children = []

      // loại bỏ những nội dung là chỉnh nó hoặc là chuyên đề
      if (element.courseContentId === Number(route.params.contentId) || (element.contentArchiveTypeId === 13)) {
        dataRow.splice(i, 1)
        i -= 1

        continue
      }
      if (conditionAttend.value.lesionRequire && conditionAttend.value.lesionRequire.find((item: any) => item === element.courseContentId))
        element.isSelected = true
      element.html = true
    }
  }
  items.value = dataRow
}

// lưu  dữ liệu
async function saveDataCondition(idx: any) {
  myFormAddConditionVideo.value.validate().then(async (success: any) => {
    if (success.valid) {
      if (!isStartTime.value)
        conditionAttend.value.dateTimeStart = null
      if (!isEndTime.value)
        conditionAttend.value.dateTimeEnd = null
      if (isStartTime.value && isEndTime.value) {
        const start = new Date(conditionAttend.value.dateTimeStart || '')
        const end = new Date(conditionAttend.value.dateTimeEnd || '')
        if (end < start) {
          toast('WARNING', t('time-end-invalid'))
          return
        }
      }
      conditionAttend.value.lesionRequire = []

      // dánh sách khóa học yêu cầu
      if (courseData.value.studyMode === 3)
        conditionAttend.value.lesionRequire = dataTable.selectedRowsIds

      const response = await MethodsUtil.requestApiCustom(CourseService.PostSaveRequireParticipate, TYPE_REQUEST.POST, conditionAttend.value).catch(() => {
        unLoadComponent(idx)
      })
      if (response.code === 200) {
        toast('SUCCESS', t(response.message))
        unLoadComponent(idx)
      }

      else {
        toast('ERROR', t(getErrorsMessage(response.errors)))
        unLoadComponent(idx)
      }
    }
  })
}
watch(conditionAttend, () => {
  getListContentCourse()
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormAddConditionVideo"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
        >
          <div class="text-semibold-md color-text-900 mb-4 ">
            {{ t('duration-time') }}
          </div>
          <div class="mb-6">
            <div class="d-flex align-center mr-4 mb-4">
              <CmCheckBox
                v-model:model-value="isStartTime"
                :label="LABEL.LABEL1"
              />
            </div>
            <div v-if="videoData.timeTypeId === 1">
              <div>
                <Field
                  v-slot="{ field, errors }"
                  v-model="conditionAttend.dateTimeStart"
                  name="isStartTime"
                >
                  <div class="mr-3">
                    <div class="mr-3 conditon-input">
                      <CmDateTimePicker
                        class="w-100"
                        :field="field"
                        :errors="errors"
                        :text="`${t(LABEL.LABEL1)}*`"
                        :placeholder="t(LABEL.LABEL1)"
                      />
                    </div>
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
          <div class="mb-6">
            <div class="d-flex align-center mr-4 mb-4">
              <CmCheckBox
                v-model:model-value="isEndTime"
                :label="LABEL.LABEL2"
              />
            </div>
            <div v-if="videoData.timeTypeId === 1">
              <div>
                <Field
                  v-slot="{ field, errors }"
                  v-model="conditionAttend.dateTimeEnd"
                  name="isEndTime"
                >
                  <div class="mr-3">
                    <div class="mr-3 conditon-input">
                      <CmDateTimePicker
                        class="w-100"
                        :field="field"
                        :errors="errors"
                        :text="`${t(LABEL.LABEL2)}*`"
                        :placeholder="t(LABEL.LABEL2)"
                      />
                    </div>
                    <div
                      v-if="errors.length"
                      class="styleError text-errors"
                    >
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
      <div class="mb-6">
        <div class="text-medium-lg mb-6">
          {{ t('list-content-req') }}
        </div>
        <CmTable
          :selected="dataTable?.selectedRowsIds"
          :headers="headers"
          :items="items"
          disiable-pagination
          custom-id="courseContentId"
          @update:selected="selectedRows"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'statusName'">
              <CmChip
                class="ma-2"
                :color="MethodsUtil.checkStatus(context.statusId, StatusTypeCourse)?.color"
              >
                <VIcon
                  start
                  icon="carbon:dot-mark"
                  size="12"
                />
                <span>{{ t(context.statusName) }}</span>
              </CmChip>
            </div>
            <div v-if="col === 'author'">
              {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
            </div>
          </template>
        </CmTable>
      </div>
      <div>
        <CpActionFooterEdit
          is-cancel
          is-save
          :title-cancel="t('cancel-title')"
          :title-save="t('save')"
          @on-save="saveDataCondition"
          @on-cancel="handleCancle"
        />
      </div>
    </Form>
  </div>
</template>
