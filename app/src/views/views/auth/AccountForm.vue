<template>
  <b-container class="pt-3">
    <AppForm
        :formModel="formModel"
        @onFormSubmit="onSubmit"
    >
      <template v-slot:formFooter>
        <div class="email-warning text-danger" v-if="originalEmail !== formModel.model.email">
          {{$t("views_auth.After email change your account will be deactivated! A confirmation account email will be sent to you")}}
        </div>
        <div class="text-right">
          <b-button type="submit" variant="success">{{$t("views_auth.Save")}}</b-button>
        </div>
      </template>
    </AppForm>
    </b-container>
</template>

<script>
import AppForm from "../../components/AppForm";
import AppFormModel from "../../../models/AppFormModel";
import AppFormPhone from "../../../models/AppFormPhone";
import AppFormInput from "../../../models/AppFormInput";
import {required, requiredIf, email, minLength, sameAs} from "vuelidate/lib/validators";
import {mapGetters, mapActions} from "vuex";

let minPasswordLength = 6;

export default {
  name: "AccountForm",
  components: {AppForm},
  data() {
    return {
      originalEmail: null,
      formModel: new AppFormModel(
          {
            email:'',
            nickname:'',
            fullName:'',
            phone:'',
            oldPassword:'',
            password:'',
            repeatPassword:'',
          },
          {
            email: new AppFormInput(
                "text",
                this.$t('views_auth.Email:'),
                this.$t('views_auth.Your email'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                },
                {wrapClass: 'col-lg-3 col-sm-6'}
            ),
            nickname: new AppFormInput(
                "text",
                this.$t('views_auth.Nickname:'),
                this.$t('views_auth.Your login'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                },
                {wrapClass: 'col-lg-3 col-sm-6'}
            ),
            fullName: new AppFormInput(
                "text",
                this.$t('views_auth.Your name:'),
                this.$t('views_auth.Enter your name'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                },
                {wrapClass: 'col-lg-3 col-sm-6'}
            ),
            phone: new AppFormPhone(
                "phone",
                this.$t('views_auth.Your phone:'),
                this.$t('views_auth.Enter your phone'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                  phone: this.$t('views_auth.Phone number is not valid'),
                },
                {wrapClass: 'col-lg-3 col-sm-6'}
            ),
            oldPassword: new AppFormInput(
                "password",
                this.$t('views_auth.Old password:'),
                this.$t('views_auth.Enter your old password'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                },
                {wrapClass: 'col-lg-3 col-sm-6'}
            ),
            password: new AppFormInput(
                "password",
                this.$t('views_auth.New password:'),
                this.$t('views_auth.Enter your new password'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                  minLength: this.$t('views_auth.This field must be at least {limit} characters long', {limit: minPasswordLength})
                },
                {wrapClass: 'col-lg-3 col-sm-6'}
            ),
            repeatPassword: new AppFormInput(
                "password",
                this.$t('views_auth.Repeat password:'),
                this.$t('views_auth.Repeat password'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                  minLength: this.$t('views_auth.This field must be at least {limit} characters long', {limit: minPasswordLength}),
                  sameAsPassword: this.$t('views_auth.This field should be the same as New password'),
                },
                {wrapClass: 'col-lg-3 col-sm-6'}
            ),
          }, null, {
            model: {
              email: {required},
              nickname: {required},
              fullName: {required},
              phone: {required},
              oldPassword: {
                required: requiredIf((model) => !model.password.isEmpty() || !model.repeatPassword.isEmpty())
              },
              password: {
                required: requiredIf((model) => !model.oldPassword.isEmpty() || !model.repeatPassword.isEmpty()),
                minLength: minLength(minPasswordLength)
              },
              repeatPassword: {
                required: requiredIf((model) => !model.oldPassword.isEmpty() || !model.password.isEmpty()),
                minLength: minLength(minPasswordLength),
                sameAsPassword: sameAs('password')
              },
            }
          }
      )
    };
  },
  created() {
    Object.assign(this.formModel.model, this.getUserData());
    this.originalEmail = this.formModel.model.email;
  },
  methods: {
    ...mapGetters('account', {
      isUserLogged: 'isUserLogged',
      getUserData: 'getUserData'
    }),
    ...mapActions('account', {
      changeAccount: 'changeAccount',
    }),
    changeEmail(value) {
      this.warningMessage ='';
    },
    onSubmit(formModel) {
      if (!formModel.errors.invalid) {
        this.changeAccount({
          data: formModel.model,
          successCallback: () => {

            this.$root.$bvToast.toast(this.$t('views_auth.Successfully saved'), {
              toaster: 'b-toaster-bottom-left',
              appendToast: true,
              autoHideDelay: 4000
            });
            this.$root.$emit('bv::hide::modal', 'modal-login');
          },
          failCallback: (data) => {formModel.handleResponseErrors(data);}
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
