<script setup lang="ts">
import CpContentGoingOn from './item/CpContentGoingOn.vue'
import CpContentComing from './item/CpContentComing.vue'
import CpContentFinished from './item/CpContentFinished.vue'
import CpMyExamFilter from './components/CpMyExamFilter.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmSwitch from '@/components/common/CmSwitch.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CmPagination from '@/components/common/CmPagination.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import ObjectUtil from '@/utils/ObjectUtil'
import CmImg from '@/components/common/CmImg.vue'
import CmTable from '@/components/common/CmTable.vue'
import DateUtil from '@/utils/DateUtil'
import CpMyItemCard from '@/components/page/gereral/CpMyItemCard.vue'
import QuestionService from '@/api/question'
import CmButton from '@/components/common/CmButton.vue'

const props = withDefaults(defineProps<Props>(), {}) /** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()
const isShowFilter = ref(true)
interface Props {
  type: number
}
const queryParams = ref<any>({
  search: '',
  fromDate: '',
  toDate: '',
  pageSize: 12,
  pageNumber: 1,
  typeId: 2,
  groupId: props.type,
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
  getListMyExam()
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
const myExam = ref<course[]>([])
const totalRecord = ref(0)
function getListMyExam() {
  MethodsUtil.requestApiCustom(QuestionService.GetMyListExam, TYPE_REQUEST.GET, queryParams.value).then((result: any) => {
    myExam.value = result?.data?.dataPaging ?? []
    totalRecord.value = result?.data?.totalRecord
  })
}
function pageChange(pageNumber: any) {
  queryParams.value.pageNumber = pageNumber
  getListMyExam()
}

//  Bấm nút vào nội dung khóa học
async function clickDetail(item: any, actionClick?: any) {
  router.push({ name: 'my-test', params: { id: item.examId } })
}
function getImage(id: number): string {
  const result = MethodsUtil.getThemeItem(1)(id)
  return typeof result === 'string' ? result : ''
}

// view table
const headers = ref([
  { text: t('KW_Exam_Test_Name'), value: 'name' },
  { text: t('name-exam'), value: 'examName' },
  { text: t('topic'), value: 'topicName' },
  { text: t('start-time'), value: 'startTime', type: 'custom' },
  { text: t('end-time'), value: 'endTime', type: 'custom' },
  { text: '', value: 'action', type: 'custom' },
])

onMounted(async () => {
  console.log(route.query.fromDate)
  console.log(new Date(route.query.fromDate))

  if (Object.keys(route.query).length > 1) {
    queryParams.value.search = route.query.search ? route.query.search as string : queryParams.value.search
    queryParams.value.toDate = route.query.toDate ? new Date(route.query.toDate) : null
    queryParams.value.fromDate = route.query.fromDate ? new Date(route.query.fromDate) : null
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

  else { await getListMyExam() }
})
watch(queryParams, (val: Any) => {
  const params = ObjectUtil.omitByDeep(JSON.parse(JSON.stringify(val)))
  router.push({
    query: {
      type: route.query.type,
      ...params,
    },
  })
  getListMyExam()
}, { deep: true })
const titleButton = computed(() => (isDoing: boolean) => isDoing ? t('continue-exam') : t('enter-the-exam'))
const isShowButton = computed(() => {
  return (item: Any) => {
    return !item.isSuspended && props.type === 2 && !item.isComplete
  }
})

const isComponent = computed(() => {
  switch (props.type) {
    case 2:
      return CpContentGoingOn
    case 1:
      return CpContentComing
    case 3:
      return CpContentFinished

    default:
      break
  }
})
</script>

<template>
  <div class="mt-6">
    <div class="mt-6">
      <div class="text-medium-lg mb-6">
        {{ t('course-happening') }}
      </div>
      <CmCollapse :is-show="isShowFilter">
        <CpMyExamFilter
          v-model:topicIds="queryParams.topicIds"
          v-model:startTime="queryParams.fromDate"
          v-model:endTime="queryParams.toDate"
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
        <div v-if="myExam?.length">
          <VRow>
            <VCol
              v-for="item in myExam"
              :key="item.id"
              cols="12"
              sm="6"
              md="3"
            >
              <CpMyItemCard
                :code="item.examCode"
                :name="item.examName"
                :label="item.name"
                :is-show-button="isShowButton(item)"
                :title-button="titleButton(item.isLearnerWork)"
                @click="clickDetail(item)"
              >
                <Component
                  :is="isComponent"
                  :item="item"
                />
              </CpMyItemCard>
            </VCol>
          </VRow>
          <CmPagination
            :type="3"
            :total-items="totalRecord"
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
          :items="myExam"
          :total-record="totalRecord"
          :type-pagination="1"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'startTime'">
              <div class="text-noWrap">
                <span>{{ DateUtil.formatTimeToHHmm(context.startDate) }}  {{ DateUtil.formatDateToDDMM(context.startDate) }} </span>
              </div>
            </div>
            <div v-if="col === 'endTime'">
              <div class="text-noWrap">
                <span>{{ DateUtil.formatTimeToHHmm(context.endDate) }}  {{ DateUtil.formatDateToDDMM(context.endDate) }}  </span>
              </div>
            </div>
            <div
              v-if="col === 'action'"
            >
              <CmButton
                v-if="isShowButton(context)"
                variant="tonal"
                color="primary"
                @click="clickDetail(context.id)"
              >
                {{ titleButton(context.isLearnerWork) }}
              </CmButton>
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
