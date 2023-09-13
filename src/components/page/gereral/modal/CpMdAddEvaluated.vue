<script setup lang="ts">
import CmRating from '@/components/common/CmRating.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { reaction } from '@/constant/data/iconList.json'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmTextArea from '@/components/common/CmTextArea.vue'
import toast from '@/plugins/toast'
import StringJwt from '@/utils/Jwt'

const props = withDefaults(defineProps<Props>(), ({
  id: null,
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))

interface Props {
  isDialogVisible: boolean
  id?: number | null
  data?: any
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm'): void
}
const route = useRoute()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const LABEL = Object.freeze({
  TITLE: t('write-evaluate'),
  TITLE1: t('api-name'),
  TITLE2: t('code-number'),
})
const dataModal = ref({
  id: null,
  rate: 5,
  content: '',
  courseId: null as number | null,
  roleId: StringJwt.getRole(),
  listCriteria: [] as any[],
})
async function onCancel() {
  emit('update:isDialogVisible', false)
}
function init() {
  dataModal.value = {
    id: null,
    rate: 5,
    content: '',
    courseId: null as number | null,
    roleId: StringJwt.getRole(),
    listCriteria: [] as any[],
  }
}
async function onConfirm(idx: any, unload: any) {
  dataModal.value.courseId = Number(route.params.id || 0) || props.id

  await MethodsUtil.requestApiCustom(
    dataModal.value?.id ? CourseService.PostUpdateEvaluation : CourseService.PostCreateEvaluation, TYPE_REQUEST.POST, dataModal.value,
  ).then((result: any) => {
    toast('SUCCESS', t(result.message))
    unload(idx)
    onCancel()
    emit('confirm')
  })
    .catch((err: any) => {
      toast('ERROR', window.getErrorsMessage(err.response.data.error, t))
      unload(idx)
    })
}

const criteria = ref()
async function getUserEvaluation() {
  await MethodsUtil.requestApiCustom(CourseService.GetCriteriaEvaluation, TYPE_REQUEST.GET).then((result: any) => {
    criteria.value = result?.data
  })
}
function selectCriterion(id: any) {
  if (dataModal.value.listCriteria.includes(id)) {
    dataModal.value.listCriteria.splice(dataModal.value.listCriteria.indexOf(id), 1)
    return
  }
  dataModal.value.listCriteria.push(id)
}
const getValidCriteria = computed(() => {
  const cloneCriteria = window._.cloneDeep(criteria.value)
  return cloneCriteria?.filter((x: any) => dataModal.value.rate >= x.ratingFrom && dataModal.value.rate <= x.ratingTo)
    .map((x: any) => ({ ...x, isSelected: dataModal.value.listCriteria?.includes(x.id) }))
})
function changeRate() {
  dataModal.value.listCriteria = []
}
watch(() => props.isDialogVisible, isShow => {
  if (isShow) {
    getUserEvaluation()
    init()
  }
})

watch(() => props.data, (val: any) => {
  dataModal.value.id = val?.id
  dataModal.value.content = val?.content
  dataModal.value.listCriteria = val?.criteria?.map((item: any) => item.id)
  dataModal.value.courseId = val?.courseId
  dataModal.value.rate = val?.rate
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isDialogVisible"
    :title="LABEL.TITLE"
    close-on-back
    justify="center"
    :is-cancle="false"
    :button-ok-name="t('send-evaluate')"
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <div>
      <div class="text-semibold-lg text-center">
        {{ t('feel-course') }}
      </div>

      <div class="d-flex justify-center my-6">
        <div
          style="width: 40%;"
        >
          <CmRating
            v-model="dataModal.rate"
            :disabled="false"
            :length="5"
            :size-icon="32"
            full-color="#FDB022"
            empty-color="#EAECF0"
            :full-icon=" MethodsUtil.checkType(3, reaction, 'value')?.fullIcon"
            :empty-icon=" MethodsUtil.checkType(3, reaction, 'value')?.emptyIcon"
            @update:model-value="changeRate"
          />
        </div>
      </div>
      <div class="d-flex flex-wrap justify-center">
        <div
          v-for="item in getValidCriteria"
          :key="item.id"
          class="required-item  mb-4"
          :class="{ selected: item.isSelected }"
          @click="selectCriterion(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
      <div>
        <CmTextArea
          v-model:model-value="dataModal.content"
          text="Mô tả"
        />
      </div>
    </div>
  </CmDialogs>
</template>

<style lang="scss">
.required-item{
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid rgb(var(--v-gray-300));
  background: var(--white, #FFF);

  /* Shadow/xs */
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);

  padding: 10px 16px;
  margin-inline: 16px;
  display: flex;
  flex-wrap: nowrap;
}
.required-item.selected{
  border-radius: 8px;
  border: 1px solid rgb(var(--v-primary-50));
  background: rgb(var(--v-primary-50));

  /* Shadow/xs focused 4px primary-100 */
  box-shadow: 0px 0px 0px 4px #D1E9FF, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
}
</style>
