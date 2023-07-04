<script setup lang="ts">
import 'vue3-treeview/dist/style.css'
import Treeview from 'vue3-treeview'
import { configStore } from '@/stores/index'
import { ActionType } from '@/constant/data/actionType.json'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmDropDown from '@/components/common/CmDropDown.vue'

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  config: () => ({
    roots: [],
    keyboardNavigation: false,
    dragAndDrop: false,
    editable: false,
    disabled: false,
    checkboxes: false,
    leaves: false,
    padding: 0,
    checkMode: 0,
  }),
  nodes: () => (reactive({})),
  isOrg: true,
  isAction: false,
  typeFlatChild: false, // chọn con không ảnh hưởng cha
  customId: 'id',
  returnObject: true,
}))

const emit = defineEmits<Emit>()

interface Props {
  config?: Config
  nodes: NodeTree
  isOrg?: boolean
  isAction?: boolean
  typeFlatChild?: boolean
  returnObject?: boolean
  customId?: string
}
interface Emit {
  (e: 'nodeOpened', value: any): void
  (e: 'nodeClosed', value: any): void
  (e: 'nodeFocus', value: any): void
  (e: 'nodeToggle', value: any): void
  (e: 'nodeBlur', value: any): void
  (e: 'nodeEdit', value: any): void
  (e: 'nodeChecked', value: any): void
  (e: 'nodeUnchecked', value: any): void
  (e: 'nodeDragstart', value: any): void
  (e: 'nodeDragenter', value: any): void
  (e: 'nodeDragleave', value: any): void
  (e: 'nodeDragend', value: any): void
  (e: 'nodeOver', value: any): void
  (e: 'nodeDrop', value: any): void
  (e: 'update:modelValue', value: any): void
  (e: 'handleAction', value: any, dataResend: any): void
}

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
interface Config {
  roots: Array<string>
  keyboardNavigation: boolean
  dragAndDrop: boolean
  checkboxes: boolean
  editable: boolean
  disabled: boolean
  leaves?: boolean
  padding: number
  closedIcon?: any
  openedIcon?: any
  checkMode?: number
}
interface NodeTree {
  [NodeTree: string]: Node
}
interface Node {
  [x: string]: any
  text?: string
  children?: Array<string>
}

const configControl = configStore()
const { isTreeBinding } = configControl
const valueChecked = ref<any>([])
const nodesTree = ref<any>(props.nodes)

const configTree = computed(() => {
  return {
    ...props.config,
    checkMode: props.typeFlatChild ? 1 : (isTreeBinding() ? 0 : 1),
    openedIcon: {
      style: 'font-size: 18px; height: 18px; width: 18px;',
      type: 'shape',
      width: '32',
      fill: ' #1D2939',
      height: '32',
      stroke: ' #1D2939',
      viewBox: '0 0 24 24',
      draw: 'M12 14.975q-.2 0-.388-.075t-.312-.2l-4.6-4.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062Z',
    },
    closedIcon: {
      style: 'font-size: 18px; height: 18px; width: 18px;',
      type: 'shape',
      stroke: ' #1D2939',
      fill: ' #1D2939',
      width: '32',
      height: '32',
      viewBox: '0 0 24 24',
      draw: 'M8.7 17.3q-.275-.275-.275-.7t.275-.7l3.9-3.9l-3.9-3.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375q0 .2-.063.375t-.212.325l-4.6 4.6q-.275.275-.7.275t-.7-.275Z',
    },
  }
})
function actionItemEdit(dataAction: any, index: any) {
  // data.isShowModalAddress = true
}

function actionItemDelete(dataAction: any, index: any, dataResend?: any) {
  // console.log('actionItemDelete', dataAction, index)
}

const action = [
  {
    title: t('update'),
    icon: ActionType[0].icon,
    action: actionItemEdit,
  },
  {
    title: t('delete'),
    icon: ActionType[1].icon,
    action: actionItemDelete,
  },
]
async function updateValueChecked() {
  await nextTick()

  valueChecked.value = window._.filter(nodesTree.value, prop => {
    return window._.get(prop, 'state.checked') === true
  })
  emit('update:modelValue', props.returnObject ? valueChecked.value : valueChecked.value.map((item: any) => item[props.customId]))
}
function handleNodeOpened(event: any) {
  emit('nodeOpened', event)
}

function handleNodeClosed(event: any) {
  emit('nodeClosed', event)
}

function handleNodeFocus(event: any) {
  emit('nodeFocus', event)
}

function handleNodeToggle(event: any) {
  emit('nodeToggle', event)
}

function handleNodeBlur(event: any) {
  emit('nodeBlur', event)
}

function handleNodeEdit(event: any) {
  emit('nodeEdit', event)
}

function checkedNodeChild(node: any, status: boolean) {
  if (props.typeFlatChild && isTreeBinding() && node?.children && node?.children.length) {
    node.children.forEach((nodeChild: any) => {
      nodesTree.value[nodeChild] = {
        ...nodesTree.value[nodeChild],
        state: {
          checked: status,
        },
      }
      if (nodesTree.value[nodeChild]?.children?.length)
        checkedNodeChild(nodesTree.value[nodeChild], status)
    })
  }
}
async function handleNodeChecked(event: any) {
  emit('nodeChecked', event)

  checkedNodeChild(event, true)
  updateValueChecked()
}

function handleNodeUnchecked(event: any) {
  emit('nodeUnchecked', event)
  checkedNodeChild(event, false)
  updateValueChecked()
}

function handleNodeDragstart(event: any) {
  emit('nodeDragstart', event)
}

function handleNodeDragenter(event: any) {
  emit('nodeDragenter', event)
}

function handleNodeDragleave(event: any) {
  emit('nodeDragleave', event)
}

function handleNodeDragend(event: any) {
  emit('nodeDragend', event)
}

function handleNodeOver(event: any) {
  emit('nodeOver', event)
}

function handleNodeDrop(event: any) {
  emit('nodeDrop', event)
}

function onChangeOrgChecked(val: any, node: any) {
  node.orgPermissionValue = val ? node.orgPermission : 0
  if (node.ids === 0) {
    nodesTree.value[node.parent].orgPermissionValue += (val ? node.orgPermission : -node.orgPermission)
    return
  }
  node.children.forEach((childeNode: any) => {
    nodesTree.value[childeNode].orgPermissionValue = val ? nodesTree.value[childeNode].orgPermission : 0
  })
}
</script>

<template>
  <div class="tree-view-select">
    <Treeview
      v-if="nodesTree"
      :config="configTree"
      :nodes="nodesTree"
      class="tree-view"
      @node-opened="handleNodeOpened"
      @node-closed="handleNodeClosed"
      @node-focus="handleNodeFocus"
      @node-toggle="handleNodeToggle"
      @node-blur="handleNodeBlur"
      @node-edit="handleNodeEdit"
      @node-checked="handleNodeChecked"
      @node-unchecked="handleNodeUnchecked"
      @node-dragstart="handleNodeDragstart"
      @node-dragenter="handleNodeDragenter"
      @node-dragleave="handleNodeDragleave"
      @node-dragend="handleNodeDragend"
      @node-over="handleNodeOver"
      @node-drop="handleNodeDrop"
    >
      <template #before-input="{ node }">
        <div
          v-if="!node.children.length"
          class="dot-tree"
        />

        <CmCheckBox
          v-if="config.checkboxes"
          v-model:model-value="node.state.checked"
          :false-value="false"
          class="checkbox-tree-view"
          :true-value="true"
          :indeterminate="node.state.indeterminate"
        />
        <VIcon
          v-if="node.icon"
          :size="24"
          :icon="node.icon"
          class="m-0"
        />
      </template>
      <template
        #after-input="{ node }"
      >
        <div
          v-if="isOrg && node.orgPermission > 0"
          class="content-after"
        >
          <CmCheckBox
            color="error"
            color-interminate="error"
            tooltip-label="Phân quyền theo cơ cấu tổ chức"
            :model-value="node.orgPermissionValue
              && (node.orgPermissionValue & node.orgPermission) === node.orgPermission"
            :disabled="!(node.state?.checked || node.state?.indeterminate)"
            :indeterminate="!!(node.orgId
              && node.orgPermissionValue
              && node.orgPermissionValue < node.orgPermission)"
            @update:model-value="onChangeOrgChecked($event, node)"
          />
        </div>
        <div
          v-if="isAction"
          class="action-more px-2"
        >
          <CmDropDown
            :list-item="node.actions"
            custom-key="name"
            :data-resend="node"
            :type="1"
            @click="($event, dataResend) => emit('handleAction', $event, dataResend)"
          />
        </div>
      </template>
      <template #loading-slot>
        <div class="progress">
          <div class="indeterminate" />
        </div>
      </template>
    </Treeview>
  </div>
</template>

<style lang="scss">
.tree-view-select {
  .content-after {
    position: absolute;
    z-index: 99;
    inset-block: 0;
    inset-inline-end: 0;
  }
  .checkbox-wrapper {
    left: 33px;
    opacity: 0;
    position: absolute;
    width: 25px;
    height: 25px;
    top: 5px;
    z-index: 1000;
  }

  .input-wrapper {
    margin: 0;
  }
  .checkbox-tree-view {
    display: flex;
    align-items: center;
    margin-left: 16px;
  }
  .tree-view {
    .tree-node {
      .node-wrapper {
        position: relative;
        align-items: center;
      }
    }
  }
  .dot-tree {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    //gray 300
    background-color: #D0D5DD;
    margin-left: -14px;
    margin-right: 8px;
  }
  // .v-selection-control__input input{
  //   display: none;
  // }
  // .dot-tree::before {
  //   content: url('https://webcoban.vn/image/banana.png')
  // }
  // input[type=checkbox] {
  //   display: none;
  // }
}
</style>
