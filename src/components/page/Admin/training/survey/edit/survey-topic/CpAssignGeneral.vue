<script lang="ts" setup>
import CpMdEditGroupUser from '../../../calendar/edit/modal/CpMdEditGroupUser.vue'
import CpAssignUserSurvey from './assign/CpAssignUserSurvey.vue'
import CmTab from '@/components/common/CmTab.vue'
import CpManaging from '@/components/page/gereral/CpManaging.vue'
import type { Any, Tab } from '@/typescript/interface'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import CpOrganization from '@/components/page/gereral/CpOrganization.vue'
import UserService from '@/api/user'
import StringJwt from '@/utils/Jwt'

const { t } = window.i18n()
const route = useRoute()
const listGroup = ref<any[] | null>(null)
function getDataTab() {
  const payload = {
    examId: Number(route.params.id),
    testId: Number(route.params.topicId),
    typeId: 2,
  }
  MethodsUtil.requestApiCustom(QuestionService.GetListPeople, TYPE_REQUEST.GET, payload).then((result: Any) => {
    listGroup.value = result?.data
  })
}

const listTab = computed((): Tab[] => [
  {
    key: 'candidate',
    title: 'candidate',
    component: CpAssignUserSurvey,
  },
  {
    key: 'user-group',
    title: 'user-group',
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
      getParams: getDataTab,
      params: {
        searchData: '',
        typeId: 2,
        isMinus: false,
      },
      keySearch: 'searchData',
      actionsTable: [
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditGroupUser,
      apiList: {
        api: QuestionService.GetListGroupFromSurvey,
        method: TYPE_REQUEST.GET,
      },
      apiAdd: {
        api: QuestionService.PostCreateGroupUser,
        method: TYPE_REQUEST.POST,
        params: {
          eventCalendarId: route.params.id,
        },
      },
      apiDelete: {
        api: QuestionService.PostDeleteGroupFromEvent,
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
        api: QuestionService.GetListPeople,
        method: TYPE_REQUEST.GET,
        params: {
          typeId: 3,
          examId: Number(route.params.id),
          testId: Number(route.params.id),
        },
      },
      routerCancel: 'course-list',
    },
  },

])
</script>

<template>
  <CmTab
    :list-tab="listTab"
    label="assignTab"
  />
</template>
