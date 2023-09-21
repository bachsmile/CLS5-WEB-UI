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
  const listAnswer: Any[] = rowData.filter((el, idx) => el !== null && idx > 5)
  const data: Any = {
    topic: rowData[1],
    type: rowData[2],
    contentBasic: rowData[3],
    urlFile: rowData[4],
    scope: rowData[5],
    id: rowData[0],
    listAnswer,
  }
  data.content = data.contentBasic
  data.typeId = getQuestionTypeFromname(data.type)
  if (data.typeId === 5) {
    const scope = parseInt(data.scope, 10)
    if (scope) {
      const amountdifference = scope - data.listAnswer.length

      // nếu ít hơn scope thì thêm đáp án trống
      if (data.listAnswer.length < scope) {
        for (let k = 0; k < amountdifference; k += 1)
          data.listAnswer.push('')
      }
      else if (data.listAnswer.length > scope) {
        for (let k = data.listAnswer.length - 1; k >= -amountdifference; k--)
          data.listAnswer.pop()
      }
    }
  }
  return data
}

// lấy kiểu câu hỏi từ tên
function getQuestionTypeFromname(questionTypeName: string) {
  switch (questionTypeName?.trim()) {
    case 'Trắc nghiệm một lựa chọn':
    case 'Single choice':
      return 1
    case 'Trắc nghiệm nhiều lựa chọn':
    case 'Multiple choice':
      return 2
    case 'Tự luận':
    case 'Underlined questions':
      return 3
    case 'Phạm vi tuyến tính':
    case 'Essay':
      return 4
    case 'Đánh giá':
    case 'Linear scale':
      return 5
    default:
      return 1
  }
}

const { t } = window.i18n()
const store = useImportFileStore()
const { type } = storeToRefs(store)
const listCombobox = ref([])
type.value = undefined

const config = reactive<Config | Any>(
  {
    customId: 'id',
    routerBack: 'question-survey-list',
    table: ({
      header: [
        {
          text: t('question-content'),
          value: 'content',
          type: 'custom',
          isSurvey: true,
        },
        {
          text: t('topic'),
          value: 'topicName',
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
      urlFileDefault: QuestionService.PostDownloadTemplateSurvey,
      method: TYPE_REQUEST.POST,
      nameFile: 'MauThemCauKhaoSat.xlsx',
      paramsDowload: {
        listTopic: listCombobox.value,
      },
    },
    importFile: {
      urlFileDefault: QuestionService.PostImportSurveyFromFile,
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
  titleList: t('surveys'),
  titlePage: t('question-survey'),
  titleButtonAdd: t('add-survey'),
  titlePageUpload: t('add-survey'),
}
</script>

<template>
  <div>
    <CpImportFile
      :config="config"
      :actions="actions"
      v-bind="titleImport"
      :is-position-err="false"
      :is-action-check="false"
    />
  </div>
</template>
