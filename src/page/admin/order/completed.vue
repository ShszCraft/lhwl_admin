<template>
    <div>
        <el-card shadow="never">
            <el-tabs v-model="activeName" v-loading="loading">
                <el-tab-pane label="已完成" name="completed">

                    <el-table
                        ref="multipleTable"
                        :data="pagination.news.items.filter(data => !pagination.news.search || data.orderid.toLowerCase().includes(pagination.news.search.toLowerCase()))"
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        style="width: 100%">

                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <div v-for="(img, key) in scope.row.suborderlist_set" :key="key" class="">

                                    <el-row :gutter="20">
                                        <el-col :span="12">
                                            <el-alert
                                                :closable="false"
                                                type="info">
                                                <div v-if="scope.row.invoice" class="">
                                                    <div v-if="scope.row.invoice === 1">
                                                        <span class="el-alert__title is-bold">普票信息</span>
                                                        <p class="m-2 mb-1">发票抬头: {{ scope.row.key_inv.head }}</p>
                                                        <p class="m-2 mb-1">纳税人识别号: {{ scope.row.key_inv.taxpayer }}</p>
                                                        <p class="m-2 mb-1" v-if="scope.row.key_inv.content === 0">发票内容:
                                                            商品明细</p>
                                                        <p class="m-2 mb-1" v-if="scope.row.key_inv.content === 1">发票内容:
                                                            商品类型</p>
                                                        <p class="m-2 mb-1">收票人手机: {{ scope.row.key_inv.phone }}</p>
                                                        <p class="m-2 mb-1">收票人邮箱: {{ scope.row.key_inv.email }}</p>
                                                    </div>
                                                    <div v-if="scope.row.invoice === 2">
                                                        <span class="el-alert__title is-bold">专票信息</span>
                                                        <p class="m-2 mb-1">单位名称: {{ scope.row.key_inv.unitName }}</p>
                                                        <p class="m-2 mb-1">注册地址: {{ scope.row.key_inv.registeredAddress
                                                            }}</p>
                                                        <p class="m-2 mb-1">纳税人识别号: {{ scope.row.key_inv.taxpayer }}</p>
                                                        <p class="m-2 mb-1">注册电话: {{ scope.row.key_inv.phone }}</p>
                                                        <p class="m-2 mb-1">开户银行: {{ scope.row.key_inv.accountOpening
                                                            }}</p>
                                                        <p class="m-2 mb-1">银行账户: {{ scope.row.key_inv.account }}</p>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <p class="m-2 mb-1">不开发票</p>
                                                </div>
                                            </el-alert>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-alert
                                                title="订单信息"
                                                :closable="false"
                                                type="info">
                                                <p class="m-2 mb-1">姓名： {{ scope.row.userinfo.name }}</p>
                                                <p class="m-2 mb-1" v-if="scope.row.userinfo.usercode">
                                                    编号： {{ scope.row.userinfo.usercode }}
                                                </p>
                                                <p class="m-2 mb-1">电话： {{ scope.row.userinfo.phone }}</p>
                                                <p class="m-2 mb-1" v-if="scope.row.unitinfo.name">
                                                    单位： {{ scope.row.unitinfo.name }}
                                                </p>
                                                <p class="m-2 mb-1">
                                                    收货地址：
                                                    {{ scope.row.province }}
                                                    {{ scope.row.city }}
                                                    <spawn v-if="scope.row.area">
                                                        {{ scope.row.area }}
                                                    </spawn>
                                                    - {{ scope.row.deliveryaddress }}
                                                </p>
                                                <p class="m-2" v-if="scope.row.unitinfo.usercode">
                                                    央采价：
                                                    <currency :money="Number(img.total)" prefix="￥"></currency>
                                                </p>
                                                <p class="m-2" v-else>总价：
                                                    <currency :money="Number(img.total)" prefix="￥"></currency>
                                                </p>
                                            </el-alert>
                                        </el-col>
                                    </el-row>

                                    <el-table :data="img.goodslist_set" tooltip-effect="dark" style="width: 100%">
                                        <el-table-column
                                            label="预览"
                                            width="70">
                                            <template slot-scope="scope">
                                                <img :src="scope.row.imgurl" class="rounded mx-auto d-block" width="50">
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="goodsname"
                                            label="名称"
                                            show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                {{ scope.row.goodsname }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="taoc"
                                            label="套餐"
                                            width="120">
                                        </el-table-column>
                                        <el-table-column
                                            v-if="scope.row.usercode"
                                            prop="price"
                                            label="央采优惠"
                                            width="120">
                                            <template slot-scope="scope">
                                                <el-popover
                                                    placement="top-start"
                                                    :title="scope.row.goodsclassguid_zycg.name"
                                                    width="200"
                                                    trigger="hover">
                                                    <el-button slot="reference">查看</el-button>
                                                    <p class="">10万元以下： {{ scope.row.goodsclassguid_zycg.a1 }}%</p>
                                                    <p class="">10万元至30万元： {{ scope.row.goodsclassguid_zycg.a2 }}%</p>
                                                    <p class="">30万元至60万元： {{ scope.row.goodsclassguid_zycg.a3 }}%</p>
                                                    <p class="">60万元至100万元： {{ scope.row.goodsclassguid_zycg.a4 }}%</p>
                                                </el-popover>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="qty"
                                            label="数量"
                                            width="120">
                                        </el-table-column>
                                        <el-table-column
                                            prop="price"
                                            label="单价"
                                            width="120">
                                            <template slot-scope="scope">
                                                <currency :money="Number(scope.row.price)" prefix="￥"></currency>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="price"
                                            label="原价"
                                            width="120">
                                            <template slot-scope="scope">
                                                <currency :money="Number(scope.row.originalprice*scope.row.qty)"
                                                          prefix="￥"></currency>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="total"
                                            label="总价"
                                            width="100">
                                            <template slot-scope="scope">
                                                <currency :money="Number(scope.row.total)" prefix="￥"></currency>
                                            </template>
                                        </el-table-column>

                                    </el-table>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column type="selection" width="55" :height="30">
                        </el-table-column>

                        <el-table-column prop="linkman" label="单位/名称" width="170">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>姓名： {{ scope.row.userinfo.name }}</p>
                                    <p>电话： {{ scope.row.userinfo.phone }}</p>
                                    <p v-if="scope.row.unitinfo.name">单位： {{ scope.row.unitinfo.name }}</p>
                                    <p v-if="scope.row.unitinfo.province">
                                        地址：
                                        {{ scope.row.unitinfo.province }}
                                        {{ scope.row.unitinfo.city }}
                                        <spawn v-if="scope.row.unitinfo.remark">{{ scope.row.unitinfo.remark }}</spawn>
                                        {{ scope.row.unitinfo.detailaddress }}
                                    </p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium" v-if="scope.row.unitinfo.name">{{ scope.row.unitinfo.name
                                            }}
                                        </el-tag>
                                        <el-tag size="medium" v-else>{{ scope.row.user.username }}</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>

                        <el-table-column prop="orderid" label="订单" show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column prop="units" label="发票" width="120">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                    <div v-if="scope.row.invoice" class="ml-2">
                                        <div v-if="scope.row.invoice === 1">
                                            <p>普票</p>
                                            <p>发票抬头: {{ scope.row.key_inv.head }}</p>
                                            <p>纳税人识别号: {{ scope.row.key_inv.taxpayer }}</p>
                                            <p v-if="scope.row.key_inv.content === 0">发票内容: 商品明细</p>
                                            <p v-if="scope.row.key_inv.content === 1">发票内容: 商品类型</p>
                                            <p>收票人手机: {{ scope.row.key_inv.phone }}</p>
                                            <p>收票人邮箱: {{ scope.row.key_inv.email }}</p>
                                        </div>
                                        <div v-if="scope.row.invoice === 2">
                                            <p>专票</p>
                                            <p>单位名称: {{ scope.row.key_inv.unitName }}</p>
                                            <p>注册地址: {{ scope.row.key_inv.registeredAddress }}</p>
                                            <p>纳税人识别号: {{ scope.row.key_inv.taxpayer }}</p>
                                            <p>注册电话: {{ scope.row.key_inv.phone }}</p>
                                            <p>开户银行: {{ scope.row.key_inv.accountOpening }}</p>
                                            <p>银行账户: {{ scope.row.key_inv.account }}</p>
                                        </div>
                                    </div>
                                    <div v-else class="ml-2">
                                        <p>未提供发票信息</p>
                                    </div>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag v-if="scope.row.invoice === 1" size="medium">普票</el-tag>
                                        <el-tag v-else-if="scope.row.invoice === 2" size="success">专票</el-tag>
                                        <el-tag v-else size="info">无</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>

                        <el-table-column label="来源" width="120">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.usercode">央采</el-tag>
                                <el-tag v-else>本站</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column label="日期" width="150">
                            <template slot-scope="scope">{{ scope.row.createtime | formatDate}}</template>
                        </el-table-column>

                        <el-table-column label="总价" width="100">
                            <template slot-scope="scope">
                                <currency :money="Number(scope.row.total)" prefix="￥"></currency>
                            </template>
                        </el-table-column>

                        <el-table-column width="200" align="right">
                            <template slot="header" slot-scope="scope">
                                <el-input v-model="pagination.news.search" size="mini" placeholder="输入订单号搜索"/>
                            </template>

                            <template slot-scope="scope">{{ scope.row.date }}</template>

                            <template slot-scope="scope">
                                <el-dropdown split-button
                                             type="primary" size="small"
                                             @command="setNewsCommand">
                                    <span class="el-dropdown-link">更多</span>
                                    <el-dropdown-menu slot="dropdown" v-if="scope.row.usercode">
                                        <el-dropdown-item :command="{name: '删除订单', data: scope}" class="text-danger">
                                            删除订单
                                        </el-dropdown-item>
                                        <el-dropdown-item divided></el-dropdown-item>
                                        <el-dropdown-item :command="{name: '打印合同', data: scope}">打印合同</el-dropdown-item>
                                        <el-dropdown-item :command="{name: '打印验收单', data: scope}">打印验收单
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                    <el-dropdown-menu slot="dropdown" v-else>
                                        <el-dropdown-item :command="{name: '删除订单', data: scope}" class="text-danger">
                                            删除订单
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-pagination
                        class="mt-3 mb-0 pb-0"
                        layout="->, prev, pager, next"
                        @current-change="pagination_news"
                        :total="pagination.news.count"
                        :page-size="pagination.news.pageSize">
                    </el-pagination>

                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import axios from '@/axios/index';

    import {
        Card,
        Tabs,
        TabPane,
        Table,
        TableColumn,
        Pagination,
        Row,
        Col,
        Alert,
        Popover,
        Button,
        Tag,
        Input,
        Dropdown,
        DropdownItem,
        DropdownMenu
    } from 'element-ui';
    import currency from '@/components/currency'

    export default {
        name: "completed",
        data: function () {
            return {
                contractBaseUrl: axios.getBaseUrl() + '/home/ordercontract/',
                zycgBaseUrl: 'http://mall-api.zycg.gov.cn/mall_ysd/ysd?ysd_code=',
                loading: true,
                activeName: 'completed',
                pagination: {
                    /* 新提交 */
                    news: {
                        items: [],
                        search: '',
                        multipleSelection: [],

                        index: 1,
                        pageSize: 20,
                        count: 1,
                        next: null,
                        previous: null,
                    },

                },
            }
        },
        components: {
            'el-card': Card,
            'el-tabs': Tabs,
            'el-tab-pane': TabPane,
            'el-table': Table,
            'el-table-column': TableColumn,
            'el-pagination': Pagination,
            'el-row': Row,
            'el-col': Col,
            'el-alert': Alert,
            'el-popover': Popover,
            'el-button': Button,
            'el-tag': Tag,
            'el-input': Input,
            'el-dropdown': Dropdown,
            'el-dropdown-menu': DropdownMenu,
            'el-dropdown-item': DropdownItem,
            currency
        },
        created: function () {
            /* 更改导航菜单 */
            this.$store.commit('setBreadCrumb', {
                text: '已完成订单',
                active: true
            });

            /* 新提交订单 */
            axios.PrivateOrder('GET', {
                isgotuaddress: false,
                ordtype: 1
            })
                .then(response => {
                    this.pagination.news.items = response.data.results;
                    this.pagination.news.count = response.data.count;
                    this.pagination.news.next = response.data.next;
                    this.pagination.news.previous = response.data.previous;
                })
                .finally(a => {
                    this.loading = false;
                });
        },
        filters: {
            formatDate: function (val) {
                /* 格式化日期时间输出 */
                var padDate = function (va) {
                    va = va < 10 ? '0' + va : va;
                    return va
                };
                let value = new Date(val);
                let year = value.getFullYear();
                let month = padDate(value.getMonth() + 1);
                let day = padDate(value.getDate());
                let hour = padDate(value.getHours());
                let minutes = padDate(value.getMinutes());
                let seconds = padDate(value.getSeconds());
                return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
            },
            slice: function (str) {
                /* 切割0-60之间的字符串 */
                return str.substring(0, 50)
            },
            /* 金额过滤器 */

            order: function (val, oul) {
                return val + oul + '/'
            }
        },
        methods: {

            /* 央采用户合同 PDF */
            getContract: function (oreder) {
                window.open(this.contractBaseUrl + oreder, '_blank');
            },

            /* 央采用户验收单 PDF */
            getZycgContract: function (ysd_code) {
                window.open(this.zycgBaseUrl + ysd_code, '_blank');
            },

            /* 新提交 */
            setNewsCommand: function (command) {
                if (command.name === '删除订单') {
                    this.setIsDeleteOreder(command.data).then(respone => {
                        this.pagination.news.items.splice(command.data.$index, 1);
                    });
                } else if (command.name === '打印验收单') {
                    this.getZycgContract(command.data.row.acceptance.ysd_code)
                } else if (command.name === '打印合同') {
                    this.getContract(command.data.row.orderid);
                }
            },

            /* 用于区分普通用户订单还是央采用户订单 */
            tableRowClassName({row, rowIndex}) {
                if (row.usercode) {
                    return 'success';
                }
                return '';
            },

            /* 同步页码 */
            pagination_news(val) {
                this.pagination.news.index = val;
            },

            /* 订单删除 */
            setIsDeleteOreder: function (val) {
                this.loading = true;
                return axios.PrivateOrder('DELETE', {
                    id: val.row.id
                }, val.row.id)
                    .then(response => {
                        this.$message({
                            showClose: true,
                            message: '操作成功 [订单号: ' + val.row.orderid + ']',
                            type: 'success'
                        });
                        this.loading = false;
                    });
            },
        },
    }
</script>

<style scoped>

</style>
