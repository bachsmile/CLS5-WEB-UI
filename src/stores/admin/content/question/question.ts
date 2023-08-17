import { defineStore } from 'pinia'

export const questionManagerStore = defineStore('conditionManager', () => {
  /** store */

  /** state ****************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()

  /**
 * Store
 */
  const refListQsCluse = ref<any[]>([])
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    refListQsCluse,
  }
})
