import { defineStore } from 'pinia'
import MethodsUtil from '@/utils/MethodsUtil'
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'

export const orgStructManagerStore = defineStore('orgStructManager', () => {
  /**
   * store
   */
  const storeCombobox = comboboxStore()
  const { ownerCombobox } = storeToRefs(storeCombobox)
  const { getComboboxOwner } = storeCombobox

  /**
   * data
   */
  const organization = reactive({
    id: null,
    code: null,
    name: null,
    ownerId: null,
    managementId: 1,
    parentId: null,
    description: '',
  })
  const vSelectOwner = reactive<any>({
    listCombobox: [],
    totalRecord: 0,
    pageNumber: 1,
    pageSize: 30,
    search: '',
    excludeList: [],
    itemSelected: {} as any,
  })
  const myFormAddInforOrg = ref()

  return {
    organization,
    myFormAddInforOrg,
    vSelectOwner,
  }
})
