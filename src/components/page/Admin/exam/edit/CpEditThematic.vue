<!-- eslint-disable indent -->
<script lang="ts" setup>
import CpInfoThematic from '@/components/page/Admin/exam/edit/thematic/components/CpInfoThematic.vue'
import ExamService from '@/api/exam'
import CpTabsOrder from '@/components/page/gereral/CpTabsOrder.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import toast from '@/plugins/toast'
import router from '@/router'
import CpAsignTypeUser from '@/components/page/gereral/asign-user/CpAsignTypeUser.vue'
import CpAsignGroupUser from '@/components/page/gereral/asign-user/CpAsignGroupUser.vue'
import CpTestThematicList from '@/components/page/Admin/exam/edit/thematic/components/CpTestThematicList.vue'
import CpShiftTest from '@/components/page/Admin/exam/edit/thematic/components/CpShiftTest.vue'
import CmTab from '@/components/common/CmTab.vue'
import CmButton from '@/components/common/CmButton.vue'

const emit = defineEmits<Emit>()
const route = useRoute()
const { t } = window.i18n()

const tabThematic = ref('info')
interface DataInput {
  fromDate: any
  isHandWork: boolean
  isShift: boolean
  name: string
  examId: number
  todate: any
  topicId: number | null
  id?: number
  ratingScale?: number | null
  certificationTemplateId?: number | null
}
interface Emit {
  (e: 'update:isShowAdd', data: boolean): void
  (e: 'onCancel'): void
  (e: 'fetchList'): void
}
const dataInput = ref<DataInput>({
  name: '',
  fromDate: null,
  examId: Number(route.params.id),
  todate: null,
  topicId: null,
  ratingScale: null,
  certificationTemplateId: null,
  isHandWork: true,
  isShift: false,
})

function updatedListTab() {
  const dynamicTabs = dataInput.value.isShift
    ? [
        {
          key: 'poetry',
          title: 'poetry',
          icon: 'tabler:bell',
          isDisabled: computed(() => !route.params.thematicId).value,
        },
      ]
    : []

  const staticTabs = [
    {
      key: 'info',
      title: 'info',
      icon: 'clarity:exclamation-circle-line',
    },
    {
      key: 'teacher',
      title: 'Teacher',
      icon: 'ci:user-check',
      isDisabled: computed(() => !route.params.thematicId).value,
    },
    {
      key: 'monitor',
      title: 'monitor',
      icon: 'tabler:eye',
      isDisabled: computed(() => !route.params.thematicId).value,
    },
    {
      key: 'candidate',
      title: 'candidate',
      icon: 'tabler:user',
      isDisabled: computed(() => !route.params.thematicId).value,
    },
    {
      key: 'test-thematic',
      title: 'original-exam-question',
      icon: 'material-symbols:edit-square-outline',
      isDisabled: computed(() => !route.params.thematicId).value,
    },
  ]

  return [...staticTabs, ...dynamicTabs]
}

// lấy dữ liệu detail
async function getDetailSurveyTopic() {
  const params = {
    id: route.params.thematicId,
  }
  MethodsUtil.requestApiCustom(ExamService.GetThematicById, TYPE_REQUEST.GET, params).then((result: Any) => {
    dataInput.value = result.data
  }).catch(() => {
    toast('ERROR', t('error'))
  })
}
if (route.params.thematicId)
  getDetailSurveyTopic()

// Thêm chuyên đề khảo sát
const myForm = ref()
async function createThematic(isUpdate: boolean, idx: number, unload: any) {
  await myForm.value.isSubmit().then((success: any) => {
    if (success.valid) {
      MethodsUtil.requestApiCustom(ExamService.PostCreateThematic, TYPE_REQUEST.POST, dataInput.value).then((result: Any) => {
        toast('SUCCESS', t(result.message) || t('add-thematic-success'))
        const routerQuery = window._.cloneDeep(route.query)
        if (isUpdate) {
          router.push({ name: 'exam-edit-thematic', query: { ...routerQuery }, params: { id: route.params.id, thematicId: result.data.testId } })
        }
        else {
          cancel()
          emit('fetchList')
        }
      }).catch((err: Any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
  })
  unload(idx)
}

// quay lại trang chuyên đề
function cancel() {
  const query = window._.cloneDeep(route.query)
  delete query.tabThematic
  router.push({ name: 'exam-edit', query: { ...query }, params: { id: route.params.id } })

  // emit('onCancel')
}

// sửa chuyên đề khảo sát
async function editThematic(idx: number, unload: any) {
  await myForm.value.isSubmit().then((success: any) => {
    if (success.valid) {
      MethodsUtil.requestApiCustom(ExamService.PostUpdateThematic, TYPE_REQUEST.POST, dataInput.value).then((result: Any) => {
        toast('SUCCESS', t(result.message) || t('update-thematic-success'))
        emit('fetchList')
        cancel()
      }).catch((err: Any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
      })
    }
  })
  unload(idx)
}
function confirm(isUpdate: boolean, idx: number, unload: any) {
  if (route.params.thematicId)
    editThematic(idx, unload)
  else
    createThematic(isUpdate, idx, unload)
}

function transferTab() {
  const query = window._.cloneDeep(route.query)
  delete query.assignTab
  delete query.type
  router.push({ query: { ...query, tabThematic: tabThematic.value } })
}

onMounted(() => {
  if (route.query.testTab) {
    const query = window._.cloneDeep(route.query)
    delete query.testTab
    router.push({ query })
  }

  if (route.query.tabThematic || tabThematic.value === '') {
    tabThematic.value = route.query.tabThematic as string
  }
  else {
    tabThematic.value = 'info'
    transferTab()
  }
})

/**
 *
 * tab
 */
const listTabCandidate = [
  {
    key: 'list-candidates',
    title: 'list-candidates',
    isSlot: true,
    isRendered: true,
  },
  {
    key: 'group-management',
    title: 'group-management',
    isSlot: true,
    isRendered: false,
  },
  {
    key: 'document',
    title: 'organizational',
    isSlot: true,
    isRendered: false,
  },
]
function activeTab(val: any) {
  // if (val === 'capacity')
  //   getCapacityCourse()
  // if (val === 'content')
  //   getContentCourseById()
  // if (val === 'document')
  //   getDocumentCourse()
}
</script>

<template>
  <div class="my-6">
    <span class="text-medium-lg">{{ t('add-survey-topics') }}</span>
  </div>

  <div class="d-flex flex-wrap">
    <CpTabsOrder
      v-model="tabThematic"
      :list-tab="updatedListTab()"
      @update:model-value="transferTab"
    />
  </div>
  <VDivider class="my-6" />

  <div v-show="route.query.tabThematic === 'info'">
    <CpInfoThematic
      ref="myForm"
      v-model:data="dataInput"
      @confirm="confirm"
      @cancel="cancel"
    />
  </div>

  <div v-if="route.query.tabThematic === 'teacher'">
    <CpAsignTypeUser
      :type-id="2"
    />
    <div class="mt-6 d-flex justify-end">
      <CmButton
        bg-color="bg-white"
        color="white"
        text-color="color-dark"
        @click="cancel"
      >
        {{ t('come-back') }}
      </CmButton>
    </div>
  </div>
  <div v-if="route.query.tabThematic === 'monitor'">
    <CpAsignTypeUser
      :type-id="3"
      :title="t('monitors')"
      :title-custom-btn="t('add-monitoring')"
      :type-title-name="t('name-monitoring')"
    />
    <div class="mt-6 d-flex justify-end">
      <CmButton
        bg-color="bg-white"
        color="white"
        text-color="color-dark"
        @click="cancel"
      >
        {{ t('come-back') }}
      </CmButton>
    </div>
  </div>

  <div v-if="route.query.tabThematic === 'candidate'">
    <CmTab
      :is-render="true"
      :list-tab="listTabCandidate"
      label="type"
      is-un-query
      @activeTab="activeTab"
    >
      <template #default="{ context }">
        <div v-if="context.key === 'list-candidates'">
          <CpAsignTypeUser
            :type-id="1"
            :title="t('list-candidates')"
            :title-custom-btn="t('add-candidates')"
            :type-title-name="t('name-candidates')"
          />
        </div>
        <div v-if="context.key === 'group-management'">
          <CpAsignGroupUser
            :type-id="4"
            :title="t('list-candidates')"
            :title-custom-btn="t('add-candidates')"
            :type-title-name="t('name-candidates')"
          />
        </div>
      </template>
    </CmTab>
    <div class="mt-6 d-flex justify-end">
      <CmButton
        bg-color="bg-white"
        color="white"
        text-color="color-dark"
        @click="cancel"
      >
        {{ t('come-back') }}
      </CmButton>
    </div>
  </div>
  <div v-if="route.query.tabThematic === 'test-thematic'">
    <CpTestThematicList :type-id="2" />
    <div class="mt-6 d-flex justify-end">
      <CmButton
        bg-color="bg-white"
        color="white"
        text-color="color-dark"
        @click="cancel"
      >
        {{ t('come-back') }}
      </CmButton>
    </div>
  </div>
  <div v-if="route.query.tabThematic === 'poetry'">
    <CpShiftTest @cancel="cancel" />
  </div>
</template>
