import axios from '@/axios'
import Cookiesx from '../../utils/Cookie'

const autherization = Cookiesx.getCookieAutherization()
const token = autherization.token
const user = autherization.username
let verify = false
if (token && user) verify = true

console.log('token', user, token)

export default {
  /* 在state中去声明全局变量，可以通过 this.$store.state 访问 */
  state: {
    user: {
      token: token,
      username: user,
    },
    message: {
      error: {
        defaults: false,
        message: null
      }
    },
    // true 以登录， false 未登录
    isLogin: verify
  },
  /* 只能执行同步方法，不要去执行异步方法 通过 this.$store.commit 方法去调用 */
  mutations: {
    authTokenJwt: function (state, user) {
      state.user = user;
      state.isLogin = true;
    },
    logoutAccount: function (state) {
      console.log('logoutAccount');
      Cookiesx.clearCookieAutherization()
      state.user = {
        token: null,
        username: null,
      };
      state.isLogin = false;
    },
    setMessage: function (state, def) {
      state.message.error = def;
    },

  },
  /* 借助actions的手去 执行 mutations ， 通过  this.$store.dispatch 的方式调用 */
  /* 可以用来执行异步操作，可以跟踪异步数据状态变化 */
  actions: {
    authTokenJwt: function (context, user) {
      axios.AuthTokenJwt(user.username, user.password)
        .then((response) => {
          if (response.status === 400 && response.statusText === "Bad Request") {
            if (response.data.non_field_errors[0] === "无法使用提供的认证信息登录。") {
              context.commit('setMessage', {
                defaults: true,
                message: '用户名或密码错误'
              });
            } else {
              // console.log('用户名或密码未知错误', response.data);
              context.commit('setMessage', {
                defaults: true,
                message: '用户名或密码未知错误'
              });
            }
          } else if (response.status === 200 && response.statusText === "OK") {
            context.commit('authTokenJwt', {
              token: response.data.token,
              username: response.data.user.username,
            });
            context.commit('setMessage', {
              defaults: false,
              message: null
            })
          } else {
            // console.log('未知错误', response.data);
            context.commit('setMessage', {
              defaults: true,
              message: '未知错误: ' + response.data
            });
          }
        })
        .catch((res) => {
          console.log('ERROR', res)
        });
      console.log('authTokenJwt')
    }
  },
  /* 在getters中声明state中变量的计算函数，缓存计算后的数据， 通过 this.$store.getters 调用 */
  getters: {
    getIsLogin: function (state) {
      return state.isLogin
    },
    getDefault: function (state) {
      return state.message.error.defaults
    },
    getMessage: function (state) {
      return state.message.error.message
    },
    getToken: function (state) {
      return state.user.token
    },
    getUser: function (state) {
      return state.user.username
    }
  }
};
