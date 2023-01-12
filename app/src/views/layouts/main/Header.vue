<template>
    <div>
        <div class="container-fluid">
            <b-navbar fixed="top" variant="light" toggleable="lg">
                <b-navbar-brand :to="{'name':'home'}"><img src="../../../assets/myQ_logo.png" class="logo"></b-navbar-brand>
                <b-navbar-toggle target="nav-collapse">
                  <template #default="{ expanded }">
                    <Hamburger :expanded="expanded" />
                  </template>
                </b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav  class="ml-auto text-right">
                        <b-nav-item v-if="isAdmin()" :to="{name: 'dashboard_home'}">{{$t("layouts_main.Admin panel")}}</b-nav-item>
                        <b-nav-item :to="{name: 'home'}">{{$t("layouts_main.Home")}}--</b-nav-item>
                        <b-nav-item-dropdown :text="$t('layouts_main.Company')" v-if="isUserLogged()" menu-class="mt-lg-2" >
                          <b-dropdown-item :to="{name: 'my_company'}">{{$t('layouts_main.My Company')}}</b-dropdown-item>
                          <b-dropdown-item :to="{name: 'company'}">{{$t('layouts_main.Edit Company')}}</b-dropdown-item>
                          <b-dropdown-item :to="{name: 'company_bookings'}">{{$t('layouts_main.Bookings')}}</b-dropdown-item>
                          <b-dropdown-item :to="{name: 'company_clients'}">{{$t('layouts_main.Clients')}}</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item v-else @click="companyShowLogin">{{$t('layouts_main.Company')}}</b-nav-item>
                        <b-nav-item-dropdown :text="isUserLogged()?getUserData().fullName:$t('layouts_main.Account')" menu-class="mt-lg-2" >
                          <b-dropdown-item :to="{name: 'my_bookings'}">{{$t('layouts_main.My bookings')}}</b-dropdown-item>
                          <b-dropdown-item :to="{name: 'favorite_companies'}">{{$t('layouts_main.Favorite services')}}</b-dropdown-item>
                          <template v-if="!isUserLogged()">
                            <b-dropdown-item @click="showLoginForm">{{$t("layouts_main.Sign in")}}</b-dropdown-item>
                            <b-dropdown-item @click="showRegistrationForm">{{$t("layouts_main.Sign up")}}</b-dropdown-item>
                          </template>
                          <template v-else>
                            <b-dropdown-item :to="{name: 'account'}">{{$t('layouts_main.Account')}}</b-dropdown-item>
                            <b-dropdown-item @click="logoutAction">{{$t("layouts_main.Logout")}}</b-dropdown-item>
                          </template>
                        </b-nav-item-dropdown>
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
    import {mapActions, mapGetters, mapMutations} from "vuex";
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
        showApproveMessage () {
          return this.getShowApproveMessage();
        },
      },
      watch: {
        userLogged (newValue) {
          if (!newValue) {
            this.showLoginForm();
          }
        },
        showApproveMessage (newValue) {
          if (newValue === 1) {
            this.$root.$emit('bv::show::modal', 'modal-login');
            this.$root.$bvToast.toast(this.$t('views_auth.Your account was successfully approved'), {
              toaster: 'b-toaster-bottom-left',
              appendToast: true,
              autoHideDelay: 4000,
              variant: 'success'
            });
            this.setShowApproveMessage(0);
          } else if (newValue === 2) {
            this.$root.$bvToast.toast(this.$t('views_auth.Account approval issue'), {
              toaster: 'b-toaster-bottom-left',
              appendToast: true,
              autoHideDelay: 4000,
              variant: 'danger'
            });
            this.setShowApproveMessage(0);
          }
        }
      },
      methods: {
        ...mapActions('account', {
          logout: 'logout',
          setAfterLoginRedirect: 'setAfterLoginRedirect'
        }),
        ...mapGetters('account', {
          isUserLogged: 'isUserLogged',
          getUserData: 'getUserData',
          isAdmin: 'isAdmin',
          getShowApproveMessage: 'getShowApproveMessage'
        }),
        ...mapMutations('account', {
          setShowApproveMessage: 'setShowApproveMessage'
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
        showLoginForm() {
          this.$root.$emit('bv::show::modal', 'modal-login');
        },
        companyShowLogin() {
          this.setAfterLoginRedirect({data:{name: 'company'}});
          this.showLoginForm();
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
