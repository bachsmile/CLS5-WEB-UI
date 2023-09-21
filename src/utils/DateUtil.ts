import moment from 'moment'

export default class DateUtil {
  /**
   * @name: get message error
   * @param str
   * @return {string}
   */
  static getDate = (serial: any) => {
    if (serial === null)
      return null
    if (serial.toString().includes('/'))
      return serial
    let dateInfo = null

    // const date = new Date(Date.parse(serial))
    // const isoDateStr = date.toISOString()

    if (isNaN(serial)) {
      dateInfo = new Date(serial)
    }
    else {
      const utcDays = Math.floor(serial - 25569)
      const utcValue = utcDays * 86400

      dateInfo = new Date(utcValue * 1000)
    }
    if (Object.prototype.toString.call(dateInfo) === '[object Date]') {
      if (isNaN(dateInfo.getTime()))
        return serial

      return `${dateInfo.getDate()}/${dateInfo.getMonth() + 1}/${dateInfo.getFullYear()}`
    }

    return serial
  }

  // format date to DD/MM/YYYY
  static formatDateToDDMM = (value: any, type = '/') => {
    if (!value)
      return ''
    return moment(String(value)).format(`DD${type}MM${type}YYYY`)
  }

  static formatTimeToHHmm = (value: any) => {
    if (value)
      return moment(String(value)).format('HH:mm')

    return '-'
  }

  static formatSecond = (seconds: any, location?: 'vi') => {
    seconds = Math.round(seconds)
    if (seconds === null || seconds === undefined)
      return '-'
    if (seconds >= 3600) {
      const hour = Math.floor(seconds / 3600)
      const minute = Math.floor((seconds % 3600) / 60)
      const second = seconds - (hour * 3600 + minute * 60)

      return location === 'vi'
        ? second === 0 ? `${hour} giờ ${minute} phút` : `${hour} giờ ${minute} phút ${second} giây`
        : second === 0 ? `${hour}h${minute}m` : `${hour}h${minute}m${second}s`
    }
    if (seconds >= 60 && seconds < 3600) {
      const minute = Math.floor(seconds / 60)
      const second = seconds - (minute * 60)
      return location === 'vi'
        ? second === 0 ? `${minute} phút` : `${minute} phút ${second} giây`
        : second === 0 ? `${minute}m` : `${minute}m${second}s`
    }
    if (seconds < 60 && seconds >= 0) {
      return location === 'vi'
        ? `${seconds} giây`
        : `${seconds}s`
    }
    return 0
  }

  static formatTimeSecondToCustom = (seconds: any, type?: any) => {
    let time
    if (!seconds)
      return '00:00'
    switch (type) {
      case 'mm:ss':
        time = new Date(seconds * 1000).toISOString().substring(14, 19)
        break
      case 'hh:mm':
        time = new Date(seconds * 1000).toISOString().substring(11, 16)
        break

      default:
        time = new Date(seconds * 1000).toISOString().substring(seconds < 3600 ? 14 : 11, 19)
        break
    }
    return time
  }

  static timeRating = (value: any, t: any) => {
    const date: any = new Date(value)
    const currentDate: any = new Date()
    const timeDifference = currentDate - date

    const secondsDifference = Math.floor(timeDifference / 1000)
    const minutesDifference = Math.floor(secondsDifference / 60)
    const hoursDifference = Math.floor(minutesDifference / 60)
    if (secondsDifference === 0)
      return t('just-a-moment')
    if (secondsDifference < 60)
      return `${secondsDifference} ${t('ago-second')}`

    else if (minutesDifference < 60)
      return `${minutesDifference} ${t('ago-minute')}`

    else if (hoursDifference < 24)
      return `${hoursDifference} ${t('ago-hours')}`

    else
      return date.toLocaleString() // Nếu hơn 24 giờ, hiển thị ngày và giờ đầy đủ
  }
}
