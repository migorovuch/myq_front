<template>
    <div>
        <AppForm
                :formModel="formModel"
                @onFormSubmit="onSubmitReset"
                @onFormReset="onResetFormReset"
        >
            <template v-slot:formFooter>
                <b-button type="submit" variant="success">{{$t("Change password")}}</b-button>
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
                            this.$t('Password:'),
                            this.$t('Enter password'),
                            {
                                required: this.$t('This value should not be blank'),
                                minLength: this.$t('This field must be at least {limit} characters long', {limit: minPasswordLength})
                            }
                        ),
                        passwordRepeat: new AppFormInput(
                            "password",
                            this.$t('Repeat password:'),
                            this.$t('Repeat password'),
                            {
                                required: this.$t('This value should not be blank'),
                                minLength: this.$t('This field must be at least {limit} characters long', {limit: minPasswordLength}),
                                sameAsPassword: this.$t('This field should be the same as password'),
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
            let body = new Object();
            body.token = this.queryToken;
            Object.assign(formModel.model, body);
            if (!formModel.errors.invalid) {
              this.resetPassword(formModel.model,
                  () => {
                    this.$router.push({name: 'home'});
                    this.$root.$bvToast.toast(this.$t('Password successfully changed'), {
                      toaster: 'b-toaster-bottom-left',
                      appendToast: true,
                      autoHideDelay: 4000
                    });
                  },
                  data => {
                    formModel.handleResponseErrors(data);
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
