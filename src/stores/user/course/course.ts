import { defineStore } from 'pinia'

export const myCourseManagerStore = defineStore('myCourseManager', () => {
  /** store */
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()

  const getStatusCourse = (
    registrationType?: number,
    statusId?: number,
    isReviewExpired?: boolean,
    endDate?: any,
    startDate?: any,
    isExpired?: boolean) => {
    if (endDate) {
      const end: any = new Date(endDate)
      const now: any = new Date()
      if (now - end > 0 && isReviewExpired) {
        return {
          key: 6,
          btnValue: t('end'),
          badgeValue: t('QUE_Finished'),
          variant: 'light-danger',
        }
      }

      if (end - now > 0) {
        const start: any = new Date(startDate)
        if (start - now > 0 && statusId === -1) {
          return {
            key: 10,
            btnValue: t('sign-up'),
            badgeValue: t('sign-up'),
            variant: 'light-secondary',
          }
        }
      }
      else if (!isReviewExpired) {
        // isReviewExpried: true -> không cho phép xem lại khi khóa học kết thúc
        return {
          key: 11,
          btnValue: t('review'),
          badgeValue: t('review'),
          variant: 'light-secondary',
        }
      }
    }
    if (isExpired) {
      return {
        key: 11,
        btnValue: t('review'),
        badgeValue: t('review'),
        variant: 'light-secondary',
      }
    }
    switch (statusId) {
      case 0:
        // Đăng kí
        if (registrationType === 3) {
          // Không cho phép đăng kí
          return {
            key: 0,
            btnValue: t('NoAssign'),
            badgeValue: t('NoAssign'),
            variant: 'light-secondary',
          }
        }

        // Cho phép đăng kí
        return {
          key: 1,
          btnValue: t('login'),
          badgeValue: t('NoAssign'),
          variant: 'light-secondary',
        }
      case 2:
        // Bắt đầu học
        return {
          key: 2,
          btnValue: t('start-learn'),
          badgeValue: t('CourseService.NoStart'),
          variant: 'light-warning',
        }
      case 3:
        // Tiếp tục ngay
        return {
          key: 3,
          btnValue: t('continue-now'),
          badgeValue: t('CourseService.LearnerStudying'),
          variant: 'light-success',
        }
      case 4:
        // Hoàn thành
        // eslint-disable-next-line no-case-declarations
        const ends: any = new Date(endDate)
        // eslint-disable-next-line no-case-declarations
        const nows: any = new Date()
        if (isReviewExpired && (nows - ends > 0)) {
          return {
            key: 6,
            btnValue: t('accomplished'),
            badgeValue: t('accomplished'),
            variant: 'light-success',
          }
        }
        return {
          key: 3,
          btnValue: t('accomplished'),
          badgeValue: t('accomplished'),
          variant: 'light-success',
        }
      case 5:
        // Đang chờ (đã đăng kí và đợi phản hồi)
        return {
          key: 4,
          btnValue: t('Pending'),
          badgeValue: t('waiting-response'),
          variant: 'light-warning',
        }
      case 6:
        // Đăng kí bị từ chối
        return {
          key: 5,
          btnValue: t('denied-accept'),
          badgeValue: t('denied-accept'),
          variant: 'light-danger',
        }
      case 10:
        // Đã kết thúc
        return {
          key: 6,
          btnValue: t('end'),
          badgeValue: t('end'),
          variant: 'light-secondary',
        }
      case 11:
        // Sắp diễn ra
        return {
          key: 7,
          btnValue: t('ComingSoon'),
          badgeValue: t('ComingSoon'),
          variant: 'light-warning',
        }
      default:
        return {
          key: 1,
          btnValue: t('login'),
          badgeValue: t('NoAssign'),
          variant: 'light-secondary',
        }
    }
  }
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    getStatusCourse,
  }
})
