<script setup lang="ts">
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpCourseInfo from '@/components/page/users/course/course-detail/CpCourseInfo.vue'
import CpTabDesc from '@/components/page/users/course/course-detail/CpTabDesc.vue'
import CpCourseRelated from '@/components/page/users/course/course-detail/CpCourseRelated.vue'
import CpCardCourseDetail from '@/components/page/users/course/course-detail/CpCardCourseDetail.vue'
import CpRatingEvaluate from '@/components/page/gereral/CpRatingEvaluate.vue'
import StringJwt from '@/utils/Jwt'
import StringUtil from '@/utils/StringUtil'
import toast from '@/plugins/toast'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const route = useRoute()
const courseDetail = ref()
function getDetailCourseById() {
  const params = {
    id: route.params.id,
  }
  MethodsUtil.requestApiCustom(CourseService.GetDetailCourse, TYPE_REQUEST.GET, params).then((result: any) => {
    courseDetail.value = result.data
  })
}

const generaRating = ref()
async function getGeneralRating() {
  const params = {
    roleId: StringJwt.getRole(),
    courseId: route.params.id,
  }

  MethodsUtil.requestApiCustom(CourseService.GetGeneralRating, TYPE_REQUEST.GET, params).then((result: any) => {
    let data = result?.data
    const ratings = []
    for (let i = 1; i <= 5; i++) {
      const rating = result?.data?.totalEvaluation?.find((x: any) => x.rate === i)
      if (rating)
        ratings.push({ rate: i, total: rating.total })

      else
        ratings.push({ rate: i, total: 0 })
    }
    const total = ratings.reduce((a, b) => a + b.total, 0)
    data = {
      ...data,
      ratings: ratings.map((x, i) => ({ rate: i + 1, total: x.total, percent: Math.round(((x.total / total) * 10000)) / 100 })),
      total,
      averageRating: total ? StringUtil.decimalToFixed((ratings.reduce((a, b) => a + b.rate * b.total, 0) / total), 2) : 0,
    }
    generaRating.value = data
  })
}
async function registerCourse(id: number) {
  const params = { id }
  MethodsUtil.requestApiCustom(CourseService.PostlRegisterCourse, TYPE_REQUEST.POST, params).then((result: any) => {
    getDetailCourseById()
    toast('SUCCESS', t('register-success'))
  }).catch((err: any) => {
    toast('ERROR', t(err?.response?.data?.message) || t('register-failed'))
  })
}
watch(() => route.params.id, (val: any) => {
  getDetailCourseById()
  getGeneralRating()
}, { immediate: true })
</script>

<template>
  <div class="mc-detail">
    <div class="mc-content">
      <VRow>
        <VCol
          cols="12"
          md="8"
        >
          <CpCourseInfo
            class="mb-6"
            :data="courseDetail"
            :genera-rating="generaRating"
          />
          <CpTabDesc :data="courseDetail" />
          <CpCourseRelated
            :data="courseDetail"
            :topic-id="courseDetail?.topicCourseId"
          />
          <CpRatingEvaluate
            class="mt-10"
            :genera-rating="generaRating"
            @update:generaRating="getGeneralRating"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <CpCardCourseDetail
            :data="courseDetail"
            @register-course="registerCourse"
          />
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<style scoped>
.mc-detail{

}
</style>
