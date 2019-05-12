<template>
    <div>
        <!-- Tabs with card integration -->
        <div>
            <el-card shadow="never">
                <el-tabs v-model="activeName" v-loading="loading">
                    <el-tab-pane label="以发布" name="publish">


                        <el-table
                            ref="multipleTable"
                            :data="pagination.publish.items.filter(data => !pagination.publish.search || data.name.toLowerCase().includes(pagination.publish.search.toLowerCase()))"
                            tooltip-effect="dark"
                            style="width: 100%">

                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                            <el-card class="box-card">
                                                <div slot="header" class="clearfix">
                                                    <span>{{ scope.row.name }}</span>
                                                    <el-button style="float: right; padding: 3px 0" type="text">修改名称</el-button>
                                                </div>
                                                <div class="" v-html="scope.row.connet">
                                                </div>
                                            </el-card>
                                        </el-col>
                                        <el-col :span="12">
                                        </el-col>
                                    </el-row>


                                </template>
                            </el-table-column>

                            <el-table-column type="selection" width="40" :height="30">
                            </el-table-column>

                            <el-table-column prop="image_64x64" label="预览" width="50">
                                <template slot-scope="scope">
                                    <img :src="scope.row.image_64x64" alt="" width="30" class="p-0 m-0"/>
                                </template>
                            </el-table-column>

                            <el-table-column prop="name" label="商品" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column prop="stock" label="分类" width="190">
                                <template slot-scope="scope">
                                    <div class="classify">
                                        <span v-if="scope.row.prefix.category">
                                            <el-badge :value="scope.row.prefix.category.name" class="item"
                                                      type="primary">
                                            </el-badge>
                                        </span>
                                        <span v-else class="text-warning ">
                                            <el-badge value=" - " class="item" type="primary">
                                            </el-badge>
                                        </span>
                                        <span v-if="scope.row.prefix.subcategory">
                                            <el-badge :value="scope.row.prefix.category.name" class="item"
                                                      type="primary">
                                            </el-badge>
                                        </span>
                                        <span v-else class="text-warning ">
                                            <el-badge value=" - " class="item" type="primary">
                                            </el-badge>
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column prop="stock" label="库存" width="70">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.scope">无货</span>
                                    <span class="text-success">有货</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="money" label="价格" width="100">
                                <template slot-scope="scope">
                                    <currency :money="Number(scope.row.money)" prefix="￥"></currency>
                                </template>
                            </el-table-column>

                            <el-table-column prop="time_now" label="最后操作时间" width="150">
                                <template slot-scope="scope">{{ scope.row.time_now | formatDate }}</template>
                            </el-table-column>

                            <el-table-column prop="time_now" align="right" width="170">
                                <template slot="header" slot-scope="scope">
                                    <el-input v-model="pagination.publish.search" size="mini" placeholder="输入订单号搜索"/>
                                </template>

                                <template slot-scope="scope">
                                    <el-dropdown split-button type="primary" size="small"
                                                 @command="setPublishCommand">
                                        <span class="el-dropdown-link">编辑</span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="{name: '商品下架', data: scope}">商品下架
                                            </el-dropdown-item>
                                            <el-dropdown-item :command="{name: '删除商品', data: scope}">删除商品
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </el-table-column>

                        </el-table>

                        <el-pagination
                            class="mt-3 mb-0 pb-0"
                            layout="->, prev, pager, next"
                            @current-change="pagination_publish"
                            :total="pagination.publish.count"
                            :page-size="pagination.publish.pageSize">
                        </el-pagination>

                    </el-tab-pane>

                    <el-tab-pane label="待发布" name="unpublished">

                        <el-table
                            ref="multipleTable"
                            :data="pagination.unpublished.items.filter(data => !pagination.unpublished.search || data.name.toLowerCase().includes(pagination.unpublished.search.toLowerCase()))"
                            tooltip-effect="dark"
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
                                                            <p class="m-2 mb-1">纳税人识别号: {{ scope.row.key_inv.taxpayer
                                                                }}</p>
                                                            <p class="m-2 mb-1" v-if="scope.row.key_inv.content === 0">
                                                                发票内容:
                                                                商品明细</p>
                                                            <p class="m-2 mb-1" v-if="scope.row.key_inv.content === 1">
                                                                发票内容:
                                                                商品类型</p>
                                                            <p class="m-2 mb-1">收票人手机: {{ scope.row.key_inv.phone }}</p>
                                                            <p class="m-2 mb-1">收票人邮箱: {{ scope.row.key_inv.email }}</p>
                                                        </div>
                                                        <div v-if="scope.row.invoice === 2">
                                                            <span class="el-alert__title is-bold">专票信息</span>
                                                            <p class="m-2 mb-1">单位名称: {{ scope.row.key_inv.unitName
                                                                }}</p>
                                                            <p class="m-2 mb-1">注册地址: {{
                                                                scope.row.key_inv.registeredAddress
                                                                }}</p>
                                                            <p class="m-2 mb-1">纳税人识别号: {{ scope.row.key_inv.taxpayer
                                                                }}</p>
                                                            <p class="m-2 mb-1">注册电话: {{ scope.row.key_inv.phone }}</p>
                                                            <p class="m-2 mb-1">开户银行: {{
                                                                scope.row.key_inv.accountOpening
                                                                }}</p>
                                                            <p class="m-2 mb-1">银行账户: {{ scope.row.key_inv.account
                                                                }}</p>
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
                                                        央采价：{{ currency(img.total) }}
                                                    </p>
                                                    <p class="m-2" v-else>总价：{{currency(img.total)}}</p>
                                                </el-alert>
                                            </el-col>
                                        </el-row>

                                        <el-table :data="img.goodslist_set" tooltip-effect="dark" style="width: 100%">
                                            <el-table-column
                                                label="预览"
                                                width="70">
                                                <template slot-scope="scope">
                                                    <img :src="scope.row.imgurl" class="rounded mx-auto d-block"
                                                         width="50">
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
                                                        <p class="">10万元至30万元： {{ scope.row.goodsclassguid_zycg.a2
                                                            }}%</p>
                                                        <p class="">30万元至60万元： {{ scope.row.goodsclassguid_zycg.a3
                                                            }}%</p>
                                                        <p class="">60万元至100万元： {{ scope.row.goodsclassguid_zycg.a4
                                                            }}%</p>
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
                                                    {{ currency(scope.row.price) }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="price"
                                                label="原价"
                                                width="120">
                                                <template slot-scope="scope">
                                                    {{currency(scope.row.originalprice*scope.row.qty) }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="total"
                                                label="总价"
                                                width="100">
                                                <template slot-scope="scope">
                                                    {{ currency(scope.row.total) }}
                                                </template>
                                            </el-table-column>

                                        </el-table>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column type="selection" width="40" :height="30">
                            </el-table-column>

                            <el-table-column prop="image_64x64" label="预览" width="50">
                                <template slot-scope="scope">
                                    <img :src="scope.row.image_64x64" alt="" width="30" class="p-0 m-0"/>
                                </template>
                            </el-table-column>

                            <el-table-column prop="name" label="商品" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column prop="stock" label="库存" width="100">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.scope">无货</span>
                                    <span class="text-success">有货</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="money" label="价格" width="100">
                                <template slot-scope="scope">
                                    <currency :money="Number(scope.row.money)" prefix="￥"></currency>
                                </template>
                            </el-table-column>

                            <el-table-column prop="time_now" label="最后操作时间" width="150">
                                <template slot-scope="scope">{{ scope.row.time_now | formatDate }}</template>
                            </el-table-column>

                            <el-table-column width="200" prop="time_now" align="right">
                                <template slot="header" slot-scope="scope">
                                    <el-input v-model="pagination.unpublished.search" size="mini"
                                              placeholder="输入订单号搜索"/>
                                </template>

                                <template slot-scope="scope">
                                    <el-dropdown split-button type="primary" size="small"
                                                 @command="setUnpublishedCommand">
                                        <span class="el-dropdown-link">编辑</span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="{name: '商品发布', data: scope}">商品发布
                                            </el-dropdown-item>
                                            <el-dropdown-item :command="{name: '删除商品', data: scope}">删除商品
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </el-table-column>

                        </el-table>

                        <el-pagination
                            class="mt-3 mb-0 pb-0"
                            layout="->, prev, pager, next"
                            @current-change="pagination_unpublished"
                            :total="pagination.unpublished.count"
                            :page-size="pagination.unpublished.pageSize">
                        </el-pagination>

                    </el-tab-pane>
                </el-tabs>
            </el-card>

        </div>


    </div>
</template>

<script>
    import {
        Card,
        Tabs,
        TabPane,
        Table,
        TableColumn,
        Pagination,
        Row,
        Badge,
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
    import axios from '@/axios/index'

    export default {
        name: 'admin-index',
        data: function () {
            return {
                activeName: 'publish',
                loading: true,
                loading_list: [],
                pagination: {

                    /* 以发布 */
                    publish: {
                        items: [],
                        search: '',
                        multipleSelection: [],

                        index: 1,
                        pageSize: 20,
                        count: 1,
                        next: null,
                        previous: null,
                    },


                    /* 未发布 */
                    unpublished: {
                        items: [],
                        search: '',
                        multipleSelection: [],

                        index: 1,
                        pageSize: 20,
                        count: 1,
                        next: null,
                        previous: null
                    }

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
            'el-badge': Badge,
            currency
        },
        created: function () {
            this.$store.commit('setBreadCrumb', {
                text: '商品管理',
                active: true,
                to: {
                    name: 'admin:goods:index'
                }
            });
            axios.GoodsPublicGoods('GET',
                {
                    release: true
                }).then(response => {
                this.pagination.publish.items = response.data.results;
                this.pagination.publish.count = response.data.count;
                this.pagination.publish.next = response.data.next;
                this.pagination.publish.previous = response.data.previous;

                this.loading_list.push('publish');
            }).catch(error => {
                this.loading_list.push('publish');
            });

            axios.GoodsPublicGoods('GET', {
                release: false
            }).then(response => {
                this.pagination.unpublished.items = response.data.results;
                this.pagination.unpublished.count = response.data.count;
                this.pagination.unpublished.next = response.data.next;
                this.pagination.unpublished.previous = response.data.previous;

                this.loading_list.push('unpublished');
            }).catch(error => {
                this.loading_list.push('unpublished');
            })
        },
        methods: {
            /* 同步页码 */
            pagination_publish(val) {
                this.pagination.publish.index = val;
            },
            pagination_unpublished(val) {
                this.pagination.unpublished.index = val;
            },

            /* 新提交 */
            setPublishCommand: function (command) {
                if (command.name === '商品下架') {
                    this.Shelf(command.data)
                } else if (command.name === '删除商品') {
                    this.Remove(command.data)
                        .then(reponse => {
                            this.pagination.publish.items.splice(command.data.$index, 1)
                        })
                }
            },

            setUnpublishedCommand: function (command) {
                if (command.name === '商品发布') {
                    console.log('商品发布', command.data);
                    this.Release(command.data)
                } else if (command.name === '删除商品') {
                    console.log('删除商品', command.data);
                    this.Remove(command.data)
                        .then(reponse => {
                            this.pagination.unpublished.items.splice(command.data.$index, 1)
                        })
                }
            },

            Release: function (data) {
                /* 上架商品 */
                axios.GoodsPublicGoods('PATCH', {
                    release: true
                }, data.row.id, null).then(response => {
                    this.loading = false;
                    this.pagination.publish.items.unshift(response.data);
                    this.pagination.unpublished.items.splice(data.$index, 1)
                }).catch(error => {
                    this.loading = false;
                });
            },

            Shelf: function (data) {
                /* 下架商品 */
                axios.GoodsPublicGoods('PATCH', {
                    release: false
                }, data.row.id, null).then(response => {
                    this.loading = false;
                    this.pagination.unpublished.items.unshift(response.data);
                    this.pagination.publish.items.splice(data.$index, 1)
                }).catch(error => {
                    this.loading = false;
                });
            },

            Remove: function (data) {
                /* 删除商品 */
                return axios.GoodsPublicGoods('DELETE', null, data.row.id, null).then(response => {
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                });
            },

            RemoveNull: function (data) {
                /* 删除商品 */
                console.log('删除商品', data.item.id);
                axios.GoodsIndexPublicGoods(data.item.id, 'DELETE').then(response => {
                    this.appNull.items.splice(data.index, 1)
                });
            }
        },
        filters: {
            formatDate: function (val) {
                /* 格式化日期时间输出 */
                var padDate = function (va) {
                    va = va < 10 ? '0' + va : va;
                    return va
                }
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
            }
        },
        computed: {
            loadings: function () {
                if (this.loading_list.length === 2) {
                    return this.loading_list
                }
            },
            pagePublishs: function () {
                return this.pagination.publish.index
            }
        },
        watch: {
            /* 加载商品数据完成 停止加载动画 */
            loadings: function () {
                this.loading = false
            },
            /* 根据分页页码变化加载对应数据 */
            pagePublishs: function (val, out) {
                this.loading = true;
                axios.GoodsPublicGoods('GET', {
                    release: true
                }, null, this.pagination.publish).then(response => {
                    this.pagination.publish.items = response.data.results;
                    this.pagination.publish.count = response.data.count;
                    this.pagination.publish.next = response.data.next;
                    this.pagination.publish.previous = response.data.previous;
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    >>> .el-checkbox {
        padding-top: 7.5px;
    }

    >>> .classify {
        padding-top: 10px;
    }

    >>> .html-images {
        width: 100%;
    }
</style>
