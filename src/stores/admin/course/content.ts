import { defineStore } from 'pinia'
import StringJwt from '@/utils/Jwt'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import ArraysUtil from '@/utils/ArrayUtil'
import StringUtil from '@/utils/StringUtil'
import toast from '@/plugins/toast'
import { courseApproveManagerStore } from '@/stores/admin/course/approve'

export const contentManagerStore = defineStore('contentManager', () => {
  /** lib ****************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()

  /**
 * Store
 */
  const storeCourseApproveManager = courseApproveManagerStore()

  const { idModalSendRatioPoint } = storeToRefs(storeCourseApproveManager)
  const { handleUpdatePointCourse } = storeCourseApproveManager

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
  const disabledDelete = computed(() => !data.selectedRowsIds.length)
  const disabledEdit = computed(() => !data.selectedRowsIds.length)
  const paramsContent = ref({
    id: Number(route?.params?.id) || null,
    search: null as any,
    role: StringJwt.getRole(),
  })

  /** method */
  async function actionItemUserReg(type: any) {
    console.log(type)

    switch (type[0]?.name) {
      case 'ActionEdit':
        console.log('ActionEdit')
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
  function showUpdateThematicModal() {
    const thematic = data.selectedRowsIds.find((x: any) => x.contentArchiveTypeId === 13)
    if (thematic) {
      toast('WARNING', t('not-select-thematic'))
      return
    }
    isShowModalUpdateThematic.value = true
  }
  async function handleSearch(val: any) {
    // paramsContent.value.search = value
    // await getListContentCourse()
    paramsContent.value.search = val
    let dataRow = ArraysUtil.unFlatMapTree(updateStatusListCourse(cloneData.value, val))
    dataRow = ArraysUtil.formatTreeTable(dataRow, customId.value)
    dataRow.forEach((element: any) => {
      element.actions = element.actions?.map((el: any) => {
        return MethodsUtil.checkActionType(el, actionItemUserReg)
      })
      element.actions = [
        ...element.actions,
        MethodsUtil.checkActionType({ id: 2 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 5 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 6 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 7 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 9 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 19 }, actionItemUserReg),

        // MethodsUtil.checkActionType({ id: 20 }, actionItemUserReg),
        // MethodsUtil.checkActionType({ id: 21 }, actionItemUserReg),
      ]
    })
    items.value = dataRow
  }
  function handlerActionHeader(type: any) {
    console.log(type)

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
      console.log(value)

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
    let dataRow = ArraysUtil.unFlatMapTree(dataFormat)
    dataRow = ArraysUtil.formatTreeTable(dataRow, customId.value)
    dataRow.forEach((element: any) => {
      // element.actions = element.actions?.map((el: any) => {
      //   return MethodsUtil.checkActionType(el, actionItemUserReg)
      // })
      element.actions = [
        MethodsUtil.checkActionType({ id: 2 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 3 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 5 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 6 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 7 }, actionItemUserReg),
        MethodsUtil.checkActionType({ id: 19 }, actionItemUserReg),

        // MethodsUtil.checkActionType({ id: 20 }, actionItemUserReg),
        // MethodsUtil.checkActionType({ id: 21 }, actionItemUserReg),
      ]
    })
    return dataRow
  }

  // kiểm tra di chuyển
  function checkMove(item: any, isMoveUp: any) {
    if (cloneData.value && cloneData.value.length) {
      const parent: any = findParent(cloneData.value, item)
      let index = 0
      if (parent?.id === item?.id) {
        index = window._.findIndex(cloneData.value, (element: any) => window._.isEqual(element.id, parent.id))
        console.log(index)
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
  async function updatePosition(toash: any) {
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

  /** *****Lấy danh sách nội dung */
  async function getListContentCourse() {
    await MethodsUtil.requestApiCustom(CourseService.GetListContentCourse, TYPE_REQUEST.GET, paramsContent.value)
      .then((value: any) => {
        cloneData.value = window._.cloneDeep(value.data)
        let dataRow = ArraysUtil.unFlatMapTree(value.data)
        dataRow = ArraysUtil.formatTreeTable(dataRow, customId.value)
        dataRow.forEach((element: any) => {
          console.log(element.actions)

          // element.actions = element.actions?.map((el: any) => {
          //   return MethodsUtil.checkActionType(el, actionItemUserReg)
          // })
          element.actions = [
            MethodsUtil.checkActionType({ id: 2 }, actionItemUserReg),
            MethodsUtil.checkActionType({ id: 3 }, actionItemUserReg),
            MethodsUtil.checkActionType({ id: 5 }, actionItemUserReg),
            MethodsUtil.checkActionType({ id: 6 }, actionItemUserReg),
            MethodsUtil.checkActionType({ id: 7 }, actionItemUserReg),
            MethodsUtil.checkActionType({ id: 9 }, actionItemUserReg),
            MethodsUtil.checkActionType({ id: 19 }, actionItemUserReg),

            // MethodsUtil.checkActionType({ id: 20 }, actionItemUserReg),
            // MethodsUtil.checkActionType({ id: 21 }, actionItemUserReg),
          ]
        })
        console.log(dataRow)

        items.value = dataRow
      })
  }

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    items,
    data,
    disabledDelete,
    disabledEdit,
    isShowModelFeedback,
    feedbackContent,
    isShowDialogNotiDelete,
    isShowModalUpdateThematic,
    viewMode,
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
    showUpdateThematicModal,
  }
})
