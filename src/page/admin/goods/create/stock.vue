<!-- 库存 -->
<template>
    <el-card shadow="never">
        <div slot="header" class="clearfix">
            <span>库存信息</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="nextStep" v-if="netx">下一步</el-button>
            <el-button style="float: right; padding: 3px 0" type="text" v-else disabled>下一步</el-button>
        </div>

        <el-form label-position="right" label-width="180px" :model="stacks">
            <el-form-item label="商品名称">
                <el-input v-model="stacks.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="入库数量">
                <el-input-number v-model.number="stacks.number" size="mini" :min="0"
                                 label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="">
                <!--<el-input v-model="stacks.is_valid"></el-input>-->
                <el-checkbox v-model="stacks.is_valid">库锁状态</el-checkbox>
                <el-tooltip content="当库存状态被勾选，锁定当前关联的商品，阻止下单，添加购物车等操作！'
                                             '对已经下单用户不受影响，对添加购物车用户，受影响！" placement="bottom" effect="light">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
        </el-form>

    </el-card>

</template>

<script>
    import {
        Card,
        Button,
        Form,
        FormItem,
        Input,
        InputNumber,
        Checkbox,
        Tooltip

    } from 'element-ui'
    import axios from '@/axios/index'
    export default {
        name: "stock",
        data: function () {
            return {
                netx: true,
                active: 3,
                GoodsId: null,
                PrefixId: null,
                stacks: {
                    id: null,
                    name: null,
                    number: 0,
                    is_valid: false,
                    add_time: null,
                    now_time: null
                }
            }
        },
        created: function () {
            this.GoodsId = this.$store.getters.getGoodsId;
            if (this.GoodsId) {
                this.Is_valid = true;
            } else {
                this.$router.push({
                    name: 'admin:goods:create:add'
                })
            }
            if (this.Is_valid) {
                axios.GoodsPublicGoods('GET', {}, this.GoodsId).then(response => {
                    this.setInit(response);
                });
            }
            this.$store.commit('setActive', this.active);
        },
        components: {
            'el-card': Card,
            'el-button': Button,
            'el-input': Input,
            'el-input-number': InputNumber,
            'el-form': Form,
            'el-form-item': FormItem,
            'el-checkbox': Checkbox,
            'el-tooltip': Tooltip
        },
        methods: {
            /* 下一步 */
            nextStep: function () {
                if (!this.netx) return;
                const loading = this.$loading({
                    lock: true,
                    text: '库存信息保存中...'
                });
                this.setSave().then(response => {
                    this.$store.commit('setActive', this.active + 1);
                    this.$router.push({
                        name: 'admin:goods:create:seo'
                    });
                    let vm = this;
                    setTimeout(() => {
                        loading.text = '库存信息以保存';
                        setTimeout(() => {
                            loading.close();
                        }, 400);
                    }, 400);
                }).catch(error => {
                    this.$message({
                        message: '库存信息保存失败',
                        type: 'error'
                    })
                });
            },

            /* 保存库存信息 */
            setSave: function(){
                const loading = this.$loading({
                    lock: true,
                    text: '保存中...'
                });
                return axios.ModelsPublicGoodsStockInfo('PATCH', {
                    number: this.stacks.number,
                    is_valid: this.stacks.is_valid
                }, this.stacks.id).then(response => {
                    setTimeout(() => {
                        loading.text = '已保存';
                        setTimeout(() => {
                            loading.close();
                        }, 300);
                    }, 300);
                });

            },

            /* 初始化默认值 */
            setInit: function (response) {
                this.GoodsId = response.data.id;
                this.PrefixId = response.data.prefix.id;
                this.stacks = response.data.with_info.stock_info_id;
            }
        }
    }
</script>

<style scoped>

</style>
