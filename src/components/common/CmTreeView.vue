<script setup lang="ts">
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import 'vue3-treeview/dist/style.css'
import { configStore } from '@/stores/index'

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
  typeFlatChild: false, // chọn con không ảnh hưởng cha
  customId: 'id',
  returnObject: true,
}))

const emit = defineEmits<Emit>()

const Treeview = defineAsyncComponent(() => import('vue3-treeview'))

interface Props {
  config?: Config
  nodes: NodeTree
  isOrg: boolean
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
}

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
      fill: 'currentColor',
      height: '32',
      stroke: 'black',
      viewBox: '0 0 24 24',
      draw: 'M12 14.975q-.2 0-.388-.075t-.312-.2l-4.6-4.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062Z',
    },
    closedIcon: {
      style: 'font-size: 18px; height: 18px; width: 18px;',
      type: 'shape',
      stroke: 'black',
      fill: 'currentColor',
      width: '32',
      height: '32',
      viewBox: '0 0 24 24',
      draw: 'M8.7 17.3q-.275-.275-.275-.7t.275-.7l3.9-3.9l-3.9-3.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375q0 .2-.063.375t-.212.325l-4.6 4.6q-.275.275-.7.275t-.7-.275Z',
    },
  }
})
const updateValueChecked = async () => {
  await nextTick()

  valueChecked.value = window._.filter(nodesTree.value, prop => {
    return window._.get(prop, 'state.checked') === true
  })
  emit('update:modelValue', props.returnObject ? valueChecked.value : valueChecked.value.map((item: any) => item[props.customId]))
}
const handleNodeOpened = (event: any) => {
  emit('nodeOpened', event)
}

const handleNodeClosed = (event: any) => {
  emit('nodeClosed', event)
}

const handleNodeFocus = (event: any) => {
  emit('nodeFocus', event)
}

const handleNodeToggle = (event: any) => {
  emit('nodeToggle', event)
}

const handleNodeBlur = (event: any) => {
  emit('nodeBlur', event)
}

const handleNodeEdit = (event: any) => {
  emit('nodeEdit', event)
}

const checkedNodeChild = (node: any, status: boolean) => {
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
const handleNodeChecked = async (event: any) => {
  emit('nodeChecked', event)

  checkedNodeChild(event, true)
  updateValueChecked()
}

const handleNodeUnchecked = (event: any) => {
  emit('nodeUnchecked', event)
  checkedNodeChild(event, false)
  updateValueChecked()
}

const handleNodeDragstart = (event: any) => {
  emit('nodeDragstart', event)
}

const handleNodeDragenter = (event: any) => {
  emit('nodeDragenter', event)
}

const handleNodeDragleave = (event: any) => {
  emit('nodeDragleave', event)
}

const handleNodeDragend = (event: any) => {
  emit('nodeDragend', event)
}

const handleNodeOver = (event: any) => {
  emit('nodeOver', event)
}

const handleNodeDrop = (event: any) => {
  emit('nodeDrop', event)
}

const onChangeOrgChecked = (val: any, node: any) => {
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
          v-model:model-value="node.state.checked"
          tooltip-label="Phân quyền theo cơ cấu tổ chức"
          :false-value="false"
          class="checkbox-tree-view"
          :true-value="true"
          :indeterminate="node.state.indeterminate"
        />
      </template>
      <template
        v-if="isOrg"
        #after-input="{ node }"
      >
        <div
          v-if="node.orgPermission > 0"
          class="content-after"
        >
          <CmCheckBox
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
    left: 24px;
    opacity: 0;
    position: absolute;
    width: 36px;
    height: 36px;
    top: 4px;
    z-index: 1000;
  }

  .input-wrapper {
    margin: 0;
  }
  .checkbox-tree-view {
    display: flex;
    align-items: center;
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
  .v-selection-control__input input{
    display: none;
  }
  // .dot-tree::before {
  //   content: url('https://webcoban.vn/image/banana.png')
  // }
}
</style>

