<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import CpCondParticipation from '@/components/page/Admin/course/modify/CpCondParticipation.vue'
import CpInforCourse from '@/components/page/Admin/course/modify/CpInforCourse.vue'
import CpConditionsCompletion from '@/components/page/Admin/course/modify/CpConditionsCompletion.vue'
import CpCostCourse from '@/components/page/Admin/course/modify/CpCostCourse.vue'
import CpCourseSurveyEvaluation from '@/components/page/Admin/course/modify/CpCourseSurveyEvaluation.vue'
import { courseInforManagerStore } from '@/stores/admin/course/infor'
import CpManaging from '@/components/page/gereral/CpManaging.vue'
import CourseService from '@/api/course'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpMdAddSemester from '@/components/page/Admin/course/modal/CpMdAddSemester.vue'
import { StatusTypeCourse } from '@/constant/data/status.json'
import CpAsginUser from '@/components/page/Admin/course/modify/asign-user/CpAsginUser.vue'
import CpContentCourse from '@/components/page/Admin/course/modify/content/CpContentCourse.vue'
import CpSettingCourse from '@/components/page/Admin/course/modify/CpSettingCourse.vue'

/** lib */
const route = useRoute()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * Store
 */
const storeCourseInforManager = courseInforManagerStore()
const { idCourse, isViewDetail } = storeToRefs(storeCourseInforManager)
const { getDetailCourse, $reset } = storeCourseInforManager

if (route?.params?.id) {
  idCourse.value = Number(route?.params.id)
  getDetailCourse()
  isViewDetail.value = route?.name === 'course-view'
}
const semesterCb = [
  { name: t('middle-perior'), id: 1 },
  { name: t('end-perior'), id: 2 },
]

const isDisabledAdd = ref(false)
const excludeIds = ref<any>([])
const listTypePeriorCurrent = ref<any>([])
const viewAdd = ref(route.name === 'course-add')
const listtab = ref([
  {
    key: 'infor',
    title: 'infor_course',
    component: CpInforCourse,
  },
  {
    key: 'content',
    title: 'content-course',
    component: CpContentCourse,
    isDisabled: viewAdd.value,

  },
  {
    key: 'user',
    title: 'asign-user',
    component: CpAsginUser,
    isDisabled: viewAdd.value,

  },
  {
    key: 'participation',
    title: 'course-attend-dk',
    component: CpCondParticipation,
    isDisabled: viewAdd.value,

  },

  {
    key: 'completion',
    title: 'conditions-completion',
    component: CpConditionsCompletion,
    isDisabled: viewAdd.value,

  },

  {
    key: 'cost',
    title: 'cost-management',
    component: CpCostCourse,
    isDisabled: viewAdd.value,
  },

  {
    key: 'survey-course',
    title: 'survey-course',
    component: CpCourseSurveyEvaluation,
    isDisabled: viewAdd.value,
  },
  {
    key: 'semester',
    title: 'semester',
    component: CpManaging,
    isDisabled: viewAdd.value,
    dataTab: {
      titlePage: t('semester'),
      header: [
        { text: '', value: 'checkbox', width: 50 },
        { text: t('exam-title'), value: 'testName' },
        { text: t('status-name'), value: 'statusName', type: 'custom', isStatus: true, statusType: StatusTypeCourse },
        { text: t('name-exam'), value: 'examName' },
        { text: t('semester'), value: 'typeId', type: 'custom', isDataId: true, statusType: semesterCb, width: 200 },
        { text: '', value: 'actions', width: 150 },
      ],
      isDisabledAdd: isDisabledAdd.value,
      apiList: {
        api: CourseService.GetSemester,
        method: TYPE_REQUEST.GET,
        payload: {
          courseId: idCourse,
          pageNumber: null,
          pageSize: null,
        },
      },
      actionsTable: [
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],

      componentEdit: CpMdAddSemester,

      apiAdd: {
        api: CourseService.PostCreateSemester,
        method: TYPE_REQUEST.POST,
        params: {
          courseId: idCourse,
        },
      },

      apiEdit: {
        api: 'SharedService.PostUpdateTypeCost',
        method: TYPE_REQUEST.POST,
        params: {
          listTypePeriorCurrent,
        },
        excludeIds: computed(() => excludeIds.value),
      },
      apiDelete: {
        api: CourseService.PostDeleteSemester,
        method: TYPE_REQUEST.PUT,
        label: 'ids',
      },
      isShowExportExcel: false,
    },
  },
  {
    key: 'setting-option',
    title: 'setting-option',
    component: CpSettingCourse,
    isDisabled: viewAdd.value,
  },
])
function updateFetchData(data: any) {
  isDisabledAdd.value = data.length >= 2
  excludeIds.value = []
  listTypePeriorCurrent.value = []
  data.forEach((item: any) => {
    excludeIds.value.push(item.testId)
    listTypePeriorCurrent.value.push(item.typeId)
  })
}

onBeforeUnmount(() => {
  $reset(storeCourseInforManager.$state)
  storeCourseInforManager.$dispose()
})

onDeactivated(() => {
  storeCourseInforManager.$dispose()
})
</script>

<template>
  <CmTab
    :list-tab="listtab"
    label="tab"
    @updateFetchData="updateFetchData"
  />
</template>
