<script lang="ts" setup>
import CpMdEditGroupUser from './modal/CpMdEditGroupUser.vue'
import CpManaging from '@/components/page/gereral/CpManaging.vue'
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpMdEditUser from '@/components/page/gereral/CpMdEditUser.vue'
import UserService from '@/api/user'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpOrganization from '@/components/page/gereral/CpOrganization.vue'
import StringJwt from '@/utils/Jwt'

const { t } = window.i18n()
const route = useRoute()
const listTab: Tab[] = [
  {
    key: 'user',
    title: 'user',
    component: CpManaging,
    dataTab: {
      titlePage: t('list-academedegree'),
      customId: 'eventCalendarUserId',
      isShowExportExcel: false,
      header: [
        { text: '', value: 'checkbox' },
        { text: t('Full_Name'), value: 'fullName', width: 300, isFullName: true },
        { text: t('Email'), value: 'email' },
        { text: t('date-register'), value: 'registrationDate', isDate: true, type: 'custom' },
        { text: '', value: 'actions', width: 150 },
      ],
      params: {
        eventCalendarId: route.params.id,
      },
      actionsTable: [
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditUser,
      apiList: {
        api: UserService.GetEventUser,
        method: TYPE_REQUEST.GET,
      },
      apiAdd: {
        api: UserService.PostAddUserToEvent,
        method: TYPE_REQUEST.POST,
        params: {
          eventCalendarId: route.params.id,
        },
      },
      apiDelete: {
        api: UserService.PostDeleteUserFromEvent,
        method: TYPE_REQUEST.POST,
        label: 'listEventCalendarUserId',
        params: {},
      },
      apiExportExcel: {
        api: UserService.PostExporExcelAcademidegree,
        method: TYPE_REQUEST.POST,
        fileName: 'academicdegree.xlsx',
      },
    },
  },
  {
    key: 'group-user',
    title: 'group-management',
    component: CpManaging,
    dataTab: {
      titlePage: t('list-group-user'),
      customId: 'eventCalendarGroupId',
      isShowExportExcel: false,
      header: [
        { text: '', value: 'checkbox' },
        { text: t('user-group-name'), value: 'groupName' },
        { text: t('description'), value: 'description' },
        { text: '', value: 'actions', width: 50 },
      ],
      params: {
        eventCalendarId: route.params.id,
      },
      actionsTable: [
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditGroupUser,
      apiList: {
        api: UserService.GetEventGroup,
        method: TYPE_REQUEST.GET,
      },
      apiAdd: {
        api: UserService.PostAddGroupUserToEvent,
        method: TYPE_REQUEST.POST,
        params: {
          eventCalendarId: route.params.id,
        },
      },
      apiDelete: {
        api: UserService.PostDeleteGroupFromEvent,
        method: TYPE_REQUEST.POST,
        label: 'eventCalendarGroupUserId',
        params: {},
      },
    },
  },
  {
    key: 'organizational-structure',
    title: 'organizational-structure-management',
    component: CpOrganization,
    dataTab: {
      apiList: {
        api: UserService.GetOrganizationalStructure,
        method: TYPE_REQUEST.GET,
        params: {
          role: StringJwt.getRole(),
        },
      },
      apiAdd: {
        api: UserService.PostUpdateOrgFromEvent,
        method: TYPE_REQUEST.POST,
        params: {
          eventCalendarId: Number(route.params.id),
        },
        label: 'listOrganizationalStructureId',
      },
      apiDetail: {
        api: UserService.GetEventOrganizationalStructure,
        method: TYPE_REQUEST.GET,
        params: {
          EventCalendarId: route.params.id,
        },
        label: 'organizationalStructureId',
      },
      routerCancel: 'course-list',
    },
  },
]
</script>

<template>
  <CmTab
    :list-tab="listTab"
    type="underline"
    label="assign"
  />
</template>
