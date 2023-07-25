<script setup lang="ts">
import Fingerprint2 from 'fingerprintjs2'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { requiredValidator } from '@validators'
import jwtDefaultConfig from '@/auth/jwtDefaultConfig'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import systemService from '@/api/system-service/index'
import MethodsUtil from '@/utils/MethodsUtil'
import AuthUtil from '@/auth'
import authV2LoginIllustrationBorderedDark from '@/assets/images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@/assets/images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@/assets/images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@/assets/images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@/assets/images/pages/misc-mask-dark.png'
import authV2MaskLight from '@/assets/images/pages/misc-mask-light.png'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const router = useRouter()

const isPasswordVisible = ref(false)

const email = ref('sinhtv')
const password = ref('123123')
const rememberMe = ref(false)
const captcha = ref({})
const deviceUUID = ref()

function handleLogin() {
  const userData = {
    email: email.value,
    password: password.value,
    captcha: '',
    remember: rememberMe.value,
    uuid: deviceUUID.value,
  }

  AuthUtil.login(userData)
    .then((res: any) => {
      handleAfterLogin(res)
    })

    .catch((error: any) => {
      const err = error?.response?.data

      // this.$hideLoading()
      if (err?.message) {
        //
      }
    })
}

function handleAfterLogin(response: any) {
  // this.$hideLoading()
  if (response?.code === 200) {
    if (response.data?.securityCode) {
      router.push({ name: 'auth-reset-password', params: { id: response.data.securityCode } })

      return
    }
    const userData = response.data.userProfile

    AuthUtil.setToken(response.data.accessToken)
    AuthUtil.setRefreshToken(response.data.refreshToken)

    const userProfile = {
      id: userData.id,
      fullName: MethodsUtil.formatFullName(userData.firstName, userData.lastName),
      firstName: userData.firstName,
      lastName: userData.lastName,
      userName: userData.userName,
      avatar: userData.avatar,
      role: 'admin',
      ability: [{ action: 'manage', subject: 'all' }],
      roles: userData.roles,
      logo: response.data.logo,
      smallLogo: response.data.icon,
      languageCode: userData.languageCode,
    }

    localStorage.setItem(jwtDefaultConfig.userData, JSON.stringify(userProfile))

    // this.$store.commit('app/UPDATE_USERDATA', userProfile)
    // this.$ability.update([{ action: 'manage', subject: 'all' }])

    // lưu danh sách phân quyền
    // store.commit('app/UPDATE_PERMISSION', parseJwt(response.data.accessToken))
    if (userData.roles.length > 0)
      localStorage.setItem(jwtDefaultConfig.role, userData.roles[0].name)

    // this.requestPermissionNotifications()
    // this.$store.dispatch(`${CONNECTION_MODULE_STORE}/updateLoginConnection`)
    // this.$store.dispatch(`${CONNECTION_MODULE_STORE}/getGeneralNotificationSetting`)

    const urlParams = new URLSearchParams(window.location.search)
    if (['casperlms.cls.vn', 'stavian.cls.vn', 'daotaoyody.cls.vn'].includes(window.location.hostname)) {
      window.axios.get(`${systemService.GetListWidget}`)
        .then((data: any) => {
          if (data?.data?.length > 0) {
            router.push({ name: 'home-page' })
          }
          else {
            router.push(urlParams.has('redirect') ? urlParams.get('redirect') : getHomeRouteForLoggedInUser(userData.roles))
              .finally(() => {
                //
              })
          }
        }).catch(() => {
          router.push(urlParams.has('redirect') ? urlParams.get('redirect') : getHomeRouteForLoggedInUser(userData.roles))
            .finally(() => {
              //
            })
        })
    }
    else {
      router.push({ name: 'admin-organization-users' })

      // router.push(urlParams.has('redirect') ? urlParams.get('redirect') : getHomeRouteForLoggedInUser(userData.roles))
        .then(() => {
          //
        })
        .catch(() => {
          // this.$refs.loginForm.setErrors(error.response.data.error)
        })
    }
  }
  else if (response.errors !== null) {
    // response.errors.forEach((element: any) => {
    //   if (captcha)
    //     captcha.reset()

    //   switch (element.location) {
    //     case 'Password':
    //       this.$refs.password.setErrors([this.$t(element.message)])
    //       break
    //     case 'Email':
    //       this.$refs.userName.setErrors([this.$t(element.message)])
    //       break
    //     case 'Captcha':
    //       if (!captcha && window) {
    //         captcha.value = window.captcha

    //         const captchaElement = document.getElementById('recaptcha-element')
    //         if (captcha && captcha.render && captchaElement) {
    //           captcha.render(captchaElement, {
    //             sitekey: '6LcShtwhAAAAAP6CApkGjB3ZUzpLwCTsu1W_S0p_',

    //             // // eslint-disable-next-line no-undef
    //             // if (grecaptcha) {
    //             //   if (!this.captcha) {
    //             //     // eslint-disable-next-line no-undef
    //             //     this.captcha = grecaptcha
    //             //     this.captcha.ready(() => {
    //             //       this.captcha.execute('6LefuYciAAAAAFFZYo76FgG8n2mrgnfPIXmPCKfv', { action: 'submit' }).then(token => {
    //             //         this.captchaToken = token
    //             //       })
    //           })
    //         }

    //         // this.captcha.execute('6LefuYciAAAAAFFZYo76FgG8n2mrgnfPIXmPCKfv', { action: 'submit' }).then(token => {
    //         //   this.captchaToken = token
    //         // })
    //       }
    //       else {
    //         console.log(element.message)

    //         // this.$bvToast.toast(this.$t(element.message), {
    //         //   title: this.$t('common.notification'),
    //         //   variant: 'danger',
    //         //   toaster: this.$toastPosition,
    //         //   solid: true,
    //         // })
    //       }
    //       break
    //     default:
    //       break
    //   }
    // })
  }
  else {

    // this.$bvToast.toast(this.$t(response.message), {
    //   title: this.$t('common.notification'), variant: 'danger', toaster: this.$toastPosition, solid: true,
    // })
  }
}

function getDeviceUUID(): Promise<string> {
  return new Promise(resolve => {
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        Fingerprint2.get(components => {
          const values = components.map(component => component.value)
          const fingerprint = Fingerprint2.x64hash128(values.join(''), 31)
          resolve(fingerprint)
        })
      })
    }
    else {
      setTimeout(() => {
        Fingerprint2.get(components => {
          const values = components.map(component => component.value)
          const fingerprint = Fingerprint2.x64hash128(values.join(''), 31)
          resolve(fingerprint)
        })
      }, 500)
    }
  })
}
getDeviceUUID().then(uuid => {
  deviceUUID.value = uuid
})
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 font-weight-semibold mb-1">
            Welcome to {{ themeConfig.app.title }}! 👋🏻
          </h5>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <!--
          <VCardText>
          <VAlert
          color="primary"
          variant="tonal"
          >
          <p class="text-caption mb-2">
          Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
          </p>
          <p class="text-caption mb-0">
          Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
          </p>
          </VAlert>
          </VCardText>
        -->
        <VCardText>
          <VForm @submit.prevent="handleLogin">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Tên đăng nhập"
                  type="text"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <a
                  class="text-primary ms-2"
                  href="#"
                >
                  Create an account
                </a>
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
