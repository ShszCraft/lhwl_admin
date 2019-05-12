<!-- 格式化 统一化货币格式 ￥50,245.00 -->
<template>
    <span>{{ currenc }}</span>
</template>

<script>
    import accounting from 'accounting'

    export default {
        name: "currency",
        props: {
            money: {
                type: Number,
                required: true
            },
            prefix: {
                type: String,
                default: '￥'
            }
        },
        computed: {
            currenc: function () {
                return accounting.formatMoney(this.money, this.prefix, 2, ",", ".");
            }
        }
    }
</script>

<style scoped>
    span {
        margin: 0;
        padding: 0;
    }
</style>
