<script setup lang="ts">
import CmList from '@/components/common/CmList.vue'
import CmIcon from '@/components/common/CmIcon.vue'
import { myCourseManagerStore } from '@/stores/user/course/course'
import { myCourseMainManagerStore } from '@/stores/user/course/index'
import CpThematicContent from '@/components/page/users/course/course-learning/components/CpThematicContent.vue'
import { StatusTypeMyCourse } from '@/constant/data/status.json'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'
import { ContentType } from '@/constant/data/contentCourseType.json'

const myCourseManagerManager = myCourseManagerStore()
const { contentList, isShowContent } = storeToRefs(myCourseManagerManager)
const myCourseMainManagerManager = myCourseMainManagerStore()
const { changeContent } = myCourseMainManagerManager
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

function handleVisible(value: any, item: any) {
  toggleRowSelection(item)
}
function toggleRowSelection(row: any, type = null) {
  let typeNew: any = null
  const indexParent = contentList.value?.findIndex((item: any) => item.id === row.id) // check vị trí item click đóng mở
  if (type === null) {
    contentList.value[indexParent].isShow = contentList.value[indexParent]?.isShow === undefined ? false : !contentList.value[indexParent]?.isShow // khóa isShow biểu trị đạng thái toogle đóng mở
    typeNew = contentList.value[indexParent].isShow
  }
  else {
    contentList.value[indexParent].isShow = contentList.value[indexParent]?.isShow === undefined ? false : type
    typeNew = type
  }

  row?.children?.forEach((child: any) => {
    const index = contentList.value.findIndex((item: any) => item.id === child.id)
    contentList.value[index].isHide = !typeNew
    if (contentList.value[index]?.children)
      toggleRowSelection(contentList.value[index], typeNew)
  })
}
function changeCurrentContent(contentNew: any) {
  // isShowContent.value = contentNew.statusName !== 'CourseService.CourseService.NoStart'
  isShowContent.value = false
  console.log(isShowContent.value)

  changeContent(contentNew.courseContentId)
}
</script>

<template>
  <div class="content-box">
    <div
      v-for="item in contentList"
      :key="item?.id"
      class="cursor-pointer"
    >
      <CmList
        v-if="(item.children === null || !item.children || !item.children.length) && Number(item.contentArchiveTypeId) !== 13"
        is-custom
        :list="item.listCourseContent"
        :class-list="['box-item', item.isHide ? 'd-none' : '']"
        key-label="courseContentName"
        @click="changeCurrentContent"
      >
        <template #default="{ listItem }">
          <div
            class="content-item "
            :style="{ paddingLeft: `${(item.level) * 20}px` }"
          >
            <div class="flex-center">
              <CmIcon
                :type="2"
                :bg-color="MethodsUtil.checkStatus(listItem.statusName, StatusTypeMyCourse)?.color"
                color="white"
                variant="flat"
                :icon="MethodsUtil.checkStatus(listItem.statusName, StatusTypeMyCourse)?.icon"
                :size="12"
                class="mr-3"
              />
            </div>
            <div>
              <div class="content-item-label">
                {{ listItem.courseContentName }}
              </div>
              <div class="d-flex flex-nowrap">
                <div class=" mr-3">
                  <VProgressLinear
                    rounded-bar
                    :model-value="Number(listItem?.completeRatio || 0)"
                    color="success"
                    class="my-2"
                    rounded
                    style="width: 160px;"
                    height="8"
                  />
                </div>
                <div>{{ Math.round(listItem?.completeRatio) }}%</div>
              </div>
              <div class="text-regular-sm color-text-500">
                {{ t(MethodsUtil.checkType(listItem.contentArchiveTypeId, ContentType, 'id')?.name) }} • {{ DateUtil.formatTimeSecondToCustom(listItem.time) }}
              </div>
            </div>
          </div>
        </template>
      </CmList>
      <div v-else>
        <div>
          <CpThematicContent
            :class="{ 'd-none': item.isHide }"
            :title="item.thematicName"
            :level="item.level"
            :item="item"
            :is-visible="item.isShow || item.isShow === undefined ? true : false "
            @visible="handleVisible"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style  lang="scss">
.content-box{
  border: 1px solid rgb(var(--v-gray-200));
  .box-item{
    border-bottom: 1px solid rgb(var(--v-gray-200));
  }
  .content-item{
    display: flex;
    .content-item-label {
      overflow-wrap: anywhere;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
