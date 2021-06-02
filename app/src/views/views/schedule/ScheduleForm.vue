<template>
  <div>
    <div class="row">
      <div class="col-4">
        <AppForm
            v-if="formModel.model"
            :formModel="formModel"
            @onFormSubmit="onSubmit"
            @onFormReset="onReset"
        >
          <template v-slot:available>
            <b-form-checkbox
                :id="'input-available'"
                v-model="formModel.model.available"
                value="true"
                unchecked-value="false"
                :class="('available' in formModel.errors?'is-invalid':'') + ' mb-3'"
            >{{formModel.form.available.label}}</b-form-checkbox>
            <b-button v-b-modal.modal-specal-hours>{{ $t('Select availability') }}</b-button>
          </template>
          <template v-slot:formFooter>
            <b-button type="submit" variant="primary">{{$t("Save")}}</b-button>
          </template>
        </AppForm>
      </div>
      <div class="col-8">
        <CompanyCalendar :with-events="true"/>
      </div>
    </div>
    <b-modal id="modal-specal-hours" hide-footer :title="$t('Availability')">
      <SpecialHoursForm :id-schedule="idSchedule"></SpecialHoursForm>
    </b-modal>
  </div>
</template>

<script>
  import AppFormModel from "../../../models/AppFormModel";
  import AppFormInput from "../../../models/AppFormInput";
  import AppForm from "../../components/AppForm";
  import SpecialHoursForm from "../specialHours/SpecialHoursForm";
  import CompanyCalendar from "../../components/CompanyCalendar";
  import {mapActions, mapGetters} from "vuex";
  import {required} from "vuelidate/lib/validators";

  export default {
    name: "ScheduleForm",
    components: {AppForm, CompanyCalendar, SpecialHoursForm},
    data() {
      return {
        formModel: new AppFormModel(
            {
              acceptBookingCondition: 0,
              available: false,
              bookingCondition: 0,
              bookingDuration: 30,
              description: "",
              enabled: true,
              maxBookingTime: 0,
              minBookingTime: 0,
              name: ""
            },
            {
              name: new AppFormInput(
                  "text",
                  this.$t('Name:'),
                  this.$t('Enter name'),
                  {
                    required: this.$t('This value should not be blank'),
                  }
              ),
              enabled: new AppFormInput(
                  "checkbox",
                  this.$t('Available for booking:'),
                  null,
                  {}
              ),
              available: new AppFormInput(
                  "checkbox",
                  this.$t('Always availabl:'),
                  null,
                  {}
              ),
              bookingDuration: new AppFormInput(
                  "number",
                  this.$t('Booking duration:'),
                  'seconds',
                  {}
              ),
              minBookingTime: new AppFormInput(
                  "number",
                  this.$t('Min Booking time:'),
                  'seconds',
                  {}
              ),
              maxBookingTime: new AppFormInput(
                  "number",
                  this.$t('Max Booking time:'),
                  'seconds',
                  {}
              ),
              bookingCondition: new AppFormInput(
                  "select",
                  this.$t('Booking condition:'),
                  '',
                  {},
                  null,
                  [
                    {value: 0, text: this.$t('All users')},
                    {value: 1, text: this.$t('Authorized only')},
                  ]
              ),
              acceptBookingCondition: new AppFormInput(
                  "select",
                  this.$t('Accept booking condition:'),
                  '',
                  {},
                  null,
                  [
                    {value: 0, text: this.$t('Accept all bookings')},
                    {value: 1, text: this.$t('Decline all bookings')},
                    {value: 2, text: this.$t('Accept only from approved users')},
                    {value: 3, text: this.$t('Accept only after pay advance')},
                  ]
              ),
              description: new AppFormInput(
                  "textarea",
                  this.$t('Description:'),
                  this.$t('Enter description'),
                  {}
              ),
            },
            null,
            null
        ),
        idSchedule: this.$route.params.id
      };
    },
    created() {
      this.loadSchedule({
        id: this.$route.params.id,
        successCallback: (data) => {
          this.formModel.model = data;
          this.loadSpecialHours({filter:{schedule:this.$route.params.id}});
        }
      });
    },
    methods: {
      ...mapGetters('specialHours', {
        getSpecialHours: 'getList',
      }),
      ...mapActions('specialHours', {
        loadSpecialHours: 'load'
      }),
      ...mapGetters('schedule', {
        getSchedule: 'getModel',
      }),
      ...mapActions('schedule', {
        loadSchedule: 'loadOne',
        updateSchedule: 'update',
      }),
      onSubmit(formModel) {
        let idSchedule = this.idSchedule;
        console.log(idSchedule, formModel.model);
        this.updateSchedule({
          id: idSchedule,
          data: formModel.model,
          successCallback: (data) => {
            this.$bvToast.toast(this.$t('Successfully saved'), {
              toaster: 'b-toaster-top-left',
              appendToast: true,
              autoHideDelay: 10000
            });
          },
          failCallback: (data) => {
            formModel.handleResponseErrors(data);
          },
        })
      },
      onReset() {
      },
    }

  }
</script>

<style>

</style>
