<script setup lang="ts">
import 'katex/dist/katex.min.css'
import katex from 'katex'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import CmPickColor from './CmPickColor.vue'
import CmAddLink from './CmAddLink.vue'

interface Emit {
  (e: 'change', key: any, value?: any): void
  (e: 'update:event', value?: any): void
  (e: 'changeAlign', key: any, value?: any): void
  (e: 'order', type: any, value?: any): void
  (e: 'changeColor', key: any, option: any, value?: any): void
  (e: 'addLinkUrl', key: any, option: any, value?: any, selection?: any, range?: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  statusMenu: () => ({
    bold: false,
    underline: false,
    italic: false,
    left: false,
    center: false,
    right: false,
    justify: false,
    insertOrderedList: false,
    insertUnorderedList: false,
  }),
  isMenuSimple: false,
  rlt: 'left',
  listMenu: [],
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const config = ref({
  suppressScrollY: true,
})
interface Props {
  statusMenu?: any
  isMenuSimple?: boolean
  rlt?: string
  listMenu?: any
}

const activeMenu = ref<any>(props.statusMenu)
function insertA() {
  const htmlString = katex.renderToString('c = \\pm\\sqrt{a^2 + b^2}', {
    throwOnError: false,
  })
  document.execCommand('insertHTML', false, htmlString)
}

function styleFontText(key: any, value?: any) {
  activeMenu.value[key] = !activeMenu.value[key as never]
  emit('change', key, value)
}
function styleAsignText(key: any, value?: any) {
  activeMenu.value = {
    ...{
      left: false,
      center: false,
      right: false,
      justify: false,
    },
  }
  activeMenu.value[value] = !activeMenu.value[value as never]
  emit('changeAlign', key)
}
function orderList(key: any) {
  activeMenu.value = {
    ...{
      insertOrderedList: key === 'insertOrderedList' ? !activeMenu.value[key] : false,
      insertUnorderedList: key === 'insertUnorderedList' ? !activeMenu.value[key] : false,
    },
  }

  emit('order', key)
}
function changeColor(key: any, option: any, value: any) {
  emit('changeColor', key, option, value)
}
function addLinkUrl(key: any, option: any, value: any, selection: any, range: any) {
  emit('addLinkUrl', key, option, value, selection, range)
}
function handleEventTool(item: any) {
  emit('update:event', item)
}

watch(() => props.statusMenu, (val: any) => {
  activeMenu.value = val
}, { deep: true })
</script>

<template>
  <div
    v-if="!isMenuSimple || isMenuSimple && listMenu?.length"
    class="menu-box"
  >
    <PerfectScrollbar :options="config">
      <div
        v-if="!isMenuSimple"
        :class="`justify-${props.rlt}`"
        class="menu-list"
      >
        <button
          class="menu-item"
          :title="t('bold')"
          :class="{ actived: activeMenu.bold }"
          @click="styleFontText('bold', 'strong')"
        >
          <b>B</b>
        </button>
        <button
          class="menu-item"
          :title="t('underline')"
          :class="{ actived: activeMenu.underline }"
          @click="styleFontText('underline', 'u')"
        >
          <u><b>U</b></u>
        </button>
        <button
          class="menu-item"
          :title="t('italic')"
          :class="{ actived: activeMenu.italic }"
          @click="styleFontText('italic', 'em')"
        >
          <i><b>I</b></i>
        </button>
        <button
          class="menu-item"
          :title="t('strikeThrough')"
          :class="{ actived: activeMenu.strikeThrough }"
          @click="styleFontText('strikeThrough', 'strike')"
        >
          <del>S</del>
        </button>
        <button
          class="menu-item"
          :class="{ actived: activeMenu.left }"
          :title="t('justifyLeft')"
          @click="styleAsignText('justifyLeft', 'left')"
        >
          <VIcon icon="tabler:align-left" />
        </button>
        <button
          class="menu-item"
          :class="{ actived: activeMenu.center }"
          :title="t('justifyCenter')"
          @click="styleAsignText('justifyCenter', 'center')"
        >
          <VIcon icon="tabler:align-center" />
        </button>
        <button
          class="menu-item"
          :class="{ actived: activeMenu.right }"
          :title="t('justifyRight')"
          @click="styleAsignText('justifyRight', 'right')"
        >
          <VIcon icon="tabler:align-right" />
        </button>
        <button
          class="menu-item"
          :title="t('justify')"
          :class="{ actived: activeMenu.justify }"
          @click="styleAsignText('justifyFull', 'justify')"
        >
          <VIcon icon="tabler:align-justified" />
        </button>
        <button
          class="menu-item"
          :title="t('insertOrderedList')"
          :class="{ actived: activeMenu.insertOrderedList }"
          @click="orderList('insertOrderedList')"
        >
          <VIcon icon="octicon:list-ordered-24" />
        </button>
        <button
          class="menu-item"
          :title="t('insertUnorderedList')"
          :class="{ actived: activeMenu.insertUnorderedList }"
          @click="orderList('insertUnorderedList')"
        >
          <VIcon icon="material-symbols:list" />
        </button>
        <button
          class="menu-item"
          :title="t('color')"
        >
          <CmPickColor
            is-hide-input-color
            @change="changeColor"
          />
        </button>
        <button
          :title="t('no-color')"
          class="menu-item"
          @click="changeColor('foreColor', null, '#000')"
        >
          <VIcon
            icon="ic:baseline-invert-colors-off"
            size="18"
          />
        </button>
        <button
          class="menu-item"
          :title="t('backColor')"
        >
          <CmPickColor
            :type="1"
            is-hide-input-color
            @change="changeColor"
          />
        </button>
        <button
          class="menu-item"
          :title="t('no-backColor')"
          @click="changeColor('backColor', null, '#fff')"
        >
          <VIcon
            icon="cil:color-fill"
            size="18"
          />
        </button>
        <button
          class="menu-item"
          :title="t('link-insert')"
        >
          <CmAddLink @addLinkUrl="addLinkUrl" />
        </button>
        <button
          class="menu-item"
          :title="t('Math')"
        >
          <span>Math</span>
        </button>
        <div
          class="menu-item"
        >
          <span>a</span>
        </div>
        <div class="mark" />
      </div>
      <div
        v-else-if="listMenu?.length"
        class="menu-list"
        :class="`justify-${props.rlt}`"
      >
        <button
          v-for="(item, id) in listMenu"
          :key="id"
          :class="{ actived: item.actived }"
          class="menu-item"
          :title="t(item.title)"
          @click="handleEventTool(item)"
        >
          <VIcon :icon="item.icon" />
        </button>
      </div>
    </PerfectScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.menu-box{
  border: 1px solid rgba(var(--v-border-color));
  border-bottom: none;
  background-color:  rgb(var(--v-theme-surface));
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 5px;
  .menu-list{
    display: flex;
    .menu-item{
      width: fit-content;
      padding: 5px;
      min-width: 30px;
      text-align: center;
    }
    .menu-item.actived {
      color:  rgb(var(--v-primary-600)) !important;
    }
    .mask{
      border-left: 1px solid #a3a3a3;
    }
  }

}
</style>
