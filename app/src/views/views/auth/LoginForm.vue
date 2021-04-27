<template>
    <div>
        <div v-show="showLoginForm">
            <AppForm
                    :formModel="formModel"
                    @onFormSubmit="onSubmitLogin"
                    @onFormReset="onResetLogin"
            >
                <template v-slot:formFooter>
                    <b-button type="submit" variant="primary">{{$t("Sign in")}}</b-button>
                    <a href="#" class="ml-2 forgot-password-link" @click.stop.prevent="showLoginForm=false;">{{$t('Forgot password?')}}</a>
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
                    <b-button type="submit" variant="primary">{{$t("Reset password")}}</b-button>
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
    import UserApiProvider from "@/providers/api/UserApiProvider";

    const minPasswordLength = 6;
    export default {
        name: "LoginForm",
        components: {AppForm},
        data: function(){
            return {
                showLoginForm: true,
                userApiProvider: new UserApiProvider(),
                formModel: new AppFormModel({
                        username: '',
                        password: ''
                    }, {
                        username: new AppFormInput(
                                "email",
                                this.$t('Email:'),
                                this.$t('Enter email'),
                                {
                                    required: this.$t('This value should not be blank'),
                                }
                            ),
                        password: new AppFormInput(
                            "password",
                            this.$t('Password:'),
                            this.$t('Enter password'),
                            {
                                required: this.$t('This value should not be blank'),
                                minLength: this.$t('This field must be at least {limit} characters long', {limit: minPasswordLength})
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
                                this.$t('Email:'),
                                this.$t('Enter email'),
                                {
                                    email: this.$t('Incorrect email format'),
                                    required: this.$t('This value should not be blank'),
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
            onSubmitLogin(formModel) {
                this.userApiProvider.login(formModel, () => {
                    this.$bvToast.toast(this.$t('Successfully authenticated'), {
                        toaster: 'b-toaster-top-left',
                        appendToast: true,
                        autoHideDelay: 10000
                    });
                    this.$root.$emit('bv::hide::modal', 'modal-login');
                });
            },
            onResetLogin() {

            },
            onSubmitRequest(formModel) {
                this.userApiProvider.requestPassword(formModel, result => {
                    formModel.model.email = '';
                    if ('message' in result) {
                        this.$bvToast.toast(result.message, {
                            toaster: 'b-toaster-top-left',
                            appendToast: true,
                            autoHideDelay: 10000
                        });
                    }
                });
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
