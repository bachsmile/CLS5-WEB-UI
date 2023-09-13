<script setup lang="ts">
import CmAccodion from '@/components/common/CmAccodion.vue'
import CpContentParent from '@/components/page/users/course/course-detail/components/CpContentParent.vue'
import CpContentChild from '@/components/page/users/course/course-detail/components/CpContentChild.vue'

const props = defineProps<Props>()

interface Props {
  data?: any
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
function checkNumContent(contentArchiveTypeTotal: any) {
  let count = 0
  contentArchiveTypeTotal.forEach((item: any) => {
    if (item.id !== 13)
      count += item?.total || 0
  })
  return count
}
</script>

<template>
  <div>
    <div
      v-for="el in data"
      :key="el.id"
      class="parent-item"
    >
      <div v-if="el.typeId === 13">
        <CmAccodion
          is-open
          is-tree
        >
          <template #title>
            <div class="pr-4 d-flex justify-space-between w-100">
              <div class=" text-medium-md title-parent">
                {{ el.name }}
              </div>
              <div class="text-regular-sm ">
                {{ checkNumContent(el.contentArchiveTypeTotal) }} {{ t('content') }}
              </div>
            </div>
          </template>
          <template #text>
            <CpContentParent
              :data="el.children"
            />
          </template>
        </CmAccodion>
      </div>
      <div v-else>
        <CpContentChild :data="el" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.parent-item{
  .title-parent{
    color:rgb(var(--v-gray-900)) ;
  }
  .v-expansion-panel{
    border-bottom: 1px solid rgb(var(--v-gray-200));
    border-radius: unset;
  }
}
.parent-item:last-child{
  .v-expansion-panel{
    border-bottom:none;
  }

}
</style>
