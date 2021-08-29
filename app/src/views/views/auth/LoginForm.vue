<template>
    <div>
        <div v-show="showLoginForm">
            <AppForm
                    :formModel="formModel"
                    @onFormSubmit="onSubmitLogin"
                    @onFormReset="onResetLogin"
            >
                <template v-slot:formFooter>
                    <b-button type="submit" variant="success">{{$t("views_auth.Sign in")}}</b-button>
                    <a href="#" class="ml-2 forgot-password-link" @click.stop.prevent="showLoginForm=false;">{{$t('views_auth.Forgot password?')}}</a>
                </template>
            </AppForm>
        </div>
        <div v-show="!showLoginForm">
            <AppForm
                    :formModel="resetFormModel"
                    @onFormSubmit="onSubmitRequest"
                    @onFormReset="onResetRequest"
            >
                <template v-slot:formFooter>
                    <b-button type="submit" variant="success">{{$t("views_auth.Reset password")}}</b-button>
                </template>
            </AppForm>
        </div>
    </div>
</template>

<script>
    import AppFormModel from "@/models/AppFormModel";
    import AppFormInput from "@/models/AppFormInput";
    import {minLength, required, email} from "vuelidate/lib/validators";
    import AppForm from "@/views/components/AppForm";
    import {mapActions, mapMutations, mapGetters} from "vuex";

    const minPasswordLength = 6;
    export default {
      name: "LoginForm",
      components: {AppForm},
      data: function () {
        return {
          showLoginForm: true,
          formModel: new AppFormModel({
                username: '',
                password: ''
              }, {
                username: new AppFormInput(
                    "email",
                    this.$t('views_auth.Email:'),
                    this.$t('views_auth.Enter email'),
                    {
                      required: this.$t('views_auth.This value should not be blank'),
                    }
                ),
                password: new AppFormInput(
                    "password",
                    this.$t('views_auth.Password:'),
                    this.$t('views_auth.Enter password'),
                    {
                      required: this.$t('views_auth.This value should not be blank'),
                      minLength: this.$t('views_auth.This field must be at least {limit} characters long', {limit: minPasswordLength})
                    }
                ),
              }, {
                formError: '',
                invalid: false
              }, {
                model: {
                  username: {
                    required,
                  },
                  password: {
                    required,
                    minLength: minLength(minPasswordLength)
                  },
                }
              }
          ),
          resetFormModel: new AppFormModel({
                email: '',
              }, {
                email: new AppFormInput(
                    "email",
                    this.$t('views_auth.Email:'),
                    this.$t('views_auth.Enter email'),
                    {
                      email: this.$t('views_auth.Incorrect email format'),
                      required: this.$t('views_auth.This value should not be blank'),
                    }
                ),
              }, {
                formError: '',
                invalid: false
              }, {
                model: {
                  email: {
                    required,
                    email
                  },
                }
              }
          )
        };
      },
      methods: {
        ...mapActions('account', {
          login: 'login',
          requestPassword: 'requestPassword',
        }),
        ...mapMutations('account', {
          resetAfterLoginActions: 'resetAfterLoginActions'
        }),
        ...mapGetters('account', {
          getAfterLoginActions: 'getAfterLoginActions'
        }),
        onSubmitLogin(formModel) {
          if (!formModel.errors.invalid) {
            this.login(
                {
                  data: formModel.model,
                  successCallback: () => {
                    this.$root.$bvToast.toast(this.$t('views_auth.Successfully authenticated'), {
                      toaster: 'b-toaster-bottom-left',
                      appendToast: true,
                      autoHideDelay: 4000
                    });
                    this.$root.$emit('bv::hide::modal', 'modal-login');
                    if (this.getAfterLoginActions().length) {
                      for (let afterLoginAction of this.getAfterLoginActions()) {
                        afterLoginAction.func(afterLoginAction.url, afterLoginAction.options, afterLoginAction.successCallback, afterLoginAction.failCallback, afterLoginAction.errorCallback);
                      }
                      this.resetAfterLoginActions();
                    }
                  },
                  failCallback: (data) => {formModel.handleResponseErrors(data);}
                });
          }
        },
        onResetLogin() {

        },
        onSubmitRequest(formModel) {
          if (!formModel.errors.invalid) {
            this.requestPassword(
                {
                  data: formModel.model,
                  successCallback: result => {
                    formModel.model.email = '';
                    if ('message' in result) {
                      this.$root.$bvToast.toast(result.message, {
                        toaster: 'b-toaster-bottom-left',
                        appendToast: true,
                        autoHideDelay: 4000
                      });
                      this.$root.$emit('bv::hide::modal', 'modal-login');
                    }
                  },
                  failCallback: (data) => {
                    formModel.handleResponseErrors(data);
                  }
                }
            );
          }
        },
        onResetRequest() {

        },
      }
    }
</script>

<style scoped>
.forgot-password-link {
    font-size: 12px;
}
</style>
