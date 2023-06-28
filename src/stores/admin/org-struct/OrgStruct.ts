import { defineStore } from 'pinia'
import MethodsUtil from '@/utils/MethodsUtil'
import { comboboxStore } from '@/stores/combobox'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import StringJwt from '@/utils/Jwt'
import ArraysUtil from '@/utils/ArrayUtil'

export const orgStructManagerStore = defineStore('orgStructManager', () => {
  /**
   * store
   */
  const storeCombobox = comboboxStore()
  const { ownerCombobox } = storeToRefs(storeCombobox)
  const { getComboboxOwner } = storeCombobox

  /**
 * lib
 */
  const route = useRoute()
  const router = useRouter()
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  /**
   * data
   */
  const nodes = ref({})
  const render = ref(0)
  const apiType = ref('org')
  const xmlTitleData = ref<any>()
  const config = ref({
    roots: [] as any[],
    keyboardNavigation: false,
    dragAndDrop: false,
    checkboxes: false,
    editable: false,
    disabled: false,
    padding: 25,
  })
  const initValue = ref({
    id: undefined,
    code: null,
    name: null,
    ownerId: null,
    managementId: 1,
    parentId: null as null | number,
    description: '',
  })
  const organization = ref({
    id: undefined,
    code: null,
    name: null,
    ownerId: null,
    managementId: 1,
    parentId: null as null | number,
    description: '',
  })
  const vSelectOwner = ref<any>({
    listCombobox: [],
    totalRecord: 0,
    pageNumber: 1,
    pageSize: 30,
    search: '',
    excludeList: [],
    itemSelected: {} as any,
  })
  const title = ref<any>({
    description: null,
    name: null,
    level: 1,
    categoryTitleId: null,
    orStructureId: null,
    proficiencyModel: [
    ],
    proficiencies: [], // danh sách cấp độ năng lực được chọn
  })
  const queryUser = ref({
    orStructureId: null as any,
    pageSize: 10,
    pageNumber: 1,
    search: '',
  })
  const dataTabUserOrg = ref({
    list: [],
    totalRecord: 0,
  })
  const proficiencies = ref()
  const titleSelected = ref()
  const myFormAddInforOrg = ref()
  const isEdit = ref(false) // trạng thái đang chỉnh sửa hay thêm mới
  const isView = ref(false) // Trạng thái xem hay chỉnh sửa
  const viewModeAddTitle = ref(false) // trạng thái thêm chức danh
  const idOrg = ref()
  const userIds = ref<Array<any>>([])
  const listTitles = ref()
  const resetForm = () => {
    idOrg.value = null
    isEdit.value = false

    if (myFormAddInforOrg.value)
      myFormAddInforOrg.value.resetForm()
    organization.value = window._.cloneDeep(initValue.value)
  }

  const getListOrgStruct = async () => {
    const params = {
      role: StringJwt.getRole(),
    }
    await MethodsUtil.requestApiCustom(ApiUser.GetOrganizationalStructure, TYPE_REQUEST.GET, params).then((value: any) => {
      // cấu hình dạng cây cho cơ cấu tổ chức
      for (let i = 0; i < value.data.length; i++) {
        value.data[i] = {
          ...value.data[i],
        }
      }
      const result = ArraysUtil.formatTreeData(ArraysUtil.unFlatMapTree(ArraysUtil.formatSelectTree(value.data, 'parentId', 'id')), config.value.roots, t, 'children')

      nodes.value = reactive(result)

      // Cấu hình node roots cho vue tree
      const filteredKeys = Object.keys(result).filter(key => result[key].parentId === 0)
      config.value.roots = filteredKeys
      render.value++
    })
  }
  const getComboboxOwnerInf = async (loadMore?: any) => {
    // loadMore dùng khi infinity scroll
    if (vSelectOwner.value) {
      await getComboboxOwner(vSelectOwner.value).then((value: any) => {
        if (ownerCombobox.value.data?.length) {
          vSelectOwner.value.totalRecord = ownerCombobox.value.totalRecord
          if (loadMore)
            vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.concat(ownerCombobox.value.data)

          else
            vSelectOwner.value.listCombobox = ownerCombobox.value?.data

          if (vSelectOwner.value.itemSelected?.id && !loadMore) {
            const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item?.id === vSelectOwner.value.itemSelected.id)
            if (indexOwner === -1) {
              vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value?.itemSelected)
              vSelectOwner.value.excludeList = [vSelectOwner.value?.itemSelected.id]
            }
          }
        }

        else {
          vSelectOwner.value.listCombobox = []
          vSelectOwner.value.totalRecord = 0
        }
      })
    }
  }
  const getInforOrgById = async () => {
    const params = {
      organizationalStructureId: idOrg.value,
    }
    await MethodsUtil.requestApiCustom(ApiUser.GetOrgById, TYPE_REQUEST.GET, params).then(async (value: any) => {
      if (value.data.parentId === 0)
        value.data.parentId = null
      if (value.data?.ownerId) {
        vSelectOwner.value.excludeList = [value.data?.ownerId]

        await MethodsUtil.searchUserInfoByIds([value.data?.ownerId]).then((users: any) => {
          if (users?.pageLists.length) {
            const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item.id === vSelectOwner.value.itemSelected.id)
            if (indexOwner === -1)
              vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value.itemSelected)
          }
          else {
            vSelectOwner.value.itemSelected.id = null
            value.data.ownerId = null
          }
        })
      }

      organization.value = value.data
    })
  }

  // thêm mới
  const addOrganizational = async (isUpdate: any) => {
    const params = (({ code, name, parentId, ownerId, description }) => ({
      code, name, parentId, ownerId, description,
    }))(organization.value)
    if (params.parentId === null)
      params.parentId = 0

    await MethodsUtil.requestApiCustom(ApiUser.PostOrgCreate, TYPE_REQUEST.POST, organization.value)
      .then(async (value: any) => {
        if (value.code === 200) {
          if (isUpdate === false) { router.push({ name: 'admin-organization-org-struct-list', query: { navigateFrom: value.data } }) }
          else {
            window.showAllPageLoading('COMPONENT')
            router.push({ name: 'admin-organization-org-struct-edit', params: { tab: 'infor', id: value.data } })
            isEdit.value = true
            idOrg.value = value.data
            await getInforOrgById()
            window.hideAllPageLoading()
          }
          toast('SUCCESS', t('add-success'))
          resetForm()
        }
      })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  // Cập nhật cơ cấu tổ chức
  const updateOrganizational = async () => {
    const params = (({
      code, id, name, parentId, ownerId, description,
    }) => ({
      code, id, name, parentId, ownerId, description,
    }))(organization.value)
    if (params.parentId === null)
      params.parentId = 0

    await MethodsUtil.requestApiCustom(ApiUser.PostOrgUpdate, TYPE_REQUEST.POST, params).then((value: any) => {
      if (value.code === 200) {
        window.showAllPageLoading('COMPONENT')
        router.push({ name: 'admin-organization-org-struct-list', query: { navigateFrom: organization.value.id } })
        window.hideAllPageLoading()
      }
      toast('SUCCESS', t('USR_UpdateSuccess'))
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  // Reset data title
  const resetDataTitle = () => {
    title.value.description = null
    title.value.name = null
    title.value.level = 1
    title.value.categoryTitleId = null
    title.value.proficiencies = []
    title.value.proficiencyModel = []
    title.value.id = null
  }

  // Lấy dữ liệu user trong org
  const fetchDataUserOrg = async () => {
    queryUser.value.orStructureId = organization.value.id
    await MethodsUtil.requestApiCustom(ApiUser.getPagingUserOrgByList, TYPE_REQUEST.GET, queryUser.value).then((value: any) => {
      dataTabUserOrg.value.list = value.data?.pageLists || []
      dataTabUserOrg.value.totalRecord = value.data?.totalRecord
    })
  }

  // Lấy thông tin chức danh trong cctc qua id
  const getInforTitleById = async (id: any) => {
    await MethodsUtil.requestApiCustom(ApiUser.getTitleById, TYPE_REQUEST.GET, { id }).then((value: any) => {
      value.data.proficiencies = value.data.proficiencyModel
      title.value = value.data
      viewModeAddTitle.value = true
    })
  }

  // thêm/cập nhật chức danh vào cơ cấu tổ chức
  const handleModifineTitleOrg = async () => {
    title.value.orStructureId = organization.value.id
    title.value.level = Number(title.value.level)
    if (title.value.id)
      title.value.proficiencyModel = title.value.proficiencies

    else
      title.value.proficiencyModel = title.value.proficiencies.map(({ proficiencyLevelId }: any) => proficiencyLevelId)

    if (title.value.id) {
      await MethodsUtil.requestApiCustom(ApiUser.PostUpdateTitle, TYPE_REQUEST.POST, title.value)
        .then((value: any) => {
          if (value.code === 200) {
            resetDataTitle()
            toast('SUCCESS', t(value.message))
            return value
          }
        })
        .catch((error: any) => {
          toast('ERROR', t(error.response.data.message))
        })
    }

    else {
      await MethodsUtil.requestApiCustom(ApiUser.PostCreateTitle, TYPE_REQUEST.POST, title.value)
        .then((value: any) => {
          if (value.code === 200) {
            resetDataTitle()
            toast('SUCCESS', t(value.message))
            return value
          }
        })
        .catch((error: any) => {
          toast('ERROR', t(error.response.data.message))
        })
    }
  }

  // lấy danh sách năng lực
  const getAllProficiency = async () => {
    await MethodsUtil.requestApiCustom(ApiUser.getProficiencyData, TYPE_REQUEST.POST, {}).then((value: any) => {
      value?.data?.forEach((item: any) => { item.id = MethodsUtil.createRandomId(5) })
      proficiencies.value = value?.data
    })
  }

  // thêm năng lực
  const addProficiency = (data: any) => {
    if (!title.value.proficiencies || title.value.proficiencies === null)
      title.value.proficiencies = []
    toast('SUCCESS', t('add-success'))
    title.value.proficiencies.push(data)
  }

  // trở về list view
  const backOrg = () => {
    router.push({ name: 'admin-organization-org-struct-list', query: organization.value.id ? { navigateFrom: organization.value?.id } : {} })
  }

  // Lưu cơ cấu tổ chức
  const handleSaveOrg = async () => {
    myFormAddInforOrg.value.validate().then(async (success: any) => {
      if (success.valid) {
        if (organization.value.id === organization.value.parentId)
          toast('ERROR', t('parent-invalid'))

        else if (isEdit.value === false)
          addOrganizational(false)
        else updateOrganizational()
      }
    })
  }

  // Lưu và cập nhật cơ cấu tổ chức
  const handleSaveUpdateOrg = () => {
    myFormAddInforOrg.value.validate().then(async (success: any) => {
      if (success.valid)
        addOrganizational(true)
    })
  }

  // danh sách id người dùng
  const fetchUserIds = async () => {
    const params = {
      id: organization.value?.id,
      typeId: 3,
    }
    await MethodsUtil.requestApiCustom(ApiUser.GetUserExclude, TYPE_REQUEST.GET, params).then((value: any) => {
      userIds.value = value?.data
    })
  }

  // danh sách chức danh
  const getPagingByTitles = async () => {
    const params = {
      orStructureId: organization.value.id,
      pageNumber: 1,
      pageSize: 1000,
      search: '',
    }
    await MethodsUtil.requestApiCustom(ApiUser.GetListTitle, TYPE_REQUEST.POST, params).then((value: any) => {
      listTitles.value = value?.data?.pageLists
    })
  }
  const exportExcel = async () => {
    window.showAllPageLoading()
    const params = {
      language:
          localStorage.getItem('lang') === null
            ? 'vi'
            : localStorage.getItem('lang'),
    }
    await MethodsUtil.dowloadSampleFile(
      ApiUser.exportOrgStructToExcel,
      'POST',
      'organizationalstructure.xlsx',
      params,
    )
    window.hideAllPageLoading()
  }
  const handleAddFromApi = async (model: any) => {
    if (apiType.value === 'title') {
      model.forEach((element: any) => {
        if (!element.Level || element.Level.length === 0)
          element.Level = null
        if (!element.TitleId || element.TitleId.length === 0)
          element.TitleId = null
      })
    }
    const params = {
      isSave: false,
      data: model,
    }
    await MethodsUtil.requestApiCustom(apiType.value === 'org' ? ApiUser.PostCreateFromXml : ApiUser.PostCreateTitleFromXml, TYPE_REQUEST.POST, params).then((value: any) => {
      if (value.code === 200) {
        if (apiType.value === 'title') {
          xmlTitleData.value = value.data
          return 'xmlTitleModalId'
        }
        else {
          xmlTitleData.value = value.data
          return 'xmlModalId'
        }
      }
    })
  }
  return {
    idOrg,
    organization,
    myFormAddInforOrg,
    vSelectOwner,
    isEdit,
    isView,
    nodes,
    config,
    render,
    title,
    viewModeAddTitle,
    proficiencies,
    titleSelected,
    userIds,
    listTitles,
    apiType,
    getComboboxOwnerInf,
    getInforOrgById,
    addOrganizational,
    updateOrganizational,
    resetForm,
    getListOrgStruct,
    handleModifineTitleOrg,
    fetchDataUserOrg,
    getInforTitleById,
    getAllProficiency,
    addProficiency,
    backOrg,
    handleSaveOrg,
    handleSaveUpdateOrg,
    resetDataTitle,
    fetchUserIds,
    getPagingByTitles,
    exportExcel,
    handleAddFromApi,
  }
})
