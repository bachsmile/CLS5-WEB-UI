<script setup lang="ts">
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import CmRating from '@/components/common/CmRating.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { reaction } from '@/constant/data/iconList.json'

interface Props {
  data?: any
  generaRating?: any
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({}),
}))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()

const getRating = computed(() => props?.generaRating?.averageRating ? Math.round(props?.generaRating?.averageRating * 2) / 2 : 0)
</script>

<template>
  <div class="mc-content">
    <div class="mc-name text-bold-lg mb-2">
      {{ data.name }}
    </div>
    <div class="mc-rating mb-4">
      <div
        v-if="getRating"
        class="d-flex align-center"
      >
        <div class="d-flex align-center mc-rating-left">
          <div class="mc-rating-star">
            <CmRating
              :model-value="getRating"
              :disabled="true"
              :length="5"
              :size-icon="20"
              full-color="#FDB022"
              :full-icon=" MethodsUtil.checkType(3, reaction, 'value')?.fullIcon"
              :empty-icon=" MethodsUtil.checkType(3, reaction, 'value')?.emptyIcon"
            />
          </div>
          <div class="mc-rating-point">
            {{ generaRating?.averageRating }} {{ t('stars') }}
          </div>
        </div>
        <div class="ml-2 text-regular-sm">
          {{ generaRating?.total }} {{ t('evaluate') }}
        </div>
      </div>
      <div v-else>
        {{ t('not-evaluate') }}
      </div>
    </div>
    <div class="mc-decs">
      <div class="mc-author">
        <CpCustomInfo
          :is-show-email="false"
          is-show-sub
          :sub-content="t('Giảng viên')"
          :context="data?.authors?.[0]"
        />
      </div>
      <div class="mc-topic text-truncate">
        <div class="mc-topic-label text-semibold-sm ">
          {{ data.topicName }}
        </div>
        <small class="sub-topic text-regular-xs">
          Chủ đề
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mc-content{
    .mc-decs{
      display: flex;
      .mc-author{
        max-width: 50%;
        margin-right: 32px;
      }
      .mc-topic{
        max-width: 50%;
        .mc-topic-label{
          text-wrap: wrap;
        }
      }
    }
    .mc-rating{
      display: flex;
      flex-wrap: nowrap;
      .mc-rating-left{
        border-right: 1px solid rgb(var(--v-gray-300));

        .mc-rating-star{
         width: 120px;
        }
      }
      .mc-rating-point{
        color: rgb(var(--v-warning-400));
        margin-inline: 0.5rem;
      }
    }
}
</style>
