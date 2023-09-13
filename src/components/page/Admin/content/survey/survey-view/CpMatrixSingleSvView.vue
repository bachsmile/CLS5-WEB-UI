<script setup lang="ts">
import CmRadio from '@/components/common/CmRadio.vue'
import ArraysUtil from '@/utils/ArrayUtil'

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  [name: string]: any
}
interface Props {
  data: question
  showContent: boolean
  showMedia: boolean
  showAnswerTrue: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
}))
const { t } = window.i18n()

const listAnswerMatrixValue = ref<any[]>([])
const getRatingLevels = computed(() => {
  if (props.data && props.data.surveyLevelRatings) {
    const ratingLevels = props.data.surveyLevelRatings
    ratingLevels.sort((a: any, b: any) => a.position - b.position)
    return ratingLevels
  }
  return []
})
const getGroupRating = computed(() => {
  if (props.data.isGroup) {
    const groups = ArraysUtil.fromListToTree(props.data.surveyCategoryRatings, 'randomId', 'groupId', undefined, undefined, null)
    groups.sort((a, b) => a.position - b.position)
    groups.forEach(item => {
      if (item.children && item.children.length > 0)
        item.children.sort((a: any, b: any) => a.position - b.position)
    })
    let result: any[] = []
    groups.forEach(element => {
      element.isGroup = true
      result.push(element)
      if (element.children)
        result = result.concat(element.children)
    })
    return result
  }
  return props.data.surveyCategoryRatings
})
function getCheckedValue(categoryId: number, levelId: number) {
  if (!listAnswerMatrixValue.value || listAnswerMatrixValue.value.length === 0)
    return false

  const checkedValue = listAnswerMatrixValue.value.find((item: any) => item.categoryId === categoryId && item.levelId === levelId)
  return !!checkedValue
}
function onChangeAnswer(categoryId: number, levelId: number) {
  const index = listAnswerMatrixValue.value?.findIndex(item => item.categoryId === categoryId)

  if (index >= 0) {
    listAnswerMatrixValue.value.splice(index, 1, { categoryId, levelId })
  }
  else {
    listAnswerMatrixValue.value.push({
      categoryId,
      levelId,
    })
  }
}
const mapPoint = computed(() => {
  return props.data.surveyLevelRatings.reduce((a: any, b: any) => ({ ...a, [b.id]: b.point }), {})
})
const getTotalPoint = computed(() => {
  if (props.data.isPoint && listAnswerMatrixValue.value) {
    const userPoint = listAnswerMatrixValue.value?.reduce((a, b) => a + mapPoint.value[b.levelId], 0)
    return Math.round(userPoint * 100) / 100
  }
  return 0
})

watch(() => props.data.listAnswerMatrix, (val: any) => {
  listAnswerMatrixValue.value = val ?? []
}, { immediate: true, deep: true })
</script>

<template>
  <div class="view-Matrix-sg">
    <div class="tb-matrix">
      <div class="tb-row tb-row-catg">
        <div
          class="tb-label"
          v-html="data.titleRating"
        />
        <div class="tb-content">
          <div
            v-for="level in getRatingLevels"
            :key="level.id"
            class="tb-label-content"
            v-html="level.name"
          />
        </div>
      </div>
      <div
        v-if="data.isPoint"
        class="tb-row tb-row-th"
      >
        <div class="tb-label">
          {{ t('point') }}
        </div>
        <div class="tb-content">
          <div
            v-for="level in getRatingLevels"
            :key="level.id"
            class="tb-label-content"
          >
            {{ level.point }}
          </div>
        </div>
      </div>
      <template
        v-for="catg in getGroupRating"
        :key="catg.id"
      >
        <div
          v-if="catg.isGroup"
          class="tb-row tb-row-group"
        >
          <div
            class="tb-label"
            v-html="catg.name"
          />
        </div>
        <div
          v-else
          class="tb-row tb-row-item"
        >
          <div
            class="tb-label"
            v-html="catg.name"
          />
          <div class="tb-content">
            <div
              v-for="level in getRatingLevels"
              :key="level.id"
              class="tb-label-content"
            >
              <CmRadio
                :type="1"
                :model-value="showAnswerTrue ? getCheckedValue(catg.id, level.id) : false"
                :disabled="false"
                :name="`mx-single-${catg.id}`"
                :value="true"
                @update:model-value="onChangeAnswer(catg.id, level.id)"
              />
            </div>
          </div>
        </div>
      </template>
      <div
        v-if="data.isPoint"
        class="tb-row tb-row-th mt-6"
      >
        <div class="tb-label">
          {{ t("total-points") }}
        </div>
        <div class="tb-content d-flex justify-center">
          {{ getTotalPoint }} {{ t('scores') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.view-Matrix-sg{
  .tb-row{
    padding:8px 16px;
    display: flex;
    .tb-label{
      width: 25%;
      color: rgb(var(--v-gray-900));
      /* Text md/Medium */
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px; /* 150% */
    }
    .tb-content{
      display: flex;
      width: 75%;
      .tb-label-content{
        width: 100%;
        text-align: center;
        color: rgb(var(--v-gray-900));
        /* Text md/Medium */
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
        display: flex;
        justify-content: center;
      }
    }

    &.tb-row-th{
      background-color:  rgb(var(--v-primary-25));
    }
    &.tb-row-catg{
      padding:16px;
      .tb-label{
        color: rgb(var(--v-gray-900));
        text-transform: uppercase;
        /* Text md/Medium */
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
      }
      .tb-label-content{
        color: rgb(var(--v-gray-900));
        /* Text md/Medium */
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
      }
    }
    &.tb-row-group{
      padding-top: 16px;
      padding-bottom: 0px;
      .tb-label{
        width: 100%;
        color: rgb(var(--v-primary-600));
      }

    }
    &.tb-row-item{
      padding:16px;
      margin-block: 8px;
      border-radius: 8px;
      border: 1px solid rgb(var(--v-gray-300));
    }
  }

}
</style>
