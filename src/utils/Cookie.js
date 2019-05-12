import Cookies from 'js-cookie'

export default {
  /* 获取Cookies中的JwtToken令牌 */
  getCookieAutherizationToken: function () {
    const t = Cookies.get('Token')
    if (t) return t
    return null
  },
  /* 获取Cookies中的JwtToken令牌 */
  getCookieAutherization: function () {
    const a = {}
    if (Cookies.get('pk')) a['pk'] = Cookies.get('pk')
    if (Cookies.get('Token')) a['token'] = Cookies.get('Token')
    if (Cookies.get('User')) a['username'] = Cookies.get('User')
    if (Cookies.get('usercode')) {
      a['usercode'] = Cookies.get('usercode')
    } else {
      a['usercode'] = null
    }
    return a
  },
  /* 获取Cookies中的Username用户名 */
  getCookieAutherizationUsername: function () {
    const u = Cookies.get('User')
    if (u) return u
    return null
  },
  /* 设置Cookies中的JwtToken令牌
   * @param {String} token JwtToken令牌
   * @param {String} username 用户名 为空默认null */
  setCookieAutherization: function (data) {
    Cookies.set('pk', data.pk)
    Cookies.set('Token', data.token)
    if (data.user) Cookies.set('User', data.user)
    if (data.usercode) Cookies.set('usercode', data.usercode)
  },
  /* 清除Cookies中的JwtToken令牌 */
  clearCookieAutherization: function () {
    Cookies.remove('pk')
    Cookies.remove('Token')
    Cookies.remove('User')
    Cookies.remove('usercode')
  }
}
