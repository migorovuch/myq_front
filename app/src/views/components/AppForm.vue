<template>
    <b-form @submit.prevent="onFormSubmit" @reset="onFormReset" novalidate class="text-left">
        <div class="invalid-feedback d-block" v-if="formModel.errors.formError!=''">{{appFormModel.errors.formError}}</div>
        <slot name="formBody">
          <template v-for="(input, inputName) in appFormModel.form">
            <slot :name="inputName">
              <b-form-checkbox
                  v-if="input.type==='checkbox'"
                  :id="'input-'+inputName"
                  :key="'form-checkbox-' + inputName"
                  v-model="appFormModel.model[inputName]"
                  value="true"
                  unchecked-value="false"
                  :class="(inputName in formModel.errors?'is-invalid':'') + ' mb-3'"
              >{{input.label}}</b-form-checkbox>
              <b-form-group
                      v-else
                      :id="inputName + '-input-group'"
                      :label="input.label"
                      :label-for="'input-'+inputName"
                      :key="'form-group-' + inputName"
              >
                  <b-form-textarea
                          v-if="input.type==='textarea'"
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
          </template>
        </slot>
        <slot name="formFooter"></slot>
    </b-form>
</template>

<script>
    import { validationMixin } from 'vuelidate';
    import AppFormModel from "../../models/AppFormModel";

    export default {
        name: "AppForm",
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
                this.$v.appFormModel.model.$touch();
                let vmodel = this.$v.appFormModel.model;
                this.appFormModel.errors = {formError: '', invalid: vmodel.$invalid};
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
