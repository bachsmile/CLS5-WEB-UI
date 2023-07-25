<script setup lang="ts">
import type { typeTab } from '@/typescript/enums/enums'

/**
 *khi emit từ component lên thẳng component cha thì khai báo
 *
 * interface Props {
 *    emit?: any
 * }
 * const { emitEvent } = props.emit()
 * emitEvent('name', abc) dùng như emit mặc định của vue
 *
  */
const props = withDefaults(defineProps<Props>(), ({
  listTab: () => ([]),
  type: 'button',
  isSmall: false,
  label: 'tabActive',
  routeName: '',
  hide: false,
  isRender: false,
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface tab {
  key: string
  title?: string
  icon?: string
  component?: any // truyền thẳng component vào nếu dùng composition api, còn không thì truyền string tên component
  dataTab?: any // Dữ liệu riêng của từng tab
  isDisabled?: boolean
  isRendered?: boolean
}
interface Props {
  hide: boolean
  listTab: tab[]
  type?: typeof typeTab[any]
  isSmall?: boolean
  label?: string
  routeName?: string
  dataGeneral?: any // hạn chế dùng
  isRender: boolean
}
const router = useRouter()
const route = useRoute()

interface Emit {
  (e: string, data: any): void
  (e: 'activeTab', data: tab): void
}
const tabActive = ref<string>('')
const dataTab = ref<any>({})

function getTabActive() {
  dataTab.value = props.listTab.find(e => e.key === route.query[props.label]) as object
  if (dataTab.value) {
    tabActive.value = dataTab.value?.key
    if (route.query[props.label] && props.isRender)
      dataTab.value.isRendered = true
  }
}
getTabActive()
function activeTab(value: any) {
  // value.isRendered = true
  dataTab.value = props.listTab.find(x => x.key === value) as tab
  dataTab.value.isRendered = true
  router.push({
    query: {
      ...route.query,
      [props.label]: value,
    },
  })
  emit('activeTab', tabActive.value)
}

function useEmitter() {
  const emitEvent = (event: any, data: any) => {
    emit(event, data)
  }
  return { emitEvent }
}
watch(() => route.query[props.label], val => {
  getTabActive()
})
</script>

<template>
  <div class="tabs w-100">
    <div
      :class="`w-100 ${type}-tabs`"
    >
      <VTabs
        v-if="!hide"
        v-model="tabActive"
        class="cm-tabs"
        style="height: calc(100% + 10px);"
        show-arrows
        @update:modelValue="activeTab"
      >
        <VTab
          v-for="(item, index) in listTab"
          :key="index"
          :disabled="item.isDisabled"
          :value="item?.key"
          :class="`item-tab ${dataTab?.key === item?.key ? 'active' : ''} `"
        >
          <VIcon
            v-if="item.icon"
            :icon="item.icon"
            :size="18"
            class="mr-2"
          />
          <span>{{ t(item.title) }}</span>
        </VTab>
      </VTabs>
    </div>
    <div v-if="props.isRender">
      <div
        v-for="item in listTab"
        :key="item.key"
        class="content-tab"
      >
        <div
          v-if="item.isRendered"
          v-show="item.key === route.query[props.label]"
        >
          <Component
            :is="item?.component"
            :emit="useEmitter"
            :data-general="dataGeneral"
            v-bind="dataTab?.dataTab"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <Component
        :is="dataTab?.component"
        :key="dataTab?.key"
        :emit="useEmitter"
        :data-general="dataGeneral"
        v-bind="dataTab?.dataTab"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;
.tabs {
  .cm-tabs {
  // background-color: $color-white;
  color: $color-gray-500;
  inline-size: fit-content;
  text-transform: capitalize !important;
  .v-slide-group__content {
    border-block-end: 1px red solid;
  }
  .item-tab {
    border-radius: unset !important;
    text-transform: capitalize !important;
    box-shadow: unset !important;
  }

}

 // kiểu button tab
 .button-tabs {
    border-bottom: 1px solid $color-gray-200 !important;
    .active {
      background-color: $color-primary-50 !important;
      color: $color-primary-700 !important;
    }
  }

  // kiểu underline tab
  .underline-tabs {
    border-block-end: 1px solid $color-gray-200 ;

    .active {
      color: $color-primary-700 !important;
    }
  }
.content-tab {
  inline-size: 100%;
  margin-block-start: 5px;
}
}
</style>

<style lang="scss">
.cm-tabs {
  .v-slide-group__content {
   display: flex;
   flex-wrap: wrap !important;
  }
}
</style>
