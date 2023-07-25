import { defineStore } from 'pinia'
import MethodsUtil from '@/utils/MethodsUtil'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import { validatorStore } from '@/stores/validatator'

export const profileUserManagerStore = defineStore('profileUserManager', () => {
  /** variable main */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const route = useRoute()
  const router = useRouter()

  /** data main */
  interface userInfor {
    academicDegreeId: any
    academicRankId: any
    address: any
    avatar: any
    birthDay: any
    email: any
    employmentDate: any
    firstName: any
    gender: boolean
    lastName: any
    levelId: any
    listEducationUser: Array<any>
    listExperienceUser: Array<any>
    listGroupId: Array<any>
    listOrganizationalStructureId: Array<any>
    passport: any
    password: any
    payrollScaleId: any
    phoneNumber: any
    position: any
    statusId: any
    story: any
    timeZoneId: any
    userCode: any
    userName: any
    userTitleId: any
    userTypeId: any
    wardId: any
    districtId: any
    provinceId: any
    workplace: any
    listBranchId: any
    countryId: any
    userGroups: Array<any>
    userBranches: Array<any>
    kpiLearn: any
    kpiTeach: any
  }
  const initForm = ref<any>({
    academicDegreeId: null,
    academicRankId: null,
    address: '',
    avatar: '',
    birthDay: null,
    email: '',
    employmentDate: '',
    firstName: undefined,
    gender: true,
    lastName: '',
    levelId: null,
    listEducationUser: [],
    listExperienceUser: [],
    listGroupId: [],
    listOrganizationalStructureId: [],
    passport: '',
    password: '',
    payrollScaleId: null,
    phoneNumber: '',
    position: '',
    statusId: null,
    story: '',
    timeZoneId: null,
    userCode: '',
    userName: '',
    userTitleId: null,
    userTypeId: null,
    wardId: null,
    districtId: null,
    provinceId: null,
    workplace: '',
    listBranchId: null,
    countryId: null,
    userGroups: [],
    userBranches: [],
    kpiLearn: null,
    kpiTeach: null,
  })

  const idUpdate = ref<any>(null)
  const myFormUserInfor = ref()
  const titleTable = ref()
  const isShowButton = ref(true)
  const idUser = ref()
  const schema = ref<any>(null)

  /**
 * Xử lý data form
 *
 */
  const storeValidate = validatorStore()
  const { schemaOption, Field, Form, useForm, yup } = storeValidate
  const schemaInit = reactive<any>({
    lastName: schemaOption.lastName,
    firstName: schemaOption.firstName,
    email: schemaOption.email,
    userName: schemaOption.userName,
    userCode: schemaOption.userCode,
    phoneNumber: schemaOption.phoneNumber,
    kpiLearn: schemaOption.kpiLearn,
    kpiTeach: schemaOption.kpiTeach,
    userTypeIdSingle: schemaOption.userTypeIdSingle,
    statusIdSingle: schemaOption.statusIdSingle,
    defaultField: schemaOption.defaultField,
  })

  const schemaPass = reactive<any>({
    password: schemaOption?.password,
  })
  const updateSchema = () => {
    schema.value = null

    if (!Number(route.params.id))
      schema.value = { ...schemaInit, ...schemaPass }
    else
      schema.value = schemaInit
  }
  updateSchema()

  const { values, setValues, resetForm, submitForm, resetField, errors } = useForm({
    validationSchema: schema,
    initialValues: ref<userInfor>(window._.cloneDeep(initForm)),
  })

  /**
 *
 * Lấy dữ liệu edit
 */
  const getErrorsMessage = (errorsMess: Array<any>) => {
    let str = ''
    errorsMess.forEach(element => {
      str += `${t(element.message, element.params)}`
      str += '. '
    })

    return str
  }

  const updateListOrg = (val: any) => {
    const list: number[] = []

    val.forEach((item: any) => {
      if (item.id)
        list.push(item.id)
    })
    values.listOrganizationalStructureId = list as never
  }

  // lấy mã code
  const getAutoCode = async () => {
    await MethodsUtil.requestApiCustom(ApiUser.getAutoCode, TYPE_REQUEST.GET).then((value: any) => {
      values.userCode = value?.data?.data
    })
  }

  const resetData = () => {
    isShowButton.value = true

    router.replace({ name: 'admin-organization-users-profile-add', params: { tab: 'infor' } })

    idUpdate.value = null

    idUser.value = null
    getAutoCode()
  }

  // lấy thông tin học viên

  const fectchLecturers = async (id: any) => {
    const params = { userId: id }

    idUpdate.value = id
    await MethodsUtil.requestApiCustom(ApiUser.fetchDetailUpdate, TYPE_REQUEST.GET, params).then((value: any) => {
      setValues(value.data)
    })
  }
  const resetFormInfor = () => {
    idUpdate.value = null

    resetForm()
    if (myFormUserInfor.value)
      myFormUserInfor.value.resetForm()

    updateSchema()
    idUpdate.value = null
  }
  const handlesCreateUser = async (bvModalEvt: any, dataObj: any, type: any) => {
    const form: any = myFormUserInfor.value
    if (form) {
      form.validate().then(async (success: any) => {
        if (success.valid) {
          const params = dataObj

          await MethodsUtil.requestApiCustom(ApiUser.fetchCreateUser, TYPE_REQUEST.POST, params)
            .then((value: any) => {
              if (titleTable.value?.isChange)
                titleTable.value.updateTitle(value.data)
              toast('SUCCESS', t(value.message))

              if (type === 'save') {
                router.push({ name: 'admin-organization-users-manager' })

                return
              }
              if (type === 'save-add')
                resetData()

              idUser.value = value.data

              fectchLecturers(value.data)
              idUpdate.value = value.data

              router.push({ name: 'admin-organization-users-profile-edit', params: { tabActive: 'infor', id: idUser.value } })
            })

            .catch((error: any) => {
              toast('ERROR', t(getErrorsMessage(error)))
            })
        }
      })
    }
  }

  /**
 * update users
 *
 */
  const handleUpdateUser = async (bvModalEvt: any, dataObj: any, type: any) => {
    const form: any = myFormUserInfor.value

    form.validate().then(async (success: any) => {
      if (success.valid) {
        const params = dataObj

        await MethodsUtil.requestApiCustom(ApiUser.fetchUpdateUser, TYPE_REQUEST.POST, params)
          .then((value: any) => {
            if (titleTable.value?.isChange)
              titleTable.value.updateTitle()

            toast('SUCCESS', t(value.message))

            if (type === 'save') {
              router.push({ name: 'admin-organization-users-manager' })

              return
            }
            if (type === 'save-add') {
              resetData()
              resetFormInfor()
            }
          })
      }
      else {
        toast('ERROR', t('invalid-infor'))
      }
    })
  }

  const handleUser = (bvModalEvt: any, type: any) => {
    values.firstName = values?.firstName?.trim()
    values.lastName = values?.lastName?.trim()
    values.userName = values?.userName?.trim()

    if (idUpdate.value === null)
      handlesCreateUser(bvModalEvt, values, type)

    else
      handleUpdateUser(bvModalEvt, values, type)
  }

  onMounted(() => {
    // console.log('onMounted')
  })
  onBeforeUnmount(() => {
    // console.log('onBeforeUnmount')
  })

  return {
    idUpdate,
    isShowButton,
    myFormUserInfor,
    titleTable,
    values,
    schema,
    submitForm,
    resetFormInfor,
    fectchLecturers,
    handleUser,
    handlesCreateUser,
    handleUpdateUser,
    updateListOrg,
    updateSchema,
  }
})
