/*
 * @Time     : 2018/11/24 17:27
 * @Author   : Merrill
 * @Contact  : merrill@vdjango.com
 * @File     : goods.py
 * @Date     : 2018/11/24
 * @Software : IntelliJ IDEA
 * @Desc     :
 */

export default {
    /* 在state中去声明全局变量，可以通过 this.$store.state 访问 */
    state: {
        breadcrumb: null,
        active: 0,
        goodsId: null,
        switchs: true,
        statusDeparture: true
    },
    /* 只能执行同步方法，不要去执行异步方法 通过 this.$store.commit 方法去调用 */
    mutations: {
        setInit: function(state){
            state.goodsId = null;
            state.switchs = true;
            state.statusDeparture = true;
        },
        /* 清空关于商品ID信息的存储 */
        delInit: function(state){
            localStorage.removeItem("goodsId");
            state.goodsId = null;
            state.switchs = true;
            state.statusDeparture = true;
        },
        /* 设置switchs false： 阻止本实例状态改变 */
        setSwitchs: function (state, switchs) {
            state.switchs = switchs
        },
        /* 记录添加商品是否存在编辑未保存数据
         * true 以保存
         * false 未保存 */
        setStatusDeparture: function (state, status) {
            state.statusDeparture = status
        },
        setBreadCrumb: function (state, item) {
            if (state.switchs) {
                state.breadcrumb = [
                    {
                        text: '仪盘表',
                        to: {name: 'admin'}
                    }
                ];
                state.breadcrumb.push(item);
            }
        },
        setActive: function (state, active) {
            state.active = active;
        },
        setAppResponse: function (state, goodsId) {
            state.goodsId = goodsId;

            if (!window.localStorage) {
                alert("浏览器不支持localstorage");
            } else {
                let storage = window.localStorage;
                storage.setItem("goodsId", goodsId);
            }
        }
    },
    /* 借助actions的手去 执行 mutations ， 通过  this.$store.dispatch 的方式调用 */
    /* 可以用来执行异步操作，可以跟踪异步数据状态变化 */
    actions: {},
    /* 在getters中声明state中变量的计算函数，缓存计算后的数据， 通过 this.$store.getters 调用 */
    getters: {
        getStatusDeparture: function (state) {
            return state.statusDeparture
        },
        getBreadCrumb: function (state) {
            return state.breadcrumb
        },
        getActive: function (state) {
            return state.active
        },
        getGoodsId: function (state) {
            if (!window.localStorage) {
                alert("浏览器不支持localstorage");
            } else {
                let storage = window.localStorage;
                if (!state.goodsId) {
                    state.goodsId = storage.getItem("goodsId");
                    state.statusDeparture = false
                }
            }
            return state.goodsId
        }
    }
};
