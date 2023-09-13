<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import CmTab from '@/components/common/CmTab.vue'
import CmButton from '@/components/common/CmButton.vue'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import CmTable from '@/components/common/CmTable.vue'
import CpContentParent from '@/components/page/users/course/course-detail/components/CpContentParent.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

interface Props {
  data?: any
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({}),
}))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'introduce',
    title: 'introduce',
    isSlot: true,
    isRendered: true,
  },
  {
    key: 'content',
    title: 'content',
    isSlot: true,
    isRendered: false,
  },
  {
    key: 'capacity',
    title: 'capacity',
    isSlot: true,
    isRendered: false,
  },
]

const showHideIntr = ref(true)

function showMore() {
  showHideIntr.value = !showHideIntr.value
}

const paramsCapacity = ref()
const headers = ref([
  { text: t('capacity-name'), value: 'proencyName' },
  { text: t('level'), value: 'levelName' },
])

const dataContent = ref([])
const route = useRoute()
const config = ref({
  wheelPropagation: false,
})
function getContentCourseById() {
  const params = {
    courseId: route.params.id,
  }
  MethodsUtil.requestApiCustom(CourseService.GetContentByCourseId, TYPE_REQUEST.GET, params).then((result: any) => {
    dataContent.value = result.data
  })
}
function getCapacityCourse() {
  const params = {
    id: route.params.id,
  }
  MethodsUtil.requestApiCustom(CourseService.GetCapacityCourse, TYPE_REQUEST.GET, params).then((result: any) => {
    paramsCapacity.value = result.data
  })
}
function activeTab(val: any) {
  if (val === 'capacity')
    getCapacityCourse()
  if (val === 'content')
    getContentCourseById()
}
</script>

<template>
  <div class="cm-detail">
    <CmTab
      :is-render="true"
      :list-tab="listTab"
      label="type"
      @activeTab="activeTab"
    >
      <template #default="{ context }">
        <div v-if="context.key === 'introduce'">
          <div class="cm-introduce mb-4">
            <div class="cm-intr-title text-semibold-md mt-6">
              Mô tả về khóa học
            </div>
            <div
              id="myDiv"
              class="cm-intr-desc mt-4"
              :class="{ 'text-over-hide': showHideIntr }"
              v-html="data.about"
            />
            <div v-if="data.about">
              <CmButton
                v-if="showHideIntr"
                id="showMoreButton"
                variant="text"
                color="primary"
                class="px-0"
                @click="showMore"
              >
                <div class="d-flex flex-noWrap">
                  <div>
                    Hiện thêm
                  </div>
                  <VIcon icon="tabler:chevron-down" />
                </div>
              </CmButton>
              <CmButton
                v-if="!showHideIntr"
                variant="text"
                color="primary"
                class="px-0"
                @click="showMore"
              >
                <div class="d-flex flex-noWrap">
                  <div>
                    Ẩn bớt
                  </div>
                  <VIcon icon="tabler:chevron-up" />
                </div>
              </CmButton>
            </div>
          </div>
          <div class="cm-teachter">
            <div class="text-semibold-md mb-4">
              Thông tin tác giả
            </div>
            <CpCustomInfo
              :context="data?.authors?.[0]"
              :size="96"
              is-classic-border
            />
          </div>
        </div>
        <div v-if="context.key === 'content'">
          <div class="box-content-course">
            <PerfectScrollbar
              :options="config"
              style="max-height: 900px;"
            >
              <CpContentParent :data="dataContent" />
            </PerfectScrollbar>
          </div>
        </div>
        <div
          v-if="context.key === 'capacity'"
          class="my-6"
        >
          <CmTable
            is-border-row
            :headers="headers"
            :items="paramsCapacity"
            disiable-pagination
            :min-height="150"
          />
        </div>
      </template>
    </CmTab>
  </div>
</template>

<style scoped lang="scss">
.cm-detail{
  .cm-intr-title{
    color: rgb(var(--v-gray-900))
  }
  .cm-intr-desc{
    text-align: justify;
    &.text-over-hide{
      display: -webkit-box;
      -webkit-line-clamp: 3; /* Số hàng tối đa muốn hiển thị */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre-wrap;
    }
  }
  .box-content-course{
    border: 1px solid rgb(var(--v-gray-300));
    margin-block: 24px;
    border-radius: 8px;
  }
}
</style>
