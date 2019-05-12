<template>

    <div>
        <el-card shadow="never">
            <el-tabs v-model="activeName" v-loading="loading">
                <el-tab-pane label="新提交" name="new">
                    <el-table
                        ref="multipleTable"
                        :data="pagination.news.items.filter(data => !pagination.news.search || data.orderid.toLowerCase().includes(pagination.news.search.toLowerCase()))"
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">

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
                                                <currency :money="Number(scope.row.originalprice*scope.row.qty)" prefix="￥"></currency>
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
                                <el-dropdown split-button type="primary" size="small"
                                             @command="setNewsCommand"
                                             v-on:click="setDeliver(scope)">
                                    <span class="el-dropdown-link">发货</span>
                                    <el-dropdown-menu slot="dropdown" v-if="scope.row.usercode">
                                        <el-dropdown-item :command="{name: '取消订单', data: scope}">取消订单
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                    <el-dropdown-menu slot="dropdown" v-else>
                                        <el-dropdown-item :command="{name: '取消订单', data: scope}">取消订单
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

                <el-tab-pane label="配送中" name="delivery">

                    <el-table
                        ref="itemsDeliveryTable"
                        :data="pagination.itemsDelivery.items.filter(data => !pagination.itemsDelivery.search || data.orderid.toLowerCase().includes(pagination.itemsDelivery.search.toLowerCase()))"
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">

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
                                                    编号： {{ scope.row.userinfo.usercode }}</p>
                                                <p class="m-2 mb-1">电话： {{ scope.row.userinfo.phone }}</p>
                                                <p class="m-2 mb-1" v-if="scope.row.unitinfo.name">
                                                    单位： {{ scope.row.unitinfo.name }}</p>
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
                                                <p class="m-2" v-else>
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
                                                <currency :money="Number(scope.row.originalprice*scope.row.qty)" prefix="￥"></currency>
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

                        <el-table-column prop="linkman" label="用户" width="170">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>姓名： {{ scope.row.userinfo.name }}</p>
                                    <p>电话： {{ scope.row.userinfo.phone }}</p>
                                    <p>单位： {{ scope.row.unitinfo.name }}</p>
                                    <p>
                                        地址：
                                        {{ scope.row.unitinfo.province }}
                                        {{ scope.row.unitinfo.city }}
                                        <spawn v-if="scope.row.unitinfo.remark">{{ scope.row.unitinfo.remark }}</spawn>
                                        {{ scope.row.unitinfo.detailaddress }}
                                    </p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium">{{ scope.row.user.username }}</el-tag>
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
                                <el-input v-model="pagination.itemsDelivery.search" size="mini" placeholder="输入订单号搜索"/>
                            </template>

                            <template slot-scope="scope">{{ scope.row.date }}</template>

                            <template slot-scope="scope">
                                <el-dropdown split-button type="primary" size="small"
                                             @command="setDeliveryCommand"
                                             v-on:click="setDeliverCompleted(scope)">
                                    <span class="el-dropdown-link">配送完成</span>
                                    <el-dropdown-menu slot="dropdown" v-if="scope.row.usercode">
                                        <el-dropdown-item :command="{name: '订单结账', data: scope}"
                                                          v-if="scope.row.ispaid === 0">订单结账
                                        </el-dropdown-item>
                                        <el-dropdown-item v-else disabled>以结账</el-dropdown-item>
                                        <el-dropdown-item :command="{name: '取消订单', data: scope}">取消订单
                                        </el-dropdown-item>
                                        <el-dropdown-item divided></el-dropdown-item>
                                        <el-dropdown-item :command="{name: '打印合同', data: scope}">打印合同</el-dropdown-item>
                                        <el-dropdown-item :command="{name: '打印验收单', data: scope}"
                                                          v-if="scope.row.acceptance.ysd_code">打印验收单
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                    <el-dropdown-menu slot="dropdown" v-else>
                                        <el-dropdown-item :command="{name: '订单结账', data: scope}"
                                                          v-if="scope.row.ispaid === 0">订单结账
                                        </el-dropdown-item>
                                        <el-dropdown-item v-else disabled>以结账</el-dropdown-item>
                                        <el-dropdown-item :command="{name: '取消订单', data: scope}">取消订单
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-pagination
                        class="mt-3 mb-0 pb-0"
                        layout="->, prev, pager, next"
                        @current-change="pagination_delivery"
                        :total="pagination.itemsDelivery.count"
                        :page-size="pagination.itemsDelivery.pageSize">
                    </el-pagination>

                </el-tab-pane>

                <el-tab-pane label="配送完成未结账" name="completionAccounts">
                    <el-table
                        ref="itemsAccountsTable"
                        :data="pagination.completionAccounts.items.filter(data => !pagination.completionAccounts.search || data.orderid.toLowerCase().includes(pagination.completionAccounts.search.toLowerCase()))"
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">

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
                                                    编号： {{scope.row.userinfo.usercode }}
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
                                                <currency :money="Number(scope.row.originalprice*scope.row.qty)" prefix="￥"></currency>
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

                        <el-table-column prop="linkman" label="用户" width="170">
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
                                        <el-tag size="medium">{{ scope.row.user.username }}</el-tag>
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
                                <el-input v-model="pagination.completionAccounts.search" size="mini"
                                          placeholder="输入订单号搜索"/>
                            </template>

                            <template slot-scope="scope">{{ scope.row.date }}</template>

                            <template slot-scope="scope">
                                <el-dropdown split-button type="primary" size="small" v-if="scope.row.usercode"
                                             @command="setAccountsCommand"
                                             v-on:click="setAccounts(scope)">
                                    <span class="el-dropdown-link">完成结账</span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="{name: '打印合同', data: scope}">打印合同</el-dropdown-item>
                                        <el-dropdown-item :command="{name: '打印验收单', data: scope}">打印验收单
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <el-button type="primary" size="small" v-else v-on:click="setAccounts(scope)">&nbsp;&nbsp;&nbsp;&nbsp;完成结账&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-pagination
                        class="mt-3 mb-0 pb-0"
                        layout="->, prev, pager, next"
                        @current-change="pagination_completion"
                        :total="pagination.completionAccounts.count"
                        :page-size="pagination.completionAccounts.pageSize">
                    </el-pagination>
                </el-tab-pane>

                <el-tab-pane label="正在取消订单" name="cancellation">
                    <el-table
                        ref="cancellationTable"
                        :data="pagination.cancellation.items.filter(data => !pagination.cancellation.search || data.orderid.toLowerCase().includes(pagination.cancellation.search.toLowerCase()))"
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">

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
                                                    编号： {{ scope.row.userinfo.usercode }}</p>
                                                <p class="m-2 mb-1">电话： {{ scope.row.userinfo.phone }}</p>
                                                <p class="m-2 mb-1" v-if="scope.row.unitinfo.name">
                                                    单位： {{ scope.row.unitinfo.name }}</p>
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
                                                <currency :money="Number(scope.row.originalprice*scope.row.qty)" prefix="￥"></currency>
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

                        <el-table-column prop="linkman" label="用户" width="170">
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
                                        <el-tag size="medium">{{ scope.row.user.username }}</el-tag>
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
                                <el-input v-model="pagination.cancellation.search" size="mini" placeholder="输入订单号搜索"/>
                            </template>

                            <template slot-scope="scope">{{ scope.row.date }}</template>

                            <template slot-scope="scope">
                                <el-dropdown split-button type="primary" size="small"
                                             @command="setCancellationCommand"
                                             v-on:click="setIsConfirmOreder(scope)">
                                    <span class="el-dropdown-link">通过</span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="{name: '驳回订单', data: scope}">驳回订单</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-pagination
                        class="mt-3 mb-0 pb-0"
                        layout="->, prev, pager, next"
                        @current-change="pagination_cancellation"
                        :total="pagination.cancellation.count"
                        :page-size="pagination.cancellation.pageSize">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>

</template>

<script>
    import axios from '@/axios/index';
    import currency from '@/components/currency'

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


    export default {
        name: "lates",
        data: function () {
            return {
                contractBaseUrl: axios.getBaseUrl() + '/home/ordercontract/',
                zycgBaseUrl: 'http://mall-api.zycg.gov.cn/mall_ysd/ysd?ysd_code=',
                loading: true,
                loading_list: [], // 满足长度 4，加载完成
                activeName: 'new',
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

                    /* 配送中 */
                    itemsDelivery: {
                        items: [],
                        search: '',
                        multipleSelection: [],

                        index: 1,
                        pageSize: 20,
                        count: 1,
                        next: null,
                        previous: null
                    },

                    /* 配送完成未结账 */
                    completionAccounts: {
                        items: [],
                        search: '',
                        multipleSelection: [],

                        index: 1,
                        pageSize: 20,
                        count: 1,
                        next: null,
                        previous: null
                    },

                    /* 正在取消订单 */
                    cancellation: {
                        items: [],
                        search: '',
                        multipleSelection: [],

                        index: 1,
                        pageSize: 20,
                        count: 1,
                        next: null,
                        previous: null,
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
            currency
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

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
                if (command.name === '取消订单') {
                    this.setIsGotuAddress(command.data, false,
                        {
                            auto: true,
                            active: 'cancellation',
                            dataIndex: 1,
                            data: this.pagination.news
                        }
                    ).then(respone => {
                        this.pagination.cancellation.items.unshift(command.data.row);
                        this.pagination.news.items.splice(command.data.$index, 1);
                    });
                }
            },

            /* 配送中 */
            setDeliveryCommand: function (command) {
                if (command.name === '取消订单') {
                    this.setIsGotuAddress(command.data, false,
                        {
                            auto: true,
                            active: 'cancellation',
                            dataIndex: 1,
                            data: this.pagination.itemsDelivery
                        }
                    ).then(respone => {
                        this.pagination.cancellation.items.unshift(command.data.row);
                        this.pagination.itemsDelivery.items.splice(command.data.$index, 1);
                    });
                } else if (command.name === '订单结账') {
                    this.setAccounts(command.data).then(respone => {
                        this.pagination.itemsDelivery.items[command.data.$index].ispaid = 1
                    });
                } else if (command.name === '打印验收单') {
                    this.getZycgContract(command.data.row.acceptance.ysd_code)
                } else if (command.name === '打印合同') {
                    this.getContract(command.data.row.orderid);
                }
            },

            /* 配送完成未结账 */
            setAccountsCommand: function (command) {
                if (command.name === '打印验收单') {
                    this.getZycgContract(command.data.row.acceptance.ysd_code)
                } else if (command.name === '打印合同') {
                    this.getContract(command.data.row.orderid);
                }
            },

            /* 正在取消订单 */
            setCancellationCommand: function (command) {
                if (command.name === '驳回订单') {
                    this.setNoIsGotuAddress(command.data, true, {
                        auto: true,
                        active: 'new',
                        dataIndex: 0,
                        data: this.pagination.cancellation
                    })
                }
            },

            /* 区分央采用户 tables 背景添加class 颜色 */
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
            pagination_delivery(val) {
                this.pagination.itemsDelivery.index = val;
            },
            pagination_completion(val) {
                this.pagination.completionAccounts.index = val;
            },
            pagination_cancellation(val) {
                this.pagination.cancellation.index = val;
            },

            /* 订单发货提交
             * ordtype: -1 待确认
             * ordtype: 0 以发货
             * ordtype: 1 以完成 */
            setDeliver: function (val) {
                this.loading = true;
                axios.PrivateOrder('PATCH', {
                    ordtype: 0
                }, val.row.id)
                    .then(response => {
                        this.pagination.itemsDelivery.items.unshift(response.data);
                        this.$message({
                            showClose: true,
                            message: '操作成功 [订单号: ' + val.row.orderid + ']',
                            type: 'success'
                        });
                        this.pagination.news.items.splice(val.$index, 1);
                        this.loading = false;
                        if (this.pagination.news.items.length === 0) {
                            this.activeName = 'delivery'
                        }
                    });
            },

            /* 完成收货处理
             * ordtype: -1 待确认
             * ordtype: 0 以发货
             * ordtype: 1 以完成 */
            setDeliverCompleted: function (val, spline = true) {
                this.loading = true;
                axios.PrivateOrder('PATCH', {
                    ordtype: 1
                }, val.row.id)
                    .then(response => {
                        this.$message({
                            showClose: true,
                            message: '操作成功 [订单号: ' + val.row.orderid + ']',
                            type: 'success'
                        });
                        this.loading = false;
                        if (spline) {
                            this.pagination.completionAccounts.items.unshift(response.data);
                            this.pagination.itemsDelivery.items.splice(val.$index, 1); // 删除 list 元素
                            if (this.pagination.itemsDelivery.items.length === 0) {
                                this.activeName = 'completionAccounts'
                            }
                        }

                    });
            },

            /* 配送完成未结账 结账处理
             * ispaid: 0 未结账
             * ispaid: 1 结账 */
            setAccounts: function (val) {
                this.loading = true;
                return axios.PrivateOrder('PATCH', {
                    ispaid: 1
                }, val.row.id)
                    .then(response => {
                        this.pagination.completionAccounts.items[val.$index] = response.data;
                        this.$message({
                            showClose: true,
                            message: '操作成功 [订单号: ' + val.row.orderid + ']',
                            type: 'success'
                        });
                        this.pagination.completionAccounts.items.splice(val.$index, 1); // 删除 list 元素
                        this.loading = false;
                        if ((this.pagination.completionAccounts.items.length) === 0) {
                            this.activeName = 'new'
                        }
                    });
            },

            /* 对提交取消订单申请 进行驳回处理
             * 需要指定type为reject
             * 否则 按通过流程处理订单 */
            setNoIsGotuAddress: function (val, spline = true, active = {
                auto: true,
                active: 'new',
                dataIndex: 1,
                data: this.pagination.cancellation
            }) {
                this.loading = true;
                return axios.PrivateOrder('PATCH', {
                    type: 'reject'
                }, val.row.id)
                    .then(response => {
                        this.$message({
                            showClose: true,
                            message: '操作成功 [订单号: ' + val.row.orderid + ']',
                            type: 'success'
                        });
                        this.loading = false;
                        if (spline) {
                            if (val.row.ordtype === -1) {
                                this.pagination.news.items.unshift(response.data);
                            } else if (val.row.ordtype === 0) {
                                this.pagination.itemsDelivery.items.unshift(response.data);
                            }
                            this.pagination.cancellation.items.splice(val.$index, 1); // 删除 list 元素
                        }
                        if (active.auto) {
                            if ((active.data.items.length) === 0) {
                                if (val.row.ordtype === -1) {
                                    this.activeName = 'new'
                                } else if (val.row.ordtype === 0) {
                                    this.activeName = 'delivery'
                                }
                            }
                        }
                    });
            },

            /* 批准用户取消订单 */
            setIsConfirmOreder: function (val, spline = true, active = {
                auto: true,
                active: 'new',
                dataIndex: 1,
                data: this.pagination.itemsDelivery
            }) {
                this.loading = true;
                return axios.PrivateOrder('PATCH', {
                    type: 'approval'
                }, val.row.id)
                    .then(response => {
                        this.pagination.cancellation.items[val.$index] = response.data;
                        this.$message({
                            showClose: true,
                            message: '操作成功 [订单号: ' + val.row.orderid + ']',
                            type: 'success'
                        });
                        this.loading = false;
                        if (spline) {
                            this.pagination.cancellation.items.splice(val.$index, 1); // 删除 list 元素
                        }
                        if (active.auto) {
                            if ((active.data.items.length - active.dataIndex) === 0) {
                                this.activeName = active.active
                            }
                        }

                    });
            },

            /* 提交取消订单申请 */
            setIsGotuAddress: function (val, spline = true, active = {
                auto: true,
                active: 'cancellation',
                dataIndex: 1,
                data: this.pagination.itemsDelivery
            }) {
                this.loading = true;
                return axios.PrivateOrder('PATCH', {
                    isgotuaddress: true
                }, val.row.id)
                    .then(response => {
                        this.pagination.cancellation.items[val.$index] = response.data;
                        this.$message({
                            showClose: true,
                            message: '操作成功 [订单号: ' + val.row.orderid + ']',
                            type: 'success'
                        });
                        this.loading = false;
                        if (spline) {
                            this.pagination.cancellation.items.splice(val.$index, 1); // 删除 list 元素
                        }
                        console.log('active.data', active.data);
                        if (active.auto) {
                            if ((active.data.items.length - active.dataIndex) === 0) {
                                this.activeName = active.active
                            }
                        }
                    });
            }
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
        created: function () {
            console.log('this.baseurl', this.baseurl);

            /* 更改导航菜单 */
            this.loading = true;
            this.$store.commit('setBreadCrumb', {
                text: '新订单',
                active: true
            });

            /* 新提交订单 */
            axios.PrivateOrder('GET', {
                isgotuaddress: false,
                ordtype: -1
            })
                .then(response => {
                    this.pagination.news.items = response.data.results;
                    this.pagination.news.count = response.data.count;
                    this.pagination.news.next = response.data.next;
                    this.pagination.news.previous = response.data.previous;
                    this.loading_list.push('new');
                })
                .catch(a => {
                    this.loading_list.push('new');
                });

            /* 配送中 */
            axios.PrivateOrder('GET', {
                isgotuaddress: false,
                ordtype: 0
            })
                .then(response => {
                    this.pagination.itemsDelivery.items = response.data.results;
                    this.pagination.itemsDelivery.count = response.data.count;
                    this.pagination.itemsDelivery.next = response.data.next;
                    this.pagination.itemsDelivery.previous = response.data.previous;
                    this.loading_list.push('delivery');
                })
                .catch(a => {
                    this.loading_list.push('delivery');
                });

            /* 配送完成未结账 */
            axios.PrivateOrder('GET', {
                isgotuaddress: false,
                ordtype: 1,
                ispaid: 0
            })
                .then(response => {
                    this.pagination.completionAccounts.items = response.data.results;
                    this.pagination.completionAccounts.count = response.data.count;
                    this.pagination.completionAccounts.next = response.data.next;
                    this.pagination.completionAccounts.previous = response.data.previous;
                    this.loading_list.push('completionAccounts');
                })
                .catch(a => {
                    this.loading_list.push('completionAccounts');
                });

            /* 正在取消订单 */
            axios.PrivateOrder('GET', {
                isgotuaddress: true
            })
                .then(response => {
                    this.pagination.cancellation.items = response.data.results;
                    this.pagination.cancellation.count = response.data.count;
                    this.pagination.cancellation.next = response.data.next;
                    this.pagination.cancellation.previous = response.data.previous;
                    this.loading_list.push('cancellation');
                })
                .catch(a => {
                    this.loading_list.push('cancellation');
                });
        },
        computed: {
            /* 新提交 属性监听 分页 */
            getPagination: function () {
                return this.pagination.news.index
            },

            /* 配送中 属性监听 分页 */
            getPaginationDelivery: function () {
                return this.pagination.itemsDelivery.index
            },

            /* 配送完成未结账 属性监听 分页 */
            getPaginationCompletionAccounts: function () {
                return this.pagination.completionAccounts.index
            },

            /* 正在取消订单 属性监听 分页 */
            getPaginationCancellation: function () {
                return this.pagination.cancellation.index
            },

            /* 新订单完成加载 */
            getPaginationEvent: function () {
                if (this.loading_list.length === 4) {
                    return this.loading_list
                }
            }

        },
        watch: {
            /* 新提交 页面监听 */
            getPagination: function (val, oul) {
                this.loading = true;
                axios.PrivateOrder('GET', {
                    ordtype: -1
                }, null, this.pagination)
                    .then(response => {
                        this.pagination.news.items = response.data.results;
                        this.pagination.news.count = response.data.count;
                        this.pagination.news.next = response.data.next;
                        this.pagination.news.previous = response.data.previous;
                        this.loading = false;
                        console.log('getPagination', response)
                    });
            },

            /* 配送中 页面监听 */
            getPaginationDelivery: function (val, oul) {
                this.loading = true;
                axios.PrivateOrder('GET', {
                    ordtype: 0
                }, null, this.pagination.itemsDelivery)
                    .then(response => {
                        this.pagination.itemsDelivery.items = response.data.results;
                        this.pagination.itemsDelivery.count = response.data.count;
                        this.pagination.itemsDelivery.next = response.data.next;
                        this.pagination.itemsDelivery.previous = response.data.previous;
                        this.loading = false;
                        console.log('getPaginationDelivery', response)
                    });
            },

            /* 配送完成未结账 属性监听 分页 */
            getPaginationCompletionAccounts: function (val, oul) {
                this.loading = true;
                axios.PrivateOrder('GET', {
                    ordtype: 1,
                    ispaid: 0
                }, null, this.pagination.completionAccounts)
                    .then(response => {
                        this.pagination.completionAccounts.items = response.data.results;
                        this.pagination.completionAccounts.count = response.data.count;
                        this.pagination.completionAccounts.next = response.data.next;
                        this.pagination.completionAccounts.previous = response.data.previous;
                        this.loading = false;
                        console.log('getPaginationCompletionAccounts', response)
                    });
            },

            /* 正在取消订单 属性监听 分页 */
            getPaginationCancellation: function (val, oul) {
                this.loading = true;
                axios.PrivateOrder('GET', {
                    ordtype: 0
                }, null, this.pagination.cancellation)
                    .then(response => {
                        this.pagination.cancellation.items = response.data.results;
                        this.pagination.cancellation.count = response.data.count;
                        this.pagination.cancellation.next = response.data.next;
                        this.pagination.cancellation.previous = response.data.previous;
                        this.loading = false;
                        console.log('getPaginationCancellation', response)
                    });
            },

            /* Table导航器 根据数据变化自动跳转下一步操作导航UI */
            getPaginationEvent: function (val, oul) {
                if (this.pagination.cancellation.items.length !== 0) {
                    this.activeName = 'cancellation';
                } else if (this.pagination.news.items.length === 0) {
                    console.log('news', this.pagination.news.items.length);
                    if (this.pagination.itemsDelivery.items.length === 0) {
                        console.log('itemsDelivery', this.pagination.itemsDelivery.items.length);
                        if (this.pagination.completionAccounts.items.length === 0) {
                            console.log('completionAccounts', this.pagination.completionAccounts.items.length);
                            if (this.pagination.cancellation.items.length === 0) {
                                console.log('cancellation', this.pagination.cancellation.items.length);
                                this.activeName = 'new'
                            } else {
                                this.activeName = 'cancellation'
                            }
                        } else {
                            this.activeName = 'completionAccounts'
                        }
                    } else {
                        this.activeName = 'delivery'
                    }
                } else {
                    this.activeName = 'new'
                }
                this.loading = false;
            }
        }
    }
</script>

<style scoped>
    >>> .el-checkbox {
        padding-top: 7.5px;
    }

    >>> .el-table .success {
        background: #f0f9eb;
    }
</style>
