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
              <b-badge variant="primary" pill v-if="item.number" v-on:click="setBreadCrumbs(item)">{{ item.number }}
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
  import bContainer from 'bootstrap-vue/es/components/layout/container';
  import bRow from 'bootstrap-vue/es/components/layout/row';
  import bCol from 'bootstrap-vue/es/components/layout/col';
  import bBreadcrumb from 'bootstrap-vue/es/components/breadcrumb/breadcrumb';

  import bListGroup from 'bootstrap-vue/es/components/list-group/list-group';
  import bListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item';

  import bBadge from 'bootstrap-vue/es/components/badge/badge';



  export default {
    name: "admin-order-init",
    data: function () {
      return {
        breadcrumb: [
          /* breadcrumb */
          {
            text: '仪盘表',
            to: {name: 'admin'}
          },
          {
            text: '新订单',
            active: true,
            to: '#'
          },
        ],
        list_group_item: [
          /* 左边 list-group */
          {
            text: '新订单',
            to: {
              name: 'admin:order:latest'
            },
            number: 12,
            active: true
          },
          {
            text: '已完成订单',
            to: {
              name: 'admin:order:completed'
            },
            active: false
          }
        ]
      }
    },
    components: {
      'b-container': bContainer,
      'b-breadcrumb': bBreadcrumb,
      'b-row': bRow,
      'b-col': bCol,

      'b-list-group': bListGroup,
      'b-list-group-item': bListGroupItem,

      'b-badge': bBadge
    },
    methods: {
      setBreadCrumbs: function (item) {
        this.breadcrumb = [
          {
            text: '仪盘表',
            to: {name: 'admin'}
          },
          {
            text: item.text,
            to: {name: item.to.name}
          },
        ];
      }
    },
    computed: {
      getBreadCrumb: function () {
        return this.$store.getters.getBreadCrumb
      }
    },
    watch: {
      getBreadCrumb: function (val, oul) {
        console.log('gettt', val, oul);
        this.breadcrumb = this.$store.getters.getBreadCrumb
      }
    }
  }
</script>

<style scoped>

</style>
