<script setup lang="ts">
import ArraysUtil from '@/utils/ArrayUtil'
import MethodsUtil from '@/utils/MethodsUtil'
import SkTree from '@/components/page/gereral/skeleton/SkTree.vue'
import toast from '@/plugins/toast'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), ({
  apiAdd: () => ({
    label: 'listModelNew',
  }),
}))

const emit = defineEmits<Emit>()
const CmTreeView = defineAsyncComponent(() => import('@/components/common/CmTreeView.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

const { t } = window.i18n()

interface Api {
  api?: string
  method?: string
  payload?: any
  fileName?: string
  [e: string]: any
}
interface Props {
  modelValue: any
  apiList: Api
  apiAdd: Api
  apiDetail: Api
  routerCancel?: string
}
interface Emit {
  (e: 'update:modelValue', data: any): void
}

/** *end store */
const config = reactive({
  roots: [] as any[],
  keyboardNavigation: false,
  dragAndDrop: false,
  checkboxes: true,
  editable: false,
  disabled: false,
  padding: 25,
})
const valueNodeCurrent = ref(props.modelValue)
const nodes = ref({})
const render = ref(0)
const router = useRouter()
const isLoading = ref(true)
const listModelOld = ref([])
const listModelNew = ref([])
async function getListOrgStruct() {
  await MethodsUtil.requestApiCustom(props.apiList.api, props.apiList.method, props.apiList.params).then((value: any) => {
    // cấu hình dạng cây cho cơ cấu tổ chức
    for (let i = 0; i < value.data.length; i++) {
      value.data[i] = {
        ...value.data[i],
        state: {
          checked: valueNodeCurrent.value?.includes(value.data[i].id) ?? false,
        },
      }
    }

    const result = ArraysUtil.formatTreeData(ArraysUtil.unFlatMapTree(ArraysUtil.formatSelectTree(value.data, 'parentId', 'id')), config.roots, t, 'children')
    nodes.value = reactive(result)

    // Cấu hình node roots cho vue tree
    const filteredKeys = Object.keys(result).filter(key => result[key].parentId === 0)
    config.roots = filteredKeys
    render.value++
  })
}
async function getListDetailOrgStruct() {
  await MethodsUtil.requestApiCustom(props.apiDetail.api, props.apiDetail.method, props.apiDetail.params).then((value: any) => {
    if (props.apiDetail.label)
      valueNodeCurrent.value = value.data.map((i: Any) => i[props.apiDetail.label || ''])
    else
      valueNodeCurrent.value = value.data

    listModelOld.value = window._.cloneDeep(value.data)
  })
}
async function updateValueOrg(value: any) {
  emit('update:modelValue', value)
  listModelNew.value = value
}
async function handleSave(idx: number, unload: any) {
  const params = {
    ...props.apiAdd?.params,
    [props.apiAdd.label]: listModelNew.value,
    listModelOld: listModelOld.value,
  }
  await MethodsUtil.requestApiCustom(props.apiAdd.api, props.apiAdd.method, params).then((value: any) => {
    unload()
    toast('SUCCESS', t(value.message))
  }).catch((error: any) => {
    unload()
    toast('ERROR', t(error.response.data.message))
    return false
  })
}
function onCancel() {
  router.push({ name: props.routerCancel })
}
onUpdated(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 200)
})

onMounted(async () => {
  isLoading.value = false
  await getListDetailOrgStruct()
  await getListOrgStruct()
})
watch(render, val => {
  isLoading.value = true
})
</script>

<template>
  <SkTree v-show="isLoading" />
  <div
    v-show="!isLoading"
    class="page-containter-box"
  >
    <CmTreeView
      :key="render"
      :nodes="nodes"
      :config="config"
      custom-id="ids"
      :is-org="false"
      :return-object="false"
      :type-flat-child="true"
      @update:model-value="updateValueOrg"
    />
  </div>
  <div>
    <CpActionFooterEdit
      is-cancel
      is-save
      :title-cancel="t('come-back')"
      :title-save="t('save')"
      @onCancel="onCancel"
      @onSave="handleSave"
    />
  </div>
</template>
