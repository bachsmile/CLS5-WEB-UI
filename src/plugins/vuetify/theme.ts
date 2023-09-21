import type { VuetifyOptions } from 'vuetify'
import { color } from '@/constant/data/style.json'
import { themeConfig } from '@themeConfig'

const theme: VuetifyOptions['theme'] = {
  defaultTheme: localStorage.getItem(`${themeConfig.app.title}-theme`) || themeConfig.app.theme.value,
  themes: {
    light: {
      dark: false,
      colors: {
        'on-primary': '#fff',
        'on-secondary': '#fff',
        'on-success': '#fff',
        'on-info': '#fff',
        'on-warning': '#fff',
        'primary': '#1570ef', // primary/600
        // 'secondary': '#A8AAAE',

        'secondary': '#475467',
        'success': '#28C76F',
        'info': '#0086C9',
        'warning': '#dc6803',
        'error': '#d92d20',
        'purple': '#444CE7',
        'primary-light': '#0086C9',
        'background': '#F8F7FA',
        'on-background': '#4B465C',
        'on-surface': '#4B465C',
        'surface': '#FFFFFF',
        'perfect-scrollbar-thumb': '#DBDADE',
        'white': '#ffffff',

      },
      variables: {
        'default': '#1849a9',
        'line-default': '#eaecf0',
        'border-color': '#D0D5DD',
        'medium-emphasis-opacity': 1,
        'color-text-primary': color['color-text-primary'],
        'color-primary': color['color-primary'],

        // Shadows
        'shadow-key-umbra-opacity': 'rgba(var(--v-theme-on-surface), 0.08)',
        'shadow-key-penumbra-opacity': 'rgba(var(--v-theme-on-surface), 0.12)',
        'shadow-key-ambient-opacity': 'rgba(var(--v-theme-on-surface), 0.04)',

        'white': '#ffffff',

        'info-25': '#F5FBFF',
        'info-50': '#F0F9FF',
        'info-100': '#E0F2FE',
        'info-200': '#B9E6FE',
        'info-300': '#7CD4FD',
        'info-400': '#36BFFA',
        'info-500': '#0BA5EC',
        'info-600': 'var(--v-theme-info)',
        'info-700': '#026AA2',
        'info-800': '#065986',
        'info-900': '#0B4A6F',

        'primary-25': '#f5faff',
        'primary-50': '#eff8ff',
        'primary-100': '#d1e9ff',
        'primary-200': '#b2ddff',
        'primary-300': '#84caff',
        'primary-400': '#53b1fd',
        'primary-500': '#2e90fa',
        'primary-600': 'var(--v-theme-primary)',
        'primary-700': '#175cd3',
        'primary-800': '#1849a9',
        'primary-900': '#194185',

        'gray-25': '#fcfcfd',
        'gray-50': '#f9fafb',
        'gray-100': '#f2f4f7',
        'gray-200': '#eaecf0',
        'gray-300': '#d0d5dd',
        'gray-400': '#98a2b3',
        'gray-500': '#667085',
        'gray-600': '#475467',
        'gray-700': '#344054',
        'gray-800': '#1d2939',
        'gray-900': '#101828',

        'error-25': '#fffbfa', // 'error/25'
        'error-50': '#fef3f2', // 'error/50'
        'error-100': '#fee4e2', // 'error/100'
        'error-200': '#fecdca', // 'error/200'
        'error-300': '#fda29b', // 'error/300'
        'error-400': '#f97066', // 'error/400'
        'error-500': '#f04438', // 'error/500'
        'error-600': 'var(--v-theme-error)', // 'error/600'
        'error-700': '#b42318', // 'error/700'
        'error-800': '#912018', // 'error/800'
        'error-900': '#7a271a', // 'error/900'

        'warning-25': '#fffcf5', // warning/25
        'warning-50': '#fffaeb', // warning/50
        'warning-100': '#fef0c7', // warning/100
        'warning-200': '#fedf89', // warning/200
        'warning-300': '#fec84b', // warning/300
        'warning-400': '#fdb022', // warning/400
        'warning-500': '#f79009', // warning/500
        'warning-600': 'var(--v-theme-warning)', // warning/600
        'warning-700': '#b54708', // warning/700
        'warning-800': '#93370d', // warning/800
        'warning-900': '#7a2e0e', // warning/900

        'success-25': '#f6fef9', // success/25
        'success-50': '#ecfdf3', // success/50
        'success-100': '#d1fadf', // success/100
        'success-200': '#a6f4c5', // success/200
        'success-300': '#6ce9a6', // success/300
        'success-400': '#32d583', // success/400
        'success-500': '#12b76a', // success/500
        'success-600': 'var(--v-theme-success)', // success/600
        'success-700': '#027a48', // success/700
        'success-800': '#05603a', // success/800
        'success-900': '#054f31', // success/900

        'purple-25': '#', // purple/25
        'purple-50': '#', // purple/50
        'purple-100': '#', // purple/100
        'purple-200': '#', // purple/200
        'purple-300': '#', // purple/300
        'purple-400': '#', // purple/400
        'purple-500': '#', // purple/500
        'purple-600': '#6938ef', // purple/600
        'purple-700': '#', // purple/700
        'purple-800': '#', // purple/800
        'purple-900': '#', // purple/900

        'orange-25': '#', // orange/25
        'orange-50': '#', // orange/50
        'orange-100': '#', // orange/100
        'orange-200': '#', // orange/200
        'orange-300': '#', // orange/300
        'orange-400': '#', // orange/400
        'orange-500': '#', // orange/500
        'orange-600': '#ec4a0a', // orange/600
        'orange-700': '#', // orange/700
        'orange-800': '#', // orange/800
        'orange-900': '#', // orange/900

        'pink-25': '#', // pink/25
        'pink-50': '#fdf2fa', // pink/50
        'pink-100': '#', // pink/100
        'pink-200': '#', // pink/200
        'pink-300': '#', // pink/300
        'pink-400': '#', // pink/400
        'pink-500': '#', // pink/500
        'pink-600': '#', // pink/600
        'pink-700': '#', // pink/700
        'pink-800': '#', // pink/800
        'pink-900': '#', // pink/900
        // 'border-opacity': '0.5',

        'color-text': 'rgb(--v-secondary)',
      },

    },
    dark: {
      dark: true,
      colors: {
        'primary': localStorage.getItem(`${themeConfig.app.title}-darkThemePrimaryColor`) || '#7367F0',
        'on-primary': '#fff',
        'secondary': '#A8AAAE',
        'on-secondary': '#fff',
        'success': '#28C76F',
        'on-success': '#fff',
        'info': '#00CFE8',
        'on-info': '#fff',
        'warning': '#FF9F43',
        'on-warning': '#fff',
        'error': '#EA5455',
        'background': '#25293C',
        'on-background': '#CFD3EC',
        'surface': '#2F3349',
        'on-surface': '#CFD3EC',
        'a50': '#26293A',
        'a100': '#2F3349',
        'a200': '#26293A',
        'grey-300': '#4A5072',
        'grey-400': '#5E6692',
        'grey-500': '#7983BB',
        'grey-600': '#AAB3DE',
        'grey-700': '#B6BEE3',
        'grey-800': '#CFD3EC',
        'grey-900': '#E7E9F6',
        'perfect-scrollbar-thumb': '#4A5072',
      },
      variables: {
        'border-color': '#CFD3EC',
        'medium-emphasis-opacity': 0.68,

        // Shadows
        'shadow-key-umbra-opacity': 'rgba(15, 20, 34, 0.08)',
        'shadow-key-penumbra-opacity': 'rgba(15, 20, 34, 0.12)',
        'shadow-key-ambient-opacity': 'rgba(15, 20, 34, 0.04)',
      },
    },
  },
}

export default theme
