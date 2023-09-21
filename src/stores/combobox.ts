import { defineStore } from 'pinia'
import MethodsUtil from '@/utils/MethodsUtil'
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import ArrayUtil from '@/utils/ArrayUtil'
import StringUtil from '@/utils/StringUtil'

export const comboboxStore = defineStore('combobox', () => {
  /** variable */
  interface combobox {
    key: any
    value: string
    text?: string
  }
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

  const statusesCombobox = ref([])
  const organizationsCombobox = ref([])
  const userTypeCombobox = ref([])
  const groupUserCombobox = ref([])
  const titleUserCombobox = ref([])
  const topicCombobox = ref<any>([])
  const authorIdCombobox = ref<any>([])
  const formOfStudyCombobox = ref<any>([])
  const categoryTitleCombobox = ref([])
  const compoboxCostTypes = ref([])
  const country = ref<combobox[]>([])
  const provinces = ref<combobox[]>([])
  const districts = ref<combobox[]>([])
  const wards = ref<combobox[]>([])
  const userLevels = ref<combobox[]>([])
  const compoboxStatusCourse = ref([])
  const compoboxCourseApprove = ref([])
  const comboboxAuthor = ref([])
  const compoboxSortCourse = ref<combobox[]>([
    { key: '*position', value: t('CourseService_Sort_By_Position_AZ') },
    { key: '-position', value: t('CourseService_Sort_By_Position_ZA') },
    { key: 'expiring', value: t('CourseService_Expiring') },
    { key: '-createdDate', value: t('CourseService_Sort_By_Created_Date') },
    { key: '+name', value: t('CourseService_Sort_By_Name_Asc') },
    { key: '-name', value: t('CourseService_Sort_By_Name_Desc') },
    { key: '-modifiedDate', value: t('CourseService_Sort_By_Updated_Date') },
  ])

  const comboboxSortQuestion = ref([
    { key: '+questionContent', value: t('sort-name-az') },
    { key: '-questionContent', value: t('sort-name-za') },
    { key: '+time', value: t('sort-time-za') },
    { key: '-time', value: t('sort-time-az') },
  ])
  const comboboxGroupQuestion = ref([
    {
      value: t('single-question'),
      key: false,
    },
    {
      value: t('cluster-question'),
      key: true,
    },
  ])
  const isDisplayHomeCombobox = ref([
    {
      key: t('yes'),
      value: true,
    },
    {
      key: t('no'),
      value: false,
    },
  ])
  const ownerCombobox = ref<any>({
    data: [],
    totalRecord: 0,
  })
  const getComboboxAuthor = async () => {
    await MethodsUtil.requestApiCustom(ComboboxService.GetAuthCourse, TYPE_REQUEST.GET).then(async (value: any) => {
      const users = await MethodsUtil.getUserInfoByIds(value.data)
      users.pageLists.forEach((element: any) => {
        element.fullName = StringUtil.formatFullName(element.firstName, element.lastName)
      })
      comboboxAuthor.value = users.pageLists
    })
  }
  const getAuthorIdCombobox = async () => {
    await MethodsUtil.requestApiCustom(ComboboxService.GetAuthCourse, TYPE_REQUEST.GET).then(async (value: any) => {
      const users = await MethodsUtil.getUserInfoByIds(value.data)
      users.pageLists.forEach((element: any) => {
        element.fullName = StringUtil.formatFullName(element.firstName, element.lastName)
      })
      authorIdCombobox.value = users.pageLists
    })
  }
  const getComboboxTypeContent = async () => {
    return await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxContentType, TYPE_REQUEST.GET).then(async (value: any) => {
      return value
    })
  }

  // Lấy danh sách loại trường
  const typeSchoolCombobox = ref<Any>([])
  const getComboboxTypeSchool = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetSchoolType, TYPE_REQUEST.GET)
    data.forEach((element: combobox) => {
      element.text = t(element.value)
    })
    typeSchoolCombobox.value = data
  }

  // Lấy danh sách khóa học
  const courseCombobox = ref<Any>([])
  const getComboboxCourse = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxCourse, TYPE_REQUEST.GET)
    courseCombobox.value = data
  }

  // Lấy danh sách chủ đề
  const getComboboxTopic = async (typeId: number) => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxTopic, TYPE_REQUEST.GET, { typeId })
    topicCombobox.value = ArrayUtil.formatSelectTree(data, 'parentId', 'id')
  }

  // Lấy danh sách hình thức học
  const getComboboxFormStudy = async () => {
    await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxFormStudy, TYPE_REQUEST.GET).then((value: any) => {
      if (value.data.length)
        formOfStudyCombobox.value = value.data
    })
  }

  const getComboboxApprover = async (data?: any) => {
    const params = {
      excludeIds: data?.excludeIds || [],
      keyword: data?.keyword || null,
      pageNumber: data?.pageNumber || 1,
      pageSize: data?.pageSize || 10,
      currentUserIds: data?.currentUserIds || [],
    }
    await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxCourseApprove, TYPE_REQUEST.POST, params).then((value: any) => {
      value?.data?.pageLists.forEach((element: any) => {
        element.fullName = StringUtil.formatFullName(element.firstName, element.lastName)
      })
      compoboxCourseApprove.value = value?.data
    })
  }

  // Lấy danh sách trạng thái khóa học
  const getComboboxStatusCourse = async () => {
    await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxStatusCourse, TYPE_REQUEST.GET).then((value: any) => {
      if (value.data.length)
        compoboxStatusCourse.value = value.data
    })
  }

  // Lấy danh sách sự kiện
  const eventTypeCombobox = ref<Any>([])
  const getComboboxEventType = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxEventType, TYPE_REQUEST.GET)
    data.forEach((element: combobox) => {
      element.text = t(element.value)
    })
    eventTypeCombobox.value = data
  }

  // Lấy danh sách loại câu hỏi
  const comboboxTypeQuestion = ref<Any>([])
  const getComboboxTypeQuestion = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxTypeQuestion, TYPE_REQUEST.GET)
    data.forEach((element: combobox) => {
      element.text = t(element.value)
    })
    comboboxTypeQuestion.value = data
  }

  // Lấy danh sách trạng thái câu hỏi
  const statusQuestionCombobox = ref<Any[]>([])
  const getComboboxStatusQuestion = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxStatusQuestion, TYPE_REQUEST.GET)
    data.forEach((element: combobox) => {
      element.text = t(element.value)
    })
    statusQuestionCombobox.value = data
  }
  const surveyTypeCombobox = ref<Any[]>([])
  const getComboboxSurveyType = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxSurveyType, TYPE_REQUEST.GET)
    data.forEach((element: combobox) => {
      element.text = t(element.value)
    })
    surveyTypeCombobox.value = data
  }
  const comboboxLevel = ref<Any[]>([])
  const getComboboxLevel = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxLevel, TYPE_REQUEST.GET)
    data.forEach((element: combobox) => {
      element.text = t(element.value)
    })
    comboboxLevel.value = data
  }

  // Lấy danh sách loại chi phí
  const costTypeCombobox = ref<Any[]>([])
  const getCostTypeCombobox = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxCostType, TYPE_REQUEST.GET)
    costTypeCombobox.value = data
  }

  // Lấy danh sách loại chi phí
  const examCombobox = ref<Any[]>([])
  const getExamCombobox = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxExam, TYPE_REQUEST.GET)
    examCombobox.value = data
  }

  // Lấy danh sách chức danh
  const listDistrictCombobox = ref<Any[]>([])
  const getComboboxListDistrict = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxListDistrict, TYPE_REQUEST.GET)
    const array: Any[] = []
    data.forEach((item: string) => {
      array.push({
        key: item,
        value: item,
      })
    })
    listDistrictCombobox.value = array
  }

  const addFromCombobox = ref([
    { key: t('direct'), value: 1 },
    { key: t('add-from-file'), value: 2 },
    { key: t('add-from-api'), value: 3 },
  ])

  /** method */
  // Lấy danh sách trạng thái người dùng
  const fetchStatusUsersCombobox = async () => {
    const params = { statusList: [1, 2, 3, 5] }
    const res = await MethodsUtil.requestApiCustom(ComboboxService.StatusUser, TYPE_REQUEST.POST, params).then((value: any) => value)

    if (res.code === 200) {
      statusesCombobox.value = res?.data?.map((item: any) => {
        return {
          ...item,
          value: t(item.value),
        }
      })
    }
  }

  // Lấy danh sách vị trí chức danh người dùng
  const fetchTitlesUsersCombobox = async (organizationalStructureId: any) => {
    const params = {
      organizationalStructureId: [organizationalStructureId],
    }
    await MethodsUtil.requestApiCustom(ComboboxService.Titles, TYPE_REQUEST.GET, params).then((value: any) => {
      titleUserCombobox.value = value?.data || []
    })
  }

  // Lấy danh sách danh mục chức danh người dùng
  const fetchCategoryTitleCombobox = async () => {
    await MethodsUtil.requestApiCustom(ComboboxService.CategoryTitleCombobox, TYPE_REQUEST.GET).then((value: any) => {
      categoryTitleCombobox.value = value?.data || []
    })
  }

  // Lấy danh sách kiểu người dùng
  const fetchTypeUsersCombobox = async () => {
    const res = await MethodsUtil.requestApiCustom(ComboboxService.TypeUsers, TYPE_REQUEST.GET).then((value: any) => value)
    if (res.code === 200)
      userTypeCombobox.value = res?.data || []
  }

  // Lấy danh sách nhóm người dùng
  const fetchGroupUserCombobox = async () => {
    const res = await MethodsUtil.requestApiCustom(ComboboxService.GroupUser, TYPE_REQUEST.GET).then((value: any) => value)
    if (res.code === 200)
      groupUserCombobox.value = res?.data || []
  }

  // Lấy danh sách cơ cấu tổ chức
  const fetchTOrgStructCombobox = async () => {
    const res = await MethodsUtil.requestApiCustom(ComboboxService.AllOrgStruct, TYPE_REQUEST.GET).then((value: any) => value)

    // const res = await fetchData(ComboboxService.AllOrgStruct, TYPE_REQUEST.GET).then((value: any) => value)
    if (res.code === 200 && res.data)
      organizationsCombobox.value = res?.data || []
  }

  // Lấy danh sách cơ cấu tổ chức
  const fetchTOrgStructTitleCombobox = async () => {
    const res = await MethodsUtil.requestApiCustom(ComboboxService.AllOrgTitle, TYPE_REQUEST.GET).then((value: any) => value)

    // const res = await fetchData(ComboboxService.AllOrgStruct, TYPE_REQUEST.GET).then((value: any) => value)
    if (res.code === 200 && res.data)
      organizationsCombobox.value = res?.data || []
  }

  // get country'
  const fetchCountry = async () => {
    await MethodsUtil.requestApiCustom(ComboboxService.Country, TYPE_REQUEST.GET).then((value: any) => {
      country.value = value.data
    })
  }

  // get provinces'
  const fetchProvinces = async (countryId: any) => {
    if (countryId === null) {
      provinces.value = []
    }
    else {
      const params = {
        countryId,
      }

      await MethodsUtil.requestApiCustom(ComboboxService.Provinces, TYPE_REQUEST.GET, params).then((value: any) => {
        provinces.value = value.data
      })
    }
  }

  // get districts'
  const fetchDistricts = async (provinceId: any) => {
    const params = {
      provinceId,
    }

    if (provinceId === null) {
      districts.value = []
    }
    else {
      await MethodsUtil.requestApiCustom(ComboboxService.Districts, TYPE_REQUEST.GET, params).then((value: any) => {
        districts.value = value.data
      })
    }
  }

  // get wards'
  const fetchWards = async (districtId: any) => {
    const params = {
      districtId,
    }

    if (districtId === null) {
      wards.value = []
    }
    else {
      await MethodsUtil.requestApiCustom(ComboboxService.Wards, TYPE_REQUEST.GET, params).then((value: any) => {
        wards.value = value.data
      })
    }
  }

  // get trình độ
  const fetchUserLevels = async () => {
    await MethodsUtil.requestApiCustom(ComboboxService.levels, TYPE_REQUEST.GET).then((value: any) => {
      userLevels.value = value.data || []
      userLevels.value = value?.data?.map((item: any) => {
        return {
          ...item,
          value: t(item.value),
        }
      })
    })
  }

  // get chủ sở hữu
  const getComboboxOwner = async (vSelectOwner?: any, loadMore?: any) => {
    // loadMore dùng khi infinity scroll
    const params = {
      pageSize: vSelectOwner.pageSize,
      pageNumber: vSelectOwner.pageNumber,
      keyword: vSelectOwner.search,
      excludeIds: vSelectOwner.excludeList,
    }
    await MethodsUtil.requestApiCustom(ComboboxService.Owner, TYPE_REQUEST.POST, params).then((value: any) => {
      ownerCombobox.value = {
        data: value.data?.pageLists.map((item: any) => ({ ...item, name: `${item.lastName} ${item.firstName}` })),
        totalRecord: value.data.totalRecord,
      }
    })
  }
  const categoryCostCombobox = async () => {
    await MethodsUtil.requestApiCustom(ComboboxService.GetCosttype, TYPE_REQUEST.GET).then((value: any) => {
      compoboxCostTypes.value = value.data
    })
  }

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    organizationsCombobox.value = []
  })

  const listTopicCourseCombobox = ref([])
  const getlistTopicCourseCombobox = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.topicCourse, TYPE_REQUEST.GET)
    listTopicCourseCombobox.value = data
  }
  const reset = () => {
    statusesCombobox.value = []
    organizationsCombobox.value = []
    userTypeCombobox.value = []
    groupUserCombobox.value = []
    country.value = []
    provinces.value = []
    districts.value = []
    wards.value = []
    userLevels.value = []
    courseCombobox.value = []
    listDistrictCombobox.value = []
    eventTypeCombobox.value = []
  }
  return {
    organizationsCombobox,
    statusesCombobox,
    userTypeCombobox,
    groupUserCombobox,
    country,
    provinces,
    districts,
    wards,
    userLevels,
    listTopicCourseCombobox,
    addFromCombobox,
    titleUserCombobox,
    ownerCombobox,
    categoryTitleCombobox,
    examCombobox,
    courseCombobox,
    costTypeCombobox,
    topicCombobox,
    compoboxSortCourse,
    formOfStudyCombobox,
    isDisplayHomeCombobox,
    compoboxStatusCourse,
    compoboxCourseApprove,
    compoboxCostTypes,
    typeSchoolCombobox,
    authorIdCombobox,
    eventTypeCombobox,
    comboboxAuthor,
    listDistrictCombobox,
    statusQuestionCombobox,
    surveyTypeCombobox,
    comboboxLevel,
    comboboxGroupQuestion,
    comboboxSortQuestion,
    comboboxTypeQuestion,

    // function
    getComboboxTypeQuestion,
    getComboboxLevel,
    getComboboxSurveyType,
    getComboboxStatusQuestion,
    categoryCostCombobox,
    getComboboxApprover,
    fetchStatusUsersCombobox,
    fetchTypeUsersCombobox,
    fetchTOrgStructCombobox,
    fetchTOrgStructTitleCombobox,
    fetchGroupUserCombobox,
    fetchTitlesUsersCombobox,
    fetchCountry,
    fetchDistricts,
    fetchProvinces,
    fetchWards,
    getlistTopicCourseCombobox,
    fetchUserLevels,
    getComboboxOwner,
    fetchCategoryTitleCombobox,
    reset,
    getComboboxCourse,
    getCostTypeCombobox,
    getExamCombobox,
    getComboboxTopic,
    getComboboxFormStudy,
    getComboboxStatusCourse,
    getComboboxTypeSchool,
    getAuthorIdCombobox,
    getComboboxEventType,
    getComboboxAuthor,
    getComboboxTypeContent,
    getComboboxListDistrict,
  }
})
