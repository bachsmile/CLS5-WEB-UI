import { defineStore } from 'pinia'
import toast from '@/plugins/toast'

/** call api */
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

// import { TYPE_REQUEST } from '@/typescript/enums/enums'

/** end call api */
export const courseApproveManagerStore = defineStore('courseApproveManager', () => {
  /** lib */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const route = useRoute()
  const router = useRouter()

  /** store */

  /** state */
  // data request api danh sách khóa học
  const scoreSettingCourse = ref<any>({
    courseId: null,
  })
  const rowsScore = ref<any>()
  const listApprove = ref<any>([])
  const checkValidToApprover = ref<any>('')
  const pointSetting = ref<any>(null)
  const idModalSendApproveCourse = ref(false)
  const idModalSendRatioPoint = ref(false)
  const myFormScore = ref()
  const idSelected = ref()
  const approverRoleId = ref<any>()
  const data = reactive({
    deleteIds: [], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const disabledPoint = computed(() => !data.selectedRowsIds.length)

  /** method */
  /* ==> thực hiện các action được chọn ở header page CP */

  async function sendApproveCourse(id: any, list: any) {
    scoreSettingCourse.value.courseId = id
    listApprove.value = list
    const params = {
      courseId: id,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetCheckApprove, TYPE_REQUEST.GET, params).then((value: any) => {
      checkValidToApprover.value = value?.data
      if (checkValidToApprover.value === 'CSE_CourseContentNotFound') {
        toast('ERROR', t(checkValidToApprover.value))
        return
      }
      idModalSendApproveCourse.value = true
    })
  }
  function selectedRowsPoint(e: any) {
    data.selectedRowsIds = e
  }

  /* ==> thiết lập điểm */
  async function scoreSetting(courseId?: any) {
    const params = {
      id: courseId ?? scoreSettingCourse.value.courseId,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetCourseSetting, TYPE_REQUEST.GET, params).then((value: any) => {
      if (value?.data)
        rowsScore.value = value?.data
    })
  }
  function autoUpdatePoint() {
    rowsScore.value.forEach((item: any) => {
      item.point = Math.round((100 / rowsScore.value.length) * 10000) / 10000
    })
    toast('SUCCESS', t('USR_UpdateSuccess'))
    pointSetting.value = null
  }
  function updatePointSetting() {
    if (Number(pointSetting.value) > 0 && Number(pointSetting.value) <= 100) {
      rowsScore.value.forEach((item: any) => {
        if (item.isSelected)
          item.point = Number(pointSetting.value)
      })
      toast('SUCCESS', t('USR_UpdateSuccess'))
      pointSetting.value = null
    }
  }

  /* ==> lưu điểm */
  async function handlerAddPoint() {
    let score = 0
    rowsScore.value.forEach((element: any) => {
      score += element.point
      element.courseId = scoreSettingCourse.value.courseId
    })
    if (Number(score) !== 100) {
      toast('ERROR', 'score-invalid-100')
      return false
    }
    const params = {
      listModel: rowsScore.value,
    }
    let dataSend = false
    await MethodsUtil.requestApiCustom(CourseService.PostUpdatePointCourse, TYPE_REQUEST.POST, params).then((value: any) => {
      if (value.code !== 200) {
        toast('ERROR', t(value.message))
        dataSend = false
      }
      toast('SUCCESS', t(value.message))
      idModalSendRatioPoint.value = false
      dataSend = true
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
        dataSend = false
      })
    return dataSend
  }

  /* ==> lưu người duyệt */
  async function addApproverSuper() {
    const params = {
      courseId: scoreSettingCourse.value.courseId,
      listApproverId: idSelected.value,
      note: '',
      lastApproverId: approverRoleId.value,
    }

    return await MethodsUtil.requestApiCustom(CourseService.PatchAddAprover, TYPE_REQUEST.PATCH, params).then((value: any) => {
      if (value.code === 200) {
        idModalSendApproveCourse.value = false
        toast('SUCCESS', t(value.message))

        return true
      }
      else {
        toast('ERROR', t(value.errors))
        return false
      }
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
        return false
      })
  }
  async function handleUpdatePointCourse() {
    await myFormScore.value.validate().then(async (res: any) => {
      await handlerAddPoint()
    })
  }
  function valueChange(value: any, dataChange: any) {
    rowsScore.value[dataChange?.originIndex].point = Number(value)
  }
  async function approveContent(ids: any) {
    const params = {
      listModel: ids,
    }
    return await MethodsUtil.requestApiCustom(CourseService.PostApproveContentCourse, TYPE_REQUEST.POST, params).then((value: any) => {
      toast('SUCCESS', t(value.message))
      return true
    }).catch((error: any) => {
      toast('ERROR', t(error.response.data.message))
      return false
    })
  }

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    listApprove,
    scoreSettingCourse,
    idModalSendApproveCourse,
    checkValidToApprover,
    rowsScore,
    myFormScore,
    idSelected,
    approverRoleId,
    idModalSendRatioPoint,
    disabledPoint,
    pointSetting,
    sendApproveCourse,
    scoreSetting,
    valueChange,
    handlerAddPoint,
    addApproverSuper,
    handleUpdatePointCourse,
    autoUpdatePoint,
    updatePointSetting,
    selectedRowsPoint,
    approveContent,
  }
})
