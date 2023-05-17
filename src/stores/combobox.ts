import { defineStore } from 'pinia'
import readXlsxFile from 'read-excel-file'
import type { Config } from '@/typescript/interface/import'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'
import ObjectUtil from '@/utils/ObjectUtil'
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

export const comboboxStore = defineStore('combobox', () => {
  /** variable */
  interface combobox {
    key: number
    value: string
  }
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

  const statusesCombobox = ref([])
  const organizationsCombobox = ref([])
  const userTypeCombobox = ref([])
  const groupUserCombobox = ref([])
  const titleUserCombobox = ref([])
  const country = ref<combobox[]>([])
  const provinces = ref<combobox[]>([])
  const districts = ref<combobox[]>([])
  const wards = ref<combobox[]>([])
  const userLevels = ref<combobox[]>([])
  const ownerCombobox = ref<any>({
    data: [],
    totalRecord: 0,
  })
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

    if (provinceId === null) { districts.value = [] }
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

    if (districtId === null) { wards.value = [] }
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
  const getComboboxOwner = async (vSelectOwner: any, loadMore?: any) => {
    // loadMore dùng khi infinity scroll
    const params = {
      pageSize: vSelectOwner.pageSize,
      pageNumber: vSelectOwner.pageNumber,
      keyword: vSelectOwner.search,
      excludeIds: vSelectOwner.excludeList,
    }
    await MethodsUtil.requestApiCustom(ComboboxService.Owner, TYPE_REQUEST.POST, params).then((value: any) => {
      console.log(value)
      ownerCombobox.value = {
        data: value.data?.pageLists.map((item: any) => ({ ...item, name: `${item.lastName} ${item.firstName}` })),
        totalRecord: value.data.totalRecord,
      }
    })
  }

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    organizationsCombobox.value = []
  })

  const listTopicCourse = ref([])
  const getListTopicCourse = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.topicCourse, TYPE_REQUEST.GET)
    listTopicCourse.value = data
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
    listTopicCourse,
    addFromCombobox,
    titleUserCombobox,
    ownerCombobox,
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
    getListTopicCourse,
    fetchUserLevels,
    getComboboxOwner,
    reset,
  }
})
