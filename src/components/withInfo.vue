<template>
    <el-form class="demo-ruleForm m-0 p-0" label-width="100px" ref="infoForm"
             @validate="validate"
             :model="openData">
        <el-form-item
            :rules="[{ required: true, message: '请输入参数'}]"
            v-for="(item, key) in options" :key="key"
            :prop="item.value + '.value'" :label="item.label">

            <el-input v-model="openData[item.value].value"></el-input>
        </el-form-item>
    </el-form>

</template>

<script>
    import {
        Form,
        FormItem,
        Input,
        Button
    } from 'element-ui'

    export default {
        name: "withInfo",
        data() {
            return {
                text: this.openData,
                message: this.options
            }
        },
        props: {
            options: {
                type: Array
            },
            openData: {
                type: Object
            }
        },
        computed: {
            textData: function () {
                return this.openData
            }
        },
        components: {
            'el-form': Form,
            'el-form-item': FormItem,
            'el-input': Input,
            'el-botton': Button
        },
        methods: {
            validate: function (ss) {
                console.log('ss', ss)
            }
        }
    }
</script>

<style scoped>

</style>
