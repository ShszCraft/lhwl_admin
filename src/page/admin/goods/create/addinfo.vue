<template>
    <div>
        <el-card shadow="never" class="mb-3">
            <span>套餐信息</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="nextMeal" v-if="netx">下一步</el-button>
            <el-button style="float: right; padding: 3px 0" type="text" @click="nextMeal" v-else disabled>下一步
            </el-button>
        </el-card>

        <el-row :gutter="10">
            <el-col :span="8">
                <el-card shadow="hover" class="box-card" v-loading="loading" element-loading-text="加载中...">
                    <div slot="header" class="clearfix">
                        <span>基本信息</span>
                        <el-tooltip content="商品基本信息，商品详细的分类数据" placement="bottom"
                                    effect="light">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="addGoodInfo">
                            保存
                        </el-button>
                    </div>

                    <el-form class="demo-ruleForm" label-width="100px" ref="sizerForm" :model="selecteds"
                             :rules="rules">
                        <el-form-item label="央采分类" prop="goods_zycg">
                            <el-cascader
                                placeholder="试试搜索：服务器"
                                :options="options.goods_zycg"
                                v-model="selecteds.goods_zycg"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods">
                            <el-cascader
                                placeholder="试试搜索：书写工具"
                                @change="ifyChange"
                                :options="options.goods"
                                v-model="selecteds.goods"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                    </el-form>

                </el-card>
                <el-card shadow="hover" class="box-card mt-3" v-loading="loadingSizer"
                         element-loading-text="请选择商品分类">
                    <div slot="header" class="clearfix">
                        <span>筛选分类</span>
                        <el-tooltip content="搜索商品时的商品筛选器，用于细化分类商品信息" placement="bottom"
                                    effect="light">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <el-form class="demo-ruleForm" label-width="100px" ref="sizerRulesForm" :model="sizer"
                             :rules="rules" v-if="options_sizer.length !== 0">

                        <el-form-item :label="options_sizer[0].label" prop="GoodsCascA">
                            <el-cascader
                                :change-on-select="false"
                                placeholder="试试搜索：服务器"
                                :options="options_sizer[0].children"
                                v-model="sizer.GoodsCascA"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item :label="options_sizer[1].label" prop="GoodsCascB">
                            <el-cascader
                                :change-on-select="false"
                                placeholder="试试搜索：服务器"
                                :options="options_sizer[1].children"
                                v-model="sizer.GoodsCascB"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item :label="options_sizer[2].label" prop="GoodsCascC">
                            <el-cascader
                                :change-on-select="false"
                                placeholder="试试搜索：服务器"
                                :options="options_sizer[2].children"
                                v-model="sizer.GoodsCascC"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item :label="options_sizer[3].label" prop="GoodsCascD">
                            <el-cascader
                                :change-on-select="false"
                                placeholder="试试搜索：服务器"
                                :options="options_sizer[3].children"
                                v-model="sizer.GoodsCascD"
                                filterable
                            ></el-cascader>
                        </el-form-item>
                        <el-form-item :label="options_sizer[4].label" prop="GoodsCascE">
                            <el-cascader
                                :change-on-select="false"
                                placeholder="试试搜索：服务器"
                                :options="options_sizer[4].children"
                                v-model="sizer.GoodsCascE"
                                filterable
                            ></el-cascader>
                        </el-form-item>

                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover" class="box-card"
                         v-loading="withInfo.is_valid" :element-loading-text="withInfo.is_message">
                    <div slot="header" class="clearfix">
                        <span>参数信息</span>
                        <el-tooltip content="商品基本信息，商品详细的参数信息。例如商品的品牌型号等" placement="bottom"
                                    effect="light">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="addGoodWithInfo">
                            保存
                        </el-button>
                    </div>

                    <el-form class="demo-ruleForm m-0 p-0" label-width="100px" ref="infoForm"
                             :model="withInfo.data">
                        <el-form-item
                            :rules="[{ required: true, message: '请输入参数'}]"
                            v-for="(item, key) in withInfo.option" :key="key"
                            :prop="item.value" :label="item.label">

                            <el-input v-model="withInfo.data[item.value]"
                                      v-if="item.value !== 'productType'"></el-input>
                            <el-input v-model="withInfo.data[item.value]" :disabled="withInfo.disabled"
                                      v-else></el-input>
                        </el-form-item>
                    </el-form>

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    import {
        Card,
        Button,
        Tooltip,
        Form,
        FormItem,
        Cascader,
        Row,
        Col,
        Input,
    } from 'element-ui'
    import axios from '@/axios/index'
    export default {
        name: "goods-create-addinfo",
        data: function () {
            let check = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择分类'));
                }
                callback();
            };

            return {
                // 允许下一步操作
                netx: false,
                name: 'addinfo',
                active: 2,
                loading: false,
                loadingSizer: false,
                GoodsId: null,
                PrefixId: null,
                rules: {
                    goods: [
                        {required: true, validator: check,}
                    ],
                    goods_zycg: [
                        {required: true, validator: check,}
                    ],
                    GoodsCascA: [
                        {required: true, validator: check,}
                    ],
                    GoodsCascB: [
                        {required: true, validator: check,}
                    ],
                    GoodsCascC: [
                        {required: true, validator: check,}
                    ],
                    GoodsCascD: [
                        {required: true, validator: check,}
                    ],
                    GoodsCascE: [
                        {required: true, validator: check,}
                    ]
                },
                options: {
                    goods: [],
                    goods_zycg: []
                },
                selecteds: {
                    goods: null,
                    goods_zycg: null
                },
                sizer: {
                    GoodsCascA: null,
                    GoodsCascB: null,
                    GoodsCascC: null,
                    GoodsCascD: null,
                    GoodsCascE: null
                },

                options_sizer: [],
                withInfo: {
                    id: null,
                    data: null,
                    option: null,
                    /* 禁止修改 产品类型 字段，因为这个字段后端自己根据商品分类自动填写 */
                    disabled: true,
                    is_valid: true,
                    is_message: '请选择筛选分类并保存',
                    with_info_id: null,
                }
            }
        },
        components: {
            'el-card': Card,
            'el-button': Button,
            'el-tooltip': Tooltip,
            'el-form': Form,
            'el-form-item': FormItem,
            'el-cascader': Cascader,
            'el-row': Row,
            'el-col': Col,
            'el-input': Input,
        },

        created: function () {
            this.loading = true;
            this.loadingSizer = true;
            this.withInfo.is_message = '请选择筛选分类并保存';
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
            axios.CategorySet().then(response => {
                this.options = response.data;
                this.loading = false;
            })
        },
        methods: {
            /* 下一步 */
            nextMeal: function () {
                if (!this.netx) return;

                this.$store.commit('setActive', this.active + 1);
                this.$router.push({
                    name: 'admin:goods:create:stock'
                });
            },
            /* 初始化 */
            setInit: function (response) {
                this.GoodsId = response.data.id;
                this.PrefixId = response.data.prefix.id;

                if (response.data.with_info) {
                    this.$set(this.withInfo, 'id', response.data.with_info.id);
                    this.$set(this.withInfo, 'option', response.data.with_info.restful);
                    this.$set(this.withInfo, 'data', response.data.with_info.data);
                    this.$set(this.withInfo, 'with_info_id', response.data.with_info.with_info_id);
                    this.$set(this.withInfo, 'is_valid', false);
                }
                if (response.data.with_info) this.netx = true;

                /*
                * 商品品牌 GoodsCascA Brand
                * 产品类型 GoodsCascB ProductType
                * 技术类型 GoodsCascC Technology
                * 使用场景 GoodsCascD Scene
                * 价格范围 GoodsCascE PriceRange
                 */
                if (response.data.prefix.classifythere_key) {
                    this.selecteds.goods = [
                        response.data.prefix.category.id,
                        response.data.prefix.subcategory.id
                    ];
                    this.selecteds.goods_zycg = [response.data.prefix.rate_classg_key];
                    let rez = response;
                    axios.CategorySet('GET', {
                        type: 'sizer',
                        srid: response.data.prefix.subcategory.id
                    }).then(response => {
                        this.loadingSizer = false;
                        this.options_sizer = response.data;
                        this.sizer.GoodsCascA = [rez.data.prefix.brand.id];
                        this.sizer.GoodsCascB = [rez.data.prefix.product.id];
                        this.sizer.GoodsCascC = [rez.data.prefix.technology.id];
                        this.sizer.GoodsCascD = [rez.data.prefix.usescene.id];
                        this.sizer.GoodsCascE = [rez.data.prefix.pricescope.id];
                        this.$nextTick(function () {
                            this.$refs['sizerRulesForm'].validate((valid) => {
                            })
                        });
                    })
                }
            },

            /* 添加参数信息 PATCH */
            addGoodWithInfo: function () {
                this.$refs['infoForm'].validate(valid => {
                    if (valid) {
                        this.withInfo.is_valid = true;
                        this.withInfo.is_message = '正在保存...';
                        axios.ModelsPublicGoodsWithInfo('PATCH',
                            this.withInfo.data,
                            this.withInfo.with_info_id
                        ).then(response => {
                            this.withInfo.is_valid = false;
                            this.$message({
                                message: '数据以保存',
                                type: 'success'
                            });
                            this.netx = true
                        }).catch(error => {
                            this.$message({
                                message: '数据保存失败',
                                type: 'error'
                            });
                            console.log('error', error);
                        })
                    } else {
                        return false;
                    }
                });
            },
            /* 添加基本信息与商品筛选分类数据 PATCH */
            addGoodInfo: function () {
                this.$refs['sizerForm'].validate((valid) => {
                    if (valid) {
                        this.$refs['sizerRulesForm'].validate((valid) => {
                            if (valid) {
                                this.loading = true;
                                this.loadingSizer = true;
                                this.withInfo.is_valid = true;
                                this.withInfo.is_message = '正在保存...';
                                axios.GoodsInfoPublic('PATCH', {
                                    classify_key: this.selecteds.goods[0],
                                    classifythere_key: this.selecteds.goods[1],
                                    rate_classg_key: this.selecteds.goods_zycg[0],
                                    brand_key: this.sizer.GoodsCascA[0],
                                    producttype_key: this.sizer.GoodsCascB[0],
                                    technology_key: this.sizer.GoodsCascC[0],
                                    scene_key: this.sizer.GoodsCascD[0],
                                    pricerange_key: this.sizer.GoodsCascE[0]
                                }, this.PrefixId).then(response => {
                                    this.$message({
                                        message: '数据以保存',
                                        type: 'success'
                                    });
                                    this.loading = false;
                                    this.loadingSizer = false;
                                    axios.GoodsPublicGoods('GET', {}, this.GoodsId).then(response => {
                                        this.setInit(response);
                                        this.withInfo.is_valid = false;
                                    })
                                }).catch(error => {
                                    this.$message({
                                        message: '数据保存失败',
                                        type: 'success'
                                    });
                                    console.log('error', error);
                                })
                            } else {
                                return false;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            /* 获取商品梯级分类信息 商品搜索筛选器 */
            ifyChange: function (value) {
                this.loadingSizer = true;
                this.withInfo.is_valid = true;
                this.options_sizer = [];
                axios.CategorySet('GET', {
                    type: 'sizer',
                    srid: value[1]
                }).then(response => {
                    this.loadingSizer = false;

                    if (this.withInfo.option) {
                        this.withInfo.is_valid = false;
                    }

                    this.$message({
                        message: '获取数据成功',
                        type: 'success'
                    });
                    this.options_sizer = response.data;
                    this.sizer.GoodsCascA = null;
                    this.sizer.GoodsCascB = null;
                    this.sizer.GoodsCascC = null;
                    this.sizer.GoodsCascD = null;
                    this.sizer.GoodsCascE = null;

                    this.withInfo.data = null;
                    this.withInfo.option = null;

                }).catch(error => {
                    this.$message({
                        message: '获取数据失败',
                        type: 'error'
                    });
                    console.log('获取数据失败', error)
                })
            },
        },
    }
</script>

<style scoped>
    .position {
        float: left;
        width: 150px;
        height: 150px;
    }

    .position >>> .col {
        padding: 0;
    }

    .position:hover >>> .position-body {
        display: inline !important;
    }

    .position-body {
        display: none;
        width: 150px;
        padding: 5px;
        margin-left: -150px;
        position: absolute;
    }

    .position-info {
        float: left;
    }

    .position-danger {
        float: right;
    }
</style>
