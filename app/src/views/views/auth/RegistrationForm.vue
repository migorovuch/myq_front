<template>
    <div>
        <AppForm
                :formModel="formModel"
                @onFormSubmit="onSubmit"
                @onFormReset="onReset"
        >
            <template v-slot:formFooter>
                <b-button type="submit" variant="success">{{$t("views_auth.Sign up")}}</b-button>
            </template>
        </AppForm>
    </div>
</template>

<script>
    import AppFormModel from "../../../models/AppFormModel";
    import AppFormInput from "../../../models/AppFormInput";
    import {minLength, required, email} from "vuelidate/lib/validators";
    import AppForm from "../../components/AppForm";
    import {mapActions} from "vuex";

    const minPasswordLength = 6;
    export default {
        name: "RegistrationForm",
        components: {AppForm},
        data: function(){
            return {
                formModel: new AppFormModel(
                    {
                      fullName: "",
                        email: "",
                        password: "",
                        roles: ["ROLE_USER"]
                    },
                    {
                      fullName: new AppFormInput(
                            'text',
                            this.$t('views_auth.Name:'),
                            this.$t('views_auth.Enter name'),
                            {
                                required: this.$t('views_auth.This value should not be blank')
                            }
                        ),
                        email: new AppFormInput(
                            'email',
                            this.$t('views_auth.Email:'),
                            this.$t('views_auth.Enter email'),
                            {
                                required: this.$t('views_auth.This value should not be blank'),
                                email: this.$t('views_auth.Incorrect email format'),
                            }
                        ),
                        password: new AppFormInput(
                            'password',
                            this.$t('views_auth.Password:'),
                            this.$t('views_auth.Enter password'),
                            {
                                required: this.$t('views_auth.This value should not be blank'),
                                minLength: this.$t('views_auth.This field must be at least {limit} characters long', {limit: minPasswordLength})
                            }
                        ),
                    },
                    null,
                    {
                        model: {
                          fullName: {
                                required,
                            },
                            email: {
                                required,
                                email
                            },
                            password: {
                                required,
                                minLength: minLength(minPasswordLength),
                            }
                        }
                    }
                ),
            };
        },
        methods: {
          ...mapActions('account', {
            registration: 'registration',
          }),
          onSubmit(formModel) {
            if (!formModel.errors.invalid) {
              let model = Object.assign(formModel.model, {roles: ["ROLE_USER"]});
              model.nickname = model.email.replace(/@.*$/, "");
              this.registration({
                data: model,
                successCallback: () => {
                  formModel.model = {
                    fullName: "",
                    email: "",
                    password: "",
                    roles: ["ROLE_USER"]
                  }
                  this.$root.$bvToast.toast(this.$t('views_auth.Account successfully registered'), {
                    toaster: 'b-toaster-bottom-left',
                    appendToast: true,
                    autoHideDelay: 4000
                  });
                  this.$root.$emit('bv::hide::modal', 'modal-registration');
                },
                failCallback: data => {
                  formModel.handleResponseErrors(data);
                }
              });
            }
          },
          onReset() {

          },
        }
    }
</script>

<style scoped>

</style>
