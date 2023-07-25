<script setup lang="ts">
import { useStoreMenu } from '@/stores/menu'

// import { userData } from '@/store/button'

import jwtDefaultConfig from '@/auth/jwtDefaultConfig'

const router = useRouter()

function handleLogout() {
  localStorage.removeItem(jwtDefaultConfig.storageTokenKeyName)
  localStorage.removeItem(jwtDefaultConfig.storageRefreshTokenKeyName)
  localStorage.removeItem(jwtDefaultConfig.menuItems)
  localStorage.removeItem(jwtDefaultConfig.role)
  localStorage.removeItem(jwtDefaultConfig.userData)
  router.push('/login')
}
const { t } = window.i18n()
const serverFile = window.SERVER_FILE
const menuStore = useStoreMenu()
const { userRoles, userData, setDataMenu } = menuStore
const { navItems } = storeToRefs(menuStore)

const { role } = storeToRefs(menuStore)
async function setRole(val: any) {
  role.value = val
  await setDataMenu()
  localStorage.setItem('role', val.name)
  sessionStorage.setItem('role', val.name)
  router.push({ name: role.value?.router })
  sessionStorage.setItem('menuItems', JSON.stringify(navItems.value))
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="`${serverFile}${userData.avatar}`" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 Profile -->
          <VListItem
            v-for="item in userRoles"
            :key="item.name"
            class="cursor-pointer"
            @click="setRole(item)"
          >
            <VListItemTitle>
              {{ t(item.name) }}
            </VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
