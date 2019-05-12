<template>
    <div>
        <b-container fluid>
            <b-breadcrumb :items="breadcrumb" class="mt-3"></b-breadcrumb>
            <b-row>
                <b-col md="2">
                    <b-list-group>
                        <b-list-group-item v-for="(item, key) in list_group_item" :key="key" :to="item.to"
                                           v-on:click="setBreadCrumbs(item)">
                            {{ item.text }}
                            <b-badge variant="primary" pill v-if="item.number" v-on:click="setBreadCrumbs(item)">
                                {{ item.number }}
                            </b-badge>
                        </b-list-group-item>
                    </b-list-group>
                </b-col>
                <b-col md="10">
                    <router-view name="goods"></router-view>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import bBreadcrumb from 'bootstrap-vue/es/components/breadcrumb/breadcrumb';
    import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'
    import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'

    import bContainer from 'bootstrap-vue/es/components/layout/container';
    import bRow from 'bootstrap-vue/es/components/layout/row';
    import bCol from 'bootstrap-vue/es/components/layout/col'

    import bAlert from 'bootstrap-vue/es/components/alert/alert'
    import bBadge from 'bootstrap-vue/es/components/badge/badge';

    export default {
        name: "admin-goods",
        data: function () {
            return {
                breadcrumb: [
                    /* breadcrumb */
                    {
                        text: '仪盘表',
                        to: {name: 'admin'}
                    },
                    {
                        text: '商品管理',
                        active: true,
                        to: '#'
                    },
                ],
                list_group_item: [
                    /* 左边 list-group */
                    {
                        text: '添加商品',
                        to: {
                            name: 'admin:goods:create:add'
                        },
                        active: false
                    },
                    {
                        text: '商品管理',
                        to: {
                            name: 'admin:goods:index'
                        },
                        active: true
                    },
                    {
                        text: '商品导入',
                        to: {
                            name: 'admin:goods:import'
                        },
                        number: 12,
                        active: false
                    }
                ]
            }
        },
        components: {
            'b-breadcrumb': bBreadcrumb,
            'b-list-group': bListGroup,
            'b-list-group-item': bListGroupItem,

            'b-container': bContainer,
            'b-row': bRow,
            'b-col': bCol,

            'b-alert': bAlert,
            'b-badge': bBadge,
        },
        created: function () {
        },
        mounted: function () {
        },
        methods: {
            setBreadCrumbs: function (item) {
                this.$store.commit('setBreadCrumb', item)
            }
        },
        computed: {
            getBreadCrumb: function () {
                return this.$store.getters.getBreadCrumb
            }
        },
        watch: {
            getBreadCrumb: function (val, oul) {
                this.breadcrumb = this.$store.getters.getBreadCrumb
            }
        },

    }
</script>

<style scoped>

</style>
