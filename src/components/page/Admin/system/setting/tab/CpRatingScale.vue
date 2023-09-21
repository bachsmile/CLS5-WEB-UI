<script lang="ts" setup>
import CpRatingStep from './rating-component/CpRatingStep.vue'
import CpMdEditRatingScale from './rating-component/modal/CpMdEditRatingScale.vue'
import CpMdEditStep from './rating-component/modal/CpMdEditStep.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import CmButton from '@/components/common/CmButton.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import ComboboxService from '@/api/combobox'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import SharedService from '@/api/shared'
import toast from '@/plugins/toast'

const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

const { t } = window.i18n()

const isShowEdit = ref(false)

const selectedRatingScale = ref<any>(null)
const comboboxRatingScale = ref<Any[]>([])
function getComboboxRatingScale() {
  MethodsUtil.requestApiCustom(ComboboxService.GetComboboxRatingScale, TYPE_REQUEST.GET).then((result: Any) => {
    if (result?.data) {
      comboboxRatingScale.value = result?.data
      selectedRatingScale.value = result?.data[0].key
      getRatingScale(selectedRatingScale.value)
    }
  })
}
onMounted(() => {
  getComboboxRatingScale()
})

interface RatingScale {
  archivePoint: number | null
  id: number | null
  levelModel: Any[]
  name: string | null
}
const maxHeight = ref(600)
const ratingScale = ref<RatingScale>({
  archivePoint: null,
  id: null,
  levelModel: [],
  name: null,
})
const keyRender = ref<string>('1212')
function getRatingScale(id: number) {
  MethodsUtil.requestApiCustom(SharedService.GetRatingScale, TYPE_REQUEST.GET, { id }).then(({ data }: Any) => {
    const { archivePoint, levelModel } = window._.cloneDeep(data)
    const maxRating = data.levelModel.find((item: Any) => item.minimumPoint === 100)
    if (!maxRating) {
      levelModel.unshift({
        minimumPoint: 100,
        name: 'MAX',
      })
    }
    const heightPoint = 60
    const heightPointMin = 36
    const numberLength = levelModel.length
    let valuePoint = 100
    const sumPointMin = heightPointMin * (numberLength - 1)
    const dataFormat = [] as any[]
    maxHeight.value = (heightPoint * numberLength + sumPointMin) * 2
    keyRender.value = MethodsUtil.createRandomId(5)
    levelModel.forEach((element: Any, index: number) => {
      const {
        minimumPoint, name,
      } = element
      if (index > 0) {
        dataFormat[index - 1].height = heightPoint + heightPointMin + (valuePoint - element.minimumPoint) * maxHeight.value / 200
        dataFormat[index - 1].name = t(`${element.name}`)
        dataFormat[index - 1].id = element.id
        dataFormat[index - 1].pointData = element.minimumPoint
        if (archivePoint > element.minimumPoint && archivePoint < dataFormat[index - 1].minimumPoint)
          dataFormat[index - 1].archivePoint = archivePoint
      }
      dataFormat.push({
        minimumPoint, name, id, pointData: 0, height: 0,
      })
      if (index === (numberLength - 1))
        dataFormat[index].name = ''
      valuePoint = element.minimumPoint
    })
    data.levelModel = dataFormat
    ratingScale.value = data
  })
}

// thêm thang đnáh giá
function handleAddRate(val: Any) {
  MethodsUtil.requestApiCustom(SharedService.PostCreateRatingScale, TYPE_REQUEST.POST, val).then((result: Any) => {
    getComboboxRatingScale()
    toast('SUCCESS', t('add-success'))
    isShowEdit.value = false
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
function handleEditRate(val: Any) {
  MethodsUtil.requestApiCustom(SharedService.PostUpdateRatingScale, TYPE_REQUEST.POST, val).then((result: Any) => {
    getComboboxRatingScale()
    toast('SUCCESS', t('USR_UpdateSuccess'))
    isShowEdit.value = false
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
const dataEdit = ref<Any>({
  name: '',
  achievePoint: 0,
})
function showModalEditRatingScale() {
  dataEdit.value = ratingScale.value
  dataEdit.value.achievePoint = ratingScale.value.archivePoint
  isShowEdit.value = true
}
async function handleRate(unload: any) {
  if (dataEdit.value.id)
    await handleEditRate(dataEdit.value)
  else
    await handleAddRate(dataEdit.value)
  unload()
}

const isShowModalConfirmDelete = ref(false)
function handleDelete() {
  MethodsUtil.requestApiCustom(SharedService.DeleteRatingScale, TYPE_REQUEST.DELETE, { id: selectedRatingScale.value }).then((result: Any) => {
    getComboboxRatingScale()
    toast('SUCCESS', t('USR_DeleteSuccess'))
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}

interface DataStep {
  id?: number
  name: string
  keyLanguage: string
  ratingScaleId: number | null
  minimumPoint: number | null
}
const dataStep = ref<DataStep>({
  name: '',
  keyLanguage: '',
  ratingScaleId: null,
  minimumPoint: null,
})
const isShowEditStep = ref(false)
function showModalAddStep() {
  isShowEditStep.value = true
}
async function handleLevel(unload: any) {
  dataStep.value.ratingScaleId = selectedRatingScale.value
  dataStep.value.keyLanguage = ratingScale.value?.levelModel[ratingScale.value?.levelModel.length - 2].name
  if (dataStep.value.id)
    await handleEditLevel(dataStep.value)
  else
    await handleAddLevel(dataStep.value)
  unload()
}

// thêm thang đnáh giá
function handleAddLevel(val: Any) {
  MethodsUtil.requestApiCustom(SharedService.PostCreateLevel, TYPE_REQUEST.POST, val).then((result: Any) => {
    getRatingScale(selectedRatingScale.value)
    toast('SUCCESS', t('add-success'))
    isShowEditStep.value = false
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
function handleEditLevel(val: Any) {
  MethodsUtil.requestApiCustom(SharedService.PostUpdateLevel, TYPE_REQUEST.POST, val).then((result: Any) => {
    getRatingScale(selectedRatingScale.value)
    toast('SUCCESS', t('USR_UpdateSuccess'))
    isShowEditStep.value = false
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}

function showModalEditLevel(val: Any) {
  dataStep.value.id = val.id
  dataStep.value.minimumPoint = val.pointData
  dataStep.value.name = val.name
  isShowEditStep.value = true
}

const isShowModalConfirmDeleteLevel = ref(false)
const idLevel = ref<any>(null)
function showModalDeleteLevel(id: number) {
  idLevel.value = id
  isShowModalConfirmDeleteLevel.value = true
}

function handleDeleteLevel() {
  MethodsUtil.requestApiCustom(SharedService.DeleteLevel, TYPE_REQUEST.DELETE, { ratingScaleId: selectedRatingScale.value, ratingScaleLevel: idLevel.value }).then((result: Any) => {
    getComboboxRatingScale()
    toast('SUCCESS', t('USR_DeleteSuccess'))
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
}
</script>

<template>
  <div class="my-2">
    <div class="d-flex justify-end align-center">
      <CmButton
        :title="t('Add-new')"
        class="ml-2"
        @click="() => { isShowEdit = true }"
      />
      <CmSelect
        v-model:model-value="selectedRatingScale"
        style="width: 200px;"
        class="ml-2"
        item-value="key"
        custom-key="value"
        :items="comboboxRatingScale"
        @update:model-value="getRatingScale($event)"
      />
      <CmButton
        icon="fe:edit"
        :size-icon="16"
        class="ml-2"
        variant="outlined"
        size="40"
        @click="showModalEditRatingScale"
      />
      <CmButton
        size="40"
        icon="fe:trash"
        color="error"
        class="ml-2"
        :size-icon="16"
        variant="outlined"
        @click="() => { isShowModalConfirmDelete = true }"
      />
    </div>
    <div
      :key="keyRender"
      class="d-flex justify-center"
      :style="`height: ${maxHeight}px`"
    >
      <div class="rating-scale">
        <div style="width: 500px;">
          <CpRatingStep
            v-for="(item, idx) in ratingScale.levelModel"
            :key="idx"
            :height-step="item.height"
            :name-step="item.name"
            :data="item"
            :point="item.minimumPoint"
            @add="showModalAddStep"
            @edit="showModalEditLevel(item)"
            @delete="showModalDeleteLevel(item.id)"
          />
        </div>
      </div>
      <div class="tree" />
    </div>
    <CpMdEditRatingScale
      v-model:is-show="isShowEdit"
      v-model:name="dataEdit.name"
      v-model:archivePoint="dataEdit.achievePoint"
      :title="dataEdit.id ? 'edit-rating-scale' : 'add-rating-scale'"
      @ok="handleRate"
    />
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowModalConfirmDelete"
      :type="1"
      :confirmation-msg="t('Delete-rating-scale')"
      @confirm="handleDelete"
    />
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowModalConfirmDeleteLevel"
      :type="1"
      :confirmation-msg="t('Delete-level-rating-scale')"
      @confirm="handleDeleteLevel"
    />
    <CpMdEditStep
      v-model:name="dataStep.name"
      v-model:archive-point="dataStep.minimumPoint"
      v-model:is-show="isShowEditStep"
      :title="dataEdit.id ? 'edit-level' : 'rating-level'"
      @ok="handleLevel"
    />
  </div>
</template>

<style lang="scss">
.rating-scale {
  position: absolute;
  background-color: transparent;
}
.tree {
  border: 1px solid #D6D8DE;
  height: inherit;
}
</style>
