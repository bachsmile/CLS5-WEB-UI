<script setup lang="ts">
import CmCollapse from '@/components/common/CmCollapse.vue'
import CpMyCourseFilter from '@/components/page/users/course/components/CpMyCourseFilter.vue'
import CpMyCourseItemCard from '@/components/page/users/course/components/CpMyCourseItemCard.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmSwitch from '@/components/common/CmSwitch.vue'
import CpMyCourseItemHome from '@/components/page/users/course/item/CpMyCourseItemHome.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CmPagination from '@/components/common/CmPagination.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CourseService from '@/api/course/index'
import type { Any } from '@/typescript/interface'
import ObjectUtil from '@/utils/ObjectUtil'
import CmImg from '@/components/common/CmImg.vue'
import CmTable from '@/components/common/CmTable.vue'
import CpCustomInforCourse from '@/components/page/gereral/CpCustomInforCourse.vue'
import StringUtil from '@/utils/StringUtil'
import DateUtil from '@/utils/DateUtil'

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()
const isShowFilter = ref(true)

const queryParams = ref<any>({
  sort: '-date',
  typeId: 1,
  studyTypeId: null,
  topicIds: [],
  keyword: null,
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

// keyword ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.keyword = value
  getListMyCourseHome()
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
const myCourseHome = ref<course[]>([])
const totalRecord = ref(0)
const groupType = ref(route.query.type)
function getListMyCourseHome() {
  MethodsUtil.requestApiCustom(CourseService.GetListMyCourseHome, TYPE_REQUEST.GET, queryParams.value).then((result: any) => {
    myCourseHome.value = result?.data?.pageLists ?? []
    totalRecord.value = result?.data?.totalRecord
  })
}
function pageChange(pageNumber: any) {
  queryParams.value.pageNumber = pageNumber
  getListMyCourseHome()
}

//  Bấm nút vào nội dung khóa học
async function clickDetailCourse(item: any, actionClick: any) {
  if (item) {
    const { id } = item
    switch (actionClick) {
      case 'start':
      case 'continue':

        // const [requiredCourses, requiredProficiencies] = await this.checkCourseCondition(id)
        // if ((requiredCourses && requiredCourses.length > 0) || (requiredProficiencies && requiredProficiencies.length > 0))
        //  openModalNotifi(requiredProficiencies, requiredCourses)

        // else
        router.push({ name: 'course-learning', params: { id }, query: {} })

        break
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
  { text: t('author-name'), value: 'fullname', type: 'custom' },
  { text: t('start-time'), value: 'startDate', type: 'custom' },
  { text: t('end-time'), value: 'endDate', type: 'custom' },
])

onMounted(async () => {
  groupType.value = 'homePage'
  if (Object.keys(route.query).length > 1) {
    queryParams.value.keyword = route.query.keyword ? route.query.keyword as string : queryParams.value.keyword
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

  else { await getListMyCourseHome() }
})
watch(queryParams, (val: Any) => {
  const params = ObjectUtil.omitByDeep(JSON.parse(JSON.stringify(val)))
  router.push({
    query: {
      type: route.query.type,
      ...params,
    },
  })
  getListMyCourseHome()
}, { deep: true })
</script>

<template>
  <div class="mt-6">
    <div class="mt-6">
      <div class="text-medium-lg mb-6">
        {{ t('course-home') }}
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
          :keyword="queryParams.keyword"
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
        <div v-if="myCourseHome?.length">
          <VRow>
            <VCol
              v-for="item in myCourseHome"
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
                <CpMyCourseItemHome :data="item" />
              </CpMyCourseItemCard>
            </VCol>
          </VRow>
          <CmPagination
            :type="3"
            :total-items="totalRecord"
            :current-page="1"
            :page-size="12"
            :total-visible="3"
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
          :items="myCourseHome"
          :total-record="totalRecord"
          :type-pagination="1"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'courseName'">
              <CpCustomInforCourse
                label-title="name"
                :context="context"
              />
            </div>
            <div v-if="col === 'fullname'">
              {{ StringUtil.formatFullName(context?.author?.firstName, context?.author?.lastName) || '-' }}
            </div>
            <div v-if="col === 'topicName'">
              {{ context?.topicName || '-' }}
            </div>
            <div v-if="col === 'startDate'">
              <div class="text-nowrap">
                {{ DateUtil.formatTimeToHHmm(context[col]) }} {{ DateUtil.formatDateToDDMM(context[col], '-') }}
              </div>
            </div>
            <div v-if="col === 'endDate'">
              <div class="text-nowrap">
                {{ DateUtil.formatTimeToHHmm(context[col]) }} {{ DateUtil.formatDateToDDMM(context[col], '-') }}
              </div>
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
