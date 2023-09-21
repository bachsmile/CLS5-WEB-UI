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
import toast from '@/plugins/toast'

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
    key: 'document',
    title: 'CourseContent.Document',
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
const serverfile = window.SERVER_FILE || ''

function showMore() {
  showHideIntr.value = !showHideIntr.value
}

const paramsCapacity = ref()
const headers = ref([
  { text: t('capacity-name'), value: 'name', type: 'custom', width: 500 },
  { text: t('level'), value: 'levelName' },
])

const dataContent = ref([])
const route = useRoute()
const config = ref({
  wheelPropagation: false,
  suppressScrollX: true,
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
    courseId: route.params.id,
  }
  MethodsUtil.requestApiCustom(CourseService.GetCapacityCourse, TYPE_REQUEST.GET, params).then((result: any) => {
    paramsCapacity.value = result.data
  })
}
const paramsDocument = ref<any[]>([])
function getDocumentCourse() {
  const params = {
    courseId: route.params.id,
  }
  MethodsUtil.requestApiCustom(CourseService.GetDocumentCourse, TYPE_REQUEST.GET, params).then((result: any) => {
    paramsDocument.value = result.data
  })
}
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE

async function downloadFile(idx: any, unLoadComponent: any, urlFileName?: any) {
  await MethodsUtil.getDocLocalInfoFileDown(urlFileName).then(value => {
    MethodsUtil.dowloadSampleFile(`${SERVERFILE}${value.filePath}`,
      TYPE_REQUEST.GET, value.fileName || 'local').then((data: any) => {
      unLoadComponent(idx)
      if (data.status === 200)
        return true

      else
        toast('WARNING', t('download-file-failed'))
    })
      .catch(() => {
        unLoadComponent(idx)
      })
    unLoadComponent(idx)
  })
}
function activeTab(val: any) {
  if (val === 'capacity')
    getCapacityCourse()
  if (val === 'content')
    getContentCourseById()
  if (val === 'document')
    getDocumentCourse()
}
function expandRow(val: any) {
  paramsCapacity.value[val.originIndex].expanded = !paramsCapacity.value[val.originIndex].expanded
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
              {{ t('course-data-about') }}
            </div>
            <div v-if="!data.about">
              {{ t('empty-data-intro') }}
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
              v-if="dataContent?.length"
              :options="config"
              style="max-height: 900px;"
            >
              <CpContentParent :data="dataContent" />
            </PerfectScrollbar>
            <div
              v-else
              class="d-flex justify-center"
            >
              <div>
                <VImg
                  :width="300"
                  aspect-ratio="16/9"
                  cover
                  :src="`${serverfile}/badge/eventDefault.png`"
                />
                <div class="mt-2 text-center">
                  {{ t('empty-data') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="context.key === 'document' "
          class="py-6"
        >
          <PerfectScrollbar
            v-if="paramsDocument?.length"
            :options="config"
            style="max-height: 900px; min-height: 85px;"
          >
            <VRow class="dc-box">
              <VCol
                v-for="doc in paramsDocument"
                :key="doc.id"
                cols="12"
                sm="6"
              >
                <div class="dc-item">
                  <div class="dc-item-content mr-1">
                    <div
                      class="text-medium-sm text-truncate"
                      title=""
                    >
                      {{ doc.contentArchiveName }}
                    </div>
                    <div class="text-regular-sm dc-sub-title text-truncate">
                      {{ doc.topicName }}
                    </div>
                  </div>
                  <div class="dc-item-action d-flex align-center">
                    <CmButton
                      icon="tabler:download"
                      :size-icon="20"
                      variant="tonal"
                      @click="(idx, event) => downloadFile(idx, event, doc.fileUrl)"
                    />
                  </div>
                </div>
              </VCol>
            </VRow>
          </PerfectScrollbar>
          <div
            v-else
            class="d-flex justify-center"
          >
            <div>
              <VImg
                :width="300"
                aspect-ratio="16/9"
                cover
                :src="`${serverfile}/badge/eventDefault.png`"
              />
              <div class="mt-2 text-center">
                {{ t('empty-data') }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="context.key === 'capacity'"
          class="my-6"
        >
          <CmTable
            is-expand
            is-border-row
            :headers="headers"
            :items="paramsCapacity"
            disiable-pagination
            :min-height="100"
            @update:expand="expandRow"
          >
            <template
              #tableSub="{ content }"
            >
              <div>
                <CmTable
                  :headers="headers"
                  :items="content?.proficiencies || []"
                  disiable-pagination
                  table-class="tableClass"
                  :min-height="100"
                  @update:expand="expandRow"
                >
                  <template #rowItem="{ col, context }">
                    <div
                      v-if="col === 'name'"
                      class="d-flex algin-center"
                    >
                      <div>
                        {{ context.name }}
                      </div>
                    </div>
                  </template>
                </CmTable>
              </div>
            </template>
            <template #rowItem="{ col, context }">
              <div
                v-if="col === 'name'"
                class="d-flex algin-center"
              >
                <div class="mr-2">
                  <VIcon
                    :icon="context.expanded ? 'tabler:chevron-up' : 'tabler:chevron-down'"
                  />
                </div>
                <div>
                  {{ context.name }}
                </div>
              </div>
            </template>
          </CmTable>
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
  .dc-box{
    .dc-item{
      border-radius: 8px;
      border: 1px solid rgb(var(--v-gray-300));
      background:  #FFF;
      display: flex;
      padding: 1rem;
      .dc-item-content{
        width: 90%;
        max-width: 90%;
        .dc-sub-title{
          color: rgb(var(--v-gray-500))
        }
      }
      .dc-item-action{
        width: 10%;
      }
    }
  }
}
</style>

<style  lang="scss">
.tableClass{
  border: unset !important;
  border-radius: unset !important;
  th{
    display: none;
  }
}
</style>
