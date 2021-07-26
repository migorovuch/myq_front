<template>
  <div>
    <AppForm
        :formModel="formModel"
        @onFormSubmit="onSubmit"
    >
      <template v-slot:formFooter>
        <div class="text-right">
          <b-button type="submit" variant="success">{{$t("views_auth.Save")}}</b-button>
        </div>
      </template>
    </AppForm>
  </div>
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
      formModel: new AppFormModel(
          {
            nickname:'',
            fullName:'',
            phone:'',
            password:'',
            newPassword:'',
            repeatPassword:'',
          },
          {
            nickname: new AppFormInput(
                "text",
                this.$t('views_auth.Nickname:'),
                this.$t('views_auth.Your login'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                },
                {wrapClass: 'col-lg-4 col-sm-6'}
            ),
            fullName: new AppFormInput(
                "text",
                this.$t('views_auth.Your name:'),
                this.$t('views_auth.Enter your name'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                },
                {wrapClass: 'col-lg-4 col-sm-6'}
            ),
            phone: new AppFormPhone(
                "phone",
                this.$t('views_auth.Your phone:'),
                this.$t('views_auth.Enter your phone'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                  phone: this.$t('views_auth.Phone number is not valid'),
                },
                {wrapClass: 'col-lg-4 col-sm-6'}
            ),
            password: new AppFormInput(
                "password",
                this.$t('views_auth.Old password:'),
                this.$t('views_auth.Enter your old password'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                },
                {wrapClass: 'col-lg-4 col-sm-6'}
            ),
            newPassword: new AppFormInput(
                "password",
                this.$t('views_auth.New password:'),
                this.$t('views_auth.Enter your new password'),
                {
                  required: this.$t('views_auth.This value should not be blank'),
                  minLength: this.$t('views_auth.This field must be at least {limit} characters long', {limit: minPasswordLength})
                },
                {wrapClass: 'col-lg-4 col-sm-6'}
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
                {wrapClass: 'col-lg-4 col-sm-6'}
            ),
          }, null, {
            model: {
              nickname: {required},
              fullName: {required},
              phone: {required},
              password: {
                required: requiredIf((model) => !model.newPassword.isEmpty() || !model.repeatPassword.isEmpty())
              },
              newPassword: {
                required: requiredIf((model) => !model.password.isEmpty() || !model.repeatPassword.isEmpty()),
                minLength: minLength(minPasswordLength)
              },
              repeatPassword: {
                required: requiredIf((model) => !model.password.isEmpty() || !model.newPassword.isEmpty()),
                minLength: minLength(minPasswordLength),
                sameAsPassword: sameAs('newPassword')
              },
            }
          }
      )
    };
  },
  created() {
    Object.assign(this.formModel.model, this.getUserData());
  },
  methods: {
    ...mapGetters('account', {
      isUserLogged: 'isUserLogged',
      getUserData: 'getUserData'
    }),
    ...mapActions('account', {
      changeAccount: 'changeAccount',
    }),
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
