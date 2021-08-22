<template>
  <div class="form-group">
    <AppForm
        :formModel="formModel"
        @onFormSubmit="onSubmit"
        @onFormReset="onReset"
    >
      <template v-slot:logoFormModel>

        <b-form-group
            :id="'logo-input-group'"
            :label="formModel.form.logoFormModel.label"
            :label-for="'input-logo'"
            :key="'form-group-logo'"
        >
          <label>
            <b-form-file
                v-show="!previewUrl"
                :id="'input-logo'"
                accept="image/jpeg, image/png"
                v-model="formModel.model.logoFormModel"
                :class="('logo' in formModel.errors?'is-invalid':'')"
                @change="loadPreview"
                :placeholder="((formModel.form.logoFormModel.placeholder !== '')?formModel.form.logoFormModel.placeholder:formModel.form.logoFormModel.label)"
            ></b-form-file>
            <img v-if="previewUrl" class="w-100" :src="previewUrl" />
          </label>
          <div class="invalid-feedback" v-if="('logo' in formModel.errors)">{{formModel.errors.logo}}</div>
        </b-form-group>
      </template>
      <template v-slot:formFooter>
        <div class="text-right">
          <b-button type="submit" variant="success">{{$t("views_company.Save")}}</b-button>
        </div>
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
  import AppFormPhone from "../../../models/AppFormPhone";

  export default {
    name: "CompanyForm",
    props: {
      companyModel: Object
    },
    watch: {
      companyModel (newValue) {
        this.formModel.model = newValue;
        if (!newValue.logoFormModel && typeof newValue.logo === 'string') {
          this.previewUrl = process.env.VUE_APP_API_URL.replaceAll("'", '') + '/media/' + newValue.logo + '?' + Date.now();
        }
      }
    },
    components: {AppForm},
    data: function() {
      return {
        previewUrl: null,
        formModel: new AppFormModel(
            this.companyModel,
            {
              name: new AppFormInput(
                  "text",
                  this.$t('views_company.Company name:'),
                  this.$t('views_company.Enter company name'),
                  {
                    required: this.$t('views_company.This value should not be blank'),
                  },
                  {wrapClass: 'col-lg-3'}
              ),
              email: new AppFormInput(
                  "email",
                  this.$t('views_company.Email:'),
                  this.$t('views_company.Enter email'),
                  {
                    required: this.$t('views_company.This value should not be blank'),
                    email: this.$t('views_company.Value is not valid')
                  },
                  {wrapClass: 'col-lg-3'}
              ),
              phone: new AppFormPhone(
                  "phone",
                  this.$t('views_company.Phone:'),
                  this.$t('views_company.Phone number'),
                  {
                    phone: this.$t('views_company.Phone number is not valid'),
                  },
                  {wrapClass: 'col-lg-3'}
              ),
              address: new AppFormInput(
                  "text",
                  this.$t('views_company.Address:'),
                  this.$t('views_company.Enter address'),
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              addressLink: new AppFormInput(
                  "text",
                  this.$t('views_company.Address link:'),
                  this.$t('views_company.Enter address link'),
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              logoFormModel: new AppFormInput(
                  "file",
                  this.$t('views_company.Logo:'),
                  this.$t('views_company.Select logo'),
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              description: new AppFormInput(
                  "textarea",
                  this.$t('views_company.Description:'),
                  this.$t('views_company.Enter description'),
                  {},
                  {wrapClass: 'col-lg-12'}
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
        uploadCompanyLogo: 'uploadLogo'
      }),
      ...mapActions('schedule', {
        loadScheduleList: 'load'
      }),
      loadPreview(event){
        const file = event.target.files[0];
        this.previewUrl = URL.createObjectURL(file);
      },
      onSubmit(formModel) {
        if (!formModel.errors.invalid) {
          let logo = formModel.model.logoFormModel;
          if (logo && Object.keys(logo).length !== 0 && typeof logo !== 'string') {
            formModel.model.logo = null;
          }
          let successCallback = (data) => {
            if (logo && Object.keys(logo).length !== 0) {
              this.uploadCompanyLogo({
                id: data.id,
                data: logo
              });
            }
            this.$root.$bvToast.toast(this.$t('views_company.Successfully saved'), {
              toaster: 'b-toaster-bottom-left',
              appendToast: true,
              autoHideDelay: 4000
            });
          };
          if (!this.getCompany()) {
            this.createCompany({
              data: formModel.model,
              successCallback: successCallback
            });
          } else {
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

    },
  }
</script>

<style scoped>

</style>
