<template>
    <div>
        <AppForm
                :formModel="formModel"
                @onFormSubmit="onSubmit"
                @onFormReset="onReset"
        >
            <template v-slot:formFooter>
                <b-button type="submit" variant="success">{{$t("Sign up")}}</b-button>
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
                            this.$t('Name:'),
                            this.$t('Enter name'),
                            {
                                required: this.$t('This value should not be blank')
                            }
                        ),
                        email: new AppFormInput(
                            'email',
                            this.$t('Email:'),
                            this.$t('Enter email'),
                            {
                                required: this.$t('This value should not be blank'),
                                email: this.$t('Incorrect email format'),
                            }
                        ),
                        password: new AppFormInput(
                            'password',
                            this.$t('Password:'),
                            this.$t('Enter password'),
                            {
                                required: this.$t('This value should not be blank'),
                                minLength: this.$t('This field must be at least {limit} characters long', {limit: minPasswordLength})
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
              model.nickname = model.email.replace(/@.*$/, "") + Date.now();
              this.registration({
                data: model,
                successCallback: () => {
                  formModel.model = {
                    fullName: "",
                    email: "",
                    password: "",
                    roles: ["ROLE_USER"]
                  }
                  this.$root.$bvToast.toast(this.$t('Account successfully registered'), {
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
