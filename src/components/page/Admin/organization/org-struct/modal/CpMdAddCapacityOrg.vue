<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'
import ComboboxService from '@/api/combobox/index'

const props = withDefaults(defineProps<Props>(), ({
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmSelectTree = defineAsyncComponent(() => import('@/components/common/CmSelectTree.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

interface Props {
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const LABEL = Object.freeze({
  TITLE: t('add-capacity'),
  TITLE1: `${t('proficiency')} *`,
  TITLE2: `${t('level')} *`,
})

/**
 * store
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const storeOrgStruct = orgStructManagerStore()
const { title, proficiencies, titleSelected } = storeToRefs(storeOrgStruct)
const { getAllProficiency, addProficiency } = storeOrgStruct
const schema = yup.object({
  proficiency: schemaOption.defaultSelectObject,
  proficiencyLevelId: schemaOption.defaultSelectSingle,
})
const levelsModal = ref([])
const levelsExclude = ref()

let dataComponent = reactive({
  proficiencyId: null,
  proficiency: null as any,
  proficiencyLevelId: null,
})
const myFormAddProficiencies = ref()

const onCancel = async () => {
  emit('update:isDialogVisible', false)
}

// thay đổi lựa chọn năng lực
const changeProficiency = async (value: any) => {
  levelsExclude.value = title.value.proficiencies.map((item: any) => item.id)

  dataComponent.proficiencyId = value.id
  dataComponent.proficiency = value
  dataComponent.proficiencyLevelId = null
  if (value.id == null) {
    levelsModal.value = []
    return
  }
  const params = {
    id: value.id,
  }
  await MethodsUtil.requestApiCustom(ComboboxService.proficiencylevelCombobox, TYPE_REQUEST.GET, params).then((res: any) => {
    levelsModal.value = res?.data?.filter((level: any) => !levelsExclude.value.includes(level.key))
  })
}
const onConfirm = async () => {
  myFormAddProficiencies.value.validate().then(async (success: any) => {
    if (success.valid) {
      const level: any = levelsModal.value.find((x: any) => x.key === dataComponent.proficiencyLevelId)
      const params = {
        proficiencyId: dataComponent.proficiencyId,
        proficiencyLevelId: dataComponent.proficiencyLevelId,
        proficiencyLevelName: level?.value,
        proficiencyName: dataComponent.proficiency?.name,
        id: dataComponent.proficiencyLevelId,
      }

      addProficiency(params)
      emit('update:isDialogVisible', false)
    }
  })
}
const getListAddProficiency = computed(() => {
  const listExcludedIds = title.value.proficiencies.map((item: any) => item.proficiencyId)
  if (proficiencies.value) {
    const cloneProficiencies = JSON.parse(JSON.stringify(proficiencies.value))
    cloneProficiencies.forEach((element: any) => {
      if (element.proficiencies && element.proficiencies.length > 0) {
        const listEl = element.proficiencies.filter((item: any) => listExcludedIds.includes(item.id))
        if (listEl.length) {
          listEl.forEach((el: any) => {
            if (titleSelected.value[el.id] >= el.proficiencyLevels.length)
              element.proficiencies = element.proficiencies.filter((exI: any) => exI.id !== el.id)
          })
        }
      }
    })
    return cloneProficiencies
  }
  return []
})
watch(() => props.isDialogVisible, isShow => {
  if (isShow) {
    levelsModal.value = []
    dataComponent = reactive({
      proficiencyId: null,
      proficiency: null,
      proficiencyLevelId: null,
    })
  }
})
getAllProficiency()
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isDialogVisible"
    :title="LABEL.TITLE"
    persistent
    append-to-body
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <Form
      ref="myFormAddProficiencies"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <Field
        v-slot="{ field, errors }"
        v-model="dataComponent.proficiency"
        name="proficiency"
      >
        <CmSelectTree
          v-model="dataComponent.proficiency"
          :field="field"
          :text="LABEL.TITLE1"
          :max-height="400"
          :errors="errors"
          :options="getListAddProficiency"
          :placeholder="LABEL.TITLE1"
          value-format="node"
          disable-branch-nodes
          :close-on-select="true"
          :normalizer-custom-type="['id', 'name', 'proficiencies']"
          @update:model-value="changeProficiency"
        />
      </Field>
      <Field
        v-slot="{ field, errors }"
        v-model="dataComponent.proficiencyLevelId"
        name="proficiencyLevelId"
        type="text"
      >
        <CmSelect
          :model-value="dataComponent.proficiencyLevelId"
          :field="field"
          :errors="errors"
          :items="levelsModal"
          custom-key="value"
          item-value="key"
          :text="LABEL.TITLE2"
          :placeholder="LABEL.TITLE2"
        />
      </Field>
    </Form>
  </CmDialogs>
</template>
