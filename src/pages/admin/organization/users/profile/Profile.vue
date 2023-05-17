<script setup lang="ts">
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'

window.showAllPageLoading('COMPONENT')

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const storeProfileUserManager = profileUserManagerStore()
const { values } = storeToRefs(storeProfileUserManager)
const { fectchLecturers, handleUser, resetFormInfor } = storeProfileUserManager

/**
 * component
 */
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpFormModifyUserInfor = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpFormModifyUserInfor.vue'))
const CpResume = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpResume.vue'))
const CpOrganization = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpOrganization.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'infor',
    title: 'account-information',
    component: CpFormModifyUserInfor,
    dataTab: { profile: values },
    isRendered: true,
  },
  {
    key: 'resumer',
    title: 'profile',
    dataTab: { profile: values },
    component: CpResume,
    isRendered: true,
  },
  {
    key: 'organization',
    title: 'organization',
    component: CpOrganization,
    isRendered: false,
    isDisabled: true,
  },
]

const isShowButton = ref(true)

const backUser = () => {
  router.push({ name: 'admin-organization-users-manager' })
  resetFormInfor()
}

/**
 * Lấy data người dùng
 */

if (route.params.tab)
  listTab[listTab.findIndex(item => item.key === route.params.tab)].isRendered = true

resetFormInfor()
if (route.params.id) {
  listTab[2].isDisabled = false
  fectchLecturers(route.params.id)
}
window.hideAllPageLoading()
</script>

<template>
  <div>
    <div
      class="d-flex justify-content-center mb-5"
      style="margin-top: 20px;"
    >
      <CmTab
        :is-render="true"
        :list-tab="listTab"
        label="tab"
        type="button"
      />
    </div>

    <div
      width="100%"
      class="user-infor no-background py-5"
    >
      <CpActionFooterEdit
        is-cancel
        :is-save-group="isShowButton"
        :title-save-group="t('save-and-add')"
        @onCancel="backUser"
        @onSaveGroup="handleUser"
      />
    </div>
  </div>
</template>

