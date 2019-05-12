<template>
    <div id="editor">
        <el-alert
            v-if="is_valids"
            :closable="false"
            :title="is_message"
            type="warning"
            class="mb-3">
        </el-alert>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加商品</span>
                <el-button v-on:click="setAppSave" style="float: right; padding: 3px 0" type="text" v-if="netx">下一步</el-button>
                <el-button style="float: right; padding: 3px 0" type="text" v-else disabled>下一步</el-button>
            </div>
            <div>
                <el-row :gutter="30">
                    <el-col :span="24" class="mb-3">
                        <p class="font-weight-normal m-0 mb-1">商品名称</p>
                        <el-input
                            placeholder="请输入商品名称"
                            v-model="name"
                            clearable>
                        </el-input>
                    </el-col>
                </el-row>
                <p class="font-weight-normal m-0 mb-1">商品描述</p>
                <mavon-editor v-model="context" @imgAdd="imgAdd" @imgDel="imgDel" placeholder="请输入商品描述信息"/>
            </div>
        </el-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    import mavonEditor from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'

    import {
        Card,
        Button,
        Input,
        Row,
        Col,
        Alert
    } from 'element-ui'
    import axios from '@/axios/index'
    // use
    Vue.use(mavonEditor);

    export default {
        name: 'editor',
        data() {
            return {
                netx: false,
                name: '',
                context: '',
                unix: null,
                is_valids: false,
                is_message: '请完整的填写以下信息',
                contextImages: {},
            }
        },
        created: function () {
            this.unix = parseInt(new Date().getTime() / 1000);
        },
        components: {
            'el-card': Card,
            'el-button': Button,
            'el-input': Input,
            'el-row': Row,
            'el-col': Col,
            'el-alert': Alert
        },
        methods: {
            /* 添加图片 */
            imgAdd(index, file) {
                this.contextImages[index] = file;
            },

            /* 删除图片 */
            imgDel(file) {
                let index = file[1];
                delete this.contextImages[index];
            },

            /* 提交商品数据
             * 同时提交图片File对象，存储图片到服务器 */
            setAppSave: function () {
                this.Is_valid();
                if (!this.is_valids) {
                    const loading = this.$loading({
                        lock: true,
                        text: '正在添加商品',
                        spinner: 'el-icon-loading'
                    });
                    axios.GoodsPublicGoods('POST', {
                        unix: this.unix,
                        name: this.name,
                        connet: this.context
                    }).then(response => {
                        this.$emit('active', response)
                        setTimeout(() => {
                            loading.text = '已添加';
                            setTimeout(() => {
                                loading.close();
                            }, 400);
                        }, 400);
                    }).catch(error => {
                        this.$message({
                            showClose: true,
                            message: '商品添加失败',
                            type: 'error'
                        });
                        this.$message({
                            showClose: true,
                            message: error,
                            type: 'error'
                        });
                    })
                }
            },

            /* 验证是否内容是否补齐 */
            Is_valid: function () {
                this.netx = false;
                if (!this.name && !this.context) {
                    this.is_valids = true;
                    this.is_message = '请完整的填写以下信息';
                    this.$emit('status', false)
                } else if (!this.name) {
                    this.is_valids = true;
                    this.is_message = '请填写商品名称';
                    this.$emit('status', true)
                } else if (!this.context) {
                    this.is_valids = true;
                    this.is_message = '请填写商品描述';
                    this.$emit('status', true)
                } else {
                    this.is_valids = false;
                    this.netx = true;
                    this.$emit('status', true)
                }
            },
        },
        computed: {
            is_valids_name: function () {
                return this.name
            },
            is_valids_context: function () {
                return this.context
            }
        },
        watch: {
            is_valids_name: function (a, b) {
                this.Is_valid()
            },
            is_valids_context: function (a, b) {
                this.Is_valid()
            }
        }
    }
</script>
<style>
    #editor {
        margin: auto;
        width: 100%;

    }

    #editor > .v-note-wrapper {
        padding: .1rem;
        padding-top: 0;
    }

    .markdown-body {
        height: 600px;
    }

</style>
