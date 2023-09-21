<script lang="ts" setup>
import CpConfigurationAll from './notification/CpConfigurationAll.vue'
import SharedService from '@/api/shared'
import CmButton from '@/components/common/CmButton.vue'
import CmMenu from '@/components/common/CmMenu.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any, Tab } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import CmTab from '@/components/common/CmTab.vue'

interface Item {
  id: any
  code: string
  isShow: boolean
  name: string
  icon: string
  items: Item[]
}

const { t } = window.i18n()
const listMenu = ref<Item[]>([])

function getMenuNotification() {
  MethodsUtil.requestApiCustom(SharedService.GetListNotification, TYPE_REQUEST.GET).then((result: Any) => {
    result.data.items.forEach((element: Item) => {
      element.isShow = false
    })
    listMenu.value = result.data.items
  })
}
getMenuNotification()

const listTab: Tab[] = [
  {
    key: 'all',
    title: 'configuration-all',
  },
  {
    key: 'mail',
    title: 'configuration-mail',
  },
]
</script>

<template>
  <div
    style="height: 1000px;"
    class="mt-2"
  >
    <CmMenu
      :items="listMenu"
    >
      <template #header>
        <CmButton
          variant="tonal"
          class="w-100"
          :title="t('configuration')"
        />
      </template>
      <template #content>
        <div class="ml-6">
          <CmTab
            :list-tab="listTab"
            label="tab"
            type="underline"
          />
          <CpConfigurationAll />
        </div>
      </template>
    </CmMenu>
  </div>
</template>
