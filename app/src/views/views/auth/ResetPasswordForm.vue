<template>
    <div>
        <AppForm
                :formModel="formModel"
                @onFormSubmit="onSubmitReset"
                @onFormReset="onResetFormReset"
        >
            <template v-slot:formFooter>
                <b-button type="submit" variant="success">{{$t("views_auth.Change password")}}</b-button>
            </template>
        </AppForm>
    </div>
</template>

<script>
    import { required, minLength, sameAs } from "vuelidate/lib/validators";
    import AppForm from "../../components/AppForm";
    import AppFormInput from "../../../models/AppFormInput";
    import AppFormModel from "../../../models/AppFormModel";
    import {mapActions} from "vuex";

    let minPasswordLength = 6;

    export default {
        name: "ResetPasswordForm",
        components: {AppForm},
        props: {
            queryToken: String
        },
        data: function() {
            return {
                formModel: new AppFormModel({
                        password: '',
                        passwordRepeat: '',
                    }, {
                        password: new AppFormInput(
                            "password",
                            this.$t('views_auth.Password:'),
                            this.$t('views_auth.Enter password'),
                            {
                                required: this.$t('views_auth.This value should not be blank'),
                                minLength: this.$t('views_auth.This field must be at least {limit} characters long', {limit: minPasswordLength})
                            }
                        ),
                        passwordRepeat: new AppFormInput(
                            "password",
                            this.$t('views_auth.Repeat password:'),
                            this.$t('views_auth.Repeat password'),
                            {
                                required: this.$t('views_auth.This value should not be blank'),
                                minLength: this.$t('views_auth.This field must be at least {limit} characters long', {limit: minPasswordLength}),
                                sameAsPassword: this.$t('views_auth.This field should be the same as password'),
                            }
                        ),
                    }, {
                        formError: '',
                        invalid: false
                    }, {
                        model: {
                            password: {
                                required,
                                minLength: minLength(minPasswordLength)
                            },
                            passwordRepeat: {
                                required,
                                minLength: minLength(minPasswordLength),
                                sameAsPassword: sameAs('password')
                            }
                        }
                    }
                )
            };
        },
        methods: {
          ...mapActions('account', {
            resetPassword: 'resetPassword',
          }),
          onSubmitReset(formModel) {
            let body = {token: this.queryToken};
            Object.assign(formModel.model, body);
            if (!formModel.errors.invalid) {
              this.resetPassword(
                  {
                    data: formModel.model,
                    successCallback: () => {
                      this.$router.push({name: 'home'});
                      this.$root.$bvToast.toast(this.$t('views_auth.Password successfully changed'), {
                        toaster: 'b-toaster-bottom-left',
                        appendToast: true,
                        autoHideDelay: 4000,
                        variant: 'success'
                      });
                      this.$root.$emit('bv::hide::modal', 'modal-reset');
                    },
                    failCallback: data => {
                      formModel.handleResponseErrors(data);
                    }
                  }
              );
            }
          },
          onResetFormReset(formModel) {
            console.log(formModel);
          }
        }
    }
</script>

<style scoped>

</style>
