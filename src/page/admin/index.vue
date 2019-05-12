<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>

    <b-navbar toggleable="md" type="dark" :variant="navbar.variant">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand :href="navbar.title.url">{{ navbar.title.name }}</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-for="(link, key) in navbar.link" :key="key" :href="link.url">{{ link.name }}</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
          <b-nav-item-dropdown text="管理" right>
            <b-dropdown-item :to="{name: 'admin:order:latest'}">订单</b-dropdown-item>
            <b-dropdown-item :to="{name: 'admin:goods:index'}">商品</b-dropdown-item>
            <b-dropdown-item :to="{name: 'admin:user'}">用户</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="user.name" v-if="user.name" right>
            <b-dropdown-item v-on:click="logoutAccount">登出</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item href="#">站点设置</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item v-else :to="{name: 'auth:login'}">请登录</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view name="admin_index"></router-view>
  </div>
</template>

<script>
  import bNavbar from 'bootstrap-vue/es/components/navbar/navbar';
  import bNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand';
  import bNavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle';
  import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav';
  import bCollapse from 'bootstrap-vue/es/components/collapse/collapse';
  import bNavItem from 'bootstrap-vue/es/components/nav/nav-item';
  import bNavForm from 'bootstrap-vue/es/components/nav/nav-form';
  import bNavItemDropdown from 'bootstrap-vue/es/components/nav/nav-item-dropdown';
  import bDropdownItem from 'bootstrap-vue/es/components/dropdown/dropdown-item';
  import bDropdownDivider from 'bootstrap-vue/es/components/dropdown/dropdown-divider';
  import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';
  import bButton from 'bootstrap-vue/es/components/button/button';

  import Cookies from '../../utils/Cookie'

  export default {
    name: "admin-index",
    data: function () {
      return {
        navbar: {
          variant: 'dark',
          title: {
            name: '后台',
            url: '#'
          },
          link: [
            {
              name: '首页',
              url: '#'
            }
          ]
        },
        breadcrumb: [
          /* breadcrumb */
          {
            text: '仪盘表',
            to: {name: 'admin'}
          },
        ],
        user: {
          name: null
        },
        activeIndex: '1',
        activeIndex2: '1'
      }
    },
    components: {
      'b-navbar': bNavbar,
      'b-navbar-toggle': bNavbarToggle,
      'b-navbar-brand': bNavbarBrand,
      'b-navbar-nav': bNavbarNav,
      'b-collapse': bCollapse,
      'b-nav-item': bNavItem,
      'b-nav-form': bNavForm,
      'b-nav-item-dropdown': bNavItemDropdown,

      'b-dropdown-item': bDropdownItem,
      'b-dropdown-divider': bDropdownDivider,

      'b-form-input': bFormInput,

      'b-button': bButton
    },
    created: function () {
      if (this.$store.state.auth.user.username === null) {
        if (Cookies.getCookieAutherizationToken()) {
          this.$store.state.auth.user.username = Cookies.getCookieAutherizationUsername();
          this.$store.state.auth.token = Cookies.getCookieAutherizationToken();
        }
      }
      this.user.name = this.$store.getters.getUser;
    },
    mounted: function () {
      this.user.name = this.$store.getters.getUser;
    },
    computed: {
      isLoginOut: function () {
        return this.$store.getters.getIsLogin
      }
    },
    watch: {
      /* 监听store中值的变化
       * 成功退出 */
      isLoginOut(val, oldVal) {
        if (!this.$store.getters.getIsLogin) {
          this.$router.push({name: 'auth:login'})
        }
      }
    },
    methods: {
      logoutAccount: function () {
        this.$store.commit('logoutAccount');
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
  }
</script>

<style scoped>

</style>
