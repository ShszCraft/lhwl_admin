<template>
    <div>
        <el-steps :active="active" simple class="mb-3">
            <el-step title="添加商品" icon="el-icon-news"></el-step>
            <el-step title="套餐信息" icon="el-icon-edit-outline"></el-step>
            <el-step title="商品分类" icon="el-icon-menu"></el-step>
            <el-step title="库存信息" icon="el-icon-flowinfo-kucun"></el-step>
            <el-step title="商品 SEO" icon="el-icon-flowinfo-seo-marketing-business-geo-tagging-globe-tag"></el-step>
        </el-steps>

        <router-view name="goods_init"></router-view>
    </div>
</template>

<script>

    import {
        Steps,
        Step,
        MessageBox
    } from 'element-ui'

    import '@/assets/Icon-flowinfo/iconfont.css'
    import axios from '@/axios/index'

    export default {
        name: "edit-create",
        data() {
            return {
                active: 0,
                statusDeparture: true,
                /* Is_valid: true 表示 获取对应商品的首图数据存在
                 * Is_valid: false 表示 获取对应商品的首图数据不存在 */
                Is_valid: false,
            }
        },
        created: function () {
            this.$store.commit('setActive', 0);
            this.$store.commit('setBreadCrumb', {
                text: '添加商品',
                active: true,
                to: {
                    name: 'admin:goods:create:add'
                },
            });

            this.statusDeparture = true;
            this.$store.commit('setStatusDeparture', this.statusDeparture);
            this.$store.commit('setSwitchs', this.statusDeparture);
        },
        components: {
            'el-steps': Steps,
            'el-step': Step,
        },
        computed: {
            getActive: function () {
                return this.$store.getters.getActive
            },
            getStatusDeparture: function () {
                return this.$store.getters.getStatusDeparture
            },
        },
        watch: {
            getActive: function (a, b) {
                this.active = a;
                console.log('getActive', a, b)
            },
            getStatusDeparture: function (a, b) {
                this.statusDeparture = a;
                this.$store.commit('setSwitchs', this.statusDeparture);
            },
        },
        beforeRouteLeave(to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
            if (!this.statusDeparture) {
                MessageBox.confirm('此操作将离开当前页面，不保存数据, 是否继续?', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.statusDeparture = true;
                    this.$store.commit('setSwitchs', this.statusDeparture);
                    if (this.$store.getters.getGoodsId) {
                        axios.GoodsPublicGoods('DELETE', {}, this.$store.getters.getGoodsId)
                    }
                    next()
                });
            }
            next(this.statusDeparture)
        }
    }
</script>

<style scoped>

</style>
