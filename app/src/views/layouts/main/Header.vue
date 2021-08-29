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
                        <b-nav-item v-if="isAdmin()" :to="{name: 'dashboard_home'}">{{$t("layouts_main.Admin panel")}}</b-nav-item>
                        <b-nav-item :to="{name: 'home'}">{{$t("layouts_main.Home")}}</b-nav-item>
                        <b-nav-item :to="{name: 'my_bookings'}">{{$t('layouts_main.My bookings')}}</b-nav-item>
                        <b-nav-item-dropdown :text="$t('layouts_main.Company')" v-if="isUserLogged()" menu-class="mt-lg-2" >
                          <b-dropdown-item :to="{name: 'my_company'}">{{$t('layouts_main.My Company')}}</b-dropdown-item>
                          <b-dropdown-item :to="{name: 'company'}">{{$t('layouts_main.Edit Company')}}</b-dropdown-item>
                          <b-dropdown-item :to="{name: 'company_bookings'}">{{$t('layouts_main.Bookings')}}</b-dropdown-item>
                          <b-dropdown-item :to="{name: 'company_clients'}">{{$t('layouts_main.Clients')}}</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item v-else v-b-modal.modal-login>{{$t('layouts_main.Company')}}</b-nav-item>
                        <template v-if="!isUserLogged()">
                          <b-nav-item @click="showLoginForm">{{$t("layouts_main.Sign in")}}</b-nav-item>
                          <b-nav-item @click="showRegistrationForm">{{$t("layouts_main.Sign up")}}</b-nav-item>
                        </template>
                        <template v-else>
                          <b-nav-item :to="{name: 'account'}">{{$t('layouts_main.Account')}}</b-nav-item>
                          <b-nav-item @click="logoutAction">{{$t("layouts_main.Logout")}}</b-nav-item>
                        </template>
                      <LanguageSelect/>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </div>
        <b-modal id="modal-login" hide-footer :title="$t('layouts_main.Sign in form')">
            <LoginForm />
        </b-modal>
        <b-modal id="modal-registration" hide-footer :title="$t('layouts_main.Sign up form')">
            <RegistrationForm />
        </b-modal>
        <b-modal v-model="showResetPassword" v-if="queryToken!==''" ref="modalReset" id="modal-reset" hide-footer :title="$t('layouts_main.Reset password')">
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
    import LanguageSelect from "../../components/LanguageSelect";
    import authMiddleware from "../../../plugins/router/authMiddleware";

    export default {
      name: "Header",
      components: {
        Hamburger,
        ResetPasswordForm,
        RegistrationForm,
        LoginForm,
        LanguageSelect
      },
      data: function () {
        return {
          queryToken: '',
          showResetPassword: false,
        };
      },
      computed: {
        userLogged () {
          return this.isUserLogged();
        },
      },
      watch: {
        userLogged (newValue) {
          if (!newValue) {
            this.showLoginForm();
          }
        }
      },
      methods: {
        ...mapActions('account', {
          logout: 'logout'
        }),
        ...mapGetters('account', {
          isUserLogged: 'isUserLogged',
          isAdmin: 'isAdmin'
        }),
        logoutAction() {
          this.logout();
          if (this.$route.meta.middleware) {
            let redirect = false;
            for (let middleware of this.$route.meta.middleware) {
              redirect = middleware.name === 'authMiddleware';
            }
            if (redirect) {
              this.$router.push({name: 'home'});
            }
          }
        },
        showLoginForm()
        {
          this.$root.$emit('bv::show::modal', 'modal-login');
        },
        showRegistrationForm()
        {
          this.$root.$emit('bv::show::modal', 'modal-registration');
        },
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
