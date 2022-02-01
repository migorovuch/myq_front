<template>
  <div class="form-group">
    <AppForm
        :formModel="formModel"
        @onFormSubmit="onSubmit"
        @onFormReset="onReset"
    >
      <template v-slot:slug>
        <b-form-group
            id='slug-input-group'
            :label="formModel.form.slug.label"
            label-for="input-slug"
        >
          <b-form-input
              id="input-slug"
              v-model="formModel.model.slug"
              :type="formModel.form.slug.type"
              :class="('slug' in formModel.errors?'is-invalid':'')"
              :placeholder="((formModel.form.slug.placeholder !== '')?formModel.form.slug.placeholder:formModel.form.slug.label)"
          ></b-form-input>
          <div class="invalid-feedback" v-if="('slug' in formModel.errors)">{{formModel.errors.slug}}</div>
          <b-tooltip target="input-slug" triggers="hover">
            {{companyUrl}}
          </b-tooltip>
        </b-form-group>
      </template>
      <template v-slot:logoFormModel>
        <div class="row">
          <div class="col-12 col-sm-6">
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
          </div>
          <div class="col-12 col-sm-6">
            <b-form-group
                :id="'access-token-input-group'"
                :label='$t("views_company.Access token")'
                label-for='access-token-input'
            >
              <b-input-group class="mb-2">
                <b-form-input type="text" id="access-token-input" :value="formModel.model.accessToken" :placeholder='$t("views_company.Access token")'></b-form-input>
                <b-input-group-append>
                  <b-button @click="copyAccessToken" id="copy-access-token-btn" :title='$t("views_company.Copy access token")'><b-icon icon="front"></b-icon></b-button>
                  <b-tooltip target="copy-access-token-btn" triggers="hover">
                    {{$t("views_company.Copy access token")}}
                  </b-tooltip>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </div>
        </div>
      </template>
      <template v-slot:formFooter>
        <div class="row">
          <div class="col-12 col-sm-6 col-lg-3">

          </div>
          <div class="col-12 col-sm-6 col-lg-9 text-right">
              <b-button type="submit" variant="success">{{$t("views_company.Save")}}</b-button>
          </div>
        </div>

      </template>
    </AppForm>
  </div>
</template>

<script>
  import AppFormModel from "@/models/AppFormModel";
  import AppFormInput from "@/models/AppFormInput";
  import {required, email, helpers} from "vuelidate/lib/validators";
  import AppForm from "@/views/components/AppForm";
  import {mapActions, mapGetters} from "vuex";
  import AppFormPhone from "../../../models/AppFormPhone";
  import SlugHelper from "../../../helpers/SlugHelper";

  export default {
    name: "CompanyForm",
    props: {
      companyModel: Object
    },
    watch: {
      companyModel (newValue) {
        this.formModel.model = newValue;
        if (!newValue.logoFormModel && typeof newValue.logo === 'string') {
          this.previewUrl = process.env.VUE_APP_API_URL + '/media/' + newValue.logo + '?' + Date.now();
        }
      },
      nameWatch(newValue, oldValue) {
        let oldSlug = SlugHelper.slug(oldValue);
        if (!this.formModel.model.slug || this.formModel.model.slug === oldSlug) {
          this.formModel.model.slug = SlugHelper.slug(newValue);
        }
      }
    },
    computed: {
      nameWatch() {
        return this.formModel.model.name;
      },
      companyUrl() {
        let id = this.formModel.model.id;
        if ('slug' in this.formModel.model) {
          id = this.formModel.model.slug;
        }
        let href = '';
        if (id != '') {
          let companyRoute = this.$router.resolve({
            name: 'company_vue',
            params: {id},
          });
          href = companyRoute.href;
        }

        return process.env.VUE_APP_API_URL + href;
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
              slug: new AppFormInput(
                  "text",
                  this.$t('views_company.Url slug:'),
                  this.$t('views_company.Part of company page url'),
                  {
                    regex: this.$t('views_company.The slug should consist of letters, numbers or hyphens'),
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
                  {wrapClass: 'col-lg-3'},
                  this.$t('views_company.Google map link (Share)'),
              ),
              logoFormModel: new AppFormInput(
                  "file",
                  this.$t('views_company.Logo:'),
                  this.$t('views_company.Select logo'),
                  {},
                  {wrapClass: 'col-lg-6 col-sm-12 col-12'}
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
                slug: {regex: value => {
                    if (typeof value === 'undefined' || value === null || value === '') {
                      return true
                    }
                    return /^[a-z0-9]+(-?[a-z0-9]+)*$/i.test(value)
                  }
                },
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
      loadPreview(event) {
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
                data: logo,
                successCallback: (data) => {
                  this.$root.$bvToast.toast(this.$t('views_company.Logo successfully saved'), {
                    toaster: 'b-toaster-bottom-left',
                    appendToast: true,
                    autoHideDelay: 4000,
                    variant: 'success'
                  });
                },
                failCallback: (data) => {
                  this.$root.$bvToast.toast(this.$t('views_company.Upload logo error! Try to use a smaller one'), {
                    toaster: 'b-toaster-bottom-left',
                    variant: 'danger',
                    appendToast: true,
                    autoHideDelay: 4000
                  });
                }
              });
            }
            this.$emit('onFormSubmit', formModel);
            this.$root.$bvToast.toast(this.$t('views_company.Successfully saved'), {
              toaster: 'b-toaster-bottom-left',
              appendToast: true,
              autoHideDelay: 4000,
              variant: 'success'
            });
          };
          formModel.model.timezoneoffset = new Date().getTimezoneOffset() * 60;
          formModel.model.timezoneoffset = formModel.model.timezoneoffset * -1;
          if (!this.getCompany()) {
            this.createCompany({
              data: formModel.model,
              successCallback: successCallback,
              failCallback: (data) => {formModel.handleResponseErrors(data);}
            });
          } else {
            this.updateCompany({
              id: this.getCompany().id,
              data: formModel.model,
              successCallback: successCallback,
              failCallback: (data) => {formModel.handleResponseErrors(data);}
            });
          }

        }
      },
      onReset() {

      },
      copyAccessToken() {
        let testingCodeToCopy = document.querySelector('#access-token-input')
        testingCodeToCopy.select()

        try {
          if (document.execCommand('copy')) {
            this.$root.$bvToast.toast(this.$t('views_company.Access token copied to clipboard'), {
              toaster: 'b-toaster-bottom-left',
              appendToast: true,
              autoHideDelay: 4000,
              variant: 'success'
            });
          }
        } catch (err) {
          console.error('Oops, unable to copy');
        }

        window.getSelection().removeAllRanges()
      },
    },
    mounted() {

    },
  }
</script>

<style scoped>

</style>
