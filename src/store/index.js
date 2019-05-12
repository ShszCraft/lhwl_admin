import Vue from 'vue';
import Vuex from 'vuex';
import auth from './module/auth'
import goods from './module/goods'
import order from './module/order'


// 需要注册vuex到vue中
Vue.use(Vuex);

// 使用 es6 语法把vuex的实例对象输出
export default new Vuex.Store({
  state: {
    admin: {
      index: {
        progress: {
          index: 1,
          progressValue: 0,
          maxIndex: 4,
          label: '填写商品信息',
          variant: 'info',
          valueLabel: [
            {
              name: '填写商品信息',
              variant: 'info',
              bottom: {
                name: '第一步',
                to: {
                  name: 'admin:goods:create:add'
                }
              }
            },
            {
              name: '商品参数设置',
              variant: 'info',
              bottom: {
                name: '第二步',
                to: {
                  name: 'admin:goods:create:addinfo'
                }
              }


            },
            {
              name: '完成',
              variant: 'success',
              bottom: {
                name: '完成',
                to: {name: 'admin:goods:create:success'}
              }
            },
            {
              name: null,
              variant: null,
              bottom: {
                name: '完成',
                to: {name: 'admin:goods:index'}
              }
            }
          ]
        }
      },
    },
  },
  modules: {
    goods,
    auth,
    order
  }
})



