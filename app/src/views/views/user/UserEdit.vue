<template>

  <AppForm
      :formModel="formModel"
      @onFormSubmit="onSubmit"
  >
    <template v-slot:formFooter>
      <div class="text-right">
        <b-button type="submit" variant="success">{{$t("edit_user_dashboard.Save")}}</b-button>
      </div>
    </template>
  </AppForm>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import AppFormPhone from "../../../models/AppFormPhone";
import AppFormModel from "../../../models/AppFormModel";
import AppFormInput from "../../../models/AppFormInput";
import AppFormSelect from "../../../models/AppFormSelect";
import {required, email, minLength, sameAs, requiredIf} from "vuelidate/lib/validators";
import AppForm from "@/views/components/AppForm";

let minPasswordLength = 6;

export default {
  name: "UserEdit",
  components: {AppForm},
  data() {
    return {
      userId: this.$route.params.id,
      formModel: new AppFormModel(
          {
            fullName: '',
            email: '',
            nickname: '',
            phone: '',
            roles: [],
            password: '',
            passwordRepeat: '',
            status: 0,
          },
          {
            fullName: new AppFormInput(
                "text",
                this.$t('edit_user_dashboard.Full name:'),
                this.$t('edit_user_dashboard.Enter company name'),
                {
                  required: this.$t('edit_user_dashboard.This value should not be blank'),
                },
                {wrapClass: 'col-lg-3'}
            ),
            email: new AppFormInput(
                "email",
                this.$t('edit_user_dashboard.Email:'),
                this.$t('edit_user_dashboard.Enter email'),
                {
                  required: this.$t('edit_user_dashboard.This value should not be blank'),
                  email: this.$t('edit_user_dashboard.Value is not valid')
                },
                {wrapClass: 'col-lg-3'}
            ),
            nickname: new AppFormInput(
                "text",
                this.$t('edit_user_dashboard.Nickname:'),
                this.$t('edit_user_dashboard.Enter nickname'),
                {
                  required: this.$t('edit_user_dashboard.This value should not be blank'),
                },
                {wrapClass: 'col-lg-3'}
            ),
            phone: new AppFormPhone(
                "phone",
                this.$t('edit_user_dashboard.Phone:'),
                this.$t('edit_user_dashboard.Phone number'),
                {
                  phone: this.$t('edit_user_dashboard.Phone number is not valid'),
                },
                {wrapClass: 'col-lg-3'}
            ),
            roles: new AppFormSelect(
                "select",
                this.$t('edit_user_dashboard.Roles:'),
                null,
                {},
                {wrapClass: 'col-lg-3'},
                null,
                {
                  'ROLE_USER': 'User',
                  'ROLE_ADMIN': 'Admin',
                },
                true,
                2
            ),
            password: new AppFormInput(
                "password",
                this.$t('edit_user_dashboard.New password:'),
                this.$t('edit_user_dashboard.Enter new password'),
                {
                  minLength: this.$t('edit_user_dashboard.This field must be at least {limit} characters long', {limit: minPasswordLength}),
                },
                {wrapClass: 'col-lg-3'}
            ),
            passwordRepeat: new AppFormInput(
                "password",
                this.$t('edit_user_dashboard.Repeat password:'),
                this.$t('edit_user_dashboard.Repeat password'),
                {
                  minLength: this.$t('edit_user_dashboard.This field must be at least {limit} characters long', {limit: minPasswordLength}),
                  sameAsPassword: this.$t('edit_user_dashboard.This field should be the same as password'),
                },
                {wrapClass: 'col-lg-3'}
            ),
            status: new AppFormSelect(
                "select",
                this.$t('edit_user_dashboard.Status:'),
                null,
                {},
                {wrapClass: 'col-lg-3'},
                null,
                {
                  0: this.$t('edit_user_dashboard.Inactive'),
                  1: this.$t('edit_user_dashboard.Active'),
                }
            ),
          }, null, {
            model: {
              fullName: {required,},
              nickname: {required,},
              email: {required, email},
              password: {
                required: requiredIf((model) => model.passwordRepeat && !model.passwordRepeat.isEmpty())
              },
              passwordRepeat: {
                required: requiredIf((model) => (model.password && !model.password.isEmpty())),
                minLength: minLength(minPasswordLength),
                sameAsPassword: sameAs('password')
              },
            }
          }
      )
    };
  },
  created() {
    this.loadUser({
      id: this.userId,
      successCallback: (data) => {
        if (Object.keys(data).length !== 0) {
          this.formModel.model = Object.assign(this.formModel.model, data.data[0]);
          this.setBreadcrumbItems([
            {
              text: this.$t('layouts_dashboard.Dashboard'),
              to: {name: 'dashboard_home'}
            },
            {
              text: this.$t('view_user_dashboard.Users list'),
              to: {name: 'dashboard_users'}
            },
            {
              text: this.formModel.model.fullName
            }
          ]);
        }
      }
    })
  },
  methods: {
    ...mapGetters('user', {
      getUser: 'getModel',
    }),
    ...mapActions('user', {
      loadUser: 'loadOne',
      updateUser: 'update',
    }),
    ...mapMutations('dashboard', {
      setBreadcrumbItems: 'setBreadcrumbItems',
    }),
    onSubmit(formModel) {
      if (!formModel.errors.invalid) {
        this.updateUser({
          id: this.userId,
          data: formModel.model,
          successCallback: () => {
            this.$root.$bvToast.toast(this.$t('view_user_dashboard.Successfully saved'), {
              toaster: 'b-toaster-bottom-left',
              appendToast: true,
              autoHideDelay: 4000,
              variant: 'success'
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
