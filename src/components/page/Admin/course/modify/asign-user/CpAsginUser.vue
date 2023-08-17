<script lang="ts" setup>
import CpStudentRegister from './CpStudentRegister.vue'
import CpManaging from '@/components/page/gereral/CpManaging.vue'
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpMdEditUser from '@/components/page/gereral/CpMdEditUser.vue'
import CpMdEditGroupUser from '@/components/page/gereral/CpMdEditGroupUser.vue'
import CpOrganization from '@/components/page/gereral/CpOrganization.vue'
import UserService from '@/api/user'
import CourseService from '@/api/course'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { asignUserManagerStore } from '@/stores/admin/course/asignUser'
import StringJwt from '@/utils/Jwt'

/**
 * Store
 */
const storeAsignUserManager = asignUserManagerStore()
const { queryParams } = storeToRefs(storeAsignUserManager)

const { t } = window.i18n()
const route = useRoute()
const isViewDetail = computed(() => route.name === 'course-view')
const headerUser = computed(() => {
  if (route.name === 'course-view') {
    return [{ text: t('Full_Name'), value: 'fullName', width: 300, isFullName: true },
      { text: t('Email'), value: 'email' },
      { text: t('Register_Date'), value: 'registeredDate', isDate: true, type: 'custom' },
      { text: t('organization'), value: 'organization', type: 'menu' }]
  }
  return [
    { text: '', value: 'checkbox' },
    { text: t('Full_Name'), value: 'fullName', width: 300, isFullName: true },
    { text: t('Email'), value: 'email' },
    { text: t('Register_Date'), value: 'registeredDate', isDate: true, type: 'custom' },
    { text: t('organization'), value: 'organization', type: 'menu' },
    { text: '', value: 'actions', width: 50 },
  ]
})

const headerUserGroup = computed(() => {
  if (route.name === 'course-view') {
    return [{ text: t('user-group-name'), value: 'name' },
      { text: t('description'), value: 'description' }]
  }
  return [[
    { text: '', value: 'checkbox' },
    { text: t('user-group-name'), value: 'name' },
    { text: t('description'), value: 'description' },
    { text: '', value: 'actions', width: 50 },
  ]]
})
const listTab: Tab[] = [
  {
    key: 'assign-user',
    title: 'user',
    component: CpManaging,
    dataTab: {
      isView: isViewDetail,
      titlePage: t('user-list'),
      customId: 'id', // id table select
      keySearch: 'searchKey',
      isShowExportExcel: false,
      isShowOrg: false,
      header: headerUser,
      params: queryParams,
      actionsTable: [
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditUser,
      apiList: {
        api: CourseService.PostListInfoByCourse,
        method: TYPE_REQUEST.POST,
      },
      apiAdd: {
        api: CourseService.PostAddUserCourse,
        method: TYPE_REQUEST.POST,
        apiModal: CourseService.PostListUserCourse,
        methodModal: TYPE_REQUEST.POST,
        params: {
          courseId: route.params.id,
        },
        customKey: 'userModel',
      },
      apiDelete: {
        api: UserService.PostDeleteUserFromEvent,
        method: TYPE_REQUEST.POST,
        label: 'listUser',
        params: {},
      },
    },
  },
  {
    key: 'group-user',
    title: 'group-management',
    component: CpManaging,
    dataTab: {
      isView: isViewDetail,
      titlePage: t('list-group-user'),
      customId: 'id', // id table select
      isShowExportExcel: false,
      header: headerUserGroup,
      actionsTable: [
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditGroupUser,
      apiList: {
        api: UserService.GetUserGroup,
        method: TYPE_REQUEST.GET,
        payload: {
          courseId: Number(route.params.id),
        },
      },
      apiAdd: {
        api: CourseService.PostAddUserCourse,
        method: TYPE_REQUEST.POST,
        apiModal: UserService.GetPagingUserGroup,
        methodModal: TYPE_REQUEST.GET,
        params: {
          courseId: Number(route.params.id),
        },
        customKey: 'userModel',
      },
      apiDelete: {
        api: CourseService.PostDeleteUserGroup,
        method: TYPE_REQUEST.POST,
        label: 'listGroup',
        params: {},
      },
    },
  },
  {
    key: 'organizational-structure',
    title: 'organizational-structure-management',
    component: CpOrganization,
    dataTab: {
      isView: isViewDetail,
      apiList: {
        api: CourseService.GetOrganizationalStructure,
        method: TYPE_REQUEST.GET,
        params: {
          role: StringJwt.getRole(),
        },
      },
      apiAdd: {
        api: CourseService.PostOrgCourse,
        method: TYPE_REQUEST.POST,
        params: {
          courseId: Number(route.params.id),
          listModelNew: [],
          listModelOld: [],
        },
      },
      apiDetail: {
        api: CourseService.GetListOrganizationalStructure,
        method: TYPE_REQUEST.GET,
        params: {
          id: route.params.id,
        },
      },
      routerCancel: 'course-list',
    },
  },
  {
    key: 'student-register',
    title: 'student-register',
    component: CpStudentRegister,
    dataTab: {
      isView: isViewDetail,
    },
  },

  // {
  //   key: 'guest-register',
  //   title: 'guest-register',
  //   component: CpGuestRegister,
  // },
]
onMounted(async () => {
  queryParams.value.id = Number(route.params.id)
})
</script>

<template>
  <div
    class="mb-5 mt-4"
  >
    <CmTab
      :list-tab="listTab"
      type="underline"
      label="assign"
    />
  </div>
</template>
