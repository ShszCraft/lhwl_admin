<!-- 时间格式工具类 -->
<template>
    <span>{{ getTime }}</span>
</template>

<script>
    export default {
        name: "dataTime",
        data: function(){
            return {
                is_valid: true
            }
        },
        props: {
            time: {
                type: String,
            }
        },
        created: function(){
            if (!this.time) {
                this.time = '未提供时间信息';
                this.is_valid = false
            }
        },
        methods: {
            formatDate: function (val) {
                /* 格式化日期时间输出 */
                let padDate = function (va) {
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
        },
        computed: {
            getTime: function () {
                if (this.is_valid) {
                    return this.formatDate(this.time);
                } else {
                    return this.time;
                }
            },
        }
    }
</script>

<style scoped>

</style>
