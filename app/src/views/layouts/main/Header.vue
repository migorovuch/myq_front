<template>
    <div>
        <div class="container-fluid">
            <b-navbar fixed="top" variant="light" toggleable="lg">
                <b-navbar-brand href="#"><img src="../../../assets/myQ_logo.png" class="logo"></b-navbar-brand>
                <b-navbar-toggle target="nav-collapse">
                  <template #default="{ expanded }">
                    <Hamburger :expanded="expanded" />
                  </template>
                </b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav  class="ml-auto text-right">
                        <b-nav-item :to="{name: 'home'}">{{$t("Home")}}</b-nav-item>
                        <b-nav-item :to="{name: 'about'}">{{$t("About")}}</b-nav-item>
                        <b-nav-item :to="{name: 'my_bookings'}">{{$t('My bookings')}}</b-nav-item>
                        <b-nav-item-dropdown :text="$t('Company')" v-if="isUserLogged()" menu-class="mt-lg-2" >
                          <b-dropdown-item :to="{name: 'my_company'}">{{$t('My Company')}}</b-dropdown-item>
                          <b-dropdown-item :to="{name: 'company'}">{{$t('Edit Company')}}</b-dropdown-item>
                          <b-dropdown-item :to="{name: 'company_bookings'}">{{$t('Bookings')}}</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item v-else v-b-modal.modal-login>{{$t('Company')}}</b-nav-item>
                        <template v-if="!isUserLogged()">
                          <b-nav-item v-b-modal.modal-login>{{$t("Sign in")}}</b-nav-item>
                          <b-nav-item v-b-modal.modal-registration>{{$t("Sign up")}}</b-nav-item>
                        </template>
                        <template v-else>
                          <b-nav-item @click="logout">{{$t("Logout")}}</b-nav-item>
                        </template>
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
    import {mapActions, mapGetters} from "vuex";
    import Hamburger from "../../components/Hamburger";

    export default {
      name: "Header",
      components: {
        Hamburger,
        ResetPasswordForm,
        RegistrationForm,
        LoginForm
      },
      data: function () {
        return {
          queryToken: '',
          showResetPassword: false,
        };
      },
      methods: {
        ...mapActions('account', {
          logout: 'logout'
        }),
        ...mapGetters('account', {
          isUserLogged: 'isUserLogged'
        }),
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
        width: 60px;
    }
</style>
