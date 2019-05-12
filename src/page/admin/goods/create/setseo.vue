<template>
    <div>
        <el-card shadow="never" class="mb-3">
            <span>SEO设置</span>

            <el-button style="float: right; padding: 3px 0" type="text" @click="nextStep" v-if="next">完成</el-button>
            <el-button style="float: right; padding: 3px 0" type="text" v-else disabled>完成</el-button>

            <el-tooltip style="float: right; padding: 2px 20px 0 5px;"
                        content="勾选发布商品,点击完成将发布商品.否则需要手动发布商品"
                        placement="bottom" effect="light">
                <i class="el-icon-info"></i>
            </el-tooltip>

            <el-checkbox style="float: right; padding: 1px 0;" v-if="next" v-model="checked">发布商品</el-checkbox>
            <el-checkbox style="float: right; padding: 1px 0;" v-else v-model="checked" disabled>发布商品</el-checkbox>
        </el-card>

        <el-row :gutter="20">
            <el-col :span="6">
                <el-card shadow="never" v-loading="label_loading">
                    <div slot="header" class="clearfix">
                        <span>标签</span>
                        <el-tooltip content="设置标签，在搜索的时候更精确。请为每个商品细心设置标签。标签应该是一组关键词 [88A, 88A硒鼓, 硒鼓墨粉]"
                                    placement="bottom" effect="light">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                    <div>
                        <el-tag
                            v-for="(tag, key) in label_info"
                            :key="key"
                            closable
                            :disable-transitions="false"
                            class="mb-2 mr-2"
                            @close="handleClose(tag)">
                            {{tag.label}}
                        </el-tag>
                        <el-input
                            type="text"
                            class="input-new-tag mb-2 mr-2"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag mb-2 mr-2" size="small" @click="showInput">添加标签
                        </el-button>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18">
                <el-card shadow="never" v-loading="seo_loading">
                    <div slot="header" class="clearfix">
                        <span>SEO信息</span>
                        <el-tooltip content="商品SEO设置,有助于百度收录等"
                                    placement="bottom" effect="light">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="setSeoSave">保存</el-button>
                    </div>
                    <div>
                        <el-form :model="seoValidateForm" ref="seoValidateForm" label-width="100px"
                                 class="demo-ruleForm">
                            <el-form-item
                                prop="keyword">
                                <template slot="label">
                                    关键词
                                    <el-tooltip placement="bottom" effect="light">
                                        <template slot="content">
                                            请逗号 <code>,</code> 分隔,关键词用于百度搜索SEO优化
                                        </template>
                                        <i class="el-icon-info"></i>
                                    </el-tooltip>
                                </template>

                                <el-input clearable
                                          type="keyword"
                                          autocomplete="off"
                                          v-model.number="seoValidateForm.keyword"></el-input>

                            </el-form-item>

                            <el-form-item
                                prop="describe">
                                <template slot="label">
                                    描述信息
                                    <el-tooltip content="描述信息，为商品的描述信息.如: 该商品的特征,等"
                                                placement="bottom" effect="light">
                                        <i class="el-icon-info"></i>
                                    </el-tooltip>
                                </template>
                                <el-input clearable
                                          type="describe"
                                          autocomplete="off"
                                          v-model.number="seoValidateForm.describe"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </el-col>
        </el-row>

    </div>

</template>

<script>
    import {
        Card,
        Button,
        Form,
        FormItem,
        Input,
        Tag,
        Row,
        Col,
        Tooltip,
        Checkbox
    } from 'element-ui'
    import axios from '@/axios/index'
    export default {
        name: "setseo",
        data: function () {
            return {
                next: true,
                checked: false, // 是否发布商品
                active: 4,
                GoodsId: null,
                Is_valid: false,

                inputVisible: false,
                inputValue: '',

                label_info: [],
                label_loading: false, // 标签板块 加载
                seoValidateForm: {
                    keyword: '',
                    describe: ''
                },
                seo_loading: false
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
        methods: {
            /* 初始化默认值 */
            setInit: function (response) {
                this.GoodsId = response.data.id;
                this.label_info = response.data.label_info;
                this.seoValidateForm.keyword = response.data.keyword;
                this.seoValidateForm.describe = response.data.describe;
            },
            /* 下一步 */
            nextStep: function () {
                console.log(this.next);
                if (!this.next) return;

                this.$store.commit('setActive', this.active + 1);

                const loading = this.$loading({
                    lock: true,
                    text: '商品正在添加中'
                });

                axios.GoodsPublicGoods('PATCH', {
                    release: this.checked
                }, this.GoodsId).then(response => {
                    let vm = this;
                    setTimeout(() => {
                        loading.text = '商品以添加完成,正在跳转页面...';
                        setTimeout(() => {
                            loading.close();
                            vm.$store.commit('delInit');
                            vm.$router.push({
                                name: 'admin:goods:create:add'
                            });
                        }, 300);
                    }, 300);
                });
            },

            /* 保存SEO信息 */
            setSeoSave: function () {
                console.log('', this.seoValidateForm)
                this.seo_loading = true;
                axios.GoodsPublicGoods('PATCH', {
                    keyword: this.seoValidateForm.keyword,
                    describe: this.seoValidateForm.describe
                }, this.GoodsId).then(response => {
                    this.seo_loading = false;
                    this.setInit(response);
                    this.$message({
                        type: 'success',
                        message: 'SEO信息以保存'
                    })
                }).catch(error => {
                    this.seo_loading = false;
                    this.$message({
                        type: 'error',
                        message: 'SEO信息保存失败'
                    })
                });
            },
            /* 关闭 Tag 时触发的事件 */
            handleClose(tag) {
                axios.ModelsPublicGoodsLabelInfo('DELETE', {}, tag.id).then(response => {
                    this.label_info.splice(this.label_info.indexOf(tag), 1);
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: '标签删除失败'
                    })
                });

            },
            /* 点击事件 */
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            /* 在 Input 失去焦点时触发 添加标签 */
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.label_loading = true;
                    axios.ModelsPublicGoodsLabelInfo('POST', {
                        label: inputValue,
                        key: this.GoodsId
                    }).then(response => {
                        this.label_loading = false;
                        this.label_info.push(response.data);
                        this.seoValidateForm.keyword += inputValue + ', ';
                        this.$message({
                            type: 'success',
                            message: '标签以添加'
                        })
                    }).catch(error => {
                        this.label_loading = false;
                        this.$message({
                            type: 'error',
                            message: '标签添加失败'
                        })
                    });
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        },
        components: {
            'el-card': Card,
            'el-button': Button,
            'el-form': Form,
            'el-form-item': FormItem,
            'el-input': Input,
            'el-tag': Tag,
            'el-row': Row,
            'el-col': Col,
            'el-tooltip': Tooltip,
            'el-checkbox': Checkbox
        }
    }
</script>

<style scoped>
    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        /*margin-left: 10px;*/
        vertical-align: bottom;
    }
</style>
