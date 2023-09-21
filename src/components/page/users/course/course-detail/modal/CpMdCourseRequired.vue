<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmTab from '@/components/common/CmTab.vue'
import CmTable from '@/components/common/CmTable.vue'
import { StatusTypeMyCourse } from '@/constant/data/status.json'
import MethodsUtil from '@/utils/MethodsUtil'
import CmButton from '@/components/common/CmButton.vue'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  dataCourse: () => ([]),
  dataProficiency: () => ([]),
})

const emit = defineEmits<Emit>()

interface Props {
  isShowModal: boolean
  dataCourse: any
  dataProficiency: any
}
interface Emit {
  (e: 'update:isShowModal', data: boolean): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
function cancelModal() {
  emit('update:isShowModal', false)
}

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'course',
    title: 'course',
    isSlot: true,
    isRendered: true,
  },
  {
    key: 'capacity',
    title: 'capacity',
    isSlot: true,
    isRendered: false,
  },
]
const headersCourse = ref([
  { text: t('course-name'), value: 'name', type: 'custom', width: 500 },
  { text: '', value: 'action' },
])
const headersProficiency = ref([
  { text: t('capacity-name'), value: 'proficiency' },
  { text: t('level'), value: 'level' },
])
function clickDetailCourse(id: number, idBtn: number, unLoadComponent: any) {
  router.push({ name: 'course-detail', params: { id } })
  emit('update:isShowModal', false)
  nextTick(() => {
    unLoadComponent(idBtn)
  })
}
</script>

<template>
  <CmDialogs
    :is-div-space="false"
    :is-dialog-visible="isShowModal"
    :is-ok="false"
    :button-cancle-name="t('goBack')"
    @cancel="cancelModal"
  >
    <template #title>
      <div class="d-flex justify-center text-bold-xl color-primary mt-6">
        {{ t('notification-my-course') }}
      </div>
      <div class="d-flex justify-center text-regular-md  text-title-noti mb-2 ">
        {{ t('notification-my-course-req') }}
      </div>
    </template>
    <div>
      <CmTab
        :is-render="true"
        :list-tab="listTab"
        label="type"
        is-un-query
      >
        <template #default="{ context }">
          <div
            v-if="context.key === 'course'"
            class="my-6"
          >
            <CmTable
              is-border-row
              :headers="headersCourse"
              :items="dataCourse"
              disiable-pagination
              :min-height="100"
            >
              <template #rowItem="{ col, context }">
                <div
                  v-if="col === 'name'"
                >
                  <div>
                    {{ context.name }}
                  </div>
                  <div :class="`color-${MethodsUtil.checkStatus(context.statusName, StatusTypeMyCourse)?.color}`">
                    {{ t(context.statusName) }}
                  </div>
                </div>
                <div
                  v-if="col === 'action'"
                >
                  <CmButton
                    is-load
                    variant="text"
                    color="primary"
                    @click="($id, $event) => clickDetailCourse(context.id, $id, $event)"
                  >
                    {{ t('view-detail') }}
                  </CmButton>
                </div>
              </template>
            </CmTable>
          </div>
          <div
            v-if="context.key === 'capacity'"
            class="my-6"
          >
            <CmTable
              is-border-row
              :headers="headersProficiency"
              :items="dataProficiency"
              disiable-pagination
              :min-height="100"
            />
          </div>
        </template>
      </CmTab>
    </div>
  </CmDialogs>
</template>

<style lang="scss">
.text-title{
  color:  rgb(var(--v-gray-900));
}
</style>
