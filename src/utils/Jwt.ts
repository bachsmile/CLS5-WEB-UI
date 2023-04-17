export default class StringJwt {
  static getRole = (roleString: any) => {
    const roleName = roleString || ''
    let role = null
    if (roleName === 'Role.Administrator')
      role = 1

    else if (roleName === 'Role.Teacher')
      role = 2

    else if (roleName === 'Role.Learner')
      role = 4

    return role
  }
}
