<script setup lang="ts">
import CmCollapse from '@/components/common/CmCollapse.vue'
import CpMyCourseFilter from '@/components/page/users/course/components/CpMyCourseFilter.vue'
import CpMyCourseItemCard from '@/components/page/users/course/components/CpMyCourseItemCard.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmSwitch from '@/components/common/CmSwitch.vue'
import CpMyCourseItemFinished from '@/components/page/users/course/item/CpMyCourseItemFinished.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CmPagination from '@/components/common/CmPagination.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CourseService from '@/api/course/index'
import type { Any } from '@/typescript/interface'
import ObjectUtil from '@/utils/ObjectUtil'
import CmImg from '@/components/common/CmImg.vue'
import CmTable from '@/components/common/CmTable.vue'
import { StatusTypeFormStudy } from '@/constant/data/status.json'
import CmChip from '@/components/common/CmChip.vue'
import CpCustomInforCourse from '@/components/page/gereral/CpCustomInforCourse.vue'
import StringUtil from '@/utils/StringUtil'
import DateUtil from '@/utils/DateUtil'
import CmButton from '@/components/common/CmButton.vue'

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()
const isShowFilter = ref(true)

const queryParams = ref<any>({
  sort: '-date',
  typeId: 5,
  studyTypeId: null,
  topicIds: [],
  search: null,
  pageSize: 12,
  pageNumber: 1,
})

/** method */
// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    default:
      break
  }
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.search = value
  getListMyCourseFinish()
}

const activeSwitch = ref(false)
const action = reactive([
  {
    icon: 'tabler:layout-grid',
    value: false,
    action: () => activeSwitch.value = false,
  },
  {
    icon: 'ic:baseline-format-list-bulleted',
    value: true,
    action: () => activeSwitch.value = true,
  },
])
interface course {
  id: number
  [name: string]: any
}
const myCourseFinish = ref<course[]>([])
const totalFinish = ref(0)
const groupType = ref(route.query.type)
function getListMyCourseFinish() {
  MethodsUtil.requestApiCustom(CourseService.GetListMyCourse, TYPE_REQUEST.GET, queryParams.value).then((result: any) => {
    myCourseFinish.value = result?.data?.myCourseFinish ?? []
    totalFinish.value = result?.data?.totalFinish
  })
}
function pageChange(pageNumber: any) {
  queryParams.value.pageNumber = pageNumber
  getListMyCourseFinish()
}

//  Bấm nút vào nội dung khóa học
async function clickDetailCourse(item: any, actionClick: any) {
  if (item) {
    const { id } = item
    switch (actionClick) {
      case 'review':
        router.push({ name: 'course-review', params: { id }, query: {} })
        break
      case 'detail':
        router.push({ name: 'course-detail', params: { id }, query: {} })
        break
      default:
        router.push({ name: 'course-detail', params: { id }, query: {} })
        break
    }
  }
}
function getImage(id: number): string {
  const result = MethodsUtil.getThemeItem(1)(id)
  return typeof result === 'string' ? result : ''
}

// view table
const headers = ref([
  { text: t('Course_Name'), value: 'courseName', type: 'custom' },
  { text: t('topic'), value: 'topicName', type: 'custom' },
  { text: t('form-study'), value: 'formOfStudy', type: 'custom' },
  { text: t('author-name'), value: 'fullname', type: 'custom' },
  { text: t('Process'), value: 'process', type: 'custom' },
  { text: t('end-time'), value: 'courseEndDate', type: 'custom' },
  { text: '', value: 'action', type: 'custom' },
])
function review(row: any) {
  if (row.isReviewExpired)
    clickDetailCourse(row, 'detail')
  clickDetailCourse(row, 'review')
}
onMounted(async () => {
  groupType.value = 'finished'
  if (Object.keys(route.query).length > 1) {
    queryParams.value.search = route.query.search ? route.query.search as string : queryParams.value.search
    queryParams.value.sort = route.query.sort ? route.query.sort as string[] : []
    queryParams.value.studyTypeId = route.query.studyTypeId ? Number(route.query.studyTypeId) : queryParams.value.studyTypeId
    if (route.query.topicIds && route.query.topicIds?.length) {
      switch (typeof route.query.topicIds) {
        case 'object':
          queryParams.value.topicIds = (route.query.topicIds as any)?.map((item: any) => Number(item))
          break

        default:
          queryParams.value.topicIds = [Number(route.query.topicIds)]
          break
      }
    }
    else {
      queryParams.value.topicIds = []
    }

    queryParams.value.pageNumber = route.query.pageNumber ? Number(route.query.pageNumber) : queryParams.value.pageNumber
    queryParams.value.pageSize = route.query.pageSize ? Number(route.query.pageSize) : queryParams.value.pageSize
  }

  else { await getListMyCourseFinish() }
})
watch(queryParams, (val: Any) => {
  groupType.value = 'finished'
  const params = ObjectUtil.omitByDeep(JSON.parse(JSON.stringify(val)))
  router.push({
    query: {
      type: route.query.type,
      ...params,
    },
  })
  getListMyCourseFinish()
}, { deep: true })
</script>

<template>
  <div class="mt-6">
    <div class="mt-6">
      <div class="text-medium-lg mb-6">
        {{ t('CSE_CourseEndDateRequire') }}
      </div>
      <CmCollapse :is-show="isShowFilter">
        <CpMyCourseFilter
          v-model:topicIds="queryParams.topicIds"
          v-model:studyTypeId="queryParams.studyTypeId"
          v-model:sort="queryParams.sort"
        />
      </CmCollapse>
      <div class="my-3">
        <CpHeaderAction
          is-fillter
          :keyword="queryParams.search"
          @click="handleClickBtn"
          @update:keyword="handleSearch"
        >
          <template #actionEnd>
            <div class="ml-3">
              <CmSwitch
                v-model="activeSwitch"
                color="secondary"
                :list-item="action"
              />
            </div>
          </template>
        </CpHeaderAction>
      </div>
      <div
        v-show="!activeSwitch"
        class="my-course-list"
      >
        <div v-if="myCourseFinish?.length">
          <VRow>
            <VCol
              v-for="item in myCourseFinish"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              xl="3"
            >
              <CpMyCourseItemCard
                :data="item"
                :group-type="groupType"
                @click="clickDetailCourse"
              >
                <CpMyCourseItemFinished :data="item" />
              </CpMyCourseItemCard>
            </VCol>
          </VRow>
          <CmPagination
            :type="3"
            :total-items="totalFinish"
            :current-page="1"
            :page-size="12"
            @pageClick="pageChange"
          />
        </div>
        <div
          v-else
        >
          <div class="d-flex justify-center">
            <div style="width: 200px;">
              <CmImg
                :src="MethodsUtil.urlImageFile(getImage(6))"
                cover
              />
            </div>
          </div>
          <div class="d-flex justify-center">
            {{ t('empty-data') }}
          </div>
        </div>
      </div>
      <div v-show="activeSwitch">
        <CmTable
          v-model:page-number="queryParams.pageNumber"
          v-model:page-size="queryParams.pageSize"
          :headers="headers"
          :items="myCourseFinish"
          :total-record="totalFinish"
          :type-pagination="1"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'courseName'">
              <CpCustomInforCourse
                label-title="name"
                :context="context"
              />
            </div>

            <div v-if="col === 'formOfStudy'">
              <CmChip
                v-if="context.formOfStudy"
                :color="MethodsUtil.checkType(context.formOfStudy, StatusTypeFormStudy, 'id')?.color"
              >
                <VIcon
                  start
                  icon="carbon:dot-mark"
                  size="12"
                />
                <span>{{ t(MethodsUtil.checkType(context.formOfStudy, StatusTypeFormStudy, 'id')?.name) }}</span>
              </CmChip>
            </div>
            <div v-if="col === 'fullname'">
              {{ StringUtil.formatFullName(context?.author?.firstName, context?.author?.lastName) || '-' }}
            </div>
            <div v-if="col === 'topicName'">
              {{ context?.topicName || '-' }}
            </div>
            <div v-if="col === 'process'">
              <VProgressLinear
                rounded-bar
                :model-value="context.completionRatio.toFixed()"
                color="success"
                class="mt-6"
                rounded
                height="8"
              />
            </div>
            <div v-if="col === 'courseEndDate'">
              <div class="text-noWrap">
                {{ DateUtil.formatTimeToHHmm(context[col]) }} {{ DateUtil.formatDateToDDMM(context[col], '-') }}
              </div>
            </div>
            <div v-if="col === 'action'">
              <CmButton
                class="w-100 button-action"
                :title="t('review')"
                color="primary"
                variant="text"
                @click="review(context)"
              />
            </div>
          </template>
        </CmTable>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.my-course-list{
  margin-block: 24px;
}
</style>
