<template>
    <div>
        <el-card shadow="never" class="mb-3">
            <span>套餐信息</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="nextMeal" v-if="next">下一步
            </el-button>
            <el-button style="float: right; padding: 3px 0" type="text" v-else disabled>下一步</el-button>

        </el-card>

        <el-row :gutter="30">
            <el-col :span="10">
                <el-card shadow="hover" class="box-card">
                    <div slot="header" class="clearfix">
                        <span>图片上传</span>
                        <small>商品首图参考图</small>
                        <el-tooltip content="商品展示图，商品信息展示图，商品细节展示图。一个商品的样貌如何，用户第一时间得知！" placement="bottom"
                                    effect="light">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">-->
                        <!--刷新-->
                        <!--</el-button>-->
                    </div>
                    <el-upload
                        name="image"
                        multiple
                        :headers="Uploads.headers"
                        :data="Uploads.data"
                        :action="Uploads.actionUpload"
                        :disabled="!Is_valid"
                        :file-list="Uploads.fileList"
                        :on-remove="ImageRemove"
                        :on-success="ImageSuccess"
                        :before-upload="beforeAvatarUpload"
                        list-type="picture-card">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-card>
            </el-col>

            <el-col :span="14">
                <el-card shadow="hover" class="box-card" v-loading="mealLoading">
                    <div slot="header" class="clearfix">
                        <span>商品套餐</span>
                        <el-tooltip content="商品的套餐分类，一个商品可以拥有多个套餐。用户可以选择不同的套餐进行购物车或下单操作" placement="bottom"
                                    effect="light">
                            <i class="el-icon-info"></i>
                        </el-tooltip>

                        <el-button style="float: right; padding: 3px 0" type="text" @click="addMela">
                            添加套餐
                        </el-button>
                    </div>
                    <el-table
                        :data="mealData"
                        style="width: 100%">
                        <el-table-column
                            prop="name"
                            label="套餐"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="money"
                            label="金额"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="defaule"
                            label="状态"
                            width="100">
                            <template slot-scope="scope">
                                <el-tag type="success" size="small" v-if="scope.row.defaule">
                                    默认
                                    <el-tooltip content="商品首页默认展示套餐，商品搜索默认展示套餐信息" placement="bottom" effect="light">
                                        <i class="el-icon-info"></i>
                                    </el-tooltip>
                                </el-tag>
                                <a href="javascript:;" v-else v-on:click="setMealDefaule(scope)">
                                    <el-tag type="info" size="small">设置默认</el-tag>
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="time_add"
                            label="时间"
                            width="200">
                            <template
                                slot-scope="scope">
                                <datatime :time="scope.row.time_add"></datatime>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="150">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="modifyMeal(scope)">编辑
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="MealDelete(scope)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-card>


                <el-dialog
                    :show-close="false"
                    :visible.sync="addDialogMeal"
                    class="box-card"
                    width="30%">
                    <div slot="title" class="clearfix">
                        <span>{{ mealName }}</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="addDialogMeal = false">取 消
                        </el-button>
                    </div>

                    <el-form :model="Meal" label-position="left" ref="ValidateForm" label-width="100px"
                             class="demo-ruleForm m-0 p-0">
                        <el-form-item
                            label="套餐名称"
                            prop="name"
                            :rules="[
                          { required: true, message: '套餐名称不能为空'}
                        ]">
                            <el-input type="text" v-model.number="Meal.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="套餐金额"
                            prop="money"
                            :rules="[
                          { required: true, message: '商品金额不能为空'},
                          { type: 'number', message: '商品金额必须为数字'}
                        ]">
                            <el-input type="money" v-model.number.trim="Meal.money" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox v-model="Meal.defaule">默认套餐</el-checkbox>
                            <el-tooltip content="每个商品只可以设置一个默认，设置当前默认，取消以有默认" placement="bottom" effect="light">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="setSaveMeal">确 定</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>

    </div>

</template>

<script>
    import {
        Upload,
        Dialog,
        Card,
        Button,
        Row,
        Col,
        Table,
        TableColumn,
        Input,
        Checkbox,
        Tooltip,
        Tag,
        MessageBox,
        Alert,
        Form,
        FormItem,
        Cascader,
    } from 'element-ui'
    import {modelPublicGoodsImage} from "@/axios/BaseUrl";
    import {getTokenJWT} from "../../../../axios";
    import Vue from 'vue';
    import datatime from '@/components/dataTime'
    import axios from '@/axios/index'

    export default {
        name: "images",
        data() {
            let checkGoods = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择商品分类区域'));
                }
                callback();
            };
            let checkGoodsZycg = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择央采分类区域'));
                }
                callback();
            };
            let checkGoodsCascA = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择筛选分类区域'));
                }
                callback();
            };
            let checkGoodsCascB = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择筛选分类区域'));
                }
                callback();
            };
            let checkGoodsCascC = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择筛选分类区域'));
                }
                callback();
            };
            let checkGoodsCascD = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择筛选分类区域'));
                }
                callback();
            };
            let checkGoodsCascE = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择筛选分类区域'));
                }
                callback();
            };


            return {
                next: false,
                rules: {
                    goods: [
                        {required: true, validator: checkGoods,}
                    ],
                    goods_zycg: [
                        {required: true, validator: checkGoodsZycg,}
                    ],
                    GoodsCascA: [
                        {required: true, validator: checkGoodsCascA,}
                    ],
                    GoodsCascB: [
                        {required: true, validator: checkGoodsCascB,}
                    ],
                    GoodsCascC: [
                        {required: true, validator: checkGoodsCascC,}
                    ],
                    GoodsCascD: [
                        {required: true, validator: checkGoodsCascD,}
                    ],
                    GoodsCascE: [
                        {required: true, validator: checkGoodsCascE,}
                    ]
                },
                /* Is_valid: true 表示 获取对应商品的首图数据存在
                 * Is_valid: false 表示 获取对应商品的首图数据不存在 */
                Is_valid: false,
                active: 1,
                Uploads: {
                    data: {},
                    headers: {
                        Authorization: getTokenJWT()
                    },
                    size: 10,
                    fileList: [],
                    IsImage: ['image/jpeg', 'image/png'],
                    actionUpload: axios.getUrl() + modelPublicGoodsImage(),
                    visible: false,
                    is_texr: []
                },
                GoodsId: null,
                PrefixId: null,
                Meal: {
                    name: null,
                    money: null,
                    defaule: false,
                    ware_key: null,
                },
                MealMessage: {
                    name: {
                        is_valid: false,
                        message: '请填写套餐名称'
                    },
                    money: {
                        is_valid: false,
                        message: '请填写套餐价格'
                    },
                },
                mealIndex: null,
                mealName: '添加套餐',
                mealScope: null,
                mealLoading: false,
                mealData: [],
                addDialogMeal: false,
                options_sizer: [],
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
                }
            }
        },
        created: function () {
            this.GoodsId = this.$store.getters.getGoodsId;
            if (this.GoodsId) {
                this.Is_valid = true;
                this.Meal.ware_key = this.GoodsId;
            } else {
                this.$store.commit('delInit');
                this.$router.push({
                    name: 'admin:goods:create:add'
                })
            }
            if (this.Is_valid) {
                this.Uploads.data['key'] = this.GoodsId;
                axios.GoodsPublicGoods('GET', {}, this.GoodsId).then(response => {
                    this.setInit(response);
                })
            }
            this.$store.commit('setActive', this.active);
            axios.CategorySet().then(response => {
                this.options = response.data;
            })
        },
        components: {
            'el-upload': Upload,
            'el-dialog': Dialog,
            'el-card': Card,
            'el-button': Button,
            'el-row': Row,
            'el-col': Col,
            'el-table': Table,
            'el-table-column': TableColumn,
            'el-input': Input,
            'el-checkbox': Checkbox,
            'el-tag': Tag,
            'el-alert': Alert,
            'el-tooltip': Tooltip,
            'el-form': Form,
            'el-form-item': FormItem,
            'el-cascader': Cascader,

            'datatime': datatime
        },
        methods: {

            nextMeal: function () {
                this.$store.commit('setActive', this.active + 1);
                this.$router.push({
                    name: 'admin:goods:create:addinfo'
                });
            },

            blur: function (e) {
                console.log('response', e);
            },

            /* 添加套餐 */
            addMela: function () {
                this.mealIndex = null;
                this.mealName = '添加套餐';
                this.mealScope = null;
                this.Meal.name = null;
                this.Meal.money = null;
                if (this.mealData.length === 0) {
                    this.Meal.defaule = true;
                } else {
                    this.Meal.defaule = false;
                }
                this.addDialogMeal = true;
                this.$nextTick(() => {
                    this.$refs['ValidateForm'].resetFields();
                });
            },
            /* 保存套餐 */
            setSaveMeal: function () {
                this.$refs['ValidateForm'].validate((valid) => {
                    if (valid) {
                        this.mealLoading = true;
                        if (!this.mealScope) {
                            axios.PublicGoodsMealInfo('POST', this.Meal).then(response => {
                                this.mealLoading = false;
                                this.mealData.unshift(response.data);
                                this.$message({
                                    showClose: true,
                                    message: '套餐以添加',
                                    type: 'success'
                                });
                            }).catch(error => {
                                this.mealLoading = false;
                                this.$message({
                                    showClose: true,
                                    message: '套餐添加失败',
                                    type: 'error'
                                });
                            });
                        } else {
                            axios.PublicGoodsMealInfo('PATCH', this.Meal, this.mealScope.row.id).then(response => {
                                this.mealLoading = false;
                                Vue.set(this.mealData, this.mealScope.$index, response.data);
                                this.$message({
                                    showClose: true,
                                    message: '套餐以修改',
                                    type: 'success'
                                });
                            }).catch(error => {
                                this.mealLoading = false;
                                this.$message({
                                    showClose: true,
                                    message: '套餐修改失败',
                                    type: 'error'
                                });
                            });
                        }
                        this.addDialogMeal = false;
                    } else {
                        return false;
                    }
                });
                // this.$refs['ValidateForm'].resetFields();
            },
            /* 修改套餐 */
            modifyMeal: function (scope) {
                this.mealIndex = scope.row.id;
                this.mealName = '修改套餐';
                this.addDialogMeal = true;
                this.Meal.name = scope.row.name;
                this.Meal.money = scope.row.money;
                this.Meal.defaule = scope.row.defaule;
                this.mealScope = scope;

                this.$nextTick(() => {
                    this.$refs['ValidateForm'].resetFields();
                })
            },
            /* 设置默认套餐 */
            setMealDefaule: function (scope) {
                this.mealLoading = true;
                axios.PublicGoodsMealInfo('PATCH', {
                    defaule: true
                }, scope.row.id).then(response => {
                    axios.PublicGoodsMealInfo('GET', {
                        ware_key: this.GoodsId
                    }).then(response => {
                        this.mealData = response.data.results;
                        this.mealLoading = false;
                    });
                    this.$message({
                        showClose: true,
                        message: '套餐以默认',
                        type: 'success'
                    });
                }).catch(error => {
                    this.mealLoading = false;
                    this.$message({
                        showClose: true,
                        message: '套餐修改失败',
                        type: 'error'
                    });
                });
            },
            /* 删除套餐 */
            MealDelete: function (scope) {
                MessageBox.confirm('此操作将删除该商品套餐 [' + scope.row.name + '], 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.mealLoading = true;
                    axios.PublicGoodsMealInfo('DELETE', {}, scope.row.id).then(response => {
                        this.mealLoading = false;
                        this.mealData.splice(scope.$index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch((error) => {
                        this.mealLoading = false;
                        this.$message({
                            type: 'error',
                            message: '操作失败!'
                        });
                    });

                })
            },
            /* 初始化参数 */
            setInit: function (response) {
                this.GoodsId = response.data.id;
                this.PrefixId = response.data.prefix.id;
                this.Uploads.fileList = response.data.images_set;

                this.Uploads.is_texr = [];
                for (let i = 0; i < response.data.images_set.length; i++) {
                    this.Uploads.is_texr.push(response.data.images_set[i].url);
                }

                this.mealData = response.data.lease_set;
                if (this.mealData.length === 0) {
                    this.Meal.defaule = true;
                }

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
                        this.options_sizer = response.data;
                        this.sizer.GoodsCascA = [rez.data.prefix.brand.id];
                        this.sizer.GoodsCascB = [rez.data.prefix.product.id];
                        this.sizer.GoodsCascC = [rez.data.prefix.technology.id];
                        this.sizer.GoodsCascD = [rez.data.prefix.usescene.id];
                        this.sizer.GoodsCascE = [rez.data.prefix.pricescope.id];
                        this.$nextTick(function () {
                            // Code that will run only after the
                            // entire view has been rendered
                            this.$refs['sizerRulesForm'].validate((valid) => {
                            })
                        });
                    })
                }

            },

            ImageSuccess: function (response, file, fileList) {
                this.Uploads.is_texr = [];
                for (let i = 0; i < fileList.length; i++) {
                    this.Uploads.is_texr.push(fileList[i].url);
                }
            },
            /* 文件列表移除文件时的钩子 */
            ImageRemove(file, fileList) {

                function contains(a, obj) {
                    var i = a.length;
                    while (i--) {
                        if (a[i] === obj) {
                            return i;
                        }
                    }
                    return false;
                }

                if (!this.Uploads.visible) {
                    this.Uploads.visible = false;
                    let uid = file.id;
                    if (!uid) {
                        uid = file.response.id
                    }
                    axios.GoodsPublicImage('DELETE', {}, uid).then(response => {
                        this.Uploads.is_texr = [];
                        for (let i = 0; i < fileList.length; i++) {
                            this.Uploads.is_texr.push(fileList[i].url);
                        }
                    })
                }
            },
            setActive: function (response) {
                this.$store.commit('setActive', this.active + 1);
            },

            beforeAvatarUpload(file) {
                let isJPG = this.Uploads.IsImage.indexOf(file.type) !== -1;
                let isSize = file.size / 1024 / 1024 < this.Uploads.size;

                if (!isJPG) {
                    this.$message.error('文件格式不支持，请上传jpg，png格式图片!');
                    this.Uploads.visible = true
                } else if (!isSize) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    this.Uploads.visible = true
                }

                return isJPG && isSize;
            },

        },
        computed: {
            mealNames: function () {
                return this.Meal.name
            },
            mealMoney: function () {
                return this.Meal.money
            },
            selected: function () {
                return this.selectedOptions
            },
            nextStep: function () {
                //this.Uploads.fileList.length
                //this.mealData
                return [this.Uploads.is_texr.length, this.mealData.length]
            }

        },
        watch: {
            mealNames: function (a, b) {
                if (!a) {
                    this.MealMessage.name.is_valid = true;
                } else {
                    this.MealMessage.name.is_valid = false;
                }
            },
            mealMoney: function (a, b) {
                if (!a) {
                    this.MealMessage.money.is_valid = true;
                } else {
                    this.MealMessage.money.is_valid = false;
                }
            },
            selected: function (a, b) {
                console.log('selected', a, b)
            },

            nextStep: function (a, b) {
                this.next = false;
                if (a[0] !== 0 && a[1] !== 0) this.next = true;
            }
        }
    }
</script>

<style scoped>
    >>> .box-card > .el-dialog > .el-dialog__header {
        padding: 20px 20px 15px;
        border-bottom: 1px solid #ebeef5;
    }

    >>> .box-card > .el-dialog > .el-dialog__body {
        padding: 35px 20px;
        padding-bottom: 0;
        color: #606266;
        font-size: 14px;
    }

    >>> .box-card > .el-dialog .el-dialog__footer {
        padding: 0px 20px 20px;
    }

    >>> .box-card > .el-dialog .el-form-item__content {
        line-height: 20px;
    }
</style>
