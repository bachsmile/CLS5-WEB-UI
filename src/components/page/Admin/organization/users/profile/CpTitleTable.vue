<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { defaultSetting } from '@/constant/data/settingDefault.json'

const props = withDefaults(defineProps<Props>(), ({
  userId: null,
}))

// Khai báo biến Emit
const emit = defineEmits<Emit>()
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CpOrganizationSelect = defineAsyncComponent(() => import('@/components/page/gereral/CpOrganizationSelect.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

// Cấu trúc Emit
interface Emit {
  (e: 'updateListOrg', value: any): void
}
interface Props {
  userId?: any
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const storeValidate = validatorStore()
const { Field, Form } = storeValidate

const isCourse = ref(false)
const isTrainingRoute = ref(false)
const autoCheckAssignUser = defaultSetting?.find(item => item.typeId === 7)
if (autoCheckAssignUser && autoCheckAssignUser?.value) {
  isCourse.value = true
  isTrainingRoute.value = true
}

// table
const headers = reactive([
  { text: t('name-structure'), value: 'orgStruct', width: 400 },
  { text: t('title-position'), value: 'title', width: 400 },
  { text: '', value: 'actions', width: 50 },
])

const items = ref<any>([])

// org
const dataOrg = reactive({
  isChange: ref(false),
  indexClick: null,
})

const isChangeRef = toRef(dataOrg, 'isChange')

function addOrg() {
  dataOrg.isChange = true
  items.value.push({
    key: items.value.length,
    id: null,
    listTitle: [],
    name: '',
    titleId: null,
    titleName: '',
  })
}

async function getTitleByOrg(orStructureId: any) {
  const params = {
    orStructureId,
  }

  return await MethodsUtil.requestApiCustom(ApiUser.GetListTitle, TYPE_REQUEST.POST, params)
    .then((value: any) => {
      if (value?.data?.pageLists?.length > 0) {
        value.data.pageLists = value.data.pageLists.map((x: any, idItem: any) => ({ value: x.id, text: x.name, orgId: x.organizationalStructureId }))

        return value.data.pageLists
      }

      return []
    })
}

function findIndex(index: any, data: any) {
  return data.findIndex((row: any) => row.key === index)
}

async function changeOrg(index: any, val: any) {
  // dataOrg.isChange = true
  isChangeRef.value = true

  const indexItem = findIndex(index, items.value)
  const testIndex = items.value.findIndex((x: any) => x.id === val)
  if (testIndex >= 0 || val === null) {
    toast('WARNING', t('Cơ cấu tổ chức không được để trống và không đươc phép trùng'))

    return
  }
  const changedValue = items.value[indexItem]
  const listTitle = await getTitleByOrg(val)

  changedValue.id = val
  changedValue.titleId = null
  changedValue.listTitle = listTitle
  items.value.splice(indexItem, 1, changedValue)
  emit('updateListOrg', items.value)
}

async function updateTitle(userId: any) {
  const listTitle = items.value.map((item: any) => ({ orgStructId: item.id, titleId: item.titleId }))
  const errItem = listTitle.find((x: any) => !x.orgStructId)
  if (errItem) {
    toast('WARNING', t('org-duplicate'))

    return
  }

  const params = {
    id: userId || Number(props.userId),
    listTitle,
    isTrainingRoute: isTrainingRoute.value,
    isCourse: isCourse.value,
  }

  await MethodsUtil.requestApiCustom(ApiUser.UpdateTitleUser, TYPE_REQUEST.POST, params)
}

function changeTitle(index: any, val: any) {
  const indexItem = findIndex(index, items.value)

  // dataOrg.isChange = true
  isChangeRef.value = true
  const changedValue = items.value[indexItem]

  changedValue.titleId = val

  items.value.splice(indexItem, 1, changedValue)
}

function deleteItem(index: any) {
  const indexItem = findIndex(index, items.value)

  items.value.splice(indexItem, 1)

  // dataOrg.isChange = true
  isChangeRef.value = true
}

async function getListOrgStructTitleUser() {
  const params = {
    userId: Number(props?.userId),
  }

  await MethodsUtil.requestApiCustom(ApiUser.GetProfileOrg, TYPE_REQUEST.GET, params).then(async (value: any) => {
    const listTitle = await getTitleByOrg(0)
    if (value.data) {
      value.data.forEach((item: any, index: number) => {
        item.titleId = item.titleId || null
        item.listTitle = listTitle.filter((x: any) => !x.orgId || x.orgId === item.id)
        item.key = index
      })
      items.value = value.data
    }
  })
}

async function checkGetListOrgStruct() {
  if (route.name === 'admin-organization-users-profile-add') {
    items.value = []

    return
  }

  await getListOrgStructTitleUser()
}

checkGetListOrgStruct()

watch(() => route.name, val => {
  checkGetListOrgStruct()
})
defineExpose({
  updateTitle,
  checkGetListOrgStruct,
  isChange: isChangeRef,
})
</script>

<template>
  <div>
    <VSheet
      width="100%"
      class="user-infor mx-auto no-background"
    >
      <Form>
        <label class="mb-1">{{ $t('auto-assign-content') }}</label>
        <VRow class="mb-5">
          <VCol
            cols="12"
            md="4"
          >
            <CmCheckBox
              v-model="isCourse"
            >
              {{ t('course') }}
            </CmCheckBox>
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <CmCheckBox
              v-model:model-value="isTrainingRoute"
            >
              {{ t('training-path') }}
            </CmCheckBox>
          </VCol>
        </VRow>
      </Form>
    </VSheet>
    <VSheet
      width="100%"
      class="user-infor mx-auto no-background"
    >
      <CmTable
        :headers="headers"
        :items="items"
        :min-height="300"
        is-action-footer
      >
        <template #action-footer>
          <div>
            <CmButton
              variant="text"
              @click="addOrg"
            >
              <VIcon icon="tabler:plus" />
              {{ t('add') }}
            </CmButton>
          </div>
        </template>
        <template #rowItem="{ col, context }">
          <div v-if="col === 'orgStruct'">
            <Form>
              <Field name="orgStruct">
                <CpOrganizationSelect
                  v-model="context.id"
                  :placeholder="t('name-structure')"
                  @update:modelValue="changeOrg(context.key, $event)"
                />
              </Field>
            </Form>
          </div>
          <div v-if="col === 'title'">
            <div v-if="context.id">
              <CmSelect
                v-model="context.titleId"
                :placeholder="t('title-position')"
                :items="context.listTitle"
                item-value="value"
                custom-key="text"
                @update:model-value="changeTitle(context.key, $event)"
              />
            </div>
          </div>
          <div v-if="col === 'actions'">
            <VIcon
              class="cursor-pointer"
              icon="fe:trash"
              @click="deleteItem(context.key)"
            />
          </div>
        </template>
      </CmTable>
    </VSheet>
  </div>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;
</style>
