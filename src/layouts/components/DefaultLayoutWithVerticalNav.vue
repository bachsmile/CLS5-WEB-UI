<script lang="ts" setup>
import { useSkins } from '@core/composable/useSkins'
import { useThemeConfig } from '@core/composable/useThemeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import CmBreadcrumb from '@/components/common/CmBreadcrumb.vue'
import { useStoreMenu } from '@/stores/menu'
import jwtDefaultConfig from '@/auth/jwtDefaultConfig'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'

const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig()
const { width: windowWidth } = useWindowSize()

// `layoutAttrs` provides skin classes and vertical nav props for semi-dark styling
const { layoutAttrs, injectSkinClasses } = useSkins()

// ℹ️ This will inject classes in body tag for accurate styling
injectSkinClasses()
const menuStore = useStoreMenu()

// const { navItems } = storeToRefs(menuStore)
const { getDataMenu } = menuStore
const { navItems, userData, role } = storeToRefs(menuStore)

const items = ref<any>([])
watch(navItems, val => {
  if (val.length)
    items.value = navItems.value
})
async function getMenu() {
  if (!sessionStorage.getItem(jwtDefaultConfig.role))
    sessionStorage.setItem(jwtDefaultConfig.role, userData.value.roles[0].name)
  if (sessionStorage.getItem('menuItems')) {
    items.value = JSON.parse(sessionStorage.getItem('menuItems') || '')
    return
  }
  items.value = await getDataMenu(userData.value.roles[0].id)
  if (items.value.length)
    sessionStorage.setItem('menuItems', JSON.stringify(items.value))
}

onMounted(async () => {
  getMenu()
})
</script>

<template>
  <VerticalNavLayout
    :key="role?.name"
    :nav-items="items"
    v-bind="layoutAttrs"
  >
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <VBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          icon
          variant="text"
          color="default"
          class="ms-n3"
          size="small"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            icon="tabler-menu-2"
            size="24"
          />
        </VBtn>

        <NavbarThemeSwitcher />

        <VSpacer />

        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component, route }">
      <CmBreadcrumb :key="route.name || ''" />
      <Transition
        :name="appRouteTransition"
        mode="out-in"
      >
        <div :key="route.name || ''">
          <Component :is="Component" />
        </div>
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
