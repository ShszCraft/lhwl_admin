import Vue from 'vue'
import Router from 'vue-router'
import adminIndex from '@/page/admin/index'

import goodsInit from '@/page/admin/goods/init'
import goodsIndex from '@/page/admin/goods/index'

import goodsCreateInit from '@/page/admin/goods/create/init'
import goodsCreateAdded from '@/page/admin/goods/create/added'
import goodsCreateSetMeal from '../page/admin/goods/create/setmeal'
import goodsCreateAddInfo from '@/page/admin/goods/create/addinfo'
import goodsCreateStock from '../page/admin/goods/create/stock'
import goodsCreateSeo from '../page/admin/goods/create/setseo'
import goodsCreateSuccess from '@/page/admin/goods/create/success'



import goodsImport from '@/page/admin/goods/import'

import orderInit from '@/page/admin/order/init'
import orderLatest from '../page/admin/order/latest'
import orderCompleted from '../page/admin/order/completed'

import userInit from '@/page/admin/user/init'

import authInit from '@/page/auth/init'
import authLogin from '@/page/auth/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      /* 重定向商品管理页面
       * path: /goods/index */
      path: '/',
      redirect: {
        name: 'admin:goods:index'
      }
    },
    {
      /* 重定向商品管理页面
       * path: /goods/index */
      path: '/goods',
      redirect: {
        name: 'admin:goods:index'
      }
    },
    {
      /* 后台 */
      path: '/',
      components: {
        default: adminIndex
      },
      children: [
        {
          /* 商品 */
          path: '/goods',
          components: {
            default: adminIndex,
            admin_index: goodsInit
          },
          children: [
            {
              /* 商品管理首页视图 */
              path: '/goods/index',
              name: 'admin:goods:index',
              components: {
                admin_index: goodsInit,
                goods: goodsIndex
              }
            },
            {
              /* 重定向商品创建页面
               * path: /goods/create */
              path: '/goods/create',
              redirect: {
                name: 'admin:goods:create:add'
              }
            },
            {
              /* 添加商品视图 */
              path: '/goods/create',
              name: 'admin:goods:create',
              components: {
                admin_index: goodsInit,
                goods: goodsCreateInit
              },
              children: [
                {
                  path: '/goods/create/add',
                  name: 'admin:goods:create:add',
                  components: {
                    goods: goodsCreateInit,
                    goods_init: goodsCreateAdded
                  }
                },
                {
                  path: '/goods/create/meal',
                  name: 'admin:goods:create:setmeal',
                  components: {
                    goods: goodsCreateInit,
                    goods_init: goodsCreateSetMeal
                  }
                },
                {
                  path: '/goods/create/stock',
                  name: 'admin:goods:create:stock',
                  components: {
                    goods: goodsCreateInit,
                    goods_init: goodsCreateStock
                  }
                },
                {
                  path: '/goods/create/seo',
                  name: 'admin:goods:create:seo',
                  components: {
                    goods: goodsCreateInit,
                    goods_init: goodsCreateSeo
                  }
                },
                {
                  path: '/goods/create/addinfo',
                  name: 'admin:goods:create:addinfo',
                  components: {
                    goods: goodsCreateInit,
                    goods_init: goodsCreateAddInfo
                  }
                },
                {
                  path: '/goods/create/success',
                  name: 'admin:goods:create:success',
                  components: {
                    goods: goodsCreateInit,
                    goods_init: goodsCreateSuccess
                  }
                }
              ]
            },
            {
              /* 商品导入视图 */
              path: '/goods/import',
              name: 'admin:goods:import',
              components: {
                default: goodsInit,
                goods: goodsImport
              }
            }
          ]
        },
        {
          /* 订单 */
          path: '/order',
          components: {
            default: adminIndex,
            admin_index: orderInit
          },
          children: [
            {
              path: '/order/latest',
              name: 'admin:order:latest',
              components: {
                admin_index: orderInit,
                goods: orderLatest
              },
            },
            {
              path: '/order/completed',
              name: 'admin:order:completed',
              components: {
                admin_index: orderInit,
                goods: orderCompleted
              },
            }
          ]
        },
        {
          /* 用户 */
          path: '/user',
          name: 'admin:user',
          components: {
            default: adminIndex,
            admin_index: userInit
          }
        }
      ]
    },
    {
      path: '/auth',
      components: {
        default: authInit
      },
      children: [
        {
          path: '/auth/login',
          name: 'auth:login',
          components: {
            auth_init: authLogin
          },
        }
      ]
    }
    // {path: '*', component: NotFoundComponent}
  ]
})
