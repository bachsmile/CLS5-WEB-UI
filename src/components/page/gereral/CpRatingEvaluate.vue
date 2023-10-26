<script setup lang="ts">
import CmRating from '@/components/common/CmRating.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { reaction } from '@/constant/data/iconList.json'
import CmButton from '@/components/common/CmButton.vue'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringJwt from '@/utils/Jwt'
import DateUtil from '@/utils/DateUtil'
import { isUserLoggedIn } from '@/auth/utils'
import CmDropDown from '@/components/common/CmDropDown.vue'
import { ActionType } from '@/constant/data/actionType.json'
import CmChip from '@/components/common/CmChip.vue'
import CpMdAddEvaluated from '@/components/page/gereral/modal/CpMdAddEvaluated.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import toast from '@/plugins/toast'
import AuthUtil from '@/auth'

interface Props {
  data?: any
  generaRating?: any
  id?: number
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({}),
}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'update:generaRating'): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const getRating = computed(() => props?.generaRating?.averageRating ? Math.round(props?.generaRating?.averageRating * 2) / 2 : 0)
const queryParams = ref({
  pageNumber: 1,
  pageSize: 4,
  roleId: StringJwt.getRole(),
  courseId: route.params.id || props.id,
})

const listUserEvl = ref<any[]>([])
const totalRecordUserEvl = ref(0)
function getUserEvaluation(isViewMore?: boolean) {
  queryParams.value.courseId = route.params.id || props.id
  MethodsUtil.requestApiCustom(CourseService.GetUserEvaluation, TYPE_REQUEST.GET, queryParams.value).then((result: any) => {
    if (isViewMore) {
      listUserEvl.value = [
        ...listUserEvl.value,
        ...result.data.pageLists,
      ]
    }
    else {
      listUserEvl.value = result.data.pageLists
    }
    totalRecordUserEvl.value = result.data.totalRecord
  })
}

function action(dataItem: any) {
  if (AuthUtil.getUserData() && AuthUtil.getUserData().id === dataItem.userId) {
    return [
      {
        title: t('ActionEdit'),
        icon: ActionType[0].icon,
        color: ActionType[0].color,
        action: actionItemEdit,
      },
      {
        title: t('Delete'),
        icon: ActionType[1].icon,
        color: ActionType[1].color,
        action: actionItemDelete,
      },
    ]
  }
  return [
    {
      title: t('Delete'),
      icon: ActionType[1].icon,
      color: ActionType[1].color,
      action: actionItemDelete,
    },
  ]
}
function showMore() {
  queryParams.value.pageNumber += 1
  getUserEvaluation()
}

const isShowModal = ref(false)
function showMdAddEvaluated() {
  isShowModal.value = true
}
const isUserExist = ref()
const isDisableRating = computed(() => {
  return props.generaRating?.isRate || (!isUserExist.value?.isStudentInCourse) || (!isUserExist.value?.isTeacherInCourse)
})

async function checkUserExist() {
  const params = {
    courseId: route.params.id || props.id,
  }

  MethodsUtil.requestApiCustom(CourseService.GetCheckUserExist, TYPE_REQUEST.GET, params).then((result: any) => {
    isUserExist.value = result.data
  })
}
const isShowDialogDelete = ref(false)
const deletedId = ref()

function actionItemDelete(dataDel: any) {
  deletedId.value = dataDel[1].id
  isShowDialogDelete.value = true
}

const dataEval = ref()

function actionItemEdit(dataDel: any) {
  dataEval.value = dataDel[1]
  isShowModal.value = true
}
async function confirmDialogDelete() {
  const params = {
    id: deletedId.value,
    courseId: Number(route.params?.id || props.id),
    roleId: StringJwt.getRole(),
  }
  MethodsUtil.requestApiCustom(CourseService.PostDelEvaluation, TYPE_REQUEST.POST, params).then((result: any) => {
    toast('SUCCESS', t('delete-author-success'))
    getData()
    emit('update:generaRating')
  }).catch((err: any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}

async function getData(isUpdate?: boolean) {
  await getUserEvaluation()
  if (isUserLoggedIn())
    await checkUserExist()
  if (isUpdate)
    emit('update:generaRating')
}

getData()
</script>

<template>
  <div class="rt-box">
    <div class="rt-title text-semibold-lg">
      Đánh giá
    </div>
    <div class="card-container mt-6">
      <VRow>
        <VCol
          cols="12"
          md="3"
          sm="4"
        >
          <div class="pr-4">
            <div class="rt-ratio display-medium-md text-center">
              {{ generaRating?.averageRating }}
            </div>
            <div class="rt-rating-star">
              <CmRating
                :model-value="getRating"
                :disabled="true"
                :length="5"
                :size-icon="20"
                full-color="#FDB022"
                :full-icon=" MethodsUtil.checkType(3, reaction, 'value')?.fullIcon"
                :empty-icon=" MethodsUtil.checkType(3, reaction, 'value')?.emptyIcon"
              />
            </div>
            <div class="rt-evaluate text-medium-sm text-center">
              {{ generaRating?.total }} {{ t('evaluate') }}
            </div>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="9"
          sm="8"
        >
          <div class="progress-list d-flex flex-column-reverse">
            <div
              v-for="(item, index) in generaRating?.ratings"
              :key="index"
              class="progress-item d-flex "
            >
              <div class="w-100 d-flex align-center mr-2">
                <VProgressLinear
                  :title="`${item.total} ${t('QuestionService.SurveyRate').toLowerCase()}`"
                  :model-value="item.percent"
                  color="success"
                  height="8"
                  rounded
                />
              </div>
              <div class="text-nowrap progress-label text-regular-xs">
                {{ item.rate }} {{ t('stars') }}
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
    </div>
    <div class="d-flex justify-center">
      <CmButton
        v-if="isUserLoggedIn()"
        :disabled="isDisableRating"
        class="mt-4"
        :title="t('write-evaluate')"
        @click="showMdAddEvaluated"
      />
    </div>
    <div class="rt-list-eval">
      <div
        v-for="item in listUserEvl"
        :key="item.id"
        class="mb-8"
      >
        <div class="d-flex justify-space-between">
          <CpCustomInfo
            :is-show-email="false"
            is-show-sub
            :context="item"
          >
            <template #sub-content>
              <div class="d-flex align-center">
                <div
                  style="width: 120px;"
                  class="mr-1"
                >
                  <CmRating
                    :model-value="item.rate"
                    :disabled="true"
                    :length="5"
                    :size-icon="20"
                    full-color="#FDB022"
                    :full-icon=" MethodsUtil.checkType(3, reaction, 'value')?.fullIcon"
                    :empty-icon=" MethodsUtil.checkType(3, reaction, 'value')?.emptyIcon"
                  />
                </div>
                <div class="text-regular-xs">
                  {{ DateUtil.timeRating(item.modifiedDate, t) }}
                </div>
              </div>
            </template>
          </CpCustomInfo>
          <CmDropDown
            :list-item="action(item)"
            :data="item"
            custom-key="title"
            :type="1"
          />
        </div>
        <div class="rt-content-eval">
          {{ item?.content }}
        </div>
        <div class="rt-criteria d-flex">
          <div
            v-for="criteria in item.criteria"
            :key="criteria.id"
            class="rt-criteria-item"
          >
            <CmChip
              class="ma-2"
              color="primary"
            >
              <span>{{ t(criteria.name) }}</span>
            </CmChip>
          </div>
        </div>
      </div>
      <div
        v-if="listUserEvl.length < totalRecordUserEvl"
        class="d-flex justify-center"
      >
        <CmButton
          :title="t('show-more')"
          icon="tabler:arrow-down"
          variant="tonal"
          @click="showMore"
        />
      </div>
    </div>
    <CpMdAddEvaluated
      v-model:isDialogVisible="isShowModal"
      :data="dataEval"
      @confirm="getData(true)"
    />
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogDelete"
      :type="2"
      variant="outlined"
      :confirmation-msg-sub-title="t('confirm-delete-section')"
      :confirmation-msg="t('del-eval')"
      @confirm="confirmDialogDelete"
    />
  </div>
</template>

<style scoped lang="scss">
.rt-box {
  .rt-ratio {
    color: rgb(var(--v-gray-700))
  }

  .rt-rating-star {
    min-width: 120px;
    margin: 16px 0 24px;
  }

  .rt-evaluate {
    color: rgb(var(--v-primary-600))
  }

  .progress-item {
    margin-top: 16px;

    &:last-child {
      margin-top: unset;
    }

    .progress-label {
      width: 30px;
      min-width: 30px;
    }
  }

  .rt-list-eval {
    .rt-content-eval {
      padding: 8px 16px;
      border-radius: var(--v-border-radius-xs);
      margin-top: 12px;
      background: rgb(var(--v-gray-100));

      /* Shadow/sm */

      box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 6%), 0 1px 3px 0 rgba(16, 24, 40, 10%);
    }
  }
}
</style>
