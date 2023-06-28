<script lang="ts" setup>
import CmAvatar from '@/components/common/CmAvatar.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusTypeCourse } from '@/constant/data/status.json'

interface Props {
  context?: any
  isShowCode?: boolean
  isShowAvatar?: boolean
  isTitle?: boolean
  isSubTitle?: boolean
  labelAvatar?: string
  labelCode?: string
  labelTitle?: string
  labelSubTitle?: string
  customKeyStatus?: string
}

const props = withDefaults(defineProps<Props>(), ({
  isShowCode: true,
  isShowAvatar: false,
  isTitle: true,
  isSubTitle: true,
  labelCode: 'code',
  labelSubTitle: '',
  labelTitle: '',
  customKeyStatus: 'id',
}))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const serverfile = window.SERVER_FILE || ''
function urlImageFile(src: any) {
  if (src)
    return src.startsWith('http') ? src : serverfile + src

  return null
}

const linkAvatar = computed(() => {
  if ((props.context && props.context.avatar))
    return urlImageFile(props.context.avatar)
  if ((props.context && props.context.avatar))
    return urlImageFile(props.context.thumbnail)

  return ''
})
</script>

<template>
  <div class="d-flex align-center">
    <CmAvatar
      v-if="isShowAvatar"
      :src="linkAvatar"
      class="mr-2"
      :data="context"
    >
      {{ labelAvatar ? context[labelAvatar] : '' }}
    </CmAvatar>
    <div>
      <div>
        <span
          v-if="isShowCode && context[labelCode]"
          class="text-primary mr-2"
          :title="t(context[labelCode])"
        >{{ t('code-log') }}</span>
        <span
          v-if="isTitle && context[labelTitle] "
          class="text-medium-sm course-name"
        >
          {{ t(context[labelTitle]) }}
        </span>
      </div>
      <div
        v-if="isSubTitle && context[labelSubTitle]"
        :class="`text-${MethodsUtil.checkType(context[labelSubTitle], StatusTypeCourse, customKeyStatus)?.color}`"
      >
        {{ t(MethodsUtil.checkType(context[labelSubTitle], StatusTypeCourse, customKeyStatus)?.name) }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.course-name{
  color: rgb(var(--v-gray-900))
}
</style>
