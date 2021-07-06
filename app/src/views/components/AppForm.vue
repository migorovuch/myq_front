<template>
    <b-form @submit.prevent="onFormSubmit" @reset="onFormReset" novalidate class="text-left">
        <div class="invalid-feedback d-block" v-if="formModel.errors.formError!=''">{{appFormModel.errors.formError}}</div>
        <slot name="formBody">
          <div class="row">
            <template v-for="(input, inputName) in appFormModel.form">
              <div :class="`${input.style.wrapClass} col-xs-12`">
                <slot :name="inputName">
                  <div v-if="input.type==='checkbox'" class="mt-2 pt-lg-4">
                    <input
                      type="checkbox"
                      :id="'input-'+inputName"
                      class="apple-switch"
                      :key="'form-checkbox-' + inputName"
                      v-model="appFormModel.model[inputName]"/>
                    <label :for="'input-'+inputName">{{input.label}}</label>
                  </div>
                  <b-form-group
                          v-else
                          :id="inputName + '-input-group'"
                          :label="input.label"
                          :label-for="'input-'+inputName"
                          :key="'form-group-' + inputName"
                  >
                      <b-form-datepicker
                          v-if="input.type==='datepicker'"
                          :id="'input-'+inputName"
                          v-model="appFormModel.model[inputName]"
                          :class="(inputName in formModel.errors?'is-invalid':'')"
                          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                          :placeholder="((input.placeholder !== '')?input.placeholder:input.label)"
                      ></b-form-datepicker>
                      <b-form-timepicker
                          v-else-if="input.type==='timepicker'"
                          :id="'input-'+inputName"
                          v-model="appFormModel.model[inputName]"
                          :class="(inputName in formModel.errors?'is-invalid':'')"
                          label-no-time-selected="-:-"
                          minutes-step="5"
                      ></b-form-timepicker>
                      <b-form-textarea
                              v-else-if="input.type==='textarea'"
                              :id="'input-'+inputName"
                              v-model="appFormModel.model[inputName]"
                              :class="(inputName in formModel.errors?'is-invalid':'')"
                              :placeholder="((input.placeholder !== '')?input.placeholder:input.label)"
                      ></b-form-textarea>
                      <b-form-file
                              v-else-if="input.type==='file'"
                              :id="'input-'+inputName"
                              v-model="appFormModel.model[inputName]"
                              :class="(inputName in formModel.errors?'is-invalid':'')"
                              :placeholder="((input.placeholder !== '')?input.placeholder:input.label)"
                      ></b-form-file>
                      <b-form-select
                          v-else-if="input.type==='select'"
                          v-model="appFormModel.model[inputName]"
                          :class="(inputName in formModel.errors?'is-invalid':'')"
                          :options="input.options"
                      ></b-form-select>
                      <b-form-input
                              v-else
                              :id="'input-'+inputName"
                              v-model="appFormModel.model[inputName]"
                              :type="input.type"
                              :class="(inputName in formModel.errors?'is-invalid':'')"
                              :placeholder="((input.placeholder !== '')?input.placeholder:input.label)"
                      ></b-form-input>
                      <div class="invalid-feedback" v-if="(inputName in appFormModel.errors)">{{appFormModel.errors[inputName]}}</div>
                  </b-form-group>
                </slot>
              </div>
            </template>
          </div>
        </slot>
        <slot name="formFooter"></slot>
    </b-form>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import AppFormModel from "../../models/AppFormModel";

    export default {
        name: "AppForm",
      components: {},
      props: {
            formModel: AppFormModel,
        },
        mixins: [validationMixin],
        validations() {
            let validations = this.formModel.validations;
            return {
                appFormModel: validations
            };
        },
        data: function() {
            return {
                appFormModel: this.formModel,
            };
        },
        methods: {
          onFormSubmit() {
            this.$emit('beforeFormValidation', this.appFormModel);
            this.appFormModel.resetErrors();
            if (this.appFormModel.validations) {
              this.$v.appFormModel.model.$touch();
              let vmodel = this.$v.appFormModel.model;
              this.appFormModel.errors.invalid = vmodel.$invalid;
              if (this.appFormModel.errors.invalid) {
                for (let inputName in this.formModel.form) {
                  if (inputName in vmodel && vmodel[inputName].$invalid) {
                    let input = this.formModel.form[inputName];
                    if ('errorLabels' in input) {
                      for (let errorKey in input.errorLabels) {
                        if (!vmodel[inputName][errorKey]) {
                          this.appFormModel.errors[inputName] = input.errorLabels[errorKey];
                        }
                      }
                    }
                  }
                }
              }
            }
            this.$emit('onFormSubmit', this.appFormModel);
          },
          onFormReset() {
            this.$emit('onFormReset', this.appFormModel);
          }
        }
    }
</script>

<style scoped>

</style>
