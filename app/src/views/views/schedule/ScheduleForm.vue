<template>
  <div>
    <AppForm
        v-if="formModel.model"
        :formModel="formModel"
        @onFormSubmit="onSubmit"
    >
      <template v-slot:available>
        <div class="row">
          <div class="mt-2 pt-lg-4 col-lg-6 col-xs-12 form-group">
            <input
                type="checkbox"
                :id="'input-available'"
                class="apple-switch"
                :key="'form-checkbox-available'"
                v-model="formModel.model.available"/>
            <label :for="'input-available'">{{formModel.form.available.label}}</label>
          </div>
          <div class="col-lg-6 col-xs-12 pt-lg-4 form-group">
            <b-button v-if="!formModel.model.available" v-b-modal.modal-specal-hours>
              <b-icon icon="clock" class="mr-2"/>
              {{ $t('Select availability') }}
            </b-button>
          </div>
        </div>
      </template>
      <template v-slot:formFooter>
        <b-button type="submit" variant="primary">{{$t("Save")}}</b-button>
      </template>
    </AppForm>
    <CompanyCalendar :with-events="false"/>
    <b-modal id="modal-specal-hours" hide-footer :title="$t('Availability')">
      <SpecialHoursForm :id-schedule="idSchedule" v-on:form:save="refreshAvailability"></SpecialHoursForm>
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
  import AppFormSelect from "../../../models/AppFormSelect";

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
                  },
                  {wrapClass: 'col-lg-3'}
              ),
              enabled: new AppFormInput(
                  "checkbox",
                  this.$t('Available for booking:'),
                  null,
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              available: new AppFormInput(
                  "checkbox",
                  this.$t('Always availabl:'),
                  null,
                  {},
                  {wrapClass: 'col-lg-6'}
              ),
              bookingDuration: new AppFormInput(
                  "number",
                  this.$t('Booking duration:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              minBookingTime: new AppFormInput(
                  "number",
                  this.$t('Min Booking time:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              maxBookingTime: new AppFormInput(
                  "number",
                  this.$t('Max Booking time:'),
                  'seconds',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              bookingCondition: new AppFormSelect(
                  "select",
                  this.$t('Booking condition:'),
                  '',
                  {},
                  {wrapClass: 'col-lg-3'},
                  [
                    {value: 0, text: this.$t('All users')},
                    {value: 1, text: this.$t('Authorized only')},
                  ]
              ),
              acceptBookingCondition: new AppFormSelect(
                  "select",
                  this.$t('Accept booking condition:'),
                  '',
                  {},
                  {wrapClass: 'col-lg-3'},
                  [
                    {value: 0, text: this.$t('Accept all bookings')},
                    {value: 1, text: this.$t('Decline all bookings')},
                    {value: 2, text: this.$t('Accept only from approved users')},
                    {value: 3, text: this.$t('Accept only after pay advance')},
                  ]
              ),
              acceptBookingTime: new AppFormInput(
                  "number",
                  this.$t('Accept booking time:'),
                  'minutes',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              timeBetweenBookings: new AppFormInput(
                  "number",
                  this.$t('Time between bookings:'),
                  'minutes',
                  {},
                  {wrapClass: 'col-lg-3'}
              ),
              description: new AppFormInput(
                  "textarea",
                  this.$t('Description:'),
                  this.$t('Enter description'),
                  {},
                  {wrapClass: 'col-lg-6'}
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
        }
      });
    },
    methods: {
      ...mapGetters('schedule', {
        getSchedule: 'getModel',
      }),
      ...mapActions('schedule', {
        loadSchedule: 'loadMyOne',
        updateSchedule: 'update',
      }),
      ...mapActions('availability', {
        loadAvailability: 'load'
      }),
      ...mapGetters('availability', {
        getCalendarCurrentView: 'getCalendarCurrentView'
      }),
      onSubmit(formModel) {
        let idSchedule = this.idSchedule;
        this.updateSchedule({
          id: idSchedule,
          data: formModel.model,
          successCallback: (data) => {
            this.$root.$bvToast.toast(this.$t('Successfully saved'), {
              toaster: 'b-toaster-top-left',
              appendToast: true,
              autoHideDelay: 4000
            });
          },
          failCallback: (data) => {
            formModel.handleResponseErrors(data);
          },
        });
      },
      refreshAvailability() {
        let calendarCurrentView = this.getCalendarCurrentView();
        let filter = {
          schedule: this.idSchedule,
          filterFrom: calendarCurrentView.startDate.timestamp(),
          filterTo: calendarCurrentView.endDate.timestamp(),
        };
        this.loadAvailability({
          filter: filter
        });
      }
    }

  }
</script>

<style>

</style>
