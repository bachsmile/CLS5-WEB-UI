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
  const listAnswer: Any[] = rowData.filter((el, idx) => el !== null && idx > 10)
  const data: Any = {
    id: rowData[0],
    groupId: rowData[1],
    topic: rowData[2],
    rank: rowData[3],
    type: rowData[4],
    contentBasic: rowData[5],
    urlFile: rowData[6],
    correctAnswer: rowData[7],
    shuffle: rowData[8],
    answerNotShuffle: rowData[9],
    level: rowData[10],
    listAnswer,
  }
  data.content = data.contentBasic
  data.typeId = getQuestionTypeFromname(data.type)
  if (data.typeId === 4) {
    const correct = Number(data.correctAnswer)
    if (listAnswer.length >= 2) {
      if (correct === 1)
        data.listAnswer = [listAnswer[0]]
      else data.listAnswer = [listAnswer[1]]
    }
  }
  if (data.typeId === 3 || data.typeId === 6 || data.typeId === 7)
    setHtmlContent(data)
  return data
}

// lấy nội dung html
function setHtmlContent(question: Any) {
  let html = `<p>${question.content}</p>`

  // câu hỏi gạch chân/đk loại 1
  if (question.typeId === 3) {
    for (let i = 0; i < question.listAnswer.length; i += 1) {
      const element = question.listAnswer[i]
      const key = `{{${i + 1}}}`
      if (html.includes(key)) {
        // eslint-disable-next-line no-irregular-whitespace, vue/no-irregular-whitespace
        const blank = `<span class="answer-underline" data-position="${i}">﻿<span contenteditable="false">${element} </span>﻿</span>`
        html = html.replaceAll(key, blank)
      }
      else {
        question.isSuccess = false
        break
      }
    }
  }
  else if (question.typeId === 6) {
    // câu hỏi điền khuyết loại 1
    question.contentBasic = question.contentBasic.replaceAll(/\{{(.+?)\}}/g, ' ... ')
    for (let i = 0; i < question.listAnswer.length; i += 1) {
      if (i < question.listAnswer.length) {
        const element = question.listAnswer[i]
        const key = `{{${i + 1}}}`
        if (html.includes(key)) {
          // eslint-disable-next-line no-irregular-whitespace, vue/no-irregular-whitespace
          const blank = `<span class="answer-fill-blank">﻿<span contenteditable="false">( ${i + 1} )</span>﻿</span>`
          html = html.replaceAll(key, blank)
        }
      }
      else {
        question.isSuccess = false
        break
      }
    }
  }
  else if (question.typeId === 7) {
    // câu hỏi điền khuyết loại 2
    question.contentBasic = question.contentBasic.replaceAll(/\{{(.+?)\}}/g, ' ... ')

    // lấy danh sách câu hỏi
    const answers = []
    const answerDatas = question.content.split('{{')
    for (let i = 1; i < answerDatas.length; i += 1) {
      const element = answerDatas[i]
      const answerDataContent = element.split('}}')
      if (answerDataContent.length > 0)
        answers.push(answerDataContent[0])
    }
    question.listAnswer = answers

    // const correctAnswers = question.correctAnswer.split(',')
    for (let i = 0; i < question.listAnswer.length; i += 1) {
      if (i < question.listAnswer.length) {
        const element = question.listAnswer[i]
        const key = `{{${element}}}`
        if (html.includes(key)) {
          const blank = `<span class="answer-select" contenteditable="false">( ${i + 1} )</span>`
          html = html.replaceAll(key, blank)
        }
      }
      else {
        question.isSuccess = false
        break
      }
    }
  }
  question.content = html
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

const config = reactive<Config | Any>(
  {
    customId: 'id',
    routerBack: 'question-list',
    table: ({
      header: [
        {
          text: t('question-content'),
          value: 'content',
          type: 'custom',
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
      :is-action-check="false"
    />
  </div>
</template>
