<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'
import CmImg from '@/components/common/CmImg.vue'
import DateUtil from '@/utils/DateUtil'
import CmButton from '@/components/common/CmButton.vue'
import CmCard from '@/components/common/CmCard.vue'
import CpMdCourseRequired from '@/components/page/users/course/course-detail/modal/CpMdCourseRequired.vue'
import { myCourseManagerStore } from '@/stores/user/course/course'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), ({
  data: () => ({}),
}))
const emit = defineEmits<Emit>()
interface Props {
  data?: any
}

/** ** Interface */
interface Emit {
  (e: 'registerCourse', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const myCourseManagerManager = myCourseManagerStore()
const { getStatusCourse } = myCourseManagerManager

const dataContent = computed(() => [
  {
    icon: 'ic:baseline-code',
    content: `Mã khóa học ${props.data.code}`,
  },
  {
    icon: 'tabler:book-2',
    content: `${props.data.numberOfContent} nội dung`,
  },
  {
    icon: 'tabler:clock-hour-4',
    content: `${DateUtil.formatSecond(props.data.durationByMinute, 'vi')}`,
  },
  {
    icon: 'ic:baseline-monitor',
    content: props.data.formOfStudyName === 'CourseService.Online' ? t('form-study-online') : t('form-study-offline'),
  },
  {
    icon: 'tabler:award',
    content: props.data.certificationId ? t('ceft-sussess-yes') : t('ceft-sussess-no'),
  },
  {
    icon: 'tabler:calendar-event',
    content: props.data.courseEndDate,
  },
])
function getImage(type = 0) {
  return MethodsUtil.getRandomImage(type)
}

const isExpired = computed(() => {
  if (props.data.studyTimeType <= 0)
    return false
  let dateCheck: any = null
  switch (props.data.studyTimeType) {
    case 1:
      if (!props.data.startDate)
        return false
      dateCheck = new Date(props.data.startDate)
      break
    case 2:
      dateCheck = new Date(props.data.modifiedDate)
      break
    case 3:
      if (!props.data.registeredDate)
        return false
      dateCheck = new Date(props.data.registeredDate)
      break
    default:
      break
  }
  const currentDate: any = new Date()
  return (currentDate - dateCheck - props.data.studyTime * 86400000) > 0
})

/** Kiểm tra action khi click button */
async function goToLearn(id: number, idBtn: number, unLoadComponent: any) {
  unLoadComponent(idBtn)
  const actionType = getStatusCourse(props.data.formOfRegistrationId, props.data.statusId, props.data.isReviewExpired, props.data.courseEndDate)
  if (actionType.key === 1) {
    emit('registerCourse', id)
  }
  else {
    const [requiredCourses, requiredProficiencies]: any = await checkCourseCondition(id)
    if (window._.isEmpty(requiredCourses) && window._.isEmpty(requiredProficiencies)) {
      if ([2, 3, 4, 11].includes(actionType.key)) {
        const query = { ...route.query }
        router.push({ name: 'course-learning', params: { id }, query: { ...query } })
      }
      if ([6].includes(actionType.key))
        toast('WARNING', t('no-review-course'))
    }
    else {
      openModalNotifi(requiredProficiencies, requiredCourses)
    }
  }
}
const isShowModalNotiCourse = ref(false)
const dataCourseRequire = ref(false)
const dataProficiencyRequire = ref(false)
function openModalNotifi(val: any, value: any) {
  isShowModalNotiCourse.value = true
  dataCourseRequire.value = value
  dataProficiencyRequire.value = val
}

/** Kiểm tra điều kiện khóa học */
async function checkCourseCondition(courseId: number) {
  const params = {
    courseId,
  }
  let [requiredCourses, requiredProficiencyIds] = await Promise.all(
    [
      MethodsUtil.requestApiCustom(CourseService.GetLnCheckCourseRequire, TYPE_REQUEST.GET, params),
      MethodsUtil.requestApiCustom(CourseService.GetLnCourseProfRequire, TYPE_REQUEST.GET, params),
    ])
  requiredCourses = requiredCourses.data || []
  requiredProficiencyIds = requiredProficiencyIds.data || []
  let requiredProficiencies: never[] = []

  // danh sách năng lực cần đạt
  if (requiredProficiencyIds.length > 0) {
    const paramsProf = {
      pageNumber: 1,
      pageSize: 10,
      ListId: requiredProficiencyIds,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetLnCheckCourseProfRequire, TYPE_REQUEST.GET, paramsProf)
      .then((result: any) => {
        requiredProficiencies = result.data
      })
  }
  return [requiredCourses, requiredProficiencies]
}
</script>

<template>
  <div>
    <CmCard
      padding="14px 8px"
      hide-action
      height="auto"
    >
      <template #title>
        <div class="v-card-img mb-3">
          <CmImg
            :src="MethodsUtil.urlImageFile(getImage())"
            height="170px"
            cover
          />
        </div>
        <VCardTitle>
          <div
            v-if="props.data.statusId"
            class="d-flex flex-nowrap"
          >
            <div class="w-100 mr-3 ">
              <VProgressLinear
                rounded-bar
                :model-value="data?.progress?.toFixed()"
                color="success"
                class="mt-6"
                rounded
                height="8"
              />
            </div>
            <div class="text-medium-sm d-flex align-end label-ratio">
              {{ `${data.progress?.toFixed()}` }} %
            </div>
          </div>
        </VCardTitle>
      </template>
      <template #text>
        <div class="listBox">
          <template v-for="(item, index) in dataContent">
            <div
              v-if="item.content"
              :key="index"
              :title="t('code')"
              class="list-item d-flex mt-3 text-regular-sm"
            >
              <div class="listIcon mr-3 d-flex align-center">
                <VIcon
                  :icon="item.icon"
                  size="16"
                />
              </div>
              <div class="listContent">
                {{ item.content }}
              </div>
            </div>
          </template>
        </div>
      </template>
      <div class="px-4">
        <CmButton
          is-load
          class="w-100 button-action"
          color="primary"
          :disabled="data.statusId === 6 || [1, 2].includes(data.courseStatusId) || getStatusCourse(data.formOfRegistrationId, data.statusId, data.isReviewExpired, data.courseEndDate, data.courseStartDate).btnValue === t('end')"
          @click="($id, $event) => goToLearn(data.id, $id, $event)"
        >
          {{ [1, 2].includes(data.courseStatusId) ? $t('CourseService.Editing') : $t(getStatusCourse(data.formOfRegistrationId, data.statusId, data.isReviewExpired, data.courseEndDate, data.courseStartDate, isExpired).btnValue) }}
        </CmButton>
      </div>
    </CmCard>
    <CpMdCourseRequired
      v-model:isShowModal="isShowModalNotiCourse"
      :data-course="dataCourseRequire"
      :data-proficiency="dataProficiencyRequire"
    />
  </div>
</template>
