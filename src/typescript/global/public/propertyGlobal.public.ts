import { isEmpty } from './../../../@core/utils/index';
import axios from '@axios';
import _ from 'lodash';
import { Ref } from "vue";
import { useI18n } from 'vue-i18n';
import type { typeLoading } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

//Cài đặt cố định
declare global {
  interface Window extends propertyGlobal {
    //định nghĩa các property custom ở window
  }
}

// Khai báo các biến dùng global
interface propertyGlobal {
  //reactive
  reactive1?: number,
  reactive2?: Ref<string>,
  token?: Ref<string>,
  //const
  _?: _.LoDashStatic,
  i18n?: any,
  axios?: any,
  requestApiCustom?: any,
  getErrorsMessage?: any,
  showAllPageLoading?: any,
  hideAllPageLoading?: any,
  TYPE_REQUEST?: any,
  formatFullName?: any,
  SERVER_FILE?: string,
  userData?: any,
}


const showAllPageLoading = (type:  typeof typeLoading[number] =null)=> {
  const htmlLoading =  document.getElementById('loading-bg')
  if(htmlLoading){
    switch (type) {
      case 'FULL':
        htmlLoading?.style.setProperty("z-index", "9999", "important");
        htmlLoading?.style.setProperty("opacity", "1", "important");
        break;
      case 'FULL-OPACITY':
        htmlLoading?.style.setProperty("z-index", "9999", "important");
        htmlLoading?.style.setProperty("opacity", "0.8", "important");
        break;
      case 'COMPONENT':
        htmlLoading?.style.setProperty("z-index", "999", "important");
        htmlLoading?.style.setProperty("opacity", "1", "important");
        break;
    
      default:
        htmlLoading?.style.setProperty("z-index", "999", "important");
        htmlLoading?.style.setProperty("opacity", "0.8", "important");
        break;
      }
    htmlLoading.style.setProperty("display", "block", "important");
  }
}
const hideAllPageLoading = ()=> {
  const htmlLoading =  document.getElementById('loading-bg')
  
  if(htmlLoading){
   setTimeout(() => {
    htmlLoading.style.setProperty("display", "none", "important");
   }, 1000);
  }
}
//Định nghĩa biến toàn cục (reactvie) có thể thay đổi dữ liệu
const windowDefineReactiveProperty = (app: any)=> {
  const global: propertyGlobal = {
    reactive1: 555, // biến không phản ứng
    reactive2: ref('react'), // khai báo ref để biến có thể phản ứng
    token: ref(''), 
    TYPE_REQUEST: TYPE_REQUEST,

    // method global
    requestApiCustom: MethodsUtil.requestApiCustom,
    getErrorsMessage: MethodsUtil.getErrorsMessage,
  }
  defineProperty(global, 'react')
}
//Định nghĩa biến toàn cục (const) không thể thay đổi dữ liệu
const windowDefineConstProperty = ()=> {
  const global: propertyGlobal = {
    _: _,
    i18n: useI18n,
    axios: axios,
    showAllPageLoading,
    hideAllPageLoading,
    SERVER_FILE: process.env.VUE_APP_BASE_SERVER_FILE,
  }
  defineProperty(global, 'const')
}

//xử lý việc có được phép thay đổi global
const defineProperty = (property: object, type: string) => {
  //register global
  _.forEach(property, (valueProperty: any, key: any)=> {
    window[key] = valueProperty
    Object.defineProperty(window, key, {
      value: valueProperty,
      writable: type === 'react'
    });
  })
}

// đăng ký với app
const windowDefineProperty=(app: any)=> {
  windowDefineReactiveProperty(app)
  windowDefineConstProperty()
}

export default windowDefineProperty
