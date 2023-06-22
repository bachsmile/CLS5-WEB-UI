import { defineStore } from 'pinia'
import * as yup from 'yup'
import { Field, FieldArray, Form, useField, useForm } from 'vee-validate'
import RegExps from '@/constant/RegExps'

export const validatorStore = defineStore('validator', () => {
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

  const CONFIG = Object.freeze({
    DEFAULT_FIELD: {
      MAX: 50,
    },
    DEFAULT_STRING: {
      MAX: 255,
    },
    DEFAULT_ARIA: {
      MAX: 2000,
    },
    DEFAULT_NUMBER: {
      MAX_VALUE: 10000,
      MIN_VALUE: 0,
    },
    DEFAULT_NUMBER_PRICE: {
      MAX_VALUE: 1000000000000,
      MIN_VALUE: 0,
    },
    DEFAULT_NUMBER_100: {
      MAX_VALUE: 100,
      MIN_VALUE: 0,
    },
    DEFAULT_NUMBER_RATIO: {
      MAX_VALUE: 100,
      MIN_VALUE: 0,
    },
    DEFAULT_SELECT_SINGLE: {
      FIELD: t(''),
      MIN: 0,
    },
    DEFAULT_SELECT_LIST: {
      FIELD: t('user-role'),
      MIN: 0,
    },
    CODE: {
      FIELD: t('common.code'),
      MAX: 50,
    },
    LAST_NAME: {
      FIELD: t('common.surname'),
      MAX: 50,
      MIN: 2,
    },
    FIRST_NAME: {
      FIELD: t('common.name'),
      MAX: 50,
    },
    EMAIL: {
      FIELD: t('common.email'),
      MAX: 255,
    },
    USERNAME: {
      FIELD: t('common.sign-name'),
      MAX: 255,
      MIN: 3,
    },
    PASSWORD: {
      FIELD: t('password'),
      MAX: 255,
      MIN: 3,
    },
    USER_CODE: {
      FIELD: t('common.employee-code'),
      MAX: 50,
    },
    PHONE_NUMBER: {
      FIELD: t('common.phone-number'),
      MAX: 20,
    },
    USER_TYPE: {
      FIELD: t('user-role'),
      MIN: 1,
    },
    STATUS: {
      FIELD: t('status-name'),
      MIN: 1,
    },
  })

  const TEXT = Object.freeze({
    FIELD: 'Trường này',
  })

  const ruleMessage = reactive({
    required: (field?: any) => `Vui lòng nhập dữ liệu ${field || ''}`,
    min: (min: any, field?: any) => `${field || TEXT.FIELD} phải chứa ít nhất ${min} ký tự`,
    minValue: (min: any, field?: any) => `${field || TEXT.FIELD} không được nhỏ hơn ${min}`,
    max: (max: any, field?: any) => `${field || TEXT.FIELD} chỉ chứa tối đa ${max} ký tự`,
    maxValue: (max: any, field?: any) => `${field || TEXT.FIELD} không được lớn hơn ${max}`,
    password: (field?: any) => `${field || TEXT.FIELD} phải chứa ít nhất một chữ cái viết thường, một chữ in hoa, một số và một ký tự đặc biệt`,
    typeNumber: 'Vui lòng nhập một số.',
    typeString: 'Vui lòng nhập chuỗi.',
    typeArray: 'Vui lòng lựa chọn.',
    typeOption: 'Vui lòng lựa chọn.',
    positive: 'Vui lòng nhập số dương.',
    numberMin: 'Vui lòng nhập số lớn hơn 0.',
    email: 'Định dạng email không hợp lệ.',
    file: 'Vui lòng chọn tệp đính kèm',
    url: 'Định dạng url không hợp lệ.',
    username: 'Tên đăng nhập không hợp lệ, cho phép tiếng việt không dấu và các ký tự đặc biệt -_.@ không liên tiếp',
    requiredOption: (field?: any) => `${field || ''} phải chứa ít nhất một lựa chọn`,
  })

  const getRulePassword = () => {
    if (window
      && window.location
      && ['daotaotlg.cls.vn', 'winedu.com.vn'].includes(window.location.hostname)
    ) {
      return yup.string()
        .required(ruleMessage.required())
        .min(8, ruleMessage.min(8, CONFIG.PASSWORD.FIELD))
        .matches(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          ruleMessage.password(CONFIG.PASSWORD.FIELD),
        )
    }

    return yup.string().required(ruleMessage.required()).min(6, ruleMessage.min(6, CONFIG.PASSWORD.FIELD))
  }

  const schemaOption = reactive({
    defaultField: yup.string().max(CONFIG.DEFAULT_FIELD.MAX, ruleMessage.max(CONFIG.DEFAULT_FIELD.MAX)),
    defaultString: yup.string().required(ruleMessage.required()).max(CONFIG.DEFAULT_STRING.MAX, ruleMessage.max(CONFIG.DEFAULT_STRING.MAX)),
    defaultFile: yup.string().required(ruleMessage.file),
    defaultStringArea: yup.string().required(ruleMessage.required()).max(CONFIG.DEFAULT_ARIA.MAX, ruleMessage.max(CONFIG.DEFAULT_ARIA.MAX)),
    defaultNumber: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.positive, (value: any) => value >= 0).nullable().required(ruleMessage.required()).max(CONFIG.DEFAULT_NUMBER.MAX_VALUE, ruleMessage.max(CONFIG.DEFAULT_NUMBER.MAX_VALUE)),
    defaultNumberPrice: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.positive, (value: any) => value >= 0).nullable().required(ruleMessage.required()).max(CONFIG.DEFAULT_NUMBER_PRICE.MAX_VALUE, ruleMessage.max(CONFIG.DEFAULT_NUMBER_PRICE.MAX_VALUE)),
    defaultSelectSingle: yup.number().typeError(ruleMessage.typeOption).required(ruleMessage.required()),
    defaultSelectList: yup.array().of(yup.number()).min(1, ruleMessage.typeArray).required(ruleMessage.required()),
    defaultSelectObject: yup.object().required(ruleMessage.required()),
    defaultNumberRatio: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.positive, (value: any) => value >= 0).nullable().required(ruleMessage.required()).max(CONFIG.DEFAULT_NUMBER_RATIO.MAX_VALUE, ruleMessage.maxValue(CONFIG.DEFAULT_NUMBER_RATIO.MAX_VALUE)).min(CONFIG.DEFAULT_NUMBER_RATIO.MIN_VALUE, ruleMessage.minValue(CONFIG.DEFAULT_NUMBER_RATIO.MAX_VALUE)),
    defaultNumberYub: yup.number(),
    defaultNumber100Yub: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.positive, (value: any) => value >= 0).nullable().required(ruleMessage.required()).max(CONFIG.DEFAULT_NUMBER_100.MAX_VALUE, ruleMessage.maxValue(CONFIG.DEFAULT_NUMBER_100.MAX_VALUE)),
    defaultNumber100YubNoRequire: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.positive, (value: any) => value >= 0).nullable().max(CONFIG.DEFAULT_NUMBER_100.MAX_VALUE, ruleMessage.maxValue(CONFIG.DEFAULT_NUMBER_100.MAX_VALUE)),
    defaultNumber100Not0YubNoRequire: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.numberMin, (value: any) => value > 0 || value === null).nullable().max(CONFIG.DEFAULT_NUMBER_100.MAX_VALUE, ruleMessage.maxValue(CONFIG.DEFAULT_NUMBER_100.MAX_VALUE)),
    defaultNumberNot0: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.numberMin, (value: any) => value > 0).nullable().required(ruleMessage.required()).max(CONFIG.DEFAULT_NUMBER.MAX_VALUE, ruleMessage.max(CONFIG.DEFAULT_NUMBER.MAX_VALUE)),
    defaultNumberTime: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.numberMin, (value: any) => {
      console.log(value)
      return Number(value) >= 0
    }).max(59, ruleMessage.maxValue(59)),
    requiredString: (field?: any) => yup.string().required(ruleMessage.required(field)).max(CONFIG.DEFAULT_STRING.MAX, ruleMessage.max(CONFIG.DEFAULT_STRING.MAX)),
    code: yup.string().max(CONFIG.CODE.MAX, ruleMessage.max(CONFIG.CODE.MAX)).nullable(),
    require: yup.string().required(ruleMessage.required()),
    lastName: yup.string().required(ruleMessage.required())
      .max(CONFIG.LAST_NAME.MAX, ruleMessage.max(CONFIG.LAST_NAME.MAX, CONFIG.LAST_NAME.FIELD)),
    firstName: yup.string().required(ruleMessage.required())
      .max(CONFIG.FIRST_NAME.MAX, ruleMessage.max(CONFIG.FIRST_NAME.MAX, CONFIG.FIRST_NAME.FIELD)),
    email: yup.string().email(ruleMessage.email).required(ruleMessage.required())
      .max(CONFIG.EMAIL.MAX, ruleMessage.max(CONFIG.EMAIL.MAX, CONFIG.EMAIL.FIELD)),
    userName: yup.string().required(ruleMessage.required())
      .max(CONFIG.USERNAME.MAX, ruleMessage.max(CONFIG.USERNAME.MAX, CONFIG.USERNAME.FIELD))
      .min(CONFIG.USERNAME.MIN, ruleMessage.min(CONFIG.USERNAME.MIN, CONFIG.USERNAME.FIELD))
      .matches(RegExps.username, ruleMessage.username),
    password: getRulePassword(),
    userCode: yup.string().required(ruleMessage.required())
      .max(CONFIG.USER_CODE.MAX, ruleMessage.max(CONFIG.USER_CODE.MAX, CONFIG.USER_CODE.FIELD)),
    phoneNumber: yup.string().nullable().max(CONFIG.PHONE_NUMBER.MAX, ruleMessage.max(CONFIG.PHONE_NUMBER.MAX, CONFIG.PHONE_NUMBER.FIELD)),
    kpiLearn: yup.number().typeError(ruleMessage.typeNumber).nullable().positive(ruleMessage.positive),
    kpiTeach: yup.number().typeError(ruleMessage.typeNumber).nullable().positive(ruleMessage.positive),
    userTypeId: yup.array().typeError(ruleMessage.typeOption).min(CONFIG.USER_TYPE.MIN, ruleMessage.requiredOption(CONFIG.USER_TYPE.FIELD)).required(ruleMessage.required()),
    userTypeIdSingle: yup.number().typeError(ruleMessage.typeOption).required(ruleMessage.required()),
    statusId: yup.array().typeError(ruleMessage.typeOption).required(ruleMessage.required()).min(CONFIG.STATUS.MIN, ruleMessage.requiredOption(CONFIG.STATUS.FIELD)),
    statusIdSingle: yup.number().typeError(ruleMessage.typeOption).required(ruleMessage.required()),
    linkUrl: yup.string().required(ruleMessage.required()).max(CONFIG.DEFAULT_STRING.MAX, ruleMessage.max(CONFIG.DEFAULT_STRING.MAX)).matches(RegExps.urlApiUser, ruleMessage.url),
  })

  return { schemaOption, ruleMessage, Field, FieldArray, Form, useField, useForm, yup }
})
