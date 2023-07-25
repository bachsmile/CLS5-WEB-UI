import { TYPE, useToast } from 'vue-toastification'
import CmToast from '@/components/common/CmToast.vue'
import type { typeToast } from '@/typescript/interface'

const toastUse = useToast()

function toast(status: typeToast, title?: string, message?: string) {
  toastUse({
    component: CmToast,
    props: {
      title,
      message,
    },
  }, {
    type: TYPE[status],
  })
}

export default toast
