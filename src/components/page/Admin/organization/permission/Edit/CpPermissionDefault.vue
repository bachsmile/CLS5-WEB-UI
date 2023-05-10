<script lang="ts" setup>
import CmTreeView from '@/components/common/CmTreeView.vue'

interface Props {
  listFeaturePermission: any[]
}
const props = withDefaults(defineProps<Props>(), {})
const config = (idx: number) => {
  return {
    roots: [`node-${idx + 1}`],
    keyboardNavigation: false,
    dragAndDrop: false,
    checkboxes: true,
    editable: false,
    disabled: false,
    padding: 25,
    checkMode: 0,
  }
}
</script>

<template>
  <div class="edit-permission">
    <div
      class="permission"
    >
      <div
        v-for="(tree, index) in listFeaturePermission"
        :key="index"
        class="content-permission"
      >
        <CmTreeView
          :config="config(index)"
          :nodes="tree"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
.edit-permission {
  .permission {
    display: flex;
    width: 100%;
    .content-permission {
      width: inherit;
      padding: 24px;
      box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
      // Gray 200
      border: 1px solid $color-gray-200;
      border-radius: 8px;
    }
    .content-permission:nth-child(n+2) {
      margin-left: 24px;
    }
  }
  .button-edit-permission:nth-child(n+2) {
    margin-left: 12px;
  }
}
</style>
