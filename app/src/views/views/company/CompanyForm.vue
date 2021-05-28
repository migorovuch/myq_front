<template>
  <div>
    <AppForm
        :formModel="formModel"
        @onFormSubmit="onSubmit"
        @onFormReset="onReset"
    >
      <template v-slot:formFooter>
        <b-button type="submit" variant="primary">{{$t("Save")}}</b-button>
      </template>
    </AppForm>
  </div>
</template>

<script>
  import AppFormModel from "@/models/AppFormModel";
  import AppFormInput from "@/models/AppFormInput";
  import {required, email} from "vuelidate/lib/validators";
  import AppForm from "@/views/components/AppForm";
  import {mapGetters} from "vuex";

  export default {
    name: "CompanyForm",
    components: {AppForm},
    data: function() {
      return {
        formModel: new AppFormModel(
            null,
            {
              name: new AppFormInput(
                  "text",
                  this.$t('Company name:'),
                  this.$t('Enter company name'),
                  {
                    required: this.$t('This value should not be blank'),
                  }
              ),
              email: new AppFormInput(
                  "email",
                  this.$t('Email:'),
                  this.$t('Enter email'),
                  {
                    required: this.$t('This value should not be blank'),
                    email: this.$t('Value is not valid')
                  }
              ),
              phone: new AppFormInput(
                  "text",
                  this.$t('Phone:'),
                  this.$t('Enter phone'),
                  {}
              ),
              logo: new AppFormInput(
                  "file",
                  this.$t('Logo:'),
                  this.$t('Select logo'),
                  {}
              ),
              address: new AppFormInput(
                  "text",
                  this.$t('Address:'),
                  this.$t('Enter address'),
                  {}
              ),
              description: new AppFormInput(
                  "textarea",
                  this.$t('Description:'),
                  this.$t('Enter description'),
                  {}
              ),
            }, null, {
              model: {
                name: {required,},
                email: {required, email},
              }
            }
        )
      };
    },
    methods: {
      ...mapGetters('company', {
        getCompany: 'getModel'
      }),
      onSubmit(formModel) {
        console.log(formModel);
        this.$bvToast.toast(this.$t('Successfully saved'), {
          toaster: 'b-toaster-top-left',
          appendToast: true,
          autoHideDelay: 10000
        });
        // this.$root.$emit('bv::hide::modal', 'company-settings');
      },
      onReset() {

      }
    },
    created() {
      this.formModel.model = this.getCompany();
    },
  }
</script>

<style scoped>

</style>
