<template>
    <div>
        <div class="container-fluid">
            <b-navbar fixed="top" variant="light">
                <b-navbar-brand href="#"><img src="../../../assets/logo.png" class="logo"></b-navbar-brand>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav  class="ml-auto">
                        <b-nav-item :to="{name: 'home'}">{{$t("Home")}}</b-nav-item>
                        <b-nav-item :to="{name: 'about'}">{{$t("About")}}</b-nav-item>
                        <b-nav-item v-b-modal.modal-login>{{$t("Sign in")}}</b-nav-item>
                        <b-nav-item v-b-modal.modal-registration>{{$t("Sign up")}}</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </div>
        <b-modal id="modal-login" hide-footer :title="$t('Sign in form')">
            <LoginForm />
        </b-modal>
        <b-modal id="modal-registration" hide-footer :title="$t('Sign up form')">
            <RegistrationForm />
        </b-modal>
        <b-modal v-model="showResetPassword" v-if="queryToken!==''" ref="modalReset" id="modal-reset" hide-footer :title="$t('Reset password')">
            <ResetPasswordForm :queryToken="queryToken" />
        </b-modal>
    </div>
</template>

<script>
    import ResetPasswordForm from "../../views/auth/ResetPasswordForm";
    import RegistrationForm from "../../views/auth/RegistrationForm";
    import LoginForm from "../../views/auth/LoginForm";

    export default {
        name: "Header",
        components: {
            ResetPasswordForm,
            RegistrationForm,
            LoginForm
        },
        data: function(){
            return {
                queryToken: '',
                showResetPassword: false
            };
        },
        mounted() {
            if (this.$route.name === 'reset-password') {
                this.queryToken = this.$route.params.token;
                this.showResetPassword = this.queryToken !== '';
            }
        }
    }
</script>

<style scoped>
    .logo {
        width: 72px;
    }
</style>
