<script lang="ts" setup>
import CpImportFile from '@/components/page/gereral/CpImportFile.vue'
import type { Action, Config } from '@/typescript/interface/import'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import QuestionService from '@/api/question'
import MethodsUtil from '@/utils/MethodsUtil'
import type { Any } from '@/typescript/interface'
import { useImportFileStore } from '@/stores/ImportFile'

// Cập nhật năng lực
function dataColumnExcel(rowData: Array<any>) {
  const [id,
    groupId,
    topic,
    rank,
    type,
    contentBasic,
    urlFile,
    correctAnswer,
    shuffle,
    answerNotShuffle,
    level
    , ...array] = rowData
  const listAnswer: Any[] = array.filter(el => el !== null)
  const typeId = getQuestionTypeFromname(type)
  return {
    id,
    groupId,
    topic,
    rank,
    type,
    contentBasic,
    urlFile,
    correctAnswer,
    shuffle,
    answerNotShuffle,
    level,
    content: contentBasic,
    listAnswer,
    typeId,
  }
}

// lấy kiểu câu hỏi từ tên
function getQuestionTypeFromname(questionTypeName: string) {
  switch (questionTypeName) {
    case 'Câu hỏi trắc nghiệm một lựa chọn':
    case 'Single choice questions':
      return 1
    case 'Câu hỏi trắc nghiệm nhiều lựa chọn':
    case 'Multiple choice questions':
      return 2
    case 'Câu hỏi gạch chân':
    case 'Underlined questions':
      return 3
    case 'Câu hỏi lựa chọn đúng sai':
    case 'True false questions':
      return 4
    case 'Câu hỏi mệnh đề đúng sai':
    case 'Clause true or false questions':
      return 5
    case 'Câu hỏi điền khuyết':
    case 'Fill in the gap questions':
      return 6
    case 'Câu hỏi điền khuyết loại 2':
    case 'Fill in the gap 2 questions':
      return 7
    case 'Câu hỏi ghép đôi':
    case 'Pairing questions':
      return 8
    case 'Câu hỏi tự luận':
    case 'Essay questions':
      return 9
    default:
      return 1
  }
}

const { t } = window.i18n()
const store = useImportFileStore()
const { type } = storeToRefs(store)
const listCombobox = ref([])
type.value = undefined

const config = reactive<Config>(
  {
    customId: 'id',
    routerBack: 'admin-organization-user-groups-list',
    table: ({
      header: [
        {
          text: t('question-content'),
          value: 'content',
          type: 'custom',
        },
        {
          text: t('topic'),
          value: 'topic',
        },
        {
          text: t('Url'),
          value: 'urlFile',
        },
        {
          text: t('question-type'),
          value: 'questionTypeName',
        },
      ],
    }),
    dowloadSample: {
      urlFileDefault: QuestionService.PostDownloadTemplateQuestion,
      method: TYPE_REQUEST.POST,
      nameFile: 'MauThemCauHoi.xlsx',
      paramsDowload: {
        listTopic: listCombobox.value,
      },
    },
    importFile: {
      urlFileDefault: QuestionService.PostImportQuestionFromFile,
      method: TYPE_REQUEST.POST,
      dataColumnExcel,
      paramsImport: {
        customListExcel: 'listQuestion',
        listTopic: [],
      },
    },
  },
)
function getTopic() {
  MethodsUtil.requestApiCustom('/topic/get-combobox-topic-question', TYPE_REQUEST.GET).then((result: Any) => {
    config.dowloadSample.paramsDowload.listTopic = result.data
    config.importFile.paramsImport.listTopic = result.data
  })
}

getTopic()
const actions = ref<Action[]>([
  {
    title: t('AddFromFiles'),
    key: 1,
  },
])
const titleImport = {
  titleList: t('question'),
  titlePage: t('add-question-from-file'),
  titleButtonAdd: t('add-question'),
  titlePageUpload: t('add-question-from-file'),
}
</script>

<template>
  <div>
    <CpImportFile
      :config="config"
      :actions="actions"
      v-bind="titleImport"
      :is-position-err="false"
    />
  </div>
</template>
