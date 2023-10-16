import { defineStore } from 'pinia'
import UserService from '@/api/user'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import uses from '@/assets/images/icon/svg/uses.svg'
import box from '@/assets/images/icon/svg/box.svg'
import officeBag1 from '@/assets/images/icon/svg/office-bag-1.svg'
import useBook from '@/assets/images/icon/svg/use-book.svg'
import pieChart from '@/assets/images/icon/svg/pie-chart.svg'
import barGraph from '@/assets/images/icon/svg/bar-graph.svg'
import link from '@/assets/images/icon/svg/link.svg'
import study from '@/assets/images/icon/svg/study.svg'
import gridOrg from '@/assets/images/icon/svg/gridOrg.svg'
import star from '@/assets/images/icon/svg/star.svg'
import type { Any } from '@/typescript/interface'
import StringUtil from '@/utils/StringUtil'

export const useStoreMenu = defineStore('useStoreMenu', () => {
  const { t } = window.i18n()
  const navItems = ref<any[]>([])
  interface Role {
    id: number
    name: string
    router: string
  }

  const setImageDefault = (val: string) => {
    switch (val) {
      case 'OrganizationManaging':
        return uses
      case 'TrainingManaging':
        return box
      case 'LearningManaging':
        return officeBag1
      case 'ContentManaging':
        return useBook
      case 'ReportManaging':
        return pieChart
      case 'SystemManaging':
        return barGraph
      case 'ShareManaging':
        return link
      case 'MyEducationProgramManaging':
        return study
      case 'ApplicationManaging':
        return gridOrg
      case 'GamificationManaging':
        return star

      default:
        break
    }
  }
  const getDataMenu = async (id: number) => {
    const data: Any[] = []
    await MethodsUtil.requestApiCustom(UserService.GetMenu, TYPE_REQUEST.GET, { id }).then((res: Any) => {
      res.data.forEach((e: any) => {
        e.items = []
        e.children.forEach((i: any) => {
          if (i.route) {
            const item = {
              to: {
                name: i.route,
              },
              title: StringUtil.jsUcfirst(t(`Menu_${i.code}`)),
            }
            e.items.push(item)
          }
        })
        const item = {
          children: e.items,
          icon: {
            icon: e.icon,
          },
          src: setImageDefault(e.title),
          title: t(`${e.title}`),
        }
        data.push(item)
      })
    })
    return data
  }

  const role = ref<Role | null>(null)
  const userData = ref(JSON.parse(localStorage.getItem('userData') || '{}'))
  const roleDefault = localStorage.getItem('role')
  const userRoles = ref<Role[]>(userData.value.roles || [])
  const setDataMenu = async () => {
    navItems.value = await getDataMenu(role.value?.id)
  }

  return {
    getDataMenu,
    navItems,
    userData,
    userRoles,
    setDataMenu,
    role,
  }
})
