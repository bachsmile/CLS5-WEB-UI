<script setup lang="ts">
import Draggable from 'vuedraggable'
import CpAnswerMatrixSgContent from '@/components/page/Admin/content/survey/modification/answerType/CpAnswerMatrixSgContent.vue'
import CpAnswerMatrixSgLevel from '@/components/page/Admin/content/survey/modification/answerType/CpAnswerMatrixSgLevel.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import { validatorStore } from '@/stores/validatator'
import { questionManagerStore } from '@/stores/admin/content/question/question'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), ({
  question: () => ({
    content: '',
    isGroup: false,
    isPoint: false,
    urlFile: null,
    isAutoApprove: true,
    levelId: null,
    typeId: 1,
    topicId: null,
    contentBasic: '\n',
    titleRating: '',
    answers: [],
    surveyCategoryRatings: [],
    surveyLevelRatings: [],
  }),
  isEdit: false,
  isView: false,
  index: 0,
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update', value: any): void
}
const { t } = window.i18n()
interface Props {
  isEdit: boolean
  question: AnswerItem
  isView: boolean
  index?: number
}
interface surveyCategoryRating {
  groupId: null | number
  name: string
  position: number
  randomId: string
}
interface surveyLevelRatings {
  name: string
  position: number
  point: number
}
interface AnswerItem {
  content: string
  isGroup: false
  urlFile: null | string
  isAutoApprove: true
  levelId: null
  typeId: null | number
  topicId: null
  contentBasic: null | string
  answers: any
  surveyCategoryRatings: surveyCategoryRating[]
  surveyLevelRatings: surveyLevelRatings[]
}
const storeQuestionManager = questionManagerStore()
const { refListQsCluse } = storeToRefs(storeQuestionManager)

const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, FieldArray, yup } = storeValidate
const { submitForm } = useForm()

const schema = ref(yup.object({
  content: schemaOption.defaultStringArea,
  titleRating: schemaOption.defaultStringArea,
}))
const anserList = ref<any>({
  titleRating: null,
})
function createInitData() {
  anserList.value.answers = []
  anserList.value.surveyLevelRatings = []
  for (let i = 0; i < 4; i++) {
    anserList.value?.surveyLevelRatings.push({
      name: '',
      position: i + 1,
      point: 1,
    })
  }
  if (anserList.value.isGroup) {
    const idGroup = MethodsUtil.createRandomId(10)
    anserList.value.surveyCategoryRatings = [{
      groupId: null,
      name: '',
      randomId: idGroup,
      position: 1,
      children: [
        {
          groupId: idGroup,
          name: '',
          randomId: MethodsUtil.createRandomId(10),
          position: 1,
        },
      ],
    }]
  }
  else {
    anserList.value.surveyCategoryRatings = [{
      groupId: null,
      name: '',
      randomId: MethodsUtil.createRandomId(10),
      position: (anserList.value?.surveyCategoryRatings?.length || 0) + 1,
    }]
  }
}

// ====> thêm và xóa mức đánh giá
function addAnswerLevel() {
  anserList.value.surveyLevelRatings[anserList.value.surveyLevelRatings.length] = {
    name: '',
    position: anserList.value.surveyLevelRatings.length + 1,
    point: 1,
  }
}
function deleteAnsLevel(dataDelete: any) {
  anserList.value?.surveyLevelRatings?.splice(dataDelete.position - 1, 1)

  anserList.value?.surveyLevelRatings?.forEach((element: any, i: number) => {
    element.position = i + 1
  })
}

// ====> thêm và xóa nhóm đánh giá

function addAnswerGroup(id: number) {
  const idGroup = MethodsUtil.createRandomId(10)
  if (id + 1 < anserList.value.surveyCategoryRatings.length) {
    for (let i = anserList.value.surveyCategoryRatings.length; i > id + 1; i--) {
      anserList.value.surveyCategoryRatings[i] = anserList.value.surveyCategoryRatings[i - 1]
      anserList.value.surveyCategoryRatings[i].position = i + 1
      anserList.value.surveyCategoryRatings[i].children.forEach((item: any) => {
        item.position = i + 1
      })
    }
  }
  anserList.value.surveyCategoryRatings[id + 1] = {
    groupId: null,
    name: '',
    randomId: idGroup,
    position: id + 2,
    children: [
      {
        groupId: idGroup,
        name: '',
        randomId: MethodsUtil.createRandomId(10),
        position: id + 2,
      },
    ],
  }
}
function delAnswerGroup(id: number) {
  anserList.value.surveyCategoryRatings.splice(id, 1)
  for (let i = id; i < anserList.value.surveyCategoryRatings.length; i++) {
    anserList.value.surveyCategoryRatings[i].position = i + 1
    anserList.value.surveyCategoryRatings[i].children.forEach((item: any) => {
      item.position = i + 1
    })
  }
}

// =================================//
// ====> thêm và xóa nọi dung nhóm đánh giá
function addAnswerContentGroup(id = 0) {
  anserList.value.surveyCategoryRatings[id].children[anserList.value.surveyCategoryRatings[id].children?.length] = {
    groupId: anserList.value.surveyCategoryRatings[id].randomId,
    name: '',
    randomId: MethodsUtil.createRandomId(10),
    position: anserList.value.surveyCategoryRatings[id].position,
  }
}

function deleteAnsContentGroup(dataDelete: any, idParent: number, idChild: number) {
  anserList.value.surveyCategoryRatings[idParent].children.splice(idChild, 1)
}

// =================================//
// ====> thêm và xóa nọi dung đánh giá
function addAnswerContent() {
  anserList.value.surveyCategoryRatings[anserList.value.surveyCategoryRatings.length] = {
    groupId: null,
    name: '',
    randomId: MethodsUtil.createRandomId(10),
    position: anserList.value.surveyCategoryRatings.length + 1 || 1,
  }
}
function deleteAnsContent(dataDelete: any) {
  anserList.value?.surveyCategoryRatings?.splice(dataDelete.position - 1, 1)

  anserList.value?.surveyCategoryRatings?.forEach((element: any, i: number) => {
    element.position = i + 1
  })
}
const myFormQs = ref()
const myFormAns = ref()
const inputAns = ref()

const isSubmit = computed(() => {
  return myFormQs.value.validate
})
const isSubmitAns = computed(() => {
  return myFormAns.value
})
function handleChangeGroup(value: any) {
  if (value) {
    const idGroup = MethodsUtil.createRandomId(10)
    anserList.value.surveyCategoryRatings = [{
      groupId: null,
      name: '',
      randomId: idGroup,
      position: 1,
      children: [
        {
          groupId: idGroup,
          name: '',
          randomId: MethodsUtil.createRandomId(10),
          position: 1,
        },
      ],
    }]
    schema.value = yup.object({
      content: schemaOption.defaultStringArea,
      nameGroup: yup.array().of(
        yup.object().shape({
          name: schemaOption.defaultStringArea,
        }),
      ),
      titleRating: schemaOption.defaultStringArea,
    })
  }
  else {
    anserList.value.surveyCategoryRatings = [{
      groupId: null,
      name: '',
      randomId: MethodsUtil.createRandomId(10),
      position: 1,
    }]
    schema.value = yup.object({
      content: schemaOption.defaultStringArea,
      titleRating: schemaOption.defaultStringArea,
    })
  }
}

function changePosition(change: any) {
  if (!window._.isEmpty(change.moved)) {
    anserList.value.surveyCategoryRatings.forEach((item: any, index: number) => {
      item.position = index + 1
      item.children.forEach((child: any) => {
        child.position = index + 1
      })
    })
  }
}
watch(() => anserList, (val: any) => {
  emit('update', anserList.value)
}, { deep: true, immediate: true })
watch(() => props.question, (val: any) => {
  anserList.value = props.question
}, { immediate: true })
onMounted(() => {
  if (!props.isEdit)
    createInitData()
})

onMounted(() => {
  refListQsCluse.value[props.index] = {
    isSubmit,
    isSubmitAns,
    inputAns,
  }
})
defineExpose({
  isSubmit,
  isSubmitAns,
  inputAns,
})
</script>

<template>
  <div>
    <div class="mb-2 text-medium-sm">
      {{ t('question-content') }} *
    </div>
    <Form
      ref="myFormQs"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="anserList.content"
            name="content"
            type="string"
          >
            <CmInputEditor
              v-model="anserList.content"
              v-model:basic="anserList.basic"
              :field="field"
              :errors="errors"
              :disabled="isView"
            />
          </Field>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="anserList.titleRating"
            name="titleRating"
            type="string"
          >
            <CmInputEditor
              v-model="anserList.titleRating"
              :field="field"
              :errors="errors"
              :disabled="isView"
              rlt="end"
              is-menu-simple
              min-height="44px"
              :placeholder="t('rating-title')"
              :text="t('rating-title')"
              width="100%"
            />
          </Field>
          <div class="my-5">
            <CmCheckBox
              v-model="anserList.isGroup"
              :disabled="isView"
              :label="t('group-rating-level')"
              @update:model-value="handleChangeGroup"
            />
          </div>

          <div v-if="anserList.isGroup">
            <FieldArray
              name="nameGroup"
            >
              <Draggable
                v-model="anserList.surveyCategoryRatings"
                tag="transition-group"
                ghost-class="ghost"
                :force-fallback="true"
                handle=".move-icon-draggable"
                @change="changePosition"
              >
                <template #item="{ element, index }">
                  <div class="mb-5">
                    <div
                      class="mb-2"
                    >
                      <label
                        class="text-label-default"
                      > {{ $t('group-name') }}
                      </label>
                    </div>
                    <VRow>
                      <VCol
                        cols="11"
                      >
                        <Field
                          v-slot="{ field, errors }"
                          :model-value="element.name"
                          :name="`nameGroup[${index}].name`"
                          type="number"
                        >
                          <CmInputEditor
                            v-model="element.name"
                            :field="field"
                            :errors="errors"
                            :is-errors="false"
                            :disabled="isView"
                            rlt="end"
                            is-menu-simple
                            min-height="44px"
                            placeholder="group-name"
                            width="100%"
                          />
                        </Field>
                      </VCol>
                      <VCol
                        cols="1"
                        class="d-flex align-center pxn"
                      >
                        <VIcon
                          class="cursor-move move-icon-draggable"
                          icon="tabler:arrows-move"
                          size="20"
                        />
                      </VCol>
                    </VRow>
                    <div class="my-5">
                      <BLink
                        class="cursor-pointer mr-6"
                        @click="addAnswerGroup(index)"
                      >
                        <VIcon
                          icon="tabler:plus"
                          size="16"
                          class="color-success-700 mr-2"
                        />
                        <span class="color-success-700  align-center">{{ $t('add-group') }}</span>
                      </BLink>

                      <BLink
                        v-if="anserList.surveyCategoryRatings.length > 1"
                        class="cursor-pointer"
                        :disabled="true"
                        @click="delAnswerGroup(index)"
                      >
                        <VIcon
                          icon="tabler:x"
                          size="16"
                          class="color-error-700 mr-2"
                        />
                        <span class="color-error-700  align-center">{{ $t('del-group') }}</span>
                      </BLink>
                    </div>
                    <div
                      v-if="element.children && element.children.length"
                      class="answer-list"
                    >
                      <div
                        v-for="(child, idChild) in element.children"
                        :key="idChild"

                        class="answer-item mb-5"
                      >
                        <CpAnswerMatrixSgContent
                          ref="myFormAns"
                          v-model:name="child.name"
                          :placeholder="t('add-evaluate-content')"
                          :is-view="isView"
                          :data="child"
                          :ans-id="idChild + 1"
                          :disabled-del="element.children.length <= 1"
                          @delete="($value: any) => deleteAnsContentGroup($value, index, idChild)"
                        />
                      </div>
                    </div>
                    <BLink
                      class="cursor-pointer"
                      @click="addAnswerContentGroup(index)"
                    >
                      <VIcon
                        icon="tabler:plus"
                        size="16"
                        class="color-primary mr-2"
                      />
                      <span class="color-primary  align-center">{{ $t('add-evaluate') }}</span>
                    </BLink>
                  </div>
                </template>
              </Draggable>
            </FieldArray>
          </div>
          <div v-else>
            <div
              v-if="anserList.surveyCategoryRatings && anserList.surveyCategoryRatings.length"
              class="answer-list"
            >
              <div
                v-for="(item, idAns) in anserList.surveyCategoryRatings"
                :key="idAns"

                class="answer-item mb-5"
              >
                <CpAnswerMatrixSgContent
                  ref="myFormAns"
                  v-model:name="item.name"
                  :placeholder="t('add-evaluate-content')"
                  :is-view="isView"
                  :data="item"
                  :ans-id="idAns + 1"
                  :disabled-del="anserList.surveyCategoryRatings.length <= 1"
                  @delete="($value: any) => deleteAnsContent($value)"
                />
              </div>
            </div>
            <BLink
              class="cursor-pointer"
              @click="addAnswerContent"
            >
              <VIcon
                icon="tabler:plus"
                size="16"
                class="color-primary mr-2"
              />
              <span class="color-primary  align-center">{{ $t('add-evaluate') }}</span>
            </BLink>
          </div>
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <div class="mb-6">
            <CmCheckBox
              v-model="anserList.isPoint"
              :disabled="isView"
              :label="t('point-number')"
            />
          </div>

          <div class="answer-list">
            <div
              v-for="(ans, idAns) in anserList.surveyLevelRatings"
              :key="idAns"

              class="answer-item mb-5"
            >
              <CpAnswerMatrixSgLevel
                ref="myFormAns"
                v-model:name="ans.name"
                v-model:point="ans.point"
                :is-match="anserList.isPoint"
                :placeholder="t('rating-level')"
                :is-view="isView"
                :data="ans"
                :ans-id="idAns + 1"
                :disabled-del="anserList.surveyLevelRatings.length <= 1"
                @delete="deleteAnsLevel"
              />
            </div>
          </div>
          <BLink
            class="cursor-pointer"
            @click="addAnswerLevel"
          >
            <VIcon
              icon="tabler:plus"
              size="16"
              class="color-primary mr-2"
            />
            <span class="color-primary  align-center">{{ $t('add-level') }}</span>
          </BLink>
        </VCol>
      </VRow>
    </Form>
  </div>
</template>
