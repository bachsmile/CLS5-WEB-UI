<script setup lang="ts">
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import { comboboxStore } from '@/stores/combobox'
import toast from '@/plugins/toast'
import { validatorStore } from '@/stores/validatator'
import { ActionType } from '@/constant/data/actionType.json'

/** lib */
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmRadio = defineAsyncComponent(() => import('@/components/common/CmRadio.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))
const CpRatioPointContentCourse = defineAsyncComponent(() => import('@/components/page/Admin/course/CpRatioPointContentCourse.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm'): void
}

/** Store */
const storeCourseApproveManager = courseApproveManagerStore()
const { idModalSendApproveCourse, listApprove, checkValidToApprover, myFormScore, approverRoleId, idSelected } = storeToRefs(storeCourseApproveManager)
const { scoreSetting, handlerAddPoint, addApproverSuper } = storeCourseApproveManager
const storeCombobox = comboboxStore()
const { compoboxCourseApprove } = storeToRefs<any>(storeCombobox)
const { getComboboxApprover } = storeCombobox

const storeValidate = validatorStore()
const { schemaOption, Field, Form, FieldArray, useForm, yup } = storeValidate
const { submitForm } = useForm()

const LABEL = Object.freeze({
  TITLE: t('set-up-a-course-approver'),
  TITLE1: t('api-name'),
  TITLE2: t('code-number'),
})

const headers = reactive([
  { text: t('course-approver'), value: 'userApprove', type: 'custom' },
  { text: t('Admin-supper'), value: 'admin', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref<any>([])

const myFormAdminSuper = ref<any>()
const paramsGetComboboxAdnin = reactive<any>({
  listCombobox: [],
  excludeIds: [],
  keyword: null,
  pageNumber: 1,
  pageSize: 10,
  currentUserIds: [],
})
const action = [
  {
    title: t('Delete'),
    icon: ActionType[1].icon,
    color: ActionType[1].color,
    action: actionItemDelete,
  },
]
const idSelectedList = computed(() => {
  return items.value?.filter((item: any) => item.approverId !== null).map((e: any) => e.approverId)
})
watch(idSelectedList, newIds => {
  idSelected.value = newIds
})

const checkRequired = computed(() => {
  return !!(idSelected.value?.length && items.value?.length > 1)
})

const schema = yup.object({
  adminSuper: yup.array().of(
    yup.object().shape(
      checkRequired.value ? { point: schemaOption.defaultSelectSingle } : {}),
  ).strict(),
})
function actionItemDelete(dataAction: any, index: any) {
  deleteItem(index, dataAction[1].approverId)
}
async function onCancel() {
  idModalSendApproveCourse.value = false
}
async function onConfirm() {
  let success = false
  await myFormScore.value.validate().then(async (res: any) => {
    success = res.valid
  })
  if (checkRequired) {
    await myFormAdminSuper.value.validate().then(async (res: any) => {
      success = res.valid
    })
  }

  if (success)
    handlerAddApprove()
}
async function handlerAddApprove() {
  if (checkValidToApprover.value === 'CSE_SettingPointInValid') {
    const isChecked = await handlerAddPoint()

    if (!isChecked)
      return
  }
  await addApproverSuper().then((value: any) => {
    emit('confirm')
    emit('update:isDialogVisible', false)
  })
}

function changeValueApprove(val: any, index: any) {
  // items.value[id].approverId = val
  if (val && index !== null) {
    if (approverRoleId.value && approverRoleId.value === items.value[index].approverId) {
      approverRoleId.value = val
      items.value[index].approverId = val
    }
  }
  else if (approverRoleId.value && approverRoleId.value === items.value[index].approverId) {
    approverRoleId.value = undefined
  }
}
function checkExclude(id: any, list: any) {
  return idSelected.value?.filter((item: any) => item !== id)
}
function addApprover() {
  if (items.value.length >= compoboxCourseApprove.value.totalRecord) {
    toast('ERROR', t('max-approver', [compoboxCourseApprove.value.totalRecord]))
    return
  }
  items.value.push({
    approverId: null,
  })
}
function deleteItem(index: number, approverId: any) {
  items.value.splice(index, 1)
  if (approverId === approverRoleId.value)
    approverRoleId.value = undefined
}
async function isIntersecting() {
  paramsGetComboboxAdnin.pageNumber += 1
  await getComboboxApprover(paramsGetComboboxAdnin).then(() => {
    paramsGetComboboxAdnin.listCombobox = paramsGetComboboxAdnin.listCombobox.concat(compoboxCourseApprove.value.pageLists)
  })
}
async function searchAdmin(searchKey: any, index: any, idItem: any) {
  paramsGetComboboxAdnin.pageNumber = 1
  paramsGetComboboxAdnin.keyword = searchKey
  getComboboxApprover(paramsGetComboboxAdnin).then(() => {
    paramsGetComboboxAdnin.listCombobox = compoboxCourseApprove.value.pageLists
  })
}
function searchBlur(params: any, index: any) {
  const listId = paramsGetComboboxAdnin.listCombobox.map((item: any) => item.approverId)
  if (!listId.includes(items.value[index].approverId))
    items.value[index].approverId = null
}
watch(idModalSendApproveCourse, isShow => {
  if (isShow) {
    items.value = []

    if (!listApprove.value) {
      items.value.push({
        approverId: null,
      })
      getComboboxApprover().then(() => {
        paramsGetComboboxAdnin.listCombobox = compoboxCourseApprove.value.pageLists
      })
    }
    else {
      listApprove.value?.forEach((element: any) => {
        items.value.push({
          approverId: element.userId,
        })

        paramsGetComboboxAdnin.currentUserIds.push(element.userId)
        if (element.roleApprover)
          approverRoleId.value = element.userId
      })

      getComboboxApprover(paramsGetComboboxAdnin).then(() => {
        paramsGetComboboxAdnin.listCombobox = compoboxCourseApprove.value.pageLists
      })
    }
    if (checkValidToApprover.value === 'CSE_SettingPointInValid')
      scoreSetting()
  }
  else {
    paramsGetComboboxAdnin.pageNumber = 1
  }
})
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="idModalSendApproveCourse"
      :title="LABEL.TITLE"
      close-on-back
      :height="800"
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <VRow class="table-header no-magin-card justify-content-between mb-4">
        <VCol
          cols="6"
          class="pl-6"
        >
          {{ t(headers[0].text) }}
        </VCol>
        <VCol
          cols="5"
        >
          {{ t(headers[1].text) }}
        </VCol>
        <VCol>
          {{ t('action') }}
        </VCol>
      </VRow>
      <Form
        ref="myFormAdminSuper"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <FieldArray
          name="adminSuper"
        >
          <VRow
            v-for="(item, id) in items"
            :key="id"
            class="no-magin-card rowTable"
          >
            <VCol
              cols="6"
              class="pl-6"
            >
              <Field
                v-slot="{ field, errors }"
                v-model="item.approverId"
                :name="`adminSuper[${id}].point`"
              >
                <CmSelect
                  :field="field"
                  :errors="errors"
                  :model-value="item.approverId"
                  :items="paramsGetComboboxAdnin.listCombobox"
                  :exclude-id="checkExclude(item.approverId, idSelected)"
                  item-value="id"
                  custom-key="fullName"
                  is-infinity-scroll
                  :total-record="compoboxCourseApprove.totalRecord - checkExclude(item.approverId, idSelected)?.length ?? 0"
                  :placeholder="t('choose-admin-supper')"
                  @isIntersecting="isIntersecting"
                  @search="searchAdmin($event, id, item.approverId)"
                  @search:blur="searchBlur($event, id)"
                  @update:model-value="changeValueApprove($event, id)"
                >
                  <template #infinityItem>
                    <SkUser
                      :number="2"
                    />
                  </template>
                </CmSelect>
              </Field>
            </VCol>
            <VCol
              cols="5"
            >
              <CmRadio
                v-model="approverRoleId"
                name="approverId"
                :value="item.approverId"
                :disabled="!item.approverId"
              />
            </VCol>
            <VCol
              cols="1"
              class="d-flex align-center justify-center"
            >
              <CmDropDown
                :list-item="action"
                :data="item"
                custom-key="title"
                :type="1"
              />
            </VCol>
          </VRow>
        </FieldArray>
      </Form>

      <div class="mt-7">
        <BLink
          class="d-flex align-center cursor-pointer"
          @click="addApprover"
        >
          <VIcon
            icon="tabler:plus"
            size="16"
            class="color-primary mr-2"
          />
          <span class="color-primary  align-center">{{ $t('Add-new') }}</span>
        </BLink>
      </div>
      <div
        v-if="checkValidToApprover === 'CSE_SettingPointInValid'"
        class="mt-6 no-magin-card"
      >
        <CpRatioPointContentCourse />
      </div>
    </CmDialogs>
  </div>
</template>

<style lang="scss">
@use "@/styles/variables/common/table.cm" as *;
.no-magin-card{
  margin-top: -10px;
  margin-inline: -24px;
}
.table-header{
  background-color: $table-header-background-color;
}
.rowTable{
  position: relative;
}
</style>
