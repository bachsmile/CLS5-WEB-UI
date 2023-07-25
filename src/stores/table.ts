import { defineStore } from 'pinia'

export const tableStore = defineStore('table', () => {
  const callBackAction = ref()
  function handleActionTable(data?: any, index?: number, dataResent?: any) {
    return resultAction(data, dataResent || undefined)
  }
  function resultAction(data: any, dataResent?: any) {
    callBackAction.value(data, dataResent || undefined)
  }
  return {
    callBackAction,
    handleActionTable,
    resultAction,
  }
})
