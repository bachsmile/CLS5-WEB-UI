import { defineStore } from 'pinia'

export const tableStore = defineStore('table', () => {
  const callBackAction = ref()
  function handleActionTable(data?: any, index?: number, dataResent?: any) {
    return resultAction(data)
  }
  function resultAction(data: any) {
    callBackAction.value(data)
  }
  return {
    callBackAction,
    handleActionTable,
    resultAction,
  }
})
