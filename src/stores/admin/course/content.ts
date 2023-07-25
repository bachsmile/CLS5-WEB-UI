/* eslint-disable indent */
import { defineStore } from 'pinia'
import StringJwt from '@/utils/Jwt'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import ArraysUtil from '@/utils/ArrayUtil'
import StringUtil from '@/utils/StringUtil'
import toast from '@/plugins/toast'
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import { tableStore } from '@/stores/table'
import type { Any } from '@/typescript/interface'

export const contentManagerStore = defineStore('contentManager', () => {
  /** lib ****************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()

  /**
 * Store
 */
  const storeCourseApproveManager = courseApproveManagerStore()
  const storeTable = tableStore()
  const { callBackAction } = storeToRefs(storeTable)

  const { idModalSendRatioPoint } = storeToRefs(storeCourseApproveManager)
  const { handleUpdatePointCourse } = storeCourseApproveManager

  /** ********************************Content******************************************** */
  /** state */
  const data = reactive({
    deleteIds: [], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const items = ref<any>([])
  const cloneData = ref<any>([])
  const customId = ref('id')
  const viewMode = ref('view')
  const feedbackContent = ref('')
  const isShowModelFeedback = ref(false)
  const isShowDialogNotiDelete = ref(false)
  const isShowModalUpdateThematic = ref(false)
  const isShowModalMoveThematic = ref(false)
  const courseContentId = ref<number | null>(null)
  const disabledDelete = computed(() => !data.selectedRowsIds.length)
  const disabledEdit = computed(() => !data.selectedRowsIds.length)
  const isShowModalMeeting = ref(false)
  const contentDataEdit = ref<any>({
    name: null,
    themeticId: null,
    courseId: null,
    topicCourseId: 0,
    archiveTypeId: 13,
    description: '',
    url: null,
    dateTimeStart: null,
    dateTimeEnd: null,
    isRewind: false,
    isPdf: false,
  })
  const paramsContent = ref({
    id: Number(route?.params?.id) || null,
    search: null as any,
    role: StringJwt.getRole(),
  })

  /** method */
  function handleUpdateThematic() {
    contentDataEdit.value.courseId = Number(route.params?.id)
    MethodsUtil.requestApiCustom(courseContentId.value ? CourseService.PostUpdateRefer : CourseService.PostAddRefer, TYPE_REQUEST.POST, contentDataEdit.value).then((value: any) => {
      toast('SUCCESS', t(value?.message))
      getListContentCourse()
    }).catch((error: any) => {
      toast('ERROR', t(error.response.data.message))
    })
  }
  async function getInforContent(id: any) {
    const params = {
      isView: false,
      id,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetInforContentById, TYPE_REQUEST.GET, params).then((value: any) => {
      if (value.data?.themeticId === 0)
        value.data.themeticId = null
      contentDataEdit.value = value?.data
    })
  }
  const dataDetailMeeting = ref<Any>({})
  function showModalEditMeeting(id: number) {
    MethodsUtil.requestApiCustom(CourseService.GetInforContentById, TYPE_REQUEST.GET, { id, isView: false }).then((result: Any) => {
      dataDetailMeeting.value = result?.data
      isShowModalMeeting.value = true
    }).catch(() => {
      //
    })
  }
  async function actionItemUserReg(type: any) {
    switch (type[0]?.name) {
      case 'ActionEdit':
        if (type[1]?.contentArchiveTypeId === 13) {
          getInforContent(type[1]?.courseContentId)
          courseContentId.value = type[1]?.courseContentId
          nextTick(() => {
            isShowModalUpdateThematic.value = true
          })
        }
        else if (type[1]?.contentArchiveTypeId === 3) {
          showModalEditMeeting(type[1]?.courseContentId)
        }
        else {
          router.push({
            name: 'content-edit',
            params: {
              id: Number(route.params.id),
              type: MethodsUtil.getTypeContent(type[1].contentArchiveTypeId),
              contentId: type[1]?.courseContentId,
            },
            query: {
              contentTab: 'infor',
            },
          })
        }
        break
      case 'ActionDelete':
        deleteItem(type[1].courseContentId)
        break
      case 'ActionViewFeedBack':
        viewFeedback(type[1]?.courseContentId)
        break
      case 'ActionRecallRequest':
        recall(type[1]?.courseContentId, false)
        break
      case 'ActionAcceptRecallRequest':
        recall(type[1]?.courseContentId, true)
        break
      case 'AddQuestionContent':
        addToContentRepo(type[1]?.courseContentId)
        break
      case 'MoveUp':
        moveUp(type[1])
        break
      case 'MoveDown':
        moveDown(type[1])
        break
      case 'ActionSendAgree':
        sendApprove(type[1]?.courseContentId)
        break
      case 'ActionAgree':
        await approveContent([{ id: type[1]?.courseContentId }]).then(() => {
          getListContentCourse()
        })
        break
      case 'ActionUpdatePointOffline':
        router.push({
          name: 'update-point-offline',
          params: {
            id: Number(route.params.id),
            contentId: type[1]?.courseContentId,
          },
        })
        break
      case 'ActionViewDetail':
        if (type[1]?.contentArchiveTypeId === 13) {
          getInforContent(type[1]?.courseContentId)
          courseContentId.value = type[1]?.courseContentId
          nextTick(() => {
            isShowModalUpdateThematic.value = true
          })
        }
        else {
          router.push({
            name: 'content-view',
            params: {
              id: Number(route.params.id),
              type: 'video-content',
              contentId: type[1]?.courseContentId,
            },
            query: {
              contentTab: 'infor',
            },
          })
        }
        break
        break
      default:
        break
    }
  }
  function selectedRows(e: any) {
    data.selectedRowsIds = e
  }

  //* *****action thực thi */
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
  function updateStatusListCourse(listData: any, val: any) {
    let newListContent = listData?.map((item: any) => {
      if (StringUtil.removeAccents(item?.name.toLowerCase()).includes(StringUtil.removeAccents(val?.toLowerCase())))
        return item

      let children = item?.children
      if (children?.length > 0) {
        children = updateStatusListCourse(children, val)
        children = children.filter(Boolean)
        if (children?.length > 0)
          return { ...item, children }

        return null
      }
      return null
    })
    newListContent = newListContent.filter(Boolean)

    return newListContent
  }

  async function handleSearch(val: any) {
    paramsContent.value.search = val
    const result: any[] = []
    convertNoneLv(updateStatusListCourse(cloneData.value, val), result, 0)
    items.value = result
  }
  function handlerActionHeader(type: any) {
    switch (type) {
      case 'handlerCustomButton':

        router.push({ name: 'course-approve' })
        break
      case 'setting-point':
        idModalSendRatioPoint.value = true
        break

      default:
        break
    }
  }

  // Xóa từng item
  function deleteItem(id: number) {
    data.deleteIds = [id as never]
    isShowDialogNotiDelete.value = true
  }
  function deleteItems() {
    data.deleteIds = data.selectedRowsIds
    isShowDialogNotiDelete.value = true
  }
  async function deleteAction() {
    const params = {
      courseId: Number(route?.params?.id),
      model: data.deleteIds,
    }
    await MethodsUtil.requestApiCustom(CourseService.PostDeleteContent, TYPE_REQUEST.POST, params)
      .then(async (value: any) => {
        toast('SUCCESS', t(value?.message))
        await getListContentCourse()
        data.deleteIds = []
        data.selectedRowsIds = []
      })
      .catch(() => {
        toast('ERROR', t('USR_DeleteFail'))
      })
  }
  function confirmDialogDelete(event: any) {
    if (event)
      deleteAction()
  }

  // gửi duyệt
  async function sendApprove(id: number) {
    const params = {
      listModel: [id],
      courseId: Number(route?.params?.id),
    }
    await MethodsUtil.requestApiCustom(CourseService.PostSendApproveContent, TYPE_REQUEST.POST, params).then((value: any) => {
      toast('SUCCESS', t(value.message))
      getListContentCourse()
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  // xem thông tin phản hồi
  async function viewFeedback(id: number) {
    const params = {
      id,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetFeadback, TYPE_REQUEST.GET, params).then((value: any) => {
      feedbackContent.value = value.data
      isShowModelFeedback.value = true
    })
  }

  // Thêm vào ngân hàng nội dung
  async function addToContentRepo(id: number) {
    const params = {
      courseContentId: id,
    }
    await MethodsUtil.requestApiCustom(CourseService.PutAddToContentBank, TYPE_REQUEST.PUT, params).then((value: any) => {
      toast('SUCCESS', t('add-content-to-repo-success'))
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  // tìm đối tượng cha

  function findNodeByValue(tree: any, value: any) {
    for (let i = 0; i < tree?.length; i++) {
      const node = tree[i]

      if (node.id === value)
        return node // Nếu giá trị trùng khớp, trả về nút

      if (node?.children?.length > 0) {
        const foundNode: any = findNodeByValue(node.children, value)
        if (foundNode)
          return foundNode // Nếu tìm thấy nút, trả về nút
      }
    }

    return null // Nếu không tìm thấy, trả về null
  }
  function findParent(listItem: any, item: any): any {
    const parent = item?.parent?.id ? findNodeByValue(listItem, item?.parent?.id) : item
    return parent ?? null
  }
  function formatDataTableTree(dataFormat: any) {
    const result: any[] = []
    convertNoneLv(dataFormat, result, 0)
    return result
  }

  // kiểm tra di chuyển
  function checkMove(item: any, isMoveUp: any) {
    if (cloneData.value && cloneData.value.length) {
      const parent: any = findParent(cloneData.value, item)
      let index = 0
      if (parent?.id === item?.id) {
        index = window._.findIndex(cloneData.value, (element: any) => window._.isEqual(element.id, parent.id))

        if (isMoveUp === true)
          return index > 0
        return index < cloneData.value.length - 1
      }
      const content = parent?.children.find((x: any) => x.courseContentId === item.courseContentId)
      index = parent?.children.indexOf(content)
      if (isMoveUp === true)
        return index > 0
      return index < parent?.children.length - 1
    }
    return false
  }

  // cập nhật vị trí
  async function updatePosition(toash?: any) {
    const params = {
      courseId: Number(route?.params?.id),
      listId: items.value.map((itemRow: any, indexRow: any) => ({
        id: itemRow.courseContentId,
        position: indexRow,
      })),
    }
    await MethodsUtil.requestApiCustom(CourseService.PostPositionContent, TYPE_REQUEST.POST, params).then((value: any) => {
      if (toash)
        toast('SUCCESS', t(value.message))
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))

      // items.value = dataClone.value
      })
  }

  // cập nhật chuyên đề
  async function handleMoveThematic(thematic: any) {
    const params = {
      courseId: Number(route?.params?.id),
      themeticId: thematic,
      model: data.selectedRowsIds,
    }

    await MethodsUtil.requestApiCustom(CourseService.PostMoveThemetic, TYPE_REQUEST.POST, params).then((value: any) => {
      toast('SUCCESS', t(value?.message))
      data.deleteIds = []
      data.selectedRowsIds = []
      getListContentCourse()
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  // di chuyển lên trên
  function moveUp(item: any) {
    const dataNew: any = window._.cloneDeep(cloneData.value)
    const parent = findParent(dataNew, item)
    let index = 0
    if (parent?.id === item?.id) {
      index = window._.findIndex(dataNew, (element: any) => window._.isEqual(element.id, parent.id))
      dataNew.splice(index, 1)
      dataNew.splice(index - 1, 0, parent)
    }
    else {
      const content = parent.children.find((x: any) => x.courseContentId === item.courseContentId)
      index = parent.children.indexOf(content)
      parent.children.splice(index, 1)
      parent.children.splice(index - 1, 0, item)
    }
    cloneData.value = dataNew
    items.value = formatDataTableTree(dataNew)
    updatePosition(true)
  }

  // di chuyển xuống dưới
  function moveDown(item: any) {
    const dataNew: any = window._.cloneDeep(cloneData.value)
    const parent = findParent(dataNew, item)
    let index = 0
    if (parent.id === item.id) {
      index = window._.findIndex(dataNew, (element: any) => window._.isEqual(element.id, parent.id))
      dataNew.splice(index, 1)
      dataNew.splice(index + 1, 0, parent)
    }
    else {
      const content = parent.children.find((x: any) => x.courseContentId === item.courseContentId)
      index = parent.children.indexOf(content)
      parent.children.splice(index, 1)
      parent.children.splice(index + 1, 0, item)
    }
    cloneData.value = dataNew
    items.value = formatDataTableTree(dataNew)
    updatePosition(true)
  }

  // type:=>  true: Chấp nhận yêu cầu thu hồi , false: Yêu cầu thu hồi
  async function recall(id: number, type: boolean) {
    const params = {
      listModel: [id],
      courseId: Number(route?.params?.id),
    }
    await MethodsUtil.requestApiCustom(type ? CourseService.PostAcceptRecall : CourseService.PostRequestRecall, TYPE_REQUEST.POST, params)
      .then((value: any) => {
        toast('SUCCESS', t(value.message))
        getListContentCourse()
      })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  function convertNoneLv(listData: any[], result: any[], level: number, parent?: any) {
    listData?.forEach((item: any) => {
      if (item?.children && item?.children?.length > 0) {
        result.push({
          ...item,
          level,
          ...(
            parent
              ? ({
                  parent: {
                    [customId.value]: parent[customId.value],
                  },
                })
              : {}
          ),
        })
        convertNoneLv(item?.children, result, level + 1, item)
      }
      else {
        result.push({
          ...item,
          level,
          ...(
            parent
              ? ({
                  parent: {
                    [customId.value]: parent[customId.value],
                  },
                })
              : {}
          ),
        })
      }
    })
  }

  /** *****Lấy danh sách nội dung */
  async function getListContentCourse() {
    console.time('updates')
    paramsContent.value.id = Number(route.params?.id)

    const value = await MethodsUtil.requestApiCustom(CourseService.GetListContentCourse, TYPE_REQUEST.GET, paramsContent.value)
    if (value.data) {
      const result: any[] = []

      cloneData.value = window._.cloneDeep(value.data)
      convertNoneLv(value.data, result, 0)
      items.value = result

      // updatePosition()
      console.timeEnd('updates')
    }
  }

  /** ********************************end Content******************************************** */
  /** ********************************Reference******************************************** */
  // state
  const viewModeRefer = ref('view')
  const itemsRefer = ref()
  const customIdRefer = ref('id')
  const isShowDialogNotiDeleteRefer = ref(false)
  const isShowModalAddRefStock = ref(false)
  const cloneDataRefer = ref<any>([])
  const contentRefer = ref<any>({
    courseId: route.params.id,
    archiveTypeId: 0,
    description: '',
    urlFileName: null,
    name: null,
    url: null,
    dateTimeStart: null,
    dateTimeEnd: null,
    isRewind: false,
    isPdf: false,
  })
  const paramsRefer = ref({
    id: Number(route?.params?.id) || null,
    search: null as any,
    role: StringJwt.getRole(),
  })
  const dataRefer = reactive({
    deleteIds: [], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const dataSelectRef = ref<any>()
  const disabledDeleteRefer = computed(() => !dataRefer.selectedRowsIds.length)

  function resetRefer() {
    contentRefer.value = {
      courseId: route.params.id,
      archiveTypeId: 0,
      description: '',
      urlFileName: null,
      name: null,
      url: null,
      dateTimeStart: null,
      dateTimeEnd: null,
      isRewind: false,
      isPdf: false,
    }
  }

  // Xóa từng item
  function deleteItemRefer(id: number) {
    dataRefer.deleteIds = [id as never]
    isShowDialogNotiDeleteRefer.value = true
  }
  function deleteItemsRefer() {
    dataRefer.deleteIds = dataRefer.selectedRowsIds
    isShowDialogNotiDeleteRefer.value = true
  }
  async function deleteActionRefer() {
    const params = {
      courseId: Number(route?.params?.id),
      model: dataRefer.deleteIds,
    }
    await MethodsUtil.requestApiCustom(CourseService.PostDeleteRefer, TYPE_REQUEST.POST, params)
      .then(async (value: any) => {
        toast('SUCCESS', t(value?.message))
        await getListReferContentCourse(Number(route?.params?.id))
        dataRefer.deleteIds = []
        dataRefer.selectedRowsIds = []
      })
      .catch(() => {
        toast('ERROR', t('USR_DeleteFail'))
      })
  }
  function confirmDialogDeleteRefer(event: any) {
    if (event)
      deleteActionRefer()
  }
  function selectedRowsRefer(e: any) {
    dataRefer.selectedRowsIds = e
  }
  async function actionItemRefer(type: any) {
    switch (type[0]?.name) {
      case 'ActionDelete':
        deleteItemRefer(type[1].courseContentId)
        break
      case 'ActionEdit':
        dataSelectRef.value = type[1]
        getDataContentRefer(type[1].courseContentId)

        break

      default:
        break
    }
  }

  async function handleSearchRefer(val: any) {
    paramsRefer.value.search = val
    let dataRow = ArraysUtil.unFlatMapTree(updateStatusListCourse(cloneDataRefer.value, val))
    dataRow = ArraysUtil.formatTreeTable(dataRow, customIdRefer.value)
    dataRow.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    itemsRefer.value = dataRow
  }
  async function getListReferContentCourse(id: number) {
    const params = {
      id,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetListReferContent, TYPE_REQUEST.GET, params)
      .then((value: any) => {
        cloneDataRefer.value = window._.cloneDeep(value.data)
        let dataRow = ArraysUtil.unFlatMapTree(value.data)
        dataRow = ArraysUtil.formatTreeTable(dataRow, customIdRefer.value)
        dataRow.forEach((element: any) => {
          if (element?.parent?.id === 0) {
            element.actions = [
              MethodsUtil.checkActionType({ id: 1 }),
              MethodsUtil.checkActionType({ id: 2 }),
            ]
          }
          if (element?.parent?.id === 1) {
            element.actions = [
              MethodsUtil.checkActionType({ id: 2 }),
            ]
          }
        })
        itemsRefer.value = dataRow
      })
  }
  async function handleAddRefContentStock(dataRef: any) {
    const params = {
      courseId: Number(route?.params?.id),
      model: dataRef,
    }
    await MethodsUtil.requestApiCustom(CourseService.PostSaveRefContent, TYPE_REQUEST.POST, params).then((value: any) => {
      toast('SUCCESS', t(value?.message))
      getListReferContentCourse(Number(route?.params?.id))
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }
  async function getDataContentRefer(contentId: any) {
    const params = {
      id: Number(contentId),
    }
    return await MethodsUtil.requestApiCustom(CourseService.GetInforContentById, TYPE_REQUEST.GET, params).then((value: any) => {
      contentRefer.value = value?.data
      viewModeRefer.value = 'file'
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  /** ********************************Reference******************************************** */
  /** ********************************Stock content******************************************** */
  const isShowModalAddStockContent = ref(false)
  const paramsContentStock = ref({
    listTopic: [
    ],
    authorId: null,
    topicId: null,
    archiveTypeId: null,
    fromDate: '',
    toDate: '',
    pageSize: 10,
    pageNumber: 1,
    searchData: '',
    role: StringJwt.getRole(),
  })
  const dataStock = reactive({
    deleteIds: [], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  async function handleAddContentFromStock(listId: any) {
    const params = {
      courseId: Number(route?.params?.id),
      listId,
    }

    await MethodsUtil.requestApiCustom(CourseService.PostAddLContentStock, TYPE_REQUEST.POST, params).then((value: any) => {
      toast('SUCCESS', t(value?.message))
      data.deleteIds = []
      data.selectedRowsIds = []
      getListContentCourse()
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
      })
  }

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    callBackAction,

    /** Nội dung */
    items,
    data,
    disabledDelete,
    disabledEdit,
    isShowModelFeedback,
    feedbackContent,
    isShowDialogNotiDelete,
    isShowModalUpdateThematic,
    isShowModalMoveThematic,
    isShowModalMeeting,
    dataDetailMeeting,
    viewMode,
    contentDataEdit,
    courseContentId,
    getListContentCourse,
    confirmDialogDelete,
    handlerActionHeader,
    handleSearch,
    selectedRows,
    deleteItems,
    moveUp,
    actionItemUserReg,
    checkMove,
    approveContent,
    handleMoveThematic,
    handleUpdateThematic,

    /** Nội dung tham khảo */
    itemsRefer,
    viewModeRefer,
    contentRefer,
    isShowDialogNotiDeleteRefer,
    disabledDeleteRefer,
    isShowModalAddRefStock,
    dataSelectRef,
    confirmDialogDeleteRefer,
    getListReferContentCourse,
    selectedRowsRefer,
    deleteItemsRefer,
    handleSearchRefer,
    handleAddRefContentStock,
    actionItemRefer,
    resetRefer,

    /** Stock content */
    dataStock,
    isShowModalAddStockContent,
    paramsContentStock,
    handleAddContentFromStock,
  }
})
