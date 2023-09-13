<script setup lang="ts">
import CpMyCourseItemRelated from '@/components/page/users/course/item/CpMyCourseItemRelated.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmButton from '@/components/common/CmButton.vue'

interface Props {
  data?: any
  topicId?: any
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({}),
}))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const route = useRoute()
const queryParams = ref({
  courseId: null as number | null,
  topicIds: [] as number[],
  pageNumber: 1,
  pageSize: 4,
})
const dataRelated = ref<any[]>([])
const totalRecordRelated = ref()
function getCourseRelated() {
  queryParams.value.courseId = Number(route.params.id)
  queryParams.value.topicIds = [Number(props.data?.topicCourseId)]
  MethodsUtil.requestApiCustom(CourseService.GetListMyCourseHome, TYPE_REQUEST.GET, queryParams.value).then((result: any) => {
    dataRelated.value = [
      ...dataRelated.value,
      ...result.data.pageLists,
    ]
    totalRecordRelated.value = result.data.totalRecord
  })
}
function showMoreRelated() {
  queryParams.value.pageNumber += 1
  getCourseRelated()
}
watch(() => props.topicId, (val: any) => {
  getCourseRelated()
})
</script>

<template>
  <div>
    <div
      v-for="item in dataRelated"
      :key="item.id"
    >
      <CpMyCourseItemRelated :data="item" />
    </div>
    <div
      v-if="dataRelated.length < totalRecordRelated"
      class="d-flex justify-center"
    >
      <CmButton
        :title="t('show-more')"
        icon="tabler:arrow-down"
        variant="tonal"
        @click="showMoreRelated"
      />
    </div>
  </div>
</template>
