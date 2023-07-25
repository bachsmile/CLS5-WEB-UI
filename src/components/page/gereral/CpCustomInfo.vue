<script lang="ts" setup>
import StringUtil from '@/utils/StringUtil'
import CmAvatar from '@/components/common/CmAvatar.vue'

interface Props {
  context?: any
  isShowEmail?: boolean
  isShowCode?: boolean
  isShowAvatar?: boolean
  labelFirst?: string
  labelLast?: string
  isFullName?: boolean
  labelCode?: string
}

const props = withDefaults(defineProps<Props>(), ({
  isShowEmail: true,
  isShowCode: true,
  isShowAvatar: true,
  labelFirst: 'firstName',
  labelLast: 'lastName',
  isFullName: true,
  labelCode: 'userCode',
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
      is-avatar
      :data="context"
    >
      {{ StringUtil.formatFullName(context[labelFirst], context[labelLast]) }}
    </CmAvatar>
    <div class="d-flex flex-column ml-2">
      <div>
        <span
          v-if="isShowCode && context[labelCode]"
          class="text-primary mr-2"
          :title="context[labelCode]"
        >{{ t('code-log') }}</span>
        <span
          v-if="isFullName"
          class="text-medium-sm"
        >{{ StringUtil.formatFullName(context[labelFirst], context[labelLast]) }}</span>
        <span
          v-else
          class="text-medium-sm"
        >{{ context.name }}</span>
      </div>
      <small
        v-if="isShowEmail"
        class="whitespace-no-wrap text-medium-emphasis"
      >{{ context.email }}</small>
    </div>
  </div>
</template>
