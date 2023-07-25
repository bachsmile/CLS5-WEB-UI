<script lang="ts" setup>
import { useLayouts } from '@layouts'
import { config } from '@layouts/config'
import { can } from '@layouts/plugins/casl'
import type { NavLink } from '@layouts/types'
import { getComputedNavLinkToProp, isNavLinkActive } from '@layouts/utils'

defineProps<{
  item: NavLink
}>()

const { width: windowWidth } = useWindowSize()
const { isVerticalNavMini, dynamicI18nProps } = useLayouts()

const hideTitleAndBadge = isVerticalNavMini(windowWidth)
</script>

<template>
  <li
    v-if="can(item.action, item.subject)"
    class="nav-link nav-link-custom"
    :class="{ disabled: item.disable }"
  >
    <Component
      :is="item.to ? 'RouterLink' : 'a'"
      v-bind="getComputedNavLinkToProp(item)"
      :class="{ 'router-link-active router-link-exact-active': isNavLinkActive(item, $router) }"
    >
      <!--
        <Component
        :is="config.app.iconRenderer || 'div'"
        v-bind="item.icon || config.verticalNav.defaultNavItemIconProps"
        class="nav-item-icon"
        />
      -->
      <div
        class="w-100 h-100 d-flex align-center"
        style="margin-left: 12px;"
      >
        <div class="dot-menu nav-item-icon" />
        <TransitionGroup name="transition-slide-x">
          <!-- 👉 Title -->
          <Component
            :is="config.app.enableI18n ? 'i18n-t' : 'span'"
            v-show="!hideTitleAndBadge"
            key="title"
            class="nav-item-title"
            v-bind="dynamicI18nProps(item.title, 'span')"
          >
            {{ item.title }}
          </Component>

          <!-- 👉 Badge -->
          <Component
            :is="config.app.enableI18n ? 'i18n-t' : 'span'"
            v-if="item.badgeContent"
            v-show="!hideTitleAndBadge"
            key="badge"
            class="nav-item-badge"
            :class="item.badgeClass"
            v-bind="dynamicI18nProps(item.badgeContent, 'span')"
          >
            {{ item.badgeContent }}
          </Component>
        </TransitionGroup>
      </div>
    </Component>
  </li>
</template>

<style lang="scss">
@use "@/styles/style-global" as *;
.layout-vertical-nav {
  .nav-link a {
    display: flex;
    align-items: center;
  }
  .nav-link
  .dot-menu {
    width: 5px;
    height: 5px;
    border-radius: $border-radius-sm;
    background-color: $color-gray-600;
  }
  .nav-item-title {
    @extend .text-regular-md;
    overflow: unset;
    text-overflow: unset;
    white-space: unset;
    width: 155px;
    white-space: pre-wrap;
  }

}
</style>
