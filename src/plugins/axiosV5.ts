import axios from 'axios'
import AuthUtil from '@/auth'
import jwtDefaultConfig from '@/auth/jwtDefaultConfig'

const axiosIns = axios.create({
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
  baseURL: process.env.VUE_APP_BASE_V5_API,

  headers: {
    'Content-Type': 'application/json',
  },
})

const token = AuthUtil.getToken()
let isAlreadyFetchingAccessToken = false
let isWaitingRefreshToken = false
let subscribers: any = []

function refreshToken() {
  return axiosIns.post(jwtDefaultConfig.refreshEndpoint, { refreshToken: getRefreshToken() })
}

function getRefreshToken() {
  return localStorage.getItem(jwtDefaultConfig.storageRefreshTokenKeyName)
}
function onAccessTokenFetched(accessToken: string) {
  subscribers = subscribers.filter((callback: (accessToken: string) => any) => callback(accessToken))
}
function addSubscriber(callback: (accessToken: any) => void) {
  subscribers.push(callback)
}

axiosIns.interceptors.request.use(
  (config: any) => {
    if (token)
      config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error: any) => {
    // Do something with request error
    return Promise.reject(error)
  },
)

axiosIns.interceptors.response.use(
  (response: any) => {
    return {
      status: response.status,
      data: response.data,
    }
  },

  (error: any) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { config, response } = error
    const originalRequest = config

    // if (response && response.status === 401 && response.error.message === 'TokenLifetimeValidateFailed') {
    if (response && (response.status === 403 || response.status === 401)) {
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true
        isWaitingRefreshToken = true
        // eslint-disable-next-line promise/no-promise-in-callback
        refreshToken().then(r => {
          isWaitingRefreshToken = false
          isAlreadyFetchingAccessToken = false
          if (r.data.data.accessToken !== null) {
            // eventBus.$emit('refreshToken', true)

            // Update accessToken in localStorage
            AuthUtil.setToken(r.data.data.accessToken)
            AuthUtil.setRefreshToken(r.data.data.refreshToken)
            onAccessTokenFetched(r.data.data.accessToken)
          }
        }).catch(() => {
          isWaitingRefreshToken = false
          isAlreadyFetchingAccessToken = true
          localStorage.clear()
          window.location = `/login?redirect=${window.location.pathname}` as never
        })
      }
      else if (isWaitingRefreshToken === false) {
        isAlreadyFetchingAccessToken = true
        localStorage.clear()
        window.location = `/login?redirect=${window.location.pathname}` as never
      }

      return new Promise(resolve => {
        addSubscriber((accessToken: any) => {
          originalRequest.headers.Authorization = `${jwtDefaultConfig.tokenType} ${accessToken}`
          resolve(axiosIns(originalRequest))
        })
      })
    }

    // if (response && response.status === 401) {
    //   localStorage.clear()
    //   if (window.location.pathname !== '/login')
    //     window.location = `/login?redirect=${window.location.pathname}` as never
    // }
    // else if (response && response.status === 404) {
    //   // makeToast('Thông báo', response.statusText, 'danger')
    // }
    // else if (response && response.status === 403) {
    //   // window.location = '/not-authorized'
    // }
    return Promise.reject(error)
  },
)
export default axiosIns
