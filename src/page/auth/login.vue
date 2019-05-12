<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="col-12 mb-5">
        <div class="col-sm-5 m-auto">
            <div v-loading="loading" element-loading-text="正在登陆中">
                <div class="card text-left border border-white rounded-top">
                    <div class="card-body">
                        <div class="text-left">
                            <h5 class="card-title">登录到后台</h5>
                            <p class="card-text">请输入您的用户名和密码</p>
                        </div>
                        <div class="text-right form-top-right">
                            <i class="fa fa-lock"></i>
                        </div>
                    </div>
                </div>
                <div class="card text-left border border-white bg-light">
                    <div class="card-body">
                        <div class="text-left">

                            <div class="form-group">
                                <b-form-input
                                    v-model.trim.lazy="user.name"
                                    type="text"
                                    :state="userState"
                                    aria-describedby="UserFeedback"
                                    placeholder="用户名">
                                </b-form-input>
                                <b-form-invalid-feedback id="UserFeedback">
                                    用户名长度应大于2位数
                                </b-form-invalid-feedback>
                            </div>
                            <div class="form-group">
                                <b-form-input
                                    v-model.trim.lazy="password.name"
                                    type="password"
                                    :state="passwordState"
                                    aria-describedby="PasswordFeedback"
                                    placeholder="请输入密码"></b-form-input>
                                <b-form-invalid-feedback id="PasswordFeedback">
                                    密码长度应大于6位数
                                </b-form-invalid-feedback>
                            </div>
                            <b-row>
                                <div class="col-12 mb-3" v-show="error.defaults">
                                    <b-alert show variant="warning" class="text-center">{{ error.message }}</b-alert>
                                </div>
                            </b-row>
                            <b-button class="btn-block" variant="primary" v-on:click="loginAccount">登录</b-button>
                        </div>
                    </div>
                </div>
                <div class="card text-left rounded-bottom bg-light border-right-0 border-bottom-0 border-left-0">
                    <div class="card-body mt-0 mb-0 pt-2 pb-2">
                        <div class="text-left">
                            其他登录方式
                            <i class="fab fa-qq ml-2"></i>
                            <i class="fab fa-weixin ml-2"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import bButton from 'bootstrap-vue/es/components/button/button';
    import bAlert from 'bootstrap-vue/es/components/alert/alert';
    import bFormValidFeedback from 'bootstrap-vue/es/components/form/form-valid-feedback';
    import bFormInvalidFeedback from 'bootstrap-vue/es/components/form/form-invalid-feedback';
    import bFormInput from 'bootstrap-vue/es/components/form-input/form-input';
    import bRow from 'bootstrap-vue/es/components/layout/row'

    import fontawesome from '@fortawesome/fontawesome'
    import solid from '@fortawesome/fontawesome-free-solid' // TODO 0.3MB
    import brands from '@fortawesome/fontawesome-free-brands' // TODO 0.3MB

    fontawesome.library.add(solid);
    fontawesome.library.add(brands);

    export default {
        name: "auth-login",
        data: function () {
            return {
                loading: false,
                user: {
                    name: null,
                    lengths: 2,
                    auth: null
                },
                password: {
                    name: null,
                    lengths: 6,
                    auth: null
                },
                error: {
                    message: '用户或密码错误',
                    defaults: false
                }
            }
        },
        components: {
            'b-alert': bAlert,
            'b-button': bButton,
            'b-form-valid-feedback': bFormValidFeedback,
            'b-form-invalid-feedback': bFormInvalidFeedback,
            'b-form-input': bFormInput,
            'b-row': bRow,
        },
        created: function () {
        },
        computed: {
            userState: function () {
                this.$store.commit('setMessage', {
                    defaults: false,
                    message: null
                });
                if (this.user.name !== null && this.user.name.length > this.user.lengths) {
                    this.user.auth = true;
                    return this.user.auth
                } else if (this.user.name === null) {
                    return this.user.auth
                }
                this.user.auth = false;
                return false
            },
            passwordState: function () {
                this.$store.commit('setMessage', {
                    defaults: false,
                    message: null
                });
                if (this.password.name !== null && this.password.name.length > this.password.lengths) {
                    this.password.auth = true;
                    return this.password.auth
                } else if (this.password.name === null) {
                    return this.password.auth
                }
                this.password.auth = false;
                return false
            },
            watchLogin: function () {
                return this.$store.getters.getIsLogin
            },
            messageError: function () {
                return this.$store.getters.getDefault
            }
        },
        watch: {
            /* 监听store中值的变化
             * 成功登录 */
            watchLogin(val, oldVal) {
                if (this.$store.getters.getIsLogin) {
                    this.loading = false;
                    this.$router.push({name: 'admin:goods:index'})
                }
            },

            /* 监听store中值的变化
             * 检测用户登陆密码是否输入错误，亦或者其他错误导致getters.getDefault值发生变化 */
            messageError(val, oul) {
                this.error.defaults = this.$store.getters.getDefault;
                this.error.message = this.$store.getters.getMessage;
                this.loading = false;
                this.$store.commit('logoutAccount')
            }
        },
        methods: {
            loginAccount: function () {

                if (this.userState === null) {
                    this.user.auth = false
                }
                // this.loading = false;

                if (this.passwordState === null) {
                    this.password.auth = false
                }
                if (this.user.auth && this.password.auth) {
                    this.loading = true;
                    this.$store.dispatch('authTokenJwt', {
                        username: this.user.name,
                        password: this.password.name
                    });
                } else {
                    this.loading = false;
                    this.user.auth = false;
                    console.log('用户或密码长度不够', this.userState, this.passwordState)
                }
            },
        },
    }
</script>

<style scoped>
    .row.align-middle {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }

    .card {
        border-radius: inherit;
    }

    .login {
        margin: 10px auto;
        border: 1px solid #00F;
    }

    .form-top-right {
        width: 25%;
        color: #ddd;
        float: right;
        font-size: 66px;
        margin: -80px auto;
    }
</style>
