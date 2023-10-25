<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import CmSheet from '@/components/common/CmSheet.vue'
import StringUtil from '@/utils/StringUtil'

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  level: 0,
  isVisible: false,
  disabled: false,
})
const emit = defineEmits<Emit>()
const sheet = ref(false)
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

interface Props {
  progress?: number
  title?: string
  disabled?: boolean
}
interface Emit {
  (e: 'goHome'): void
  (e: 'goBack'): void
  (e: 'openInfor'): void
}
</script>

<template>
  <div class="course-learning">
    <div class="header-learning">
      <div class="header-action">
        <div class="action-content">
          <CmButton
            class="d-flex mr-2 button-learning"
            size="36"
            @click="emit('goHome')"
          >
            <VIcon
              icon="ic:outline-home"
              size="20"
            />
          </CmButton>
          <CmButton
            variant="outlined"
            color="secondary"
            class="d-flex mr-2 button-learning"
            size="36"
            icon="material-symbols:arrow-back-rounded"
            :size-icon="20"
            @click="emit('goBack')"
          />
        </div>
        <div class="header-content">
          <div
            class="text-bold-lg text-truncate"
            :title="title"
          >
            {{ title }}
          </div>
          <div
            class="d-flex align-start"
            style="width: 50%"
          >
            <div class="mr-3">
              <VProgressLinear
                rounded-bar
                :model-value="progress"
                color="success"
                class="mt-6"
                rounded
                height="8"
                style="width: 17.375rem;"
              />
            </div>
            <div class="text-medium-sm d-flex text-noWrap">
              {{ StringUtil.decimalToFixed(Number(progress), 0) }} %
            </div>
          </div>
        </div>
      </div>
      <div class="header-sidebar">
        <div class="d-flex justify-end flex-center ">
          <slot name="action" />

          <div class="mr-3">
            <CmButton
              icon="tabler:info-circle"
              color="warning"
              :tooltip="t('info-content')"
              size="40"
              :size-icon="20"
              @click="emit('openInfor')"
            />
          </div>
          <div>
            <CmButton
              icon="tabler:chevron-left"
              variant="tonal"
              :title="t('previous-post')"
            />
          </div>
          <div class="ml-2">
            <CmButton
              icon="tabler:chevron-right"
              variant="tonal"
              :title="t('next-post')"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content-course">
        <div class="content-learning">
          <slot
            name="content"
          />
        </div>
      </div>
      <div class="sidebar">
        <slot name="sidebar" />
      </div>
    </div>
    <div
      class="sidebar-mobile"
    >
      <CmSheet
        v-model="sheet"
        inset
        size="30vh"
        origin="bottom"
      >
        <div>
          <slot name="sidebar" />
        </div>
      </CmSheet>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global" as *;

.course-learning {
  width: calc(100% - 64px);
  max-width: calc(var(--v-max-width-page) - 64px);
  height: calc(100vh - 64px) ;
  padding: 32px;
  border-radius: 8px;
  margin: 32px;
  background: rba(--v-them-surface);
  box-shadow: 0 2px 4px -2px rgba(16, 24, 40, 6%), 0 4px 8px -2px rgba(16, 24, 40, 10%);
  .button-learning {
    height: 36px !important;
    min-height: unset !important;
  }
  .header-learning {
    display: flex;
    .header-action {
      display: flex;
      width: 69%;
      padding-right: 32px;
      margin-bottom: 32px;
      .action-content {
        display: flex;
        margin-right: 24px;
      }

      .header-content {
        width: calc(100% - 112px);

        .v-progress-linear {
          margin-top: 8px !important;
        }
      }
    }
    .header-sidebar {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
  }
  .content {
    display: flex;
    width: 100%;
    height: calc(100% - 76px);;
    .content-course {
      display: flex;
      overflow: hidden;
      width: 68%;
      height: 100%;
      flex-direction: column;
      margin-right: 24px;
      .content-learning {
        display: flex;
        overflow: auto;
        height: 100%;
        align-items: center;
        justify-content: center;
        border: 1px solid $color-gray-300;
        border-radius: var(--v-border-radius-xs);
        background-color: $color-gray-200;
      }
    }

    .sidebar {
      overflow: auto;
      width: 32%;
      height: 100%;
    }
  }

  .sidebar-mobile {
    display: none;
  }

  @media only screen and (width <= 1000px) {
    .header-action {
      margin-bottom: 32px;
      background-color: greenyellow;
    }

    .content {
      .content-course {
        width: 100%;
        padding-right: unset;
      }

      .sidebar {
        display: none;
      }
    }
    .sidebar-mobile {
      display: block;
    }
  }
}
</style>
