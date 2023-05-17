<script setup lang="ts">
import { createVuetify } from 'vuetify'

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

import {
  BulletListLoader,
  CodeLoader,
  ContentLoader,
  FacebookLoader,
  InstagramLoader,
  ListLoader,
} from 'vue-content-loader'
import type { typeSkeleton } from '@/typescript/enums/enums'

interface Props {
  type: typeof typeSkeleton[number]
  height?: number
}

const props = withDefaults(defineProps<Props>(), ({
  type: 'ContentLoader',
  height: 500,
}))
const skeletonComponent = (type: string) => {
  let component = null
  switch (type) {
    case 'BulletListLoader':
      component = BulletListLoader
      break
    case 'CodeLoader':
      component = CodeLoader
      break
    case 'ContentLoader':
      component = ContentLoader
      break
    case 'FacebookLoader':
      component = FacebookLoader
      break
    case 'InstagramLoader':
      component = InstagramLoader
      break
    case 'ListLoader':
      component = ListLoader
      break

    default:
      component = ContentLoader
      break
  }
  return component
}
</script>

<template>
  <div>
    <Component
      :is="skeletonComponent(type)"
      :height="height"
      width="100%"
      viewBox="0 0 100% 550"
      :speed="1"
      primary-color="#F2F4F7"
      secondary-color="#D0D5DD"
    >
      <slot />
    </Component>
  </div>
</template>

