/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => !!(localStorage.getItem('userData') && localStorage.getItem('accessToken'))

export function getUserData() {
  const stringifiedUserData = localStorage.getItem('userData')

  return stringifiedUserData ? JSON.parse(stringifiedUserData) : null
}

/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
// export const getHomeRouteForLoggedInUser = (userRole: string) => {
//   if (userRole === 'admin')
//     return '/'
//   if (userRole === 'client')
//     return { name: 'access-control' }

//   return { name: 'login' }
// }

export function getHomeRouteForLoggedInUser(userRoles: any) {
  if (userRoles.length > 0)
    return { name: userRoles[0].router }

  // if (userRole === 'admin') return '/'
  // if (userRole === 'client') return { name: 'access-control' }
  return { name: 'auth-login' }
}

export function parseJwt(token: any) {
  const base64Url = token?.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''))

  return JSON.parse(jsonPayload)
}
