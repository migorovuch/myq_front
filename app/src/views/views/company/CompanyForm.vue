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
  import {mapActions, mapGetters} from "vuex";

  export default {
    name: "CompanyForm",
    components: {AppForm},
    data: function() {
      return {
        formModel: new AppFormModel(
            {
              name: '',
              email: '',
              phone: '',
              logo: [],
              address: '',
              description: '',
              photos: [],
            },
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
      ...mapActions('company', {
        createCompany: 'create',
        updateCompany: 'update',
        loadMyCompany: 'loadMyCompany',
        uploadCompanyLogo: 'uploadLogo'
      }),
      ...mapActions('schedule', {
        loadScheduleList: 'load'
      }),
      onSubmit(formModel) {
        if (!formModel.errors.invalid) {
          let logo = formModel.model.logo;
          formModel.model.logo = null;
          let successCallback = (data) => {
            if (Object.keys(logo).length !== 0) {
              this.uploadCompanyLogo({
                id: data.id,
                data: logo
              });
            }
            this.$root.$bvToast.toast(this.$t('Successfully saved'), {
              toaster: 'b-toaster-top-left',
              appendToast: true,
              autoHideDelay: 4000
            });
          };
          if (!this.getCompany()) {
            console.log('save');
            this.createCompany({
              data: formModel.model,
              successCallback: successCallback
            });
          } else {
            console.log('update');
            this.updateCompany({
              id: this.getCompany().id,
              data: formModel.model,
              successCallback: successCallback
            });
          }

        }
      },
      onReset() {

      }
    },
    mounted() {
      this.loadMyCompany({
        successCallback: (data) => {
          if (Object.keys(data).length !== 0) {
            this.formModel.model = Object.assign(this.formModel.model, data);
            this.loadScheduleList({filter:{company: data.id}});
          }
        },
        failCallback: (data) => {
          // this.$router.push({ name: 'home' });
        }
      });
    },
  }
</script>

<style scoped>

</style>
